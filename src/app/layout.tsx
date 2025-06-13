"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { cn, poppins } from "@/lib/utils";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/Toaster";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased bg-gradient-to-b from-[#FFC882] to-[#FDE0B9]",
          poppins.className
        )}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className="mx-auto min-h-screen bg-[#FFC882] relative overflow-hidden">
                {children}
                <Footer />
                <Toaster />
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
