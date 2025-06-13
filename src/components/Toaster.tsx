"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #000",
        },
      }}
    />
  );
}
