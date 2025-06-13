import { writeContract } from '@wagmi/core';
import { parseAbi } from 'viem';
import { config } from '@/lib/wagmi';

// The burn address where NFTs will be sent
export const BURN_ADDRESS = '0xc9F0f96b4F33B6Dd4a44F53431af7fa4F08b805A';

// ERC721 ABI for the transferFrom function
const erc721Abi = parseAbi([
  'function transferFrom(address from, address to, uint256 tokenId) external',
]);

/**
 * Transfers an NFT to the burn address
 * @param contractAddress The NFT contract address
 * @param tokenId The token ID to transfer
 * @param ownerAddress The current owner's address
 * @returns The transaction hash
 */
export async function transferNFTToBurnAddress(
  contractAddress: string,
  tokenId: string,
  ownerAddress: string
) {
  try {
    const hash = await writeContract(
      config,
      {
        address: contractAddress as `0x${string}`,
        abi: erc721Abi,
        functionName: 'transferFrom',
        args: [ownerAddress as `0x${string}`, BURN_ADDRESS, BigInt(tokenId)],
      }
    );

    return { success: true, hash };
  } catch (error) {
    console.error('Error transferring NFT:', error);
    return { success: false, error };
  }
}