"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingCart, User, LogOut } from "lucide-react";

export type StoreHeaderCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function StoreHeader({
  categories,
  initialSearch,
}: {
  categories: StoreHeaderCategory[];
  initialSearch?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch ?? "");
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const name = data?.user?.name || null;
        if (active) setUserName(name);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const searchHref = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return "/products";
    const params = new URLSearchParams({ search: q });
    return `/products?${params.toString()}`;
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50">
      {/* ================= BRAND TAGLINES TOP STRIP ================= */}
      <div className="bg-[#4A3A28] text-[#F7F2EA]">
        <div className="container-max px-0">
          <div className="marquee py-2">
            <div className="marquee-track">
              {["Where Every Ladoo Tells a Story of Love & Purity","Sweetness Made with Sincerity","A Taste of Tradition in Every Bite","Handcrafted with Care, Delivered with Love","Where Every Ladoo Tells a Story of Love & Purity","Sweetness Made with Sincerity","A Taste of Tradition in Every Bite","Handcrafted with Care, Delivered with Love"].map((t) => (
                <span key={t+Math.random()} className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-medium border border-white/20 shadow-sm">
                  “{t}”
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOP BAR ================= */}
      <div className="bg-[#FBF8F3]/90 backdrop-blur border-b border-[#E6DCCB]">
        <div className="container-max py-3 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="font-serif font-bold tracking-wide text-xl"
          >
            <span className="text-[#C8A24D]">Ladoo</span>
            <span className="text-[#4A3A28]">zi</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ladoos, sweets & gift boxes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") window.location.assign(searchHref);
                }}
                className="w-full h-11 rounded-full bg-white border border-[#D6C6A8] px-5 pr-11 text-sm outline-none
                  focus:ring-2 focus:ring-[#C8A24D]/30 focus:border-[#C8A24D]"
              />
              <Link
                href={searchHref}
                className="absolute right-4 top-2.5 text-[#6B563A] hover:text-[#C8A24D]"
                aria-label="Search"
              >
                <Search size={18} />
              </Link>
            </div>
          </div>

          {/* ACTIONS */}
          <nav className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Wishlist first */}
            <Link
              href="/wishlist"
              className="h-10 px-4 rounded-full inline-flex items-center gap-2 hover:bg-[#F3EBD9] text-sm font-medium"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Cart second */}
            <Link
              href="/cart"
              className="h-10 px-4 rounded-full inline-flex items-center gap-2 bg-[#C8A24D] hover:bg-[#B8963D] text-white text-sm font-medium"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Account/Profile last */}
            {userName ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-10 inline-flex items-center gap-2 text-sm font-medium text-[#4A3A28] hover:text-[#C8A24D]"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <User size={18} />
                  <span className="truncate max-w-[10rem]">{userName}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E6DCCB] rounded-md shadow-md py-2 z-50" role="menu" aria-label="Account menu">
                    <div className="px-4 py-2 text-sm text-[#6B563A] truncate" title={userName}>
                      {userName}
                    </div>
                    <div className="h-px bg-[#E6DCCB] my-1" />
                    <div className="w-full flex justify-center">
                    <button
                      onClick={async () => {
                        try {
                          await fetch("/api/auth/logout", { method: "POST" });
                        } finally {
                          setMenuOpen(false);
                          window.location.assign("/");
                        }
                      }}
                      className="px-3 py-1.5 text-xs hover:bg-[#F3EBD9] text-[#4A3A28] rounded inline-flex items-center gap-1.5"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="h-10 px-4 rounded-full inline-flex items-center gap-2 hover:bg-[#F3EBD9] text-sm font-medium"
              >
                <User size={18} />
                <span className="hidden sm:inline">Account</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* ================= CATEGORY STRIP ================= */}
      <div className="bg-white border-b border-[#E6DCCB]">
        <div className="container-max">
          <div className="flex items-center gap-6 py-3 overflow-x-auto text-sm">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="whitespace-nowrap font-medium text-[#6B563A] hover:text-[#C8A24D] transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
