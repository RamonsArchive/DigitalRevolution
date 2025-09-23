import React from "react";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <Navbar />
        {children}
        <Toaster richColors />
      </SessionProvider>
    </>
  );
};

export default layout;
