"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const ClientProfileIcon = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // useMemo for expensive computations or objects that depend on specific values
  // Only recalculate when session.user.image actually changes
  const userImageUrl = useMemo(() => {
    return session?.user?.image || "/Assets/UserPlaceholder.svg";
  }, [session?.user?.image]); // Only re-run when the image URL changes

  // useCallback for functions that are passed to child components or used in effects
  // Prevents unnecessary re-renders of child components
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      console.warn("Profile image failed to load, using placeholder");
      setImageError(true);
      e.currentTarget.src = "/Assets/UserPlaceholder.svg";
    },
    []
  ); // No dependencies since it's a static handler

  const handleAuthClick = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      if (session) {
        await signOut({ redirect: false });
        toast.success("SUCCESS", { description: "Logged out successfully" });
        setImageError(false); // Reset error state on logout
      } else {
        await signIn("google", { callbackUrl: "/" });
        toast.success("SUCCESS", { description: "Logged in successfully" });
      }
    } catch (error) {
      toast.error("ERROR", { description: "Failed to sign in or out" });
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading]); // Dependencies: session and isLoading

  // Reset image error when session changes (new user logged in)
  useEffect(() => {
    setImageError(false);
  }, [session?.user?.image]);

  // useMemo for the final image source logic
  const finalImageSrc = useMemo(() => {
    if (imageError) return "/Assets/UserPlaceholder.svg";
    return userImageUrl;
  }, [imageError, userImageUrl]);

  // useMemo for button className to prevent recalculation on every render
  const buttonClassName = useMemo(() => {
    return `w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-200 bg-gray-700 ${
      isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
    }`;
  }, [isLoading]);

  return (
    <button
      onClick={handleAuthClick}
      disabled={isLoading}
      className={buttonClassName}
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <img
          src={finalImageSrc}
          alt="User Profile"
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
          // Use userImageUrl as key to force re-render when image changes
          key={userImageUrl}
        />
      )}
    </button>
  );
};

export default ClientProfileIcon;

/* 
EXPLANATION OF WHEN TO USE EACH:

1. useMemo:
   - Use for expensive computations
   - Use for objects/values that should only change when specific dependencies change
   - Examples: userImageUrl, finalImageSrc, buttonClassName

2. useCallback:
   - Use for functions passed to child components (prevents child re-renders)
   - Use for functions used in useEffect dependencies
   - Use for event handlers that don't need to be recreated on every render
   - Examples: handleAuthClick, handleImageError

3. React.memo (for the entire component):
   - Use when you want to prevent the entire component from re-rendering
   - Only re-render when props actually change
   - Useful if this component is used in multiple places

KEY POINTS:
- useMemo prevents recalculation of values
- useCallback prevents recreation of functions
- Both help with performance but only use when there's an actual benefit
- Over-optimizing can sometimes hurt performance
*/
