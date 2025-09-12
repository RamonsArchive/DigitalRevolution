"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { DivideCircle, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const normalMenuRef = useRef<SVGSVGElement>(null);
  const scrollMenuRef = useRef<SVGSVGElement>(null);
  const menuRefInner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const normalClicked = normalMenuRef.current?.contains(
        event.target as Node
      );
      const scrollClicked = scrollMenuRef.current?.contains(
        event.target as Node
      );
      const innerClicked = menuRefInner.current?.contains(event.target as Node);
      if (!normalClicked && !scrollClicked && !innerClicked) {
        setOpenMenu(false);
      } else if ((normalClicked || scrollClicked) && !innerClicked) {
        setOpenMenu(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Show when scrolling up or at top, hide when scrolling down
    if (currentScrollY > 42) {
      setIsDropdown(true);
    } else if (currentScrollY < 42) {
      setIsDropdown(false);
    }
  }, []);

  // Memoized navigation links - only re-renders if NAV_LINKS changes
  const navigationLinks = useMemo(
    () => (
      <div className="flex items-center w-full flex-col md:flex-row md:justify-end h-full">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="w-full text-center md:w-fit font-courier-prime text-white text-lg font-bold px-5 py-2 transition-all duration-300 ease-in-out hover:bg-primary-400 active:bg-primary-600"
          >
            {link.label}
          </Link>
        ))}
      </div>
    ),
    []
  );

  // Memoized logo - static, never changes
  const logo = useMemo(
    () => (
      <Link href="/" className="flex items-center">
        <div className="relative w-[225px]">
          <Image
            src="/Assets/Logos/lightDRlogo.svg"
            alt="DR Logo"
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>
    ),
    []
  );

  // Memoized close handler to prevent re-renders
  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  // Mobile menu component - always rendered for smooth animations
  const mobileMenu = useMemo(() => {
    return (
      <div
        ref={menuRefInner}
        className={`fixed top-0 right-0 bottom-0 h-[100dvh] w-[50%] transition-all duration-300 ease-in-out z-50 bg-black ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-10 w-full h-full">
          <div className="flex w-full items-center justify-end p-5">
            <button
              className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-slate-400 active:bg-slate-600"
              onClick={handleCloseMenu}
            >
              <X className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:text-slate-700 active:text-slate-700" />
            </button>
          </div>
          {navigationLinks}
        </div>
      </div>
    );
  }, [openMenu, handleCloseMenu, navigationLinks]);

  const scrollNavbar = useMemo(() => {
    return (
      <div
        className={`fixed flex px-10 py-5 w-full items-center justify-between top-0 left-0 right-0 h-[42px] transition-all duration-300 ease-in-out z-10 bg-black overflow-y-hidden ${
          isDropdown
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        {logo}
        <div className="hidden md:flex items-center h-full">
          {navigationLinks}
        </div>
        <div className="flex md:hidden items-center">
          <Menu
            ref={scrollMenuRef}
            className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          />
        </div>
      </div>
    );
  }, [isDropdown, logo, navigationLinks]);

  const normalNavbar = useMemo(() => {
    return (
      <div
        className={`flex w-full items-center justify-between h-[42px] px-10 py-5 transition-all duration-300 ease-in-out z-10 overflow-y-hidden ${
          isDropdown
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        {logo}
        <div className="hidden md:flex items-center h-full">
          {navigationLinks}
        </div>
        <div className="flex md:hidden items-center">
          <Menu
            ref={normalMenuRef}
            className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          />
        </div>
      </div>
    );
  }, [isDropdown, logo, navigationLinks]);

  return (
    <>
      {normalNavbar}
      {scrollNavbar}
      {mobileMenu}
    </>
  );
};

export default Navbar;
