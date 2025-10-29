import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tokenSymbol, onChainPrice, poolData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch real-world treasury data from public APIs
    let realWorldData;
    try {
      // Fetch current US Treasury yields from public API
      const treasuryResponse = await fetch("https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?filter=record_date:gte:2025-01-01&sort=-record_date&page[size]=1");
      const treasuryData = await treasuryResponse.json();
      realWorldData = treasuryData.data?.[0] || {};
      console.log("Fetched real-world treasury data:", realWorldData);
    } catch (error) {
      console.error("Error fetching treasury data:", error);
      realWorldData = { note: "Using historical average" };
    }

    const prompt = `You are an AI Fair Value Oracle for RWA (Real-World Assets) treasury management.

Token: ${tokenSymbol}
On-Chain Price: $${onChainPrice}
Real-World Data: ${JSON.stringify(realWorldData, null, 2)}
Pool Liquidity: ${JSON.stringify(poolData, null, 2)}

Analysis Task:
1. Calculate the fair value of this RWA token based on real-world treasury yields and maturity
2. Compare on-chain price vs fair value
3. Identify arbitrage opportunities if price dislocation exists
4. Recommend action: BUY (underpriced), SELL (overpriced), or HOLD (fairly priced)
5. Calculate expected profit/loss percentage

Respond in JSON format with:
{
  "fairValue": number,
  "onChainPrice": number,
  "dislocation": number (percentage difference),
  "arbitrageOpportunity": boolean,
  "recommendation": "BUY" | "SELL" | "HOLD",
  "expectedReturn": number (percentage),
  "confidence": number (0-100),
  "reasoning": string,
  "riskLevel": "low" | "medium" | "high"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a quantitative analyst specializing in RWA valuation. Always respond with valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = JSON.parse(result.choices[0].message.content);

    // Add real-world data context
    return new Response(
      JSON.stringify({
        ...analysis,
        realWorldData,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fair-value-oracle function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
