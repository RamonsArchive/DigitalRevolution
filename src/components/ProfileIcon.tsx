"use client";
import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ClientProfileIcon = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const userImage = session?.user?.image;
  const hasValidImage = userImage && userImage.startsWith("http");

  const handleAuthClick = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (session) {
        // User is logged in, sign them out
        await signOut({ redirect: false });
        toast.success("SUCCESS", { description: "Logged out successfully" });
      } else {
        // User is not logged in, sign them in
        await signIn("google", { callbackUrl: "/" });
        toast.success("SUCCESS", { description: "Logged in successfully" });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("ERROR", { description: "Failed to sign in or out" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuthClick}
      disabled={isLoading}
      className={`w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 bg-gray-700 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : hasValidImage ? (
        <img
          src={userImage}
          alt="User Profile"
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/Assets/UserPlaceholder.svg";
          }}
        />
      ) : (
        <img
          src="/Assets/UserPlaceholder.svg"
          alt="User Profile"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      )}
    </button>
  );
};

export default ClientProfileIcon;
