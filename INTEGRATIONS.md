# Atlas Treasury - Integrated Services (v2.0)

## 🎯 Overview
Atlas is an AI-powered treasury management system for Real-World Assets (RWAs) on Solana with advanced intelligence features.

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