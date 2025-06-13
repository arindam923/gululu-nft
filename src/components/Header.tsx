"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Wallet, Flame } from "lucide-react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { points, isLoading } = useUserPoints();

  useEffect(() => {
    if (isConnected) {
      router.push("/burn");
    }
  }, [isConnected, router]);

  const handlePointsClick = () => {
    router.push("/burn");
  };

  return (
    <div className="z-50 flex items-center justify-between py-2 md:px-6 px-4 bg-gradient-to-r from-[#FFB100] to-[#E29D00] border-2 md:border-4 border-amber-900/80 rounded-lg mt-3 relative max-w-[1450px] mx-auto w-11/12 md:w-full">
      <Image
        src={"/Group 48095938.png"}
        alt=""
        width={100}
        height={50}
        className="absolute top-1/2 -translate-y-1/2 -left-2 w-5 md:w-10 md:-left-7"
      />
      <Image
        src={"/Group 48095938.png"}
        alt=""
        width={100}
        height={50}
        className="absolute top-1/2 -translate-y-1/2 -right-2 w-5 md:w-10 md:-right-7"
      />
      <Link href={"/"} className="flex items-center gap-2">
        <Image
          src={"/logo.png"}
          alt=""
          width={300}
          height={150}
          className="md:w-52 w-24"
        />
      </Link>
      <div className="flex gap-2">
        {isConnected ? (
          <Button
            onClick={handlePointsClick}
            className="bg-[#e9b234] hover:bg-[#d4a02e] text-white font-semibold text-sm md:text-lg border-[#b68a24c9] border-2 tracking-tight h-8 md:h-12"
          >
            <Flame className="w-4 h-4 mr-1" />
            {isLoading ? "Loading..." : `${points} Points`}
          </Button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                onClick={openConnectModal}
                className="bg-[#e9b234] hover:bg-[#d4a02e] text-white font-semibold text-sm md:text-lg border-[#b68a24c9] border-2 tracking-tight h-8 md:h-12"
              >
                <Wallet className="w-4 h-4 mr-1" />
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </div>
    </div>
  );
};

export default Header;
