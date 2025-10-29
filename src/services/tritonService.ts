import { Connection, PublicKey } from '@solana/web3.js';
import { RPC_ENDPOINT } from '@/config/constants';

export class TritonService {
  private connection: Connection;

  constructor() {
    // Triton RPC connection with enhanced commitment level
    this.connection = new Connection(RPC_ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }

  async getAccountInfo(publicKey: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  async getTokenAccountBalance(publicKey: PublicKey) {
    try {
      const balance = await this.connection.getTokenAccountBalance(publicKey);
      return balance;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      throw error;
    }
  }

  async getMultipleAccountsInfo(publicKeys: PublicKey[]) {
    try {
      const accountsInfo = await this.connection.getMultipleAccountsInfo(publicKeys);
      return accountsInfo;
    } catch (error) {
      console.error('Error fetching multiple accounts:', error);
      throw error;
    }
  }

  async getSlot() {
    try {
      const slot = await this.connection.getSlot();
      return slot;
    } catch (error) {
      console.error('Error fetching slot:', error);
      throw error;
    }
  }

  async getRecentPrioritizationFees() {
    try {
      // Triton-specific API for priority fees
      const fees = await this.connection.getRecentPrioritizationFees();
      return fees;
    } catch (error) {
      console.error('Error fetching priority fees:', error);
      return [];
    }
  }

  async simulateTransaction(transaction: any) {
    try {
      const simulation = await this.connection.simulateTransaction(transaction);
      return simulation;
    } catch (error) {
      console.error('Error simulating transaction:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  // Monitor RWA token markets (less liquid markets)
  async monitorTokenPrice(tokenMint: PublicKey) {
    try {
      // This would integrate with on-chain oracles or DEX data
      // For now, return mock data structure
      return {
        mint: tokenMint.toString(),
        price: 0,
        volume24h: 0,
        liquidity: 0,
        priceChange24h: 0,
        lastUpdate: Date.now(),
      };
    } catch (error) {
      console.error('Error monitoring token price:', error);
      throw error;
    }
  }
}

export const tritonService = new TritonService();
