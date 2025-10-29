import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  getMint,
} from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { tritonService } from './tritonService';

export class SPLTokenService {
  private connection: Connection;

  constructor() {
    this.connection = tritonService.getConnection();
  }

  async getTokenBalance(owner: PublicKey, mintAddress: PublicKey) {
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintAddress,
        owner,
        false,
        TOKEN_PROGRAM_ID
      );

      const tokenAccount = await getAccount(
        this.connection,
        associatedTokenAddress,
        'confirmed',
        TOKEN_PROGRAM_ID
      );

      return {
        address: associatedTokenAddress.toString(),
        amount: tokenAccount.amount.toString(),
        decimals: 0, // Will be fetched from mint
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      return {
        address: '',
        amount: '0',
        decimals: 0,
      };
    }
  }

  async getTokenInfo(mintAddress: PublicKey) {
    try {
      const mintInfo = await getMint(
        this.connection,
        mintAddress,
        'confirmed',
        TOKEN_PROGRAM_ID
      );

      return {
        address: mintAddress.toString(),
        decimals: mintInfo.decimals,
        supply: mintInfo.supply.toString(),
        mintAuthority: mintInfo.mintAuthority?.toString() || null,
        freezeAuthority: mintInfo.freezeAuthority?.toString() || null,
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  async getAllTokenBalances(owner: PublicKey) {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        owner,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      return tokenAccounts.value.map((accountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info;
        return {
          mint: parsedInfo.mint,
          amount: parsedInfo.tokenAmount.uiAmount || 0,
          decimals: parsedInfo.tokenAmount.decimals,
          address: accountInfo.pubkey.toString(),
        };
      });
    } catch (error) {
      console.error('Error getting all token balances:', error);
      return [];
    }
  }

  formatTokenAmount(amount: string, decimals: number): string {
    const value = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return integerPart.toString();
    }
    
    return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0')}`;
  }
}

export const splTokenService = new SPLTokenService();
