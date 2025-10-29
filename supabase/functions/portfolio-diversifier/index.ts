import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { availablePools, currentAllocation, targetYield, riskTolerance, totalValue } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an AI Portfolio Diversifier for multi-asset RWA treasury management.

Available RWA Pools:
${JSON.stringify(availablePools, null, 2)}

Current Portfolio:
- Total Value: $${totalValue.toLocaleString()}
- Current Allocation: ${JSON.stringify(currentAllocation, null, 2)}
- Target Yield: ${targetYield}%
- Risk Tolerance: ${riskTolerance}

Analysis Task:
1. Analyze correlation between different RWA assets (T-Bills, Bonds, Gold, Real Estate, etc.)
2. Build an optimal portfolio using Modern Portfolio Theory (Efficient Frontier)
3. Diversify across non-correlated assets to reduce risk while meeting yield target
4. Calculate expected portfolio metrics: return, volatility, Sharpe ratio
5. Provide specific allocation percentages for each pool

Respond in JSON format:
{
  "optimizedAllocation": [
    {
      "pool": string,
      "percentage": number,
      "amount": number,
      "expectedYield": number,
      "assetClass": string,
      "reasoning": string
    }
  ],
  "portfolioMetrics": {
    "expectedReturn": number,
    "expectedVolatility": number,
    "sharpeRatio": number,
    "diversificationScore": number (0-100)
  },
  "correlationMatrix": object,
  "reasoning": string,
  "executionPlan": string[]
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
          { role: "system", content: "You are a quantitative portfolio manager specializing in diversified RWA strategies. Always respond with valid JSON." },
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

    return new Response(
      JSON.stringify({
        ...analysis,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in portfolio-diversifier function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
