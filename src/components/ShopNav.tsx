"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { SHOP_DATA } from "@/constants";
import { Menu, X, ShoppingCart } from "lucide-react";
import ShopSearch from "./ShopSearch";
import Filters from "./Filters";
import { useShopFilters } from "@/contexts/ShopContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useProduct } from "@/contexts/ProductContext";
import Link from "next/link";

const ShopNav = () => {
  // Refs
  const menuRefInner = useRef<HTMLDivElement>(null);
  const normalMenuRef = useRef<HTMLButtonElement>(null);
  const scrollMenuRef = useRef<HTMLButtonElement>(null);
  const searchRefInner = useRef<HTMLDivElement>(null);
  const searchRefOuter = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const NAVBAR_HEIGHT = 42;

  // State
  const [openMenu, setOpenMenu] = useState(false);
  const [shouldMenuRender, setShouldMenuRender] = useState(false);
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "filters">("pages");
  const [openSearch, setOpenSearch] = useState(false);

  const { selectedCategory, toggleOptionSelected } = useShopFilters();

  const { cartItems } = useProduct();

  // Handle category click
  const handleCategoryClick = useCallback(
    (categoryValue: string) => {
      toggleOptionSelected("category", categoryValue);
    },
    [toggleOptionSelected]
  );

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

  // Scroll listener to show floating shop nav on scroll down and hide on scroll up
  useEffect(() => {
    const updateShopNav = () => {
      const currentScrollY = Math.max(0, window.scrollY || 0);
      const pastNavbar = currentScrollY > NAVBAR_HEIGHT;
      const goingDown = currentScrollY > lastScrollY.current;

      if (pastNavbar) {
        setShowScrollNav(goingDown);
      } else {
        setShowScrollNav(false);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateShopNav);
        ticking.current = true;
      }
    };

    lastScrollY.current = Math.max(0, window.scrollY || 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Menu click handlers
  const handleMenuClick = useCallback(() => {
    setOpenMenu(true);
    setShouldMenuRender(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
    setShouldMenuRender(false);
  }, []);

  // Click outside effect for menu - only for closing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu &&
        menuRefInner.current &&
        !menuRefInner.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
        setShouldMenuRender(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  // Menu data component
  const menuData = useMemo(() => {
    return (
      <div
        ref={menuRefInner}
        className={`fixed flex top-0 left-0 right-0 h-dvh w-[80%] bg-linear-to-br from-secondary-800 via-primary-900 to-secondary-800 transition-all duration-300 ease-in-out overflow-y-hidden z-[999] ${
          openMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        }`}
      >
        {/* Backdrop */}
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
            <div className="hidden md:flex flex-col gap-2 overflow-x-auto w-full px-4">
              {SHOP_DATA.shopNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleCategoryClick(link.value)}
                  className={`shop-nav-link whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === link.value
                      ? "bg-slate-900/90 text-primary-100 border border-primary-500/60 shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_12px_30px_rgba(0,212,255,0.18)]"
                      : "bg-slate-800/70 text-slate-100 border border-slate-600/60 hover:border-primary-500/50 hover:bg-slate-800/90"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile: Show based on active tab */}
            <div className="flex md:hidden flex-col w-full items-center z-20 pb-15">
              {activeTab === "pages" ? (
                <div className="md:hidden flex flex-col gap-2 overflow-x-auto w-full px-4">
                  {SHOP_DATA.shopNavLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleCategoryClick(link.value)}
                      className={`shop-nav-link whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                        selectedCategory === link.value
                          ? "bg-slate-900/90 text-primary-100 border border-primary-500/60 shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_12px_30px_rgba(0,212,255,0.18)]"
                          : "bg-slate-800/70 text-slate-100 border border-slate-600/60 hover:border-primary-500/50 hover:bg-slate-800/90"
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ) : (
                <Filters />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    openMenu,
    activeTab,
    selectedCategory,
    handleCategoryClick,
    handleCloseMenu,
  ]);

  // Menu icon component - separate for normal and scroll
  const NormalMenuIcon = useMemo(
    () => (
      <button
        ref={normalMenuRef}
        onClick={handleMenuClick}
        className="p-2 rounded-full text-primary-50 transition-all duration-300 ease-in-out hover:bg-slate-700/60 hover:scale-105"
      >
        <Menu className="w-5 h-5" />
      </button>
    ),
    [handleMenuClick]
  );

  const ScrollMenuIcon = useMemo(
    () => (
      <button
        ref={scrollMenuRef}
        onClick={handleMenuClick}
        className="p-2 rounded-full text-primary-50 transition-all duration-300 ease-in-out hover:bg-slate-700/60 hover:scale-105"
      >
        <Menu className="w-5 h-5" />
      </button>
    ),
    [handleMenuClick]
  );

  // Search button
  const searchButton = useMemo(() => {
    return (
      <div className="flex items-center" ref={searchRefOuter}>
        <button
          onClick={() => setOpenSearch(!openSearch)}
          className="flex w-full max-w-lg items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-slate-900/80 border border-primary-500/40 text-primary-50 shadow-[0_10px_30px_rgba(0,212,255,0.18)] hover:shadow-[0_14px_40px_rgba(0,212,255,0.26)] transition-all duration-300 ease-in-out hover:scale-[1.02]"
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

  // Shopping cart
  const shopCart = useMemo(() => {
    return (
      <Link
        href="/cart"
        className="relative p-2 rounded-full text-primary-50 overflow-visible transition-all duration-300 ease-in-out hover:bg-slate-700/60 hover:scale-105"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-10">
          {cartItems.length}
        </span>
      </Link>
    );
  }, [cartItems]);

  // Normal shop nav (scrolls with page)
  const normalShopNav = useMemo(() => {
    return (
      <div className="flex items-center justify-between w-full h-[40px] px-10 py-3 transition-all z-1 duration-300 ease-in-out animated-gradient-bg">
        <div className="flex items-center cursor-pointer">{NormalMenuIcon}</div>
        {searchButton}
        {shopCart}
      </div>
    );
  }, [NormalMenuIcon, searchButton, shopCart]);

  // Scroll shop nav
  const scrollShopNav = useMemo(() => {
    return (
      <div
        className={`fixed z-10 flex items-center justify-between w-full h-[40px] px-10 py-3 top-[42px] left-0 right-0 transition-all duration-500 ease-out animated-gradient-bg ${
          showScrollNav
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex items-center cursor-pointer">{ScrollMenuIcon}</div>
        {searchButton}
        {shopCart}
      </div>
    );
  }, [showScrollNav, ScrollMenuIcon, searchButton, shopCart]);

  return (
    <>
      {normalShopNav}
      {scrollShopNav}
      {menuData}

      {/* Search overlay */}
      <ShopSearch
        className="fixed top-0 left-0 right-0 overflow-y-hidden h-[80dvh] w-full z-9999 transition-all duration-300 ease-out"
        searchRefInner={searchRefInner}
        searchRefOuter={searchRefOuter}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
      />
    </>
  );
};

export default ShopNav;
