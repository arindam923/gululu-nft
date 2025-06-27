"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, racing, spicy } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useState, useEffect, useRef } from "react";
import { getUserNFTs } from "@/lib/moralis";
import { transferNFTToBurnAddress } from "@/lib/nftTransfer";
import { toast } from "sonner";
import { useUserPoints } from "@/lib/hooks/useUserPoints";
import { useRouter } from "next/navigation";

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

  // Collection 1: 0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb (Ridi)
  if (
    contractAddress.toLowerCase() ===
    "0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb".toLowerCase()
  ) {
    if (tokenNumber >= 1 && tokenNumber <= 5000) {
      return 2940; // Ridi - Common
    } else if (tokenNumber >= 5001 && tokenNumber <= 8000) {
      return 5080; // Ridi - Rare
    } else if (tokenNumber >= 8001 && tokenNumber <= 9500) {
      return 7120; // Ridi - Epic
    } else if (tokenNumber >= 9501 && tokenNumber <= 10000) {
      return 16000; // Ridi - Legendary
    }
  }

  // Collection 2: 0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1 (NMM)
  if (
    contractAddress.toLowerCase() ===
    "0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1".toLowerCase()
  ) {
    if (tokenNumber >= 1 && tokenNumber <= 3600) {
      return 6050; // NMM - Normal
    } else if (tokenNumber >= 3601 && tokenNumber <= 4000) {
      return 24000; // NMM - Animated
    }
  }

  return 0; // Default to 0 if not matching any type
};

const getRarityLabel = (tokenId: string, contractAddress: string): string => {
  const tokenNumber = parseInt(tokenId);

  // Collection 1: 0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb (Ridi)
  if (
    contractAddress.toLowerCase() ===
    "0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb".toLowerCase()
  ) {
    if (tokenNumber >= 1 && tokenNumber <= 5000) {
      return "Common";
    } else if (tokenNumber >= 5001 && tokenNumber <= 8000) {
      return "Rare";
    } else if (tokenNumber >= 8001 && tokenNumber <= 9500) {
      return "Epic";
    } else if (tokenNumber >= 9501 && tokenNumber <= 10000) {
      return "Legendary";
    }
  }

  // Collection 2: 0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1 (NMM)
  if (
    contractAddress.toLowerCase() ===
    "0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1".toLowerCase()
  ) {
    if (tokenNumber >= 1 && tokenNumber <= 3600) {
      return "Normal";
    } else if (tokenNumber >= 3601 && tokenNumber <= 4000) {
      return "Animated";
    }
  }

  return "Unknown";
};

export default function SwapNftsScreen() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [displayedNfts, setDisplayedNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [burningNft, setSwappingNft] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [pendingSwapNft, setPendingSwapNft] = useState<NFT | null>(null);
  const [hasMoreNfts, setHasMoreNfts] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { updatePoints, refetch } = useUserPoints();

  // Check if user has already agreed to terms
  const checkUserTermsAgreement = async (
    walletAddress: string
  ): Promise<boolean> => {
    if (!walletAddress) return false;

    try {
      const response = await fetch(
        `/api/users/update?walletAddress=${walletAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.termsAgreed) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking user terms agreement:", error);
      return false;
    }
  };

  // Handle the actual NFT swap process
  const processSwapNFT = async (nft: NFT, userEmail?: string) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setSwappingNft(`${nft.contractAddress}-${nft.tokenId}`);

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
        const requestBody: any = {
          walletAddress: address,
          nftDetails: {
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId,
            name: nft.name,
            media: nft.image,
          },
          pointsReceived,
        };

        if (userEmail) {
          requestBody.email = userEmail;
          requestBody.termsAgreed = true;
        }

        const response = await fetch("/api/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const updatedNfts = nfts.filter(
            (item) =>
              !(
                item.contractAddress === nft.contractAddress &&
                item.tokenId === nft.tokenId
              )
          );
          setNfts(updatedNfts);
          setDisplayedNfts((prev) =>
            prev.filter(
              (item) =>
                !(
                  item.contractAddress === nft.contractAddress &&
                  item.tokenId === nft.tokenId
                )
            )
          );

          toast.success(
            `Successfully swapped NFT and received ${pointsReceived} points!`
          );
          refetch();
        } else {
          const errorData = await response.json();
          toast.error(`Failed to save swap record: ${errorData.error}`);
        }
      } else {
        toast.error(`Failed to swap NFT: ${result.error}`);
      }
    } catch (error) {
      console.error("Error swapping NFT:", error);
      toast.error("An error occurred while swapping the NFT");
    } finally {
      setSwappingNft(null);
      setPendingSwapNft(null);
    }
  };

  const handleSwapNFT = async (nft: NFT) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    const hasAgreedToTerms = await checkUserTermsAgreement(address);

    if (hasAgreedToTerms) {
      processSwapNFT(nft);
    } else {
      setPendingSwapNft(nft);
      setShowEmailForm(true);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !termsAgreed || !pendingSwapNft || !address) {
      toast.error("Please fill all required fields and agree to terms");
      return;
    }

    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          email,
          termsAgreed: true,
        }),
      });

      if (response.ok) {
        setShowEmailForm(false);
        processSwapNFT(pendingSwapNft, email);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save user data: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("An error occurred while saving your information");
    }
  };

  const handleViewMore = () => {
    const currentlyDisplayed = displayedNfts.length;
    const nextBatch = nfts.slice(currentlyDisplayed, currentlyDisplayed + 6);
    setDisplayedNfts([...displayedNfts, ...nextBatch]);

    // Check if there are more NFTs to load
    setHasMoreNfts(currentlyDisplayed + 6 < nfts.length);
  };

  const preloadImages = (nfts: NFT[]) => {
    nfts.forEach((nft) => {
      if (nft.image) {
        const img = new window.Image();
        img.src = nft.image;
      }
    });
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          const userNFTs = await getUserNFTs(address);
          setNfts(userNFTs);

          const initialNfts = userNFTs.slice(0, 6);
          setDisplayedNfts(initialNfts);
          setHasMoreNfts(userNFTs.length > 6);
          preloadImages(userNFTs);
        } catch (error) {
          console.error("Error fetching NFTs:", error);

          const mockNfts = Array.from({ length: 6 }, (_, i) => ({
            tokenId: `${i + 1}`,
            name: `NFT #${i + 1}`,
            contractAddress:
              i % 2 === 0
                ? "0x521B674F91d818f7786F784dCCa2fc2b3121A6Bb"
                : "0x5099d14FBdc58039D68dB2eb4Fa3fa939da668B1",
          }));

          setNfts(mockNfts);
          setDisplayedNfts(mockNfts);
          setHasMoreNfts(false);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNFTs();
  }, [isConnected, address]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const EmailForm = () => {
    useEffect(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, []);

    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50">
        <div className="bg-[#ffd6a0] p-6 rounded-none shadow-neo max-w-md w-full border-2 border-black relative">
          <h3
            className={cn(
              "text-2xl font-bold text-black mb-2 text-center",
              racing.className
            )}
          >
            COMPLETE YOUR INFORMATION
          </h3>

          <p
            className={cn(
              "text-sm text-black mb-6 text-center",
              spicy.className
            )}
          >
            Provide Your Email And Agree To Our Terms Before Swapping Your NFT
          </p>

          <form
            onSubmit={handleEmailSubmit}
            className="border-t-2 border-black pt-4"
          >
            <div className="mb-4">
              <label
                htmlFor="email"
                className={cn(
                  "block text-sm font-bold text-black mb-1",
                  spicy.className
                )}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                ref={emailInputRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black bg-white shadow-neo-sm rounded-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 mr-2 border-2 border-black"
                  required
                />
                <span className={cn("text-sm text-black", spicy.className)}>
                  I Agree To The{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-orange-600 hover:underline font-bold"
                  >
                    TERMS AND CONDITIONS
                  </a>{" "}
                  AND{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-orange-600 hover:underline font-bold"
                  >
                    PRIVACY POLICY
                  </a>
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-2 border-t-2 border-black">
              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(false);
                  setPendingSwapNft(null);
                }}
                className={cn(
                  "px-4 py-2 bg-white text-black border-2 border-black font-bold rounded-none shadow-neo hover:bg-gray-100 transition-colors",
                  spicy.className
                )}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className={cn(
                  "px-4 py-2 bg-gradient-to-b from-yellow-400 to-orange-400 text-black border-2 border-black font-bold rounded-none shadow-neo hover:from-yellow-500 hover:to-orange-500 transition-colors",
                  spicy.className
                )}
              >
                SUBMIT & SWAP NFT
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      {showEmailForm && <EmailForm key="email-form" />}
      <Image
        src={"/bg2.png"}
        alt=""
        width={600}
        height={100}
        className="absolute -top-20 left-0 w-full object-cover"
      />

      <div className="relative z-10 p-6 pb-20 lg:p-8 xl:p-12">
        <div className="flex justify-center items-center relative mb-8 lg:mb-10 xl:mb-12">
          <Image
            src={"/5 7.png"}
            alt=""
            width={400}
            height={600}
            className="absolute top-[80%] -right-2 w-24 h-auto lg:w-48 xl:w-64 lg:top-0 xl:top-0 lg:right-0"
          />

          <div className="text-center mx-auto max-w-3xl px-4 z-10">
            <p className="text-black text-base mb-3 lg:text-xl xl:text-3xl">
              CASH OUT
            </p>
            <h1
              className={cn(
                "text-5xl leading-10 font-black text-black mb-4 lg:text-6xl xl:text-8xl lg:leading-tight xl:leading-tight",
                racing.className
              )}
            >
              swap <span>NFT</span>s
            </h1>
            <p
              className={cn(
                "text-base text-black mb-5 lg:text-xl xl:text-2xl",
                spicy.className
              )}
            >
              Swap Your Ridiculous Dragons And Nomaimai
              <br />
              NFTs For Gululu Points
            </p>
          </div>

          <Image
            src={"/4 851118.png"}
            alt=""
            width={800}
            height={600}
            className="absolute top-[80%] -left-2 w-24 h-auto lg:w-48 xl:w-64 lg:top-0 xl:top-0 lg:left-0"
          />
        </div>

        <div className="relative mt-20 pb-10 pt-4 border-2 border-black shadow-neo px-2 bg-[#ffd6a0] lg:mt-24 xl:mt-32 lg:pb-12 xl:pb-16 lg:pt-6 xl:pt-8 lg:px-4 xl:px-6">
          <h2
            className={cn(
              "text-2xl text-center font-bold text-black mb-6 italic lg:text-3xl xl:text-4xl lg:mb-8 xl:mb-10",
              racing.className
            )}
          >
            Explore inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 mb-8 px-4 lg:px-6 xl:px-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }, (_, i) => (
                <Card
                  key={`loading-${i}`}
                  className="border-2 border-black bg-gradient-to-b from-gray-300 to-gray-400 shadow-neo rounded-none p-0 h-80 md:h-80 lg:h-96 xl:h-96 w-full animate-pulse"
                >
                  <CardContent className="relative p-1 h-full flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-black font-bold text-xl">
                        Loading...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : nfts.length > 0 ? (
              displayedNfts.map((nft) => (
                <Card
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="border-2 border-black bg-gradient-to-b from-yellow-400 to-orange-400 shadow-neo rounded-none p-0 h-96 md:h-96 lg:h-[28rem] xl:h-[30rem] w-full hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="relative p-0 h-full flex flex-col overflow-hidden">
                    {/* Star icon */}
                    <div className="absolute top-3 right-3 z-10">
                      <Star className="fill-black stroke-black size-6" />
                    </div>

                    {/* Image section - 70% of card height */}
                    <div className="relative h-[70%] border-b-2 border-black">
                      {nft.image ? (
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          fill
                          className="object-cover"
                          priority={displayedNfts.indexOf(nft) < 6} // Prioritize loading first 6 images
                          loading={
                            displayedNfts.indexOf(nft) < 6 ? "eager" : "lazy"
                          } // Eager loading for first 6
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center">
                          <span className="text-black font-bold text-2xl opacity-50">
                            NFT
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="lg:h-[30%] h-[34%]  flex relative">
                      <div className="w-10 border-r-2 border-black flex items-center justify-center relative">
                        <div className="absolute transform -rotate-90 whitespace-nowrap text-sm md:text-sm lg:text-base font-bold text-black tracking-tight">
                          {nft.name.length > 12
                            ? nft.name.substring(0, 12) + "..."
                            : nft.name}
                        </div>
                      </div>

                      {/* Right side - Token and controls */}
                      <div className="flex-1 p-2 flex flex-col justify-between">
                        {/* Token number and rarity */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm md:text-sm lg:text-base font-bold text-black tracking-tight">
                            TOKEN: #{nft.tokenId}
                          </p>
                          <p className="text-sm font-medium text-black tracking-tight mt-1">
                            RARITY:{" "}
                            <span className="font">
                              {getRarityLabel(nft.tokenId, nft.contractAddress)}
                            </span>
                          </p>
                        </div>

                        {/* Bottom section with price and swap button */}
                        <div className="border-t  border-black ">
                          <div className="flex flex-col items-end space-y-1">
                            <p className="text-sm md:text-sm lg:text-base font-medium text-black tracking-tight">
                              POINTS:{" "}
                              {calculateRarityPoints(
                                nft.tokenId,
                                nft.contractAddress
                              )}
                            </p>
                            <Button
                              className="bg-white hover:bg-gray-100 text-black border-2 border-black font-bold text-sm md:text-sm lg:text-base md:py-2 md:px-6 h-10 rounded-md shadow-neo"
                              onClick={() => handleSwapNFT(nft)}
                              disabled={
                                burningNft ===
                                `${nft.contractAddress}-${nft.tokenId}`
                              }
                            >
                              {burningNft ===
                              `${nft.contractAddress}-${nft.tokenId}`
                                ? "SWAPPING..."
                                : "SWAP"}
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
                <p className="text-black text-xl font-bold">
                  No NFTs found from the specified collections
                </p>
                <p className="text-black text-base mt-2">
                  Make sure you own NFTs from Ridiculous Dragons or Nomaimai
                  collections
                </p>
              </div>
            )}
          </div>

          {hasMoreNfts && (
            <div className="text-center pt-6 lg:pt-8 xl:pt-10">
              <Button
                className="bg-[#FBAC82] hover:bg-[#ffbb97] h-12 lg:h-14 xl:h-16 rounded-full shadow-neo border-2 border-black px-8 lg:px-10 xl:px-12"
                onClick={handleViewMore}
              >
                <span className="mr-3">
                  <Star className="inline-block w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 fill-black stroke-black" />
                </span>
                <span
                  className={cn(
                    "text-2xl lg:text-3xl xl:text-4xl text-black",
                    racing.className
                  )}
                >
                  VIEW MORE
                </span>
                <span className="ml-3">
                  <Star className="inline-block w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 fill-black stroke-black" />
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
