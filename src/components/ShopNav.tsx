"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { SHOP_DATA } from "@/constants";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useScrollThrottle } from "@/hooks/useScrollThrottle";
import { useClickOutside } from "@/hooks/useClickOutside";
import { animateTextTimeline } from "@/lib/utils";
import ShopSearch from "./ShopSearch";
import Filters from "./Filters";

const ShopNav = () => {
  const shopNavLinks = SHOP_DATA.shopNavLinks;

  const normalMenuRef = useRef<HTMLButtonElement>(null);
  const scrollMenuRef = useRef<HTMLButtonElement>(null);
  const menuRefInner = useRef<HTMLDivElement>(null);

  const [isDropdown, setIsDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [shouldMenuRender, setShouldMenuRender] = useState(false);
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "filters">("pages");

  const searchRefInner = useRef<HTMLDivElement>(null);
  const searchRefOuter = useRef<HTMLDivElement>(null);
  const [openSearch, setOpenSearch] = useState(false);

  // Click outside effect for search
  useClickOutside({
    insideRef: searchRefInner,
    outsideRef: searchRefOuter,
    currentState: openSearch,
    onInsideClick: () => {
      setOpenSearch(true);
    },
    onOutsideClick: () => {
      setOpenSearch(false);
    },
  });

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const shouldShow = currentScrollY > 42;
    setIsDropdown((prev) => (prev !== shouldShow ? shouldShow : prev));
  }, []);

  // Add delay effect for scroll nav
  useEffect(() => {
    if (isDropdown) {
      const timer = setTimeout(() => {
        setShowScrollNav(true);
      }, 200); // 200ms delay
      return () => clearTimeout(timer);
    } else {
      setShowScrollNav(false);
    }
  }, [isDropdown]);
  // Scroll throttling effect
  useScrollThrottle({ onScroll: handleScroll });

  useEffect(() => {
    if (shouldMenuRender) {
      // Wait for DOM to update after menu opens
      animateTextTimeline({
        targets: [".shop-nav-link"],
        type: "words",
        duration: 1,
        ease: "power2.inOut",
        delay: 0,
        opacity: 0,
        y: 100,
        stagger: 0.1,
      });
    }
  }, [shouldMenuRender]);

  // menu click outside effect
  useClickOutside({
    insideRef: menuRefInner,
    outsideRef: isDropdown ? scrollMenuRef : normalMenuRef,
    currentState: openMenu,
    onInsideClick: () => {
      setOpenMenu(true);
      setShouldMenuRender(true);
    },
    onOutsideClick: () => {
      setOpenMenu(false);
      setShouldMenuRender(false);
    },
  });

  const handleMenuClick = useCallback(() => {
    setOpenMenu(true);
    setShouldMenuRender(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
    setShouldMenuRender(false);
  }, []);

  const menuData = useMemo(() => {
    return (
      <div
        ref={menuRefInner}
        className={`fixed flex top-0 left-0 right-0 h-[100dvh] w-[80%] bg-gradient-to-br from-secondary-800 via-primary-900 to-secondary-800 transition-all duration-300 ease-in-out overflow-y-hidden z-10 ${
          openMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        }`}
      >
        {/* Backdrop to prevent clicks through */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="flex flex-col w-full gap-10">
          <div className="relative z-10 flex flex-col w-full">
            {/* Header with Close Button */}
            <div className="flex w-full justify-end items-center p-6 border-b border-white/20">
              <button
                onClick={handleCloseMenu}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out hover:scale-110 group"
              >
                <X className="w-6 h-6 text-white group-hover:text-red-300 transition-colors duration-300" />
              </button>
            </div>
          </div>

          {/* Tabs - Mobile Only */}
          <div className="flex w-full flex-row px-6 md:hidden z-20">
            <button
              onClick={() => setActiveTab("pages")}
              className={`flex w-full px-4 py-2 transition-all duration-300 ease-in-out ${
                activeTab === "pages"
                  ? "bg-white/20 rounded-lg"
                  : "hover:bg-white/10 rounded-lg"
              }`}
            >
              <h2
                className={`text-lg font-bold transition-colors duration-300 ${
                  activeTab === "pages" ? "text-white" : "text-white/70"
                }`}
              >
                Pages
              </h2>
            </button>
            <button
              onClick={() => setActiveTab("filters")}
              className={`flex w-full px-4 py-2 transition-all duration-300 ease-in-out ${
                activeTab === "filters"
                  ? "bg-white/20 rounded-lg"
                  : "hover:bg-white/10 rounded-lg"
              }`}
            >
              <h2
                className={`text-lg font-bold transition-colors duration-300 ${
                  activeTab === "filters" ? "text-white" : "text-white/70"
                }`}
              >
                Filters
              </h2>
            </button>
          </div>

          <div className="flex flex-col w-full items-center z-20 overflow-y-auto">
            {/* Desktop: Always show pages */}
            <div className="hidden md:flex flex-col w-full items-center">
              {shopNavLinks.map((link) => (
                <Link key={link.id} href={link.href} className="shop-nav-link">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile: Show based on active tab */}
            <div className="flex md:hidden flex-col w-full items-center z-20 pb-15">
              {activeTab === "pages" ? (
                shopNavLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="shop-nav-link"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <Filters />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [shopNavLinks, openMenu, activeTab]);

  const menuIcon = useMemo(() => {
    return (
      <div className="flex items-center cursor-pointer">
        {isDropdown ? (
          <button
            ref={scrollMenuRef}
            onClick={handleMenuClick}
            className="p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : (
          <button
            ref={normalMenuRef}
            onClick={handleMenuClick}
            className="p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }, [isDropdown, handleMenuClick]);

  const searchButton = useMemo(() => {
    return (
      <div className="flex items-center" ref={searchRefOuter}>
        <button
          onClick={() => setOpenSearch(!openSearch)}
          className="flex w-full max-w-lg items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-sm font-medium">Search</span>
        </button>
      </div>
    );
  }, [openSearch]);
  const shopCart = useMemo(() => {
    return (
      <button className="relative p-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl">
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          0
        </span>
      </button>
    );
  }, []);

  const normalShopNav = useMemo(() => {
    return (
      <div
        className={`flex items-center justify-between w-full h-[38px] px-10 py-3 transition-all z-1 duration-300 ease-in-out animated-gradient-bg ${
          isDropdown
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        {menuIcon}
        {searchButton}
        {shopCart}
      </div>
    );
  }, [isDropdown, menuIcon, searchButton, shopCart]);

  const scrollShopNav = useMemo(() => {
    return (
      <div
        className={`fixed z-10 flex items-center justify-between w-full h-[38px] px-10 py-3 top-[42px] left-0 right-0 transition-all duration-500 ease-out animated-gradient-bg ${
          showScrollNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        {menuIcon}
        {searchButton}
        {shopCart}
      </div>
    );
  }, [showScrollNav, menuIcon, searchButton, shopCart]);
  return (
    <>
      {normalShopNav}
      {scrollShopNav}
      {menuData}
      {/* Render search overlay at root level to avoid z-index issues */}

      <ShopSearch
        className="fixed top-0 left-0 right-0 overflow-y-hidden h-[80dvh] w-full z-[9999] transition-all duration-300 ease-out"
        searchRefInner={searchRefInner}
        searchRefOuter={searchRefOuter}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
    </>
  );
};

export default ShopNav;
