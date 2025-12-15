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
import ProfileIcon from "./ProfileIcon";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [showFloatingNavbar, setShowFloatingNavbar] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const normalMenuRef = useRef<HTMLButtonElement>(null);
  const scrollMenuRef = useRef<HTMLButtonElement>(null);
  const menuRefInner = useRef<HTMLDivElement>(null);
  const NAVBAR_HEIGHT = 42;

  // Scroll listener to show floating navbar on scroll down and hide on scroll up
  useEffect(() => {
    const updateNavbar = () => {
      const currentScrollY = Math.max(0, window.scrollY || 0);
      const pastNavbar = currentScrollY > NAVBAR_HEIGHT;
      const goingDown = currentScrollY > lastScrollY.current;

      if (pastNavbar) {
        setShowFloatingNavbar(goingDown);
      } else {
        setShowFloatingNavbar(false);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    lastScrollY.current = Math.max(0, window.scrollY || 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Memoized close handler to prevent re-renders
  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
    setShouldRender(false);
  }, []);

  useEffect(() => {
    // might need to clsoe menu here
    handleCloseMenu();
  }, [pathname, handleCloseMenu]);

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

  // Menu click handler
  const handleMenuClick = useCallback(() => {
    setOpenMenu(true);
    setShouldRender(true);
  }, []);

  // Click outside effect - only for closing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu &&
        menuRefInner.current &&
        !menuRefInner.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
        setShouldRender(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  // Memoized navigation links - only re-renders if NAV_LINKS changes
  const navigationLinks = useMemo(
    () => (
      <div className="flex items-center w-full flex-col md:flex-row md:justify-end h-full">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`nav-link ${link.id === "shop" ? "nav-link-shop" : ""}`}
          >
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
            className={`mobile-nav-link nav-link ${link.id === "shop" ? "nav-link-shop" : ""}`}
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
            src="/Assets/Logos/lightDRLogo.svg"
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

  const profileIcon = useMemo(() => <ProfileIcon />, []);
  // Menu icon components - separate for normal and scroll
  const NormalMenuIcon = useMemo(
    () => (
      <button
        ref={normalMenuRef}
        onClick={handleMenuClick}
        className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-slate-400 active:bg-slate-600"
      >
        <Menu className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95" />
      </button>
    ),
    [handleMenuClick]
  );

  const ScrollMenuIcon = useMemo(
    () => (
      <button
        ref={scrollMenuRef}
        onClick={handleMenuClick}
        className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-slate-400 active:bg-slate-600"
      >
        <Menu className="text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95" />
      </button>
    ),
    [handleMenuClick]
  );

  // Mobile menu component - always rendered for smooth animations
  const mobileMenu = useMemo(() => {
    return (
      <div
        ref={menuRefInner}
        className={`fixed md:hidden top-0 right-0 bottom-0 h-dvh w-[50%] bg-bg-primary transition-all duration-300 ease-in-out z-60 ${
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
  }, [openMenu, handleCloseMenu, mobileNavigationLinks]);

  // Create navbars WITHOUT ProfileIcon inside them
  const scrollNavbar = useMemo(() => {
    return (
      <div
        className={`fixed flex bg-bg-primary px-10 py-5 w-full items-center justify-between top-0 left-0 right-0 h-[42px] transition-all duration-300 ease-in-out z-50 ${
          showFloatingNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        {logo}
        <div className="hidden md:flex items-center h-full gap-6">
          {navigationLinks}
          {profileIcon}
        </div>
        <div className="flex md:hidden items-center gap-3">
          {ScrollMenuIcon}
          {profileIcon}
        </div>
      </div>
    );
  }, [showFloatingNavbar, logo, navigationLinks, ScrollMenuIcon, profileIcon]);

  const normalNavbar = useMemo(() => {
    return (
      <div className="flex w-full bg-bg-primary items-center justify-between px-10 py-5 h-[42px] transition-all duration-300 ease-in-out z-40">
        {logo}
        <div className="hidden md:flex items-center h-full gap-6">
          {navigationLinks}
          {profileIcon}
        </div>
        <div className="flex md:hidden items-center gap-3">
          {NormalMenuIcon}
          {profileIcon}
        </div>
      </div>
    );
  }, [logo, navigationLinks, NormalMenuIcon, profileIcon]);

  return (
    <>
      {normalNavbar}
      {scrollNavbar}
      {mobileMenu}
    </>
  );
};

export default memo(Navbar);
