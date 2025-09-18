"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { animateTextTimeline } from "@/lib/utils";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useScrollThrottle } from "@/hooks/useScrollThrottle";

gsap.registerPlugin(SplitText);

const Navbar = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const normalMenuRef = useRef<SVGSVGElement>(null);
  const scrollMenuRef = useRef<SVGSVGElement>(null);
  const menuRefInner = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const shouldShow = currentScrollY > 42;
    setIsDropdown((prev) => (prev !== shouldShow ? shouldShow : prev));
  }, []);

  // Scroll throttling effect
  useScrollThrottle({ onScroll: handleScroll });

  useEffect(() => {
    if (shouldRender) {
      // Wait for DOM to update after menu opens
      animateTextTimeline({
        targets: [".mobile-nav-link"],
        type: "words",
        duration: 1,
        ease: "power2.inOut",
        delay: 0,
        opacity: 0,
        y: 100,
        stagger: 0.1,
      });
    }
  }, [shouldRender]);

  // Click outside effect
  useClickOutside({
    insideRef: menuRefInner,
    outsideRef: normalMenuRef || scrollMenuRef || null,
    currentState: openMenu,
    onInsideClick: () => {
      setOpenMenu(true);
      setShouldRender(true);
    },
    onOutsideClick: () => {
      setShouldRender(false);
      setOpenMenu(false);
    },
  });

  // Memoized navigation links - only re-renders if NAV_LINKS changes
  const navigationLinks = useMemo(
    () => (
      <div className="flex items-center w-full flex-col md:flex-row md:justify-end h-full">
        {NAV_LINKS.map((link) => (
          <Link key={link.id} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </div>
    ),
    []
  );

  const mobileNavigationLinks = useMemo(
    () => (
      <div className="flex items-center w-full flex-col md:flex-row md:justify-end h-full">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="mobile-nav-link nav-link"
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
    setShouldRender(false);
  }, []);

  // Mobile menu component - always rendered for smooth animations
  const mobileMenu = useMemo(() => {
    return (
      <div
        ref={menuRefInner}
        className={`fixed md:hidden top-0 right-0 bottom-0 h-[100dvh] w-[50%] bg-bg-primary transition-all duration-300 ease-in-out z-50 ${
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
          {mobileNavigationLinks}
        </div>
      </div>
    );
  }, [openMenu, handleCloseMenu, navigationLinks]);

  const scrollNavbar = useMemo(() => {
    return (
      <div
        className={`fixed flex bg-bg-primary px-10 py-5 w-full items-center justify-between top-0 left-0 right-0 h-[42px] transition-all duration-300 ease-in-out z-10 overflow-y-hidden ${
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
        className={`flex w-full bg-bg-primary items-center justify-between h-[42px] px-10 py-5 transition-all duration-300 ease-in-out z-10 overflow-y-hidden ${
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

export default memo(Navbar);
