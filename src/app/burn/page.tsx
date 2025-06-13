"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, racing, spicy } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { getUserNFTs } from "@/lib/moralis";
import { transferNFTToBurnAddress, BURN_ADDRESS } from "@/lib/nftTransfer";
import { toast } from "sonner";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

interface NFT {
  tokenId: string;
  name: string;
  image?: string;
  contractAddress: string;
  metadata?: any;
}

const calculateRarityPoints = (
  tokenId: string,
  contractAddress: string
): number => {
  const tokenNumber = parseInt(tokenId);

  // Collection 1: 0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb
  if (
    contractAddress.toLowerCase() ===
    "0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb".toLowerCase()
  ) {
    if (tokenNumber >= 1951 && tokenNumber <= 10000) {
      return 10; // Legendary - 500 NFTs
    } else if (tokenNumber >= 8001 && tokenNumber <= 1950) {
      return 5; // Epic - 1500 NFTs
    } else if (tokenNumber >= 5001 && tokenNumber <= 8000) {
      return 3; // Rare - 3000 NFTs
    } else if (tokenNumber >= 1 && tokenNumber <= 5000) {
      return 1; // Common - 5000 NFTs
    }
  }

  // Collection 2: 0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1
  if (
    contractAddress.toLowerCase() ===
    "0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1".toLowerCase()
  ) {
    if (tokenNumber >= 1 && tokenNumber <= 3500) {
      return 1;
    } else if (tokenNumber >= 3500 && tokenNumber <= 4000) {
      return 10;
    }
  }

  return 1;
};

export default function BurnNftsScreen() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [burningNft, setBurningNft] = useState<string | null>(null);
  const { updatePoints, refetch } = useUserPoints();

  const handleBurnNFT = async (nft: NFT) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setBurningNft(`${nft.contractAddress}-${nft.tokenId}`);

    try {
      const pointsReceived = calculateRarityPoints(
        nft.tokenId,
        nft.contractAddress
      );

      const result = await transferNFTToBurnAddress(
        nft.contractAddress,
        nft.tokenId,
        address
      );

      if (result.success) {
        const response = await fetch("/api/burn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: address,
            nftDetails: {
              contractAddress: nft.contractAddress,
              tokenId: nft.tokenId,
              name: nft.name,
              media: nft.image,
            },
            pointsReceived,
          }),
        });

        if (response.ok) {
          setNfts(
            nfts.filter(
              (item) =>
                !(
                  item.contractAddress === nft.contractAddress &&
                  item.tokenId === nft.tokenId
                )
            )
          );

          // Update user points
          updatePoints({
            walletAddress: address,
            points: pointsReceived,
            action: 'add'
          });
          
          toast.success(
            `Successfully burned NFT and received ${pointsReceived} points!`
          );
          
          // Refetch points to update UI
          refetch();
        } else {
          const errorData = await response.json();
          toast.error(`Failed to save burn record: ${errorData.error}`);
        }
      } else {
        toast.error(`Failed to burn NFT: ${result.error}`);
      }
    } catch (error) {
      console.error("Error burning NFT:", error);
      toast.error("An error occurred while burning the NFT");
    } finally {
      // Clear the burning state
      setBurningNft(null);
    }
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          const userNFTs = await getUserNFTs(address);
          setNfts(userNFTs);
        } catch (error) {
          console.error("Error fetching NFTs:", error);

          setNfts(
            Array.from({ length: 6 }, (_, i) => ({
              tokenId: `${i + 1}`,
              name: `NFT #${i + 1}`,
              contractAddress:
                i % 2 === 0
                  ? "0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb"
                  : "0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1",
            }))
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNFTs();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-black">
              Please connect your wallet to view and burn your NFTs
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Image
        src={"/bg2.png"}
        alt=""
        width={600}
        height={100}
        className="absolute -top-20 left-0 w-full object-cover"
      />

      <div className="relative z-10 p-6 pb-20 lg:p-8 xl:p-12">
        <div className="mb-6 lg:mb-8 xl:mb-10 md:px-20">
          <p className="text-black text-sm mb-2 lg:text-base xl:text-xl">
            CASH OUT
          </p>
          <h1
            className={cn(
              "text-4xl leading-8 font-black text-black mb-3 lg:text-5xl xl:text-7xl lg:leading-10 xl:leading-12",
              racing.className
            )}
          >
            burn nfts
          </h1>
          <p
            className={cn(
              "text-[10px] text-black mb-4 lg:text-sm xl:text-base",
              spicy.className
            )}
          >
            Burn Your Ridiculous Dragons And Nomaimai
            <br />
            NFTs For Gululu Points
          </p>
        </div>

        <Image
          src={"/5 7.png"}
          alt=""
          width={400}
          height={600}
          className="absolute top-10 right-0 w-40 lg:w-48 xl:w-80 lg:top-8 xl:top-6"
        />

        <div className="relative mt-44 pb-10 pt-4 border-2 border-black shadow-neo px-2 bg-[#ffd6a0] lg:mt-48 xl:mt-64 lg:pb-12 xl:pb-16 lg:pt-6 xl:pt-8 lg:px-4 xl:px-6">
          <Image
            src={"/4 851118.png"}
            alt=""
            width={800}
            height={600}
            className="absolute top-5 -translate-y-full z-10 w-42 -left-3 lg:w-48 xl:w-80 lg:-left-4 xl:-left-0 xl:top-14"
          />

          <h2
            className={cn(
              "text-2xl text-center font-bold text-black mb-3 italic lg:text-3xl xl:text-4xl lg:mb-4 xl:mb-6",
              racing.className
            )}
          >
            Explore inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-3 lg:gap-4 xl:gap-5 gap-4 mb-4 md:px-1 lg:px-2 xl:px-4 px-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }, (_, i) => (
                <Card
                  key={`loading-${i}`}
                  className="border-2 border-black bg-gradient-to-b from-gray-300 to-gray-400 shadow-neo rounded-none p-0 h-60 md:h-40 lg:h-48 xl:h-56 w-full animate-pulse"
                >
                  <CardContent className="relative p-1 h-full flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-black font-bold">Loading...</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : nfts.length > 0 ? (
              nfts.map((nft) => (
                <Card
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="border-2 border-black bg-gradient-to-b from-yellow-400 to-orange-400 shadow-neo rounded-none p-0 h-80 md:h-64 lg:h-72 xl:h-80 w-full hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="relative p-0 h-full flex flex-col overflow-hidden">
                    {/* Star icon */}
                    <div className="absolute top-2 right-2 z-10">
                      <Star className="fill-black stroke-black size-4" />
                    </div>

                    {/* Image section - 70% of card height */}
                    <div className="relative h-[70%] border-b-2 border-black">
                      {nft.image ? (
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center">
                          <span className="text-black font-bold text-lg opacity-50">
                            NFT
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content section - 30% of card height */}
                    <div className="h-[30%] flex relative">
                      {/* Left side - Collection name (vertical) */}
                      <div className="w-8 border-r-2 border-black flex items-center justify-center relative">
                        <div className="absolute transform -rotate-90 whitespace-nowrap text-xs md:text-[10px] lg:text-xs font-bold text-black tracking-tight">
                          {nft.name.length > 12
                            ? nft.name.substring(0, 12) + "..."
                            : nft.name}
                        </div>
                      </div>

                      {/* Right side - Token and controls */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        {/* Token number */}
                        <div className="text-left">
                          <p className="text-xs md:text-[10px] lg:text-xs font-bold text-black tracking-tight">
                            TOKEN: #{nft.tokenId}
                          </p>
                        </div>

                        {/* Bottom section with price and burn button */}
                        <div className="border-t border-black pt-1 mt-1">
                          <div className="flex flex-col items-end space-y-1">
                            <p className="text-xs md:text-[10px] lg:text-xs font-medium text-black tracking-tight">
                              POINTS:{" "}
                              {calculateRarityPoints(
                                nft.tokenId,
                                nft.contractAddress
                              )}
                            </p>
                            <Button
                              size="sm"
                              className="bg-white hover:bg-gray-100 text-black border border-black font-bold text-xs md:text-[9px] lg:text-[10px] py-1 px-3 h-6 rounded-sm shadow-sm"
                              onClick={() => handleBurnNFT(nft)}
                              disabled={
                                burningNft ===
                                `${nft.contractAddress}-${nft.tokenId}`
                              }
                            >
                              {burningNft ===
                              `${nft.contractAddress}-${nft.tokenId}`
                                ? "BURNING..."
                                : "BURN"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // No NFTs found
              <div className="col-span-full text-center py-8">
                <p className="text-black text-lg font-bold">
                  No NFTs found from the specified collections
                </p>
                <p className="text-black text-sm mt-2">
                  Make sure you own NFTs from Ridiculous Dragons or Nomaimai
                  collections
                </p>
              </div>
            )}
          </div>

          <div className="text-center pt-4 lg:pt-6 xl:pt-8">
            <Button className="bg-[#FBAC82] hover:bg-[#ffbb97] h-8 lg:h-10 xl:h-12 rounded-full shadow-neo border border-black lg:px-6 xl:px-8">
              <span className="mr-2">
                <Star className="inline-block w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-black stroke-black" />
              </span>
              <span
                className={cn(
                  "text-xl lg:text-2xl xl:text-3xl text-black",
                  racing.className
                )}
              >
                VIEW MORE
              </span>
              <span className="ml-2">
                <Star className="inline-block w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 fill-black stroke-black" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
