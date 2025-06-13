import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="relative bg-[#fde0b9] z-10 p-4 text-center mt-32">
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
          <p className="text-xs md:text-lg text-black/80">
            contact@company.com
          </p>
        </div>
      </div>
      <div className="mt-4 text-xs md:text-sm text-black">
        <p className="border-b pb-2 border-stone-500/50">
          Copyright © 2025 GULULU Templates
        </p>
        <p className="mt-2 text-[9px] md:text-xs">
          All Rights Reserved | Terms and Conditions | Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Footer;
