"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { cn, racing, spicy } from "@/lib/utils";
import Image from "next/image";

export default function TermsAndConditionsPage() {
  return (
    <div>
      <Header />
      <Image
        src={"/bg2.png"}
        alt=""
        width={600}
        height={100}
        className="absolute top-0 left-0 w-full object-cover z-0"
      />
      <div className="relative z-10 p-6 lg:p-12 xl:p-16 max-w-4xl mx-auto">
        <Card className="border-2 lg:border-4 rounded-none border-black bg-[#FFC67C] shadow-neo">
          <CardContent className="px-4 lg:px-10 xl:px-16 py-8 lg:py-12 xl:py-16">
            <h1
              className={cn(
                "text-3xl md:text-5xl xl:text-6xl font-black text-black mb-6 text-center",
                racing.className
              )}
            >
              📜 Terms & Conditions for $GULULU Token Redemption
              <br className="hidden md:block" />
              <span className="text-xl md:text-2xl block mt-2 font-bold text-black">
                (NFT Swap Program)
              </span>
            </h1>
            <div
              className={cn(
                "space-y-8 text-black text-base md:text-lg xl:text-xl",
                spicy.className
              )}
            >
              <div>
                <span className="font-bold text-lg md:text-xl">
                  1. Voluntary Participation
                </span>
                <p className="mt-2">
                  By participating in the $GULULU redemption program, you (the
                  &quot;Participant&quot;) acknowledge that you are doing so voluntarily
                  and without any compulsion or coercion. The swap of your
                  existing NFTs (e.g., Ridiculous Dragons, NoMaiMai) for $GULULU
                  tokens is a goodwill initiative by the Project, and not a
                  legal obligation.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  2. One-Time Swap / Non-Reversible
                </span>
                <p className="mt-2">
                  Each eligible NFT holder is entitled to a one-time swap of
                  their NFT(s) for a specified number of $GULULU tokens. This
                  swap is final, non-reversible, and non-refundable. After the
                  swap is completed, you shall have no further claims against
                  the Project regarding the original NFT(s).
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  3. Extinguishment of Prior Claims
                </span>
                <p className="mt-2">
                  By accepting the swap and receiving $GULULU tokens, you:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>
                    Waive and release all past, present, and future claims,
                    demands, liabilities, or causes of action—whether known or
                    unknown—against the Project, its founders, partners,
                    developers, and affiliates.
                  </li>
                  <li>
                    Confirm that you will not pursue legal action regarding lost
                    value, failed promises, or performance issues related to the
                    original NFTs.
                  </li>
                </ul>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  4. No Guarantee or Representation
                </span>
                <p className="mt-2">
                  The Project does not make any guarantees about:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>The future value of $GULULU tokens</li>
                  <li>Liquidity, volatility, or market price</li>
                  <li>Potential profit or returns</li>
                </ul>
                <p className="mt-2">
                  You understand and agree that $GULULU is a community meme
                  token, and its value is entirely driven by market forces and
                  public perception.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  5. Not an Investment Contract
                </span>
                <p className="mt-2">$GULULU tokens are not classified as:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Securities</li>
                  <li>Investment products</li>
                  <li>Legal tender</li>
                </ul>
                <p className="mt-2">
                  Nothing in this program constitutes financial advice or an
                  investment scheme. By accepting $GULULU, you confirm that you
                  are not expecting any guaranteed financial return.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  6. No Promoter Obligation
                </span>
                <p className="mt-2">
                  Post-redemption, the Project and its team are not obligated to
                  maintain, promote, buy back, or support the token beyond
                  community initiatives. The Project is under no fiduciary duty
                  to token holders.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  7. Eligibility Verification
                </span>
                <p className="mt-2">
                  Redemption is available only to verified wallets holding
                  original NFTs as per a snapshot taken on [insert snapshot
                  date]. Fraudulent claims or duplicate submissions will be
                  disqualified at the Project&apos;s discretion.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  8. Governing Law & Jurisdiction
                </span>
                <p className="mt-2">
                  This agreement shall be governed by the laws of India. Any
                  dispute arising shall be subject to arbitration.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  9. Amendment Clause
                </span>
                <p className="mt-2">
                  The Project reserves the right to modify or terminate the
                  redemption process at any time without prior notice, but will
                  not affect claims already processed under this program.
                </p>
              </div>
              <div className="border-t-2 border-black pt-6">
                <span className="font-bold text-lg md:text-xl">
                  10. Acknowledgment
                </span>
                <p className="mt-2">
                  By accepting $GULULU tokens, you confirm:
                </p>
                <ul className="list-disc ml-6 mt-2">
                  <li>You have read and understood these terms</li>
                  <li>
                    You voluntarily release the Project from all previous
                    NFT-related liabilities
                  </li>
                  <li>
                    You accept that all future gains or losses are at your own
                    risk
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
