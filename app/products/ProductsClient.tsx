"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import StoreHeader from "@/app/components/store/StoreHeader";
import StoreFooter from "@/app/components/store/StoreFooter";

type Product = {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  ratings: number;
  reviewCount: number;
  stock: number;
  category?: { name: string; slug: string };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("limit", "48");
    return `/api/products?${params.toString()}`;
  }, [category, search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, cRes, wRes] = await Promise.all([
          fetch(apiUrl), 
          fetch("/api/categories"),
          fetch("/api/wishlist")
        ]);
        const p = await pRes.json().catch(() => ({}));
        const c = await cRes.json().catch(() => ({}));
        const w = await wRes.json().catch(() => ({ items: [] }));
        setProducts(p.products || []);
        setCategories(c.categories || []);
        setWishlist(new Set((w.items || []).map((item: any) => item.productId)));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiUrl]);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isInWishlist = wishlist.has(productId);
    
    // Optimistic update
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (isInWishlist) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
    
    try {
      if (isInWishlist) {
        await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
    } catch (error) {
      // Revert on error
      setWishlist(prev => {
        const newSet = new Set(prev);
        if (isInWishlist) {
          newSet.add(productId);
        } else {
          newSet.delete(productId);
        }
        return newSet;
      });
      console.error("Failed to update wishlist:", error);
    }
  };

  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        initialSearch={search}
      />

      <div className="container-max py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {search ? `Search: ${search}` : category ? `Category: ${category}` : "All Products"}
          </h1>
          {(category || search) && (
            <Link href="/products" className="text-primary-500 hover:underline">
              Clear filters
            </Link>
          )}
        </div>

        {/* Show menu card when "All" is selected (no category or search) */}
        {!category && !search && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-4xl">
              <img
                src="/menu.png"
                alt="Ladoos Menu Card"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Hide image if not found
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-700">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-700">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card card-hover p-4 group bg-white rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  )}
                  <button
                    onClick={(e) => toggleWishlist(e, product.id)}
                    className="wishlist-heart-btn"
                    aria-label="Add to wishlist"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      padding: '5px',
                      margin: '0',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      borderRadius: '50%',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '30px',
                    }}
                  >
                    <Heart
                      size={16}
                      className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-700"}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-500">
                  {product.name}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                  <span className="text-primary-500 font-semibold">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <>
                      <span className="text-slate-400 line-through text-sm">
                        ₹{product.comparePrice.toLocaleString()}
                      </span>
                      <span className="text-primary-500 text-sm font-medium">
                        {calculateDiscount(product.price, product.comparePrice)}% off
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 text-xs">
                  <div className="bg-primary-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <span>{product.ratings}</span>
                    <span>★</span>
                  </div>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Qty: {product.stock}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
}
