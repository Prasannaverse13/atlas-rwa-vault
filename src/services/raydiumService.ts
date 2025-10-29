import { Connection, PublicKey } from '@solana/web3.js';
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { RPC_ENDPOINT } from '@/config/constants';

export class RaydiumService {
  private raydium: Raydium | null = null;
  private connection: Connection;

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }

  async initialize(owner: PublicKey) {
    try {
      this.raydium = await Raydium.load({
        owner,
        connection: this.connection,
        cluster: 'devnet',
        disableFeatureCheck: true,
        disableLoadToken: false,
      });

      console.log('✅ Raydium SDK initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Raydium SDK:', error);
      return false;
    }
  }

  async fetchPoolByMints(mint1: string, mint2: string) {
    if (!this.raydium) {
      throw new Error('Raydium SDK not initialized');
    }

    try {
      const data = await this.raydium.api.fetchPoolByMints({
        mint1,
        mint2,
      });

      // Return pool data in array format for easier handling
      return data ? [{ id: mint1 + mint2, ...data }] : [];
    } catch (error) {
      console.error('Error fetching pool:', error);
      // Return empty array instead of throwing
      return [];
    }
  }

  async getPoolInfo(poolId: string) {
    if (!this.raydium) {
      throw new Error('Raydium SDK not initialized');
    }

    try {
      const data = await this.raydium.clmm.getPoolInfoFromRpc(poolId);
      return {
        poolInfo: data.poolInfo,
        poolKeys: data.poolKeys,
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  isInitialized() {
    return this.raydium !== null;
  }
}

export const raydiumService = new RaydiumService();
