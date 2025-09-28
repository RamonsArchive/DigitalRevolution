import React from "react";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <Navbar />
        {children}
        <Toaster richColors />
        <Footer />
      </SessionProvider>
    </>
  );
};

export default layout;
