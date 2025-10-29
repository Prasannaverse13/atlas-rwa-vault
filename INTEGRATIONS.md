# Atlas Treasury - Integrated Services (v3.0)

## 🎯 Overview
Atlas is an AI-powered treasury management system for Real-World Assets (RWAs) on Solana, built on **Forward Industries' institutional treasury methodology**. Atlas demonstrates how AI agents can autonomously manage multi-billion dollar treasuries using the same strategies deployed by the world's leading Solana treasury company.

## ✨ New AI Intelligence Features

### 🎯 AI Fair Value Oracle
**Component:** `src/components/FairValueOracle.tsx`
**Edge Function:** `supabase/functions/fair-value-oracle/`

**Real-Time Capabilities:**
- ✅ Live US Treasury data from `api.fiscaldata.treasury.gov`
- ✅ On-chain vs real-world price comparison
- ✅ Arbitrage opportunity detection
- ✅ BUY/SELL/HOLD recommendations with confidence scores

### ⚠️ AI Risk Regime Monitor
**Component:** `src/components/RiskRegimeMonitor.tsx`
**Edge Function:** `supabase/functions/risk-regime-detector/`

**Real-Time Capabilities:**
- ✅ Auto-refresh every 30 seconds
- ✅ Volatility spike detection
- ✅ Dynamic risk assessment (CRITICAL/HIGH/MEDIUM/LOW)
- ✅ Automatic allocation recommendations

### 📊 AI Portfolio Diversifier
**Component:** `src/components/PortfolioDiversifier.tsx`
**Edge Function:** `supabase/functions/portfolio-diversifier/`

**Real-Time Capabilities:**
- ✅ Multi-asset correlation analysis
- ✅ Modern Portfolio Theory optimization
- ✅ Sharpe ratio calculation
- ✅ Visual allocation breakdown with execution plan

## 🔗 Core Integrations

### Forward Industries Treasury Strategy (PRIMARY INTEGRATION)
**Code**: `src/components/ForwardMetrics.tsx`, `src/components/StakingYieldTracker.tsx`, `src/config/constants.ts`

Atlas is built on Forward Industries' proven institutional strategy:
- ✅ **SOL per Share Growth**: Track the same metric Forward uses ($6.8M+ SOL holdings)
- ✅ **Dual Revenue Streams**: 60% staking + 40% DeFi (Forward's exact allocation)
- ✅ **mNAV Tracking**: Modified Net Asset Value with ecosystem growth multiplier
- ✅ **Validator Delegation**: Staking rewards from Forward's own validator
- ✅ **Institutional Risk Management**: Low risk tolerance, 2% rebalancing threshold
- ✅ **Capital Markets Arbitrage**: Identifying spreads between traditional finance and DeFi

**What Atlas Uses from Forward**:
1. Treasury configuration parameters (`TREASURY_CONFIG` in constants.ts)
2. Blended yield calculation methodology (staking + DeFi)
3. Risk management framework (capital preservation mandate)
4. SOL per share growth tracking
5. Modified NAV calculations

### Lovable AI (Gemini 2.5 Flash)
Powers all AI features through secure edge functions. No API keys required.

### Raydium SDK V2
Liquidity pool management - `src/services/raydiumService.ts`

### Triton RPC
High-performance Solana data - `src/services/tritonService.ts`

### SPL Token Program
Token monitoring - `src/services/splTokenService.ts`

### Phantom Wallet
User authentication - `src/components/WalletProvider.tsx`

## 📊 Data Integrity

✅ **100% Real-Time Data:**
- US Treasury yields from government API
- On-chain pool data via Raydium SDK
- Live volatility calculations
- Real token balances

❌ **Zero Mock Data**

## 🚀 Quick Start
1. Connect wallet
2. Click "Analyze" on Fair Value Oracle
3. Monitor risk regime (auto-refreshes)
4. Optimize portfolio diversification

All features fully functional with live data!