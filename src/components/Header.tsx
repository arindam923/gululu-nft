"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Wallet, LogOut } from "lucide-react";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserPoints } from "@/lib/hooks/useUserPoints";

const Header = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { points, isLoading } = useUserPoints();

  const pathname = usePathname();

  useEffect(() => {
    if (isConnected && pathname === "/") {
      router.push("/swap");
    }
  }, [isConnected, router, pathname]);

  const handlePointsClick = () => {
    router.push("/swap");
  };

  const handleDisconnect = () => {
    disconnect();
    router.push("/");
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
          <>
            <Button
              onClick={handlePointsClick}
              className="bg-[#ffdcaf] hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
            >
              <Image src="/LOGOy2 1.png" alt="" width={20} height={20} />
              {isLoading ? "Loading..." : `${points} Points`}
            </Button>
            <Button
              onClick={handleDisconnect}
              className="bg-[#ffdcaf] lg:ml-5 ml-1 hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Disconnect
            </Button>
          </>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                onClick={openConnectModal}
                className="bg-[#ffdcaf] mr-5 hover:bg-[#e7c393] text-black scale-90 lg:scale-100 xl:scale-110 text-[10px] md:text-xs lg:text-sm xl:text-xl h-6 md:h-8 lg:h-10 xl:h-12 rounded-lg px-4 lg:px-6 xl:px-8 border-2 border-black shadow-neo"
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
