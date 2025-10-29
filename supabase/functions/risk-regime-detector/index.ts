import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { poolData, historicalVolatility, currentVolatility, marketMetrics } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an AI Risk Regime Detector for crypto treasury management.

Current Market Data:
- Pool Data: ${JSON.stringify(poolData, null, 2)}
- Historical Volatility (30d avg): ${historicalVolatility}%
- Current Volatility (1h): ${currentVolatility}%
- Volatility Spike: ${((currentVolatility - historicalVolatility) / historicalVolatility * 100).toFixed(2)}%
- Market Metrics: ${JSON.stringify(marketMetrics, null, 2)}

Analysis Task:
1. Determine the current market regime: BULL, BEAR, HIGH_VOLATILITY, NORMAL
2. Assess risk level: CRITICAL, HIGH, MEDIUM, LOW
3. Recommend treasury action: WITHDRAW_ALL, REDUCE_EXPOSURE, MAINTAIN, INCREASE_EXPOSURE
4. Calculate impermanent loss risk
5. Provide reasoning for regime classification

Respond in JSON format:
{
  "regime": "BULL" | "BEAR" | "HIGH_VOLATILITY" | "NORMAL",
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "action": "WITHDRAW_ALL" | "REDUCE_EXPOSURE" | "MAINTAIN" | "INCREASE_EXPOSURE",
  "recommendedAllocation": number (0-100 percentage),
  "impermanentLossRisk": number (percentage),
  "confidence": number (0-100),
  "reasoning": string,
  "alertLevel": "red" | "yellow" | "green"
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
          { role: "system", content: "You are a risk management expert for DeFi treasuries. Always respond with valid JSON." },
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
        volatilityMetrics: {
          historical: historicalVolatility,
          current: currentVolatility,
          spike: ((currentVolatility - historicalVolatility) / historicalVolatility * 100).toFixed(2),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in risk-regime-detector function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
