"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Search, ShoppingCart, User } from "lucide-react";

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

  const searchHref = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return "/products";
    const params = new URLSearchParams({ search: q });
    return `/products?${params.toString()}`;
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50">
      {/* ================= TOP BAR ================= */}
      <div className="bg-[#FBF8F3]/90 backdrop-blur border-b border-[#E6DCCB]">
        <div className="container-max py-3 flex items-center gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="font-serif font-bold tracking-wide text-xl"
          >
            <span className="text-[#C8A24D]">Ladoo</span>
            <span className="text-[#4A3A28]">zi</span>
          </Link>

          {/* SEARCH */}
          <div className="flex-1 max-w-xl">
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
          <nav className="flex items-center gap-1">
            <Link
              href="/login"
              className="h-10 px-4 rounded-full inline-flex items-center gap-2 hover:bg-[#F3EBD9] text-sm font-medium"
            >
              <User size={18} />
              <span className="hidden sm:inline">Account</span>
            </Link>

            <Link
              href="/wishlist"
              className="h-10 px-4 rounded-full inline-flex items-center gap-2 hover:bg-[#F3EBD9] text-sm font-medium"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            <Link
              href="/cart"
              className="h-10 px-4 rounded-full inline-flex items-center gap-2 bg-[#C8A24D] hover:bg-[#B8963D] text-white text-sm font-medium"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
            </Link>
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
