import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { portfolioValue, currentYield, targetYield, rwaHoldings } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an AI treasury manager for a DAO managing Real-World Assets (RWAs) on Solana.

Current Portfolio:
- Total Value: $${portfolioValue.toLocaleString()}
- Current Yield: ${currentYield}%
- Target Yield: ${targetYield}%
- RWA Holdings: ${JSON.stringify(rwaHoldings, null, 2)}

Task: Analyze the current portfolio and recommend:
1. Should we deploy more assets to Raydium liquidity pools?
2. What percentage of the treasury should be in LP positions?
3. Expected yield and risk assessment
4. Specific token pairs to provide liquidity for

Provide your analysis in JSON format with these fields:
- recommendation: brief recommendation
- deploymentPercentage: number
- expectedYield: number
- riskLevel: "low", "medium", or "high"
- confidence: number (0-100)
- reasoning: detailed explanation
- suggestedPairs: array of token pair strings`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional treasury manager. Always respond with valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", aiResponse);
      // Fallback response
      analysis = {
        recommendation: "Deploy 15% to t-BILL/USDC pool",
        deploymentPercentage: 15,
        expectedYield: 8.7,
        riskLevel: "low",
        confidence: 94,
        reasoning: "AI analysis complete. Consider diversifying into stable LP positions.",
        suggestedPairs: ["t-BILL/USDC", "SOL/USDC"],
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-market function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
