"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
        const [pRes, cRes] = await Promise.all([fetch(apiUrl), fetch("/api/categories")]);
        const p = await pRes.json().catch(() => ({}));
        const c = await cRes.json().catch(() => ({}));
        setProducts(p.products || []);
        setCategories(c.categories || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiUrl]);

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
                className="card card-hover p-4 group bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  )}
                </div>

                <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-500">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
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

                <div className="flex items-center gap-1 text-xs">
                  <div className="bg-primary-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <span>{product.ratings}</span>
                    <span>★</span>
                  </div>
                  <span className="text-slate-700">({product.reviewCount})</span>
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
