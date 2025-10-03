"use client";
import { Toaster } from "sonner";

export default function SonnerWrapper() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        style: {
          background: "#17181B",
          border: "1px solid #2A2B2E",
          color: "#fff",
        },
      }}
    />
  );
}
