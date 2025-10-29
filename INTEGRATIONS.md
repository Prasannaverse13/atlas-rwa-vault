# Atlas Treasury - Integrated Resources

## 🎯 Overview
Atlas is an AI-powered treasury management system for Real-World Assets (RWAs) on Solana. This document details all integrated services and SDKs.

## 🔗 Integrated Services

### 1. **Raydium SDK V2**
**Purpose:** Liquidity pool management for RWA tokens

**Integration:** `src/services/raydiumService.ts`

**Features:**
- Pool discovery for token pairs (t-BILL/USDC, etc.)
- CLMM (Concentrated Liquidity Market Maker) support
- Position management
- Real-time pool data fetching

**Usage:**
```typescript
import { raydiumService } from '@/services/raydiumService';

// Initialize with wallet
await raydiumService.initialize(publicKey);

// Fetch pools
const pools = await raydiumService.fetchPoolByMints(mint1, mint2);
```

**Resources:**
- [Raydium SDK V2 GitHub](https://github.com/raydium-io/raydium-sdk-V2)
- [Raydium Docs](https://docs.raydium.io/)

---

### 2. **Triton RPC**
**Purpose:** High-performance Solana RPC for monitoring less-liquid RWA markets

**Integration:** `src/services/tritonService.ts`

**Features:**
- Enhanced commitment levels
- Priority fee monitoring
- Multi-account fetching
- Real-time slot tracking

**Configuration:** `src/config/constants.ts`
```typescript
export const TRITON_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
export const TRITON_RPC_DEVNET = 'https://api.devnet.solana.com';
```

**Resources:**
- [Triton One Website](https://triton.one/)
- [Triton Docs](https://docs.triton.one/)

---

### 3. **Gemini AI (Google)**
**Purpose:** AI-powered market analysis and portfolio optimization

**Integration:** `src/services/geminiService.ts`

**Features:**
- Market condition analysis
- Yield optimization recommendations
- Risk assessment
- Portfolio rebalancing strategies

**API:** Gemini 2.0 Flash model
```typescript
import { geminiService } from '@/services/geminiService';

const analysis = await geminiService.analyzeMarket({
  portfolioValue: 1850000,
  currentYield: 8.5,
  targetYield: 5.0,
  rwaHoldings: [...],
});
```

**Resources:**
- [Gemini API Docs](https://ai.google.dev/docs)

---

### 4. **Solana SPL Token Program**
**Purpose:** RWA token account management and monitoring

**Integration:** `src/services/splTokenService.ts`

**Features:**
- Token balance fetching
- Associated token account handling
- Token metadata retrieval
- Multi-token portfolio tracking

**Usage:**
```typescript
import { splTokenService } from '@/services/splTokenService';

const balance = await splTokenService.getTokenBalance(owner, mintAddress);
const allTokens = await splTokenService.getAllTokenBalances(owner);
```

**Resources:**
- [SPL Token Program](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)

---

### 5. **Phantom Wallet**
**Purpose:** User authentication and transaction signing

**Integration:** `src/components/WalletProvider.tsx`

**Features:**
- Wallet connection gateway
- Auto-connect support
- Transaction signing
- Account monitoring

**Resources:**
- [Phantom Docs](https://docs.phantom.app/)

---

### 6. **Forward Industries**
**Purpose:** Theme alignment with Solana treasury strategy

**Integration:** Throughout the application design and treasury configuration

**Configuration:** `src/config/constants.ts`
```typescript
export const TREASURY_CONFIG = {
  TARGET_YIELD: 5.0,
  RISK_TOLERANCE: 'low',
  REBALANCE_THRESHOLD: 2.0,
};
```

**Resources:**
- [Forward Industries](https://sol.forwardindustries.com/)

---

## 📊 Application Flow

1. **Wallet Connection**
   - User connects Phantom wallet
   - System initializes Raydium SDK with user's public key
   - SPL token service fetches RWA holdings

2. **AI Analysis**
   - Gemini AI analyzes current portfolio
   - Evaluates market conditions via Triton RPC
   - Recommends deployment strategies

3. **Raydium Deployment**
   - AI identifies optimal liquidity pools
   - Calculates position parameters
   - Prepares transaction for user approval

4. **Portfolio Optimization**
   - Continuous monitoring of positions
   - AI-driven rebalancing recommendations
   - Automated yield optimization

---

## 🔧 Configuration

### Environment Setup
All configurations are in `src/config/constants.ts`:

```typescript
// Network
export const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
export const RPC_ENDPOINT = TRITON_RPC_DEVNET;

// Tokens (Update with real RWA token addresses)
export const TOKENS = {
  USDC: new PublicKey('...'),
  T_BILL: new PublicKey('...'),
  SOL: new PublicKey('...'),
};

// AI Configuration
export const AI_CONFIG = {
  GEMINI_API_KEY: 'your-api-key',
  GEMINI_API_ENDPOINT: '...',
};
```

### For Production Deployment:
1. Update `NETWORK` to `'mainnet-beta'`
2. Update `RPC_ENDPOINT` to use your Triton endpoint
3. Replace token addresses with actual RWA token mints
4. Configure proper Gemini API key
5. Test all integrations thoroughly

---

## 🚀 Features Powered by Integrations

| Feature | Powered By |
|---------|------------|
| Market Analysis | Gemini AI + Triton RPC |
| Pool Discovery | Raydium SDK V2 |
| Token Monitoring | SPL Token + Triton |
| Liquidity Deployment | Raydium SDK V2 |
| Portfolio Optimization | Gemini AI |
| Wallet Authentication | Phantom + Solana Wallet Adapter |
| Real-time Data | Triton RPC |

---

## 📚 Additional Resources

### Solana Development
- [Solana Docs](https://solana.com/docs)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)

### Testing
- [Surfpool UI](https://surfpool.run/) - Real-time Solana visualization
- [Solana Explorer](https://explorer.solana.com/) - Transaction tracking

### Learning
- [Blueshift](https://blueshift.gg/) - Solana development courses

---

## 🔐 Security Notes

1. **Private Keys:** Never expose private keys in the frontend
2. **RPC Endpoints:** Use Triton for production reliability
3. **API Keys:** Store Gemini API key securely (consider using environment variables)
4. **Wallet Permissions:** Always request minimal permissions
5. **Transaction Approval:** Users must approve all on-chain transactions

---

## 🤝 Support

For issues or questions:
- Raydium: [Discord](https://discord.gg/raydium)
- Triton: Contact via [website](https://triton.one/)
- Phantom: [Support Center](https://help.phantom.app/)
- Solana: [Stack Exchange](https://solana.stackexchange.com/)
