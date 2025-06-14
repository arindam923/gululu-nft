import { MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="relative bg-[#fde0b9] z-10 p-6 text-center mt-32 pb-10">
      <div className="flex items-center justify-between px-4 gap-2 mb-10 md:pt-10">
        <Image
          src="/logo.png"
          alt=""
          width={220}
          height={30}
          className="md:w-60 w-20"
        />
        <div className="text-right">
          <p className="text-xs md:text-lg text-black font-semibold">
            Contact us
          </p>
          <a
            href="https://t.me/gululusupport"
            className="text-xs  flex items-center gap-2 md:text-sm text-[#4a90e2] hover:underline"
          >
            <MailCheck className="text-black" />
            <span className="font-bold">Contact Us</span>
          </a>
        </div>
      </div>
      <div className="mt-4 mb-8 text-xs md:text-sm text-black">
        <p className="border-b pb-2 font-bold border-stone-500/50">
          Copyright © 2025 GULULU
        </p>
        <p className="mt-2 text-[9px] font-bold md:text-xs mb-4">
          All Rights Reserved |{" "}
          <Link
            href="/terms"
            className="text-[#4a90e2] font-bold hover:underline"
          >
            Terms and Conditions
          </Link>{" "}
          |{" "}
          <a
            href="https://gululu.io/privacy"
            className="text-[#4a90e2] hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
