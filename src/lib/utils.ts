import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Poppins, Racing_Sans_One, Spicy_Rice } from "next/font/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const racing = Racing_Sans_One({
  subsets: ["latin"],
  weight: ["400"],
});

const spicy = Spicy_Rice({
  subsets: ["latin"],
  weight: ["400"],
});

export { poppins, racing, spicy };
