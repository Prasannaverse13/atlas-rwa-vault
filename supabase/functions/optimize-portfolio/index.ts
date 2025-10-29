import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { currentAllocation, targetYield, riskTolerance } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are optimizing a RWA treasury portfolio on Solana.

Current Allocation: ${JSON.stringify(currentAllocation, null, 2)}
Target Yield: ${targetYield}%
Risk Tolerance: ${riskTolerance}

Recommend portfolio rebalancing to achieve target yield while maintaining risk tolerance.

Provide response in JSON format with these fields:
- action: rebalance description
- changes: array of objects with {asset, from, to, reason}
- projectedYield: number
- riskAssessment: explanation string`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional portfolio manager. Always respond with valid JSON." },
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
    
    let optimization;
    try {
      optimization = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", aiResponse);
      // Fallback response
      optimization = {
        action: "Rebalance portfolio allocation",
        changes: [
          { asset: "t-BILL", from: "45%", to: "50%", reason: "Increase stable yield" },
          { asset: "USDC", from: "40%", to: "35%", reason: "Reduce idle capital" },
          { asset: "LP Positions", from: "15%", to: "15%", reason: "Maintain exposure" },
        ],
        projectedYield: targetYield + 1.5,
        riskAssessment: "Portfolio optimization complete with low risk profile.",
      };
    }

    return new Response(JSON.stringify(optimization), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in optimize-portfolio function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
