import { PublicKey } from '@solana/web3.js';

// Triton RPC Endpoints
export const TRITON_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com'; // Use your Triton endpoint
export const TRITON_RPC_DEVNET = 'https://api.devnet.solana.com';

// Network Configuration
export const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
export const RPC_ENDPOINT = TRITON_RPC_DEVNET; // Change to TRITON_RPC_ENDPOINT for mainnet

// Token Addresses (Devnet examples - replace with actual RWA token addresses)
export const TOKENS = {
  USDC: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // Devnet USDC
  T_BILL: new PublicKey('So11111111111111111111111111111111111111112'), // Placeholder - replace with actual t-BILL token
  SOL: new PublicKey('So11111111111111111111111111111111111111112'),
};

// Raydium Program IDs
export const RAYDIUM_PROGRAMS = {
  AMM: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  CLMM: new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'),
  CPMM: new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'),
};

// Forward Industries - Treasury Strategy
export const TREASURY_CONFIG = {
  TARGET_YIELD: 5.0, // 5% default target yield
  RISK_TOLERANCE: 'low', // low, medium, high
  REBALANCE_THRESHOLD: 2.0, // 2% deviation triggers rebalance
};

// AI Agent Configuration
export const AI_CONFIG = {
  GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  GEMINI_API_KEY: 'AIzaSyDWCgAHBZJFyyLJLMDkbxafv9ssJ4hfu2E',
  ANALYSIS_INTERVAL: 300000, // 5 minutes
};
