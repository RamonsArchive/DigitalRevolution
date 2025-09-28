"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

const ClientProfileIcon = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };

    if (dropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropDownOpen]);

  // useMemo for expensive computations or objects that depend on specific values
  const userImageUrl = useMemo(() => {
    // For Google images, try to get a higher quality version and handle CORS
    if (session?.user?.image) {
      const imageUrl = session.user.image;
      // If it's a Google image, try to get a larger size and add parameters to reduce rate limiting
      if (imageUrl.includes("googleusercontent.com")) {
        return imageUrl.replace(/=s\d+/, "=s96") + "?sz=96";
      }
      return imageUrl;
    }
    return "/Assets/UserPlaceholder.svg";
  }, [session?.user?.image]);

  // Handle image loading errors
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      console.warn("Profile image failed to load, using placeholder");
      if (!imageError) {
        // Prevent infinite loop
        setImageError(true);
        e.currentTarget.src = "/Assets/UserPlaceholder.svg";
      }
    },
    [imageError]
  );

  const handleSignOut = useCallback(async () => {
    try {
      setDropDownOpen(false);
      await signOut({ redirect: false });
      toast.success("SUCCESS", { description: "Logged out successfully" });
      setImageError(false);
    } catch (error) {
      toast.error("ERROR", { description: "Failed to sign out" });
    }
  }, []);

  const handleAuthClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event bubbling

      if (isLoading) return;

      try {
        setIsLoading(true);

        if (session) {
          // Toggle dropdown for logged in users
          setDropDownOpen((prev) => !prev);
        } else {
          // Sign in for logged out users
          await signIn("google", { callbackUrl: "/" });
          toast.success("SUCCESS", { description: "Logged in successfully" });
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("ERROR", { description: "Failed to authenticate" });
      } finally {
        setIsLoading(false);
      }
    },
    [session, isLoading]
  );

  // Reset image error when session changes
  useEffect(() => {
    setImageError(false);
    setDropDownOpen(false); // Close dropdown when session changes
  }, [session?.user?.id]); // Use user ID instead of image to be more stable

  // Final image source with error handling
  const finalImageSrc = useMemo(() => {
    if (imageError || !session?.user?.image) {
      return "/Assets/UserPlaceholder.svg";
    }
    return userImageUrl;
  }, [imageError, userImageUrl, session?.user?.image]);

  // Button styling
  const buttonClassName = useMemo(() => {
    const baseClasses =
      "relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all duration-200 bg-gray-700";
    const interactiveClasses = isLoading
      ? "opacity-50 cursor-not-allowed border-white/20"
      : "hover:scale-105 border-white/20 hover:border-white/40";

    return `${baseClasses} ${interactiveClasses}`;
  }, [isLoading]);

  // Dropdown menu
  const dropDownCard = useMemo(() => {
    if (!session) return null;

    return (
      <div
        className={`absolute top-12 right-0 w-48 bg-slate-800 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-600 transition-all duration-300 z-[999] ${
          dropDownOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          backgroundColor: "rgb(30 41 59)", // Force background color
          color: "white", // Force text color
        }}
      >
        <div className="py-2 text-white">
          <div className="px-4 py-2 border-b border-slate-600">
            <p className="text-sm text-white truncate font-medium">
              {session.user?.name || session.user?.email}
            </p>
          </div>

          <Link
            href="/profile"
            className="flex items-center px-4 py-3 text-white hover:bg-slate-700 transition-colors duration-200 group w-full"
            onClick={() => setDropDownOpen(false)}
          >
            <span className="text-lg mr-3">👤</span>
            <span className="font-medium text-white">Profile</span>
          </Link>

          <Link
            href="/orders"
            className="flex items-center px-4 py-3 text-white hover:bg-slate-700 transition-colors duration-200 group w-full"
            onClick={() => setDropDownOpen(false)}
          >
            <span className="text-lg mr-3">📦</span>
            <span className="font-medium text-white">Orders</span>
          </Link>

          <div className="border-t border-slate-600 my-1"></div>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-red-300 hover:bg-red-900 transition-colors duration-200 group"
          >
            <span className="text-lg mr-3">🚪</span>
            <span className="font-medium text-red-300">Sign Out</span>
          </button>
        </div>
      </div>
    );
  }, [dropDownOpen, session, handleSignOut]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleAuthClick}
        disabled={isLoading}
        className={buttonClassName}
        aria-label={session ? "User menu" : "Sign in"}
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
            crossOrigin="anonymous"
            // Force re-render when user changes, not just image URL
            key={session?.user?.id || "placeholder"}
          />
        )}
      </button>
      {dropDownCard}
    </div>
  );
};

export default ClientProfileIcon;
