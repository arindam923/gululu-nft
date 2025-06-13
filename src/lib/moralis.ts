import Moralis from 'moralis';

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || 'YOUR_MORALIS_API_KEY';

// Use a global variable to track initialization status
let isInitialized = false;

// Initialize Moralis only once
export const initializeMoralis = async () => {
  if (!isInitialized) {
    try {
      await Moralis.start({
        apiKey: MORALIS_API_KEY,
      });
      isInitialized = true;
      console.log('Moralis initialized successfully');
    } catch (error) {
      // If error is about modules already started, just set isInitialized to true
      if (error instanceof Error && error.message.includes('Modules are started already')) {
        console.log('Moralis was already initialized');
        isInitialized = true;
      } else {
        console.error('Error initializing Moralis:', error);
        throw error;
      }
    }
  }
};


export const NFT_COLLECTIONS = {
  collection1: '0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb',
  collection2: '0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1',
};


export const getUserNFTs = async (walletAddress: string) => {
  try {
    await initializeMoralis();
    
    const nfts = [];
    
    
    for (const collectionAddress of Object.values(NFT_COLLECTIONS)) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address: walletAddress,
        chain: '0x38', 
        tokenAddresses: [collectionAddress],
      });
      
      nfts.push(...response.result);
    }
    
    return nfts.map((nft) => {
      
      let imageUrl = null;
      
      
      if (nft.media?.mediaCollection?.high?.url) {
        imageUrl = nft.media.mediaCollection.high.url;
      } else if (nft.media?.originalMediaUrl) {
        imageUrl = nft.media.originalMediaUrl;
      } 
      
      
       if (!imageUrl && nft.metadata) {
         try {
           const metadata = typeof nft.metadata === 'string' ? JSON.parse(nft.metadata) : nft.metadata;
           imageUrl = metadata?.image || metadata?.image_url || metadata?.imageUrl;
         } catch (e) {
           console.log('Error parsing metadata:', e);
         }
       }
       
       
       if (imageUrl && imageUrl.startsWith('ipfs://')) {
         imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
       }
       
       console.log('Final image URL for token', nft.tokenId, ':', imageUrl);
      
      return {
        tokenId: String(nft.tokenId),
        name: nft.name || 'Unknown NFT',
        image: imageUrl,
        contractAddress: nft.tokenAddress.lowercase,
        metadata: nft.metadata,
      };
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};