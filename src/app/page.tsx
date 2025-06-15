"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Image from "next/image";
import { cn, racing, spicy } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function WelcomeScreen() {
  const { isConnected } = useAccount();

  return (
    <div>
      <Header />

      <Image
        src={"/bg1.png"}
        alt=""
        width={600}
        height={100}
        className="absolute top-0 left-0 w-full object-cover"
      />
      <Image
        src={"/bg2.png"}
        alt=""
        width={600}
        height={100}
        className="absolute top-[330px] md:top-[1150px] left-0 w-full object-cover"
      />

      {/* Main Content */}
      <div className="relative z-10 p-6 lg:p-12 xl:p-16">
        {/* Welcome Banner */}
        <div className="relative mb-20 lg:mb-32 xl:mb-40 md:min-h-[400px]">
          <Image
            src={"/Group 48096007.png"}
            alt=""
            width={1000}
            height={600}
            className="absolute -top-8 lg:-top-12 xl:-top-32 w-full px-10 lg:px-12 xl:px-16 max-w-4xl left-1/2 -translate-x-1/2"
          />

          <div className="text-center relative z-10 mt-6 lg:mt-12 xl:mt-16">
            <h1 className="mb-2 tracking-widest text-sm md:text-base lg:text-4xl">
              WELCOME TO
              <br />
              <span
                className={cn(
                  "text-[44px] md:text-6xl lg:text-9xl tracking-normal leading-6  md:leading-8 lg:leading-18 xl:leading-20",
                  racing.className
                )}
              >
                GULULAND
              </span>
            </h1>
            <p
              className={cn(
                "text-[10px] md:text-xs lg:text-base xl:text-xl text-black font-black mb-1 lg:mb-2 xl:mb-4",
                spicy.className
              )}
            >
              Swap Your Ridiculous Dragons And Nomaimai
              <br />
              NFTs For Gululu Points
            </p>
            {!isConnected && (
              <ConnectButton.Custom>
                {(props) => (
                  <Button
                    onClick={props.openConnectModal}
                    className="bg-[#ffdcaf] hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
                  >
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        </div>

        {/* Process Steps */}
        <Image
          src={"/cardbg.png"}
          alt=""
          width={1000}
          height={100}
          className="mb-4 absolute z-[-1] w-full md:w-[95%] -translate-x-1/2 left-1/2"
        />
        <div className="space-y-2.5 lg:space-y-4 xl:space-y-14 w-full pt-4 lg:pt-8 xl:pt-24 z-10 relative max-w-[1250px] mx-auto md:mb-40">
          <Image
            src={"/12.png"}
            alt=""
            width={350}
            height={100}
            className="mb-4 absolute -translate-y-full top-4 lg:top-8 xl:top-12 -right-10 lg:-right-16 xl:-right-20 z-[1] w-36 md:w-40 lg:w-64 xl:w-[500px]"
          />
          <Image
            src={"/32.png"}
            alt=""
            width={350}
            height={100}
            className="mb-4 absolute -translate-y-full top-8 lg:top-12 xl:top-16 -left-9 lg:-left-16 xl:-left-20 z-[1] w-36 md:w-38 lg:w-64 xl:w-[500px]"
          />

          <Card className="border-2 lg:border-4 p-0 mx-3 lg:mx-6 xl:mx-8 rounded-none border-black bg-[#FFC67C] shadow-neo">
            <CardContent className="px-2 lg:px-4 xl:px-20 py-0 lg:py-4 xl:py-6 flex items-center gap-4 lg:gap-6 xl:gap-8">
              <div className="flex-1">
                <h3 className="font-bold text-black text-sm lg:text-4xl xl:text-6xl">
                  Connect Wallet
                </h3>
                <p className="text-[10px] lg:text-sm xl:text-2xl leading-tight text-black">
                  Connect your Web3 wallet to
                  <br />
                  access your NFT collection.
                </p>
              </div>
              <Image
                src={"/Untitled-1 1.png"}
                alt=""
                width={270}
                className="w-20 lg:w-28 xl:w-56"
                height={50}
              />
            </CardContent>
          </Card>

          <Card className="border-2 lg:border-4 p-0 mx-3 lg:mx-6 xl:mx-8 rounded-none border-black bg-[#FFC67C] shadow-neo">
            <CardContent className="px-2 lg:px-4 xl:px-20 py-0 lg:py-4 xl:py-6 flex items-center gap-4 lg:gap-6 xl:gap-8">
              <Image
                src={"/Group 48096005.png"}
                alt=""
                width={270}
                className="w-20 lg:w-28 xl:w-56 -translate-y-1"
                height={50}
              />
              <div className="flex-1 text-right">
                <h3 className="font-bold text-black text-sm lg:text-4xl xl:text-6xl">
                  Select NFT
                </h3>
                <p className="text-[10px] lg:text-sm xl:text-2xl leading-tight text-black">
                  Choose an NFT from your collection
                  <br />
                  that you want to swap.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 lg:border-4 py-1 lg:py-2 xl:py-3 mx-3 lg:mx-6 xl:mx-8 rounded-none border-black bg-[#FFC67C] shadow-neo">
            <CardContent className="px-2 lg:px-4 xl:px-20 py-0 lg:py-3 xl:py-5 flex items-center gap-4 lg:gap-6 xl:gap-8">
              <div className="flex-1">
                <h3 className="font-bold text-black text-sm lg:text-4xl xl:text-6xl">
                  Swap & Analyse
                </h3>
                <p className="text-[10px] lg:mt-4 lg:text-sm xl:text-2xl leading-tight text-black">
                  Swap the NFT and we analyse its
                  <br />
                  metadata for rarity.
                </p>
              </div>
              <Image
                src={"/Group 48096003.png"}
                alt=""
                width={270}
                className="w-20 lg:w-28 xl:w-56"
                height={50}
              />
            </CardContent>
          </Card>

          <Card className="border-2 lg:border-4 py-0 lg:py-4 xl:py-6 mx-3 lg:mx-6 xl:mx-8 rounded-none border-black bg-[#FFC67C] shadow-neo">
            <CardContent className="px-2 lg:px-4 xl:px-20 py-1 lg:py-3 xl:py-5 flex items-center gap-4 lg:gap-6 xl:gap-8">
              <Image
                src={"/Group 48096004.png"}
                alt=""
                width={270}
                className="w-20 lg:w-28 xl:w-56"
                height={50}
              />
              <div className="flex-1 text-right">
                <h3 className="font-bold text-black text-sm lg:text-4xl xl:text-6xl">
                  Earn Points
                </h3>
                <p className="text-[10px] lg:text-sm xl:text-2xl leading-tight text-black">
                  Receive points based on the rarity
                  <br />
                  and view in your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
