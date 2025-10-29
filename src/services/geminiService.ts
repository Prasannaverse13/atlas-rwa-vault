import { AI_CONFIG } from '@/config/constants';

export class GeminiService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = AI_CONFIG.GEMINI_API_KEY;
    this.endpoint = AI_CONFIG.GEMINI_API_ENDPOINT;
  }

  async analyzeMarket(data: {
    portfolioValue: number;
    currentYield: number;
    targetYield: number;
    rwaHoldings: any[];
    marketConditions?: string;
  }) {
    try {
      const prompt = `
You are an AI treasury manager for a DAO managing Real-World Assets (RWAs) on Solana.

Current Portfolio:
- Total Value: $${data.portfolioValue.toLocaleString()}
- Current Yield: ${data.currentYield}%
- Target Yield: ${data.targetYield}%
- RWA Holdings: ${JSON.stringify(data.rwaHoldings, null, 2)}

Task: Analyze the current portfolio and recommend:
1. Should we deploy more assets to Raydium liquidity pools?
2. What percentage of the treasury should be in LP positions?
3. Expected yield and risk assessment
4. Specific token pairs to provide liquidity for

Provide your analysis in the following JSON format:
{
  "recommendation": "brief recommendation",
  "deploymentPercentage": number,
  "expectedYield": number,
  "riskLevel": "low|medium|high",
  "confidence": number,
  "reasoning": "detailed explanation",
  "suggestedPairs": ["pair1", "pair2"]
}`;

      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse JSON from Gemini response');
      }

      // Fallback response if parsing fails
      return {
        recommendation: 'Deploy 15% to t-BILL/USDC pool',
        deploymentPercentage: 15,
        expectedYield: 8.7,
        riskLevel: 'low',
        confidence: 94,
        reasoning: text,
        suggestedPairs: ['t-BILL/USDC', 'SOL/USDC'],
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async optimizePortfolio(data: {
    currentAllocation: any;
    targetYield: number;
    riskTolerance: string;
  }) {
    try {
      const prompt = `
You are optimizing a RWA treasury portfolio on Solana.

Current Allocation: ${JSON.stringify(data.currentAllocation, null, 2)}
Target Yield: ${data.targetYield}%
Risk Tolerance: ${data.riskTolerance}

Recommend portfolio rebalancing to achieve target yield while maintaining risk tolerance.

Provide response in JSON format:
{
  "action": "rebalance description",
  "changes": [
    {"asset": "name", "from": "percentage", "to": "percentage", "reason": "explanation"}
  ],
  "projectedYield": number,
  "riskAssessment": "explanation"
}`;

      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse JSON from Gemini response');
      }

      // Fallback
      return {
        action: 'Rebalance portfolio allocation',
        changes: [
          { asset: 't-BILL', from: '45%', to: '50%', reason: 'Increase stable yield' },
          { asset: 'USDC', from: '40%', to: '35%', reason: 'Reduce idle capital' },
          { asset: 'LP Positions', from: '15%', to: '15%', reason: 'Maintain exposure' },
        ],
        projectedYield: data.targetYield + 1.5,
        riskAssessment: text,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
