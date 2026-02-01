"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { FaHome, FaShieldAlt, FaGift, FaTruck } from "react-icons/fa";
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

        {/* Show Festive Gifting section for corporate-packs-and-festive-gifting category */}
        {category === "corporate-packs-and-festive-gifting" && (
          <div className="mb-12 mt-8">
            {/* Hero Section */}
            <div className="text-center max-w-5xl mx-auto mb-16">
              <span className="inline-block mb-4 px-5 py-1 rounded-full bg-[#E6D3A3] text-[#4A3A28] text-sm font-medium tracking-wide">
                FESTIVE GIFTING BY LADOOZI
              </span>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3A28] mb-6">
                When Festivals Feel Like Home
              </h2>

              <p className="text-lg leading-relaxed text-[#6B5A46]">
                In India, festivals are not just dates on a calendar — they are emotions.
                LADOOZI brings you thoughtfully handcrafted laddoos made the traditional
                way, turning every celebration into a memory worth sharing.
              </p>
            </div>

            {/* Festival Cards */}
            <div className="grid md:grid-cols-3 gap-10 mb-20">
              {/* Diwali */}
              <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
                  DIWALI
                </div>

                <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
                  A Box Full of Light & Warmth
                </h3>

                <p className="mb-5 text-[#6B5A46]">
                  Light up Diwali with laddoos made using pure ingredients, elegant
                  festive packaging, and the richness of tradition — perfect for homes,
                  teams, and corporate celebrations.
                </p>

                <ul className="space-y-2 text-sm text-[#6B5A46]">
                  <li>• Freshly handcrafted laddoos</li>
                  <li>• Premium festive packaging</li>
                  <li>• Ideal for personal & corporate gifting</li>
                  <li>• Delivery across India</li>
                </ul>
              </div>

              {/* Raksha Bandhan */}
              <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
                  RAKSHA BANDHAN
                </div>

                <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
                  Sweetness That Travels Distance
                </h3>

                <p className="mb-5 text-[#6B5A46]">
                  Celebrate the bond of love with laddoos that speak from the heart.
                  LADOOZI Raksha Bandhan gift boxes are designed to make siblings feel
                  close, even miles apart.
                </p>

                <ul className="space-y-2 text-sm text-[#6B5A46]">
                  <li>• Brother–sister gifting</li>
                  <li>• Family celebrations</li>
                  <li>• Long-distance surprises</li>
                </ul>
              </div>

              {/* Ganesh Festival */}
              <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
                  GANESH FESTIVAL
                </div>

                <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
                  Sweet Beginnings with Devotion
                </h3>

                <p className="mb-5 text-[#6B5A46]">
                  Welcome Lord Ganesha with laddoos prepared with devotion, following
                  time-honored recipes that reflect purity, authenticity, and faith.
                </p>

                <ul className="space-y-2 text-sm text-[#6B5A46]">
                  <li>• Ganesh Chaturthi offerings</li>
                  <li>• Home & society celebrations</li>
                  <li>• Community gifting</li>
                </ul>
              </div>
            </div>

            {/* Health-Focused Section */}
            <div className="relative bg-white rounded-[3rem] p-12 shadow-lg max-w-6xl mx-auto mb-20 text-center">
              <span className="inline-block mb-4 px-5 py-1 rounded-full bg-[#E6D3A3] text-[#4A3A28] text-sm font-medium">
                HEALTH-FOCUSED FESTIVE GIFTING
              </span>

              <h3 className="font-serif font-bold text-3xl text-[#4A3A28] mb-5">
                Because Celebration Should Feel Good Too
              </h3>

              <p className="mb-8 max-w-4xl mx-auto text-[#6B5A46]">
                LADOOZI offers festive gifting options made without refined sugar,
                naturally sweetened with dates and jaggery — so every age group can
                celebrate without compromise.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium text-[#6B5A46]">
                <div>✔ No refined sugar</div>
                <div>✔ Sweetened naturally with dates & jaggery</div>
                <div>✔ Made with premium dry fruits & wholesome ingredients</div>
                <div>✔ Suitable for kids, elders, and health-conscious individuals</div>
              </div>
            </div>

            {/* Why Trust LADOOZI */}
            <div className="bg-[#FFF8F1] rounded-[2rem] py-12 px-6 mb-20">
              <div className="max-w-6xl mx-auto text-center">
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-[#4A3A28] mb-3">
                  Why Families & Corporates Trust LADOOZI
                </h3>

                <p className="text-[#6B5A46] mb-10">
                  Crafted with purity, delivered with care
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaHome size={32} /></div>
                    <h4 className="font-semibold text-[#4A3A28] mb-2">
                      100% Homemade
                    </h4>
                    <p className="text-sm text-[#6B5A46]">
                      Freshly handcrafted using traditional family recipes
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaShieldAlt size={32} /></div>
                    <h4 className="font-semibold text-[#4A3A28] mb-2">
                      Hygienic Preparation
                    </h4>
                    <p className="text-sm text-[#6B5A46]">
                      Prepared in small batches with strict hygiene standards
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaGift size={32} /></div>
                    <h4 className="font-semibold text-[#4A3A28] mb-2">
                      Custom Festive Boxes
                    </h4>
                    <p className="text-sm text-[#6B5A46]">
                      Thoughtfully curated gifting for festivals & occasions
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaTruck size={32} /></div>
                    <h4 className="font-semibold text-[#4A3A28] mb-2">
                      Nationwide Delivery
                    </h4>
                    <p className="text-sm text-[#6B5A46]">
                      Multi-address delivery across India with care
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Benefits */}
            <div className="relative bg-[#F7F2EA] rounded-[2rem] py-12 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span className="inline-block mb-3 px-4 py-1 rounded-full bg-[#E6D3A3] text-[#4A3A28] text-xs font-medium tracking-wide">
                    OUR BENEFITS
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3A28]">
                    Health & Tradition in Every Bite
                  </h2>
                  <div className="mx-auto mt-4 h-1 w-24 bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4] rounded-full" />
                  <p className="mt-5 text-sm md:text-base text-[#6B5A46]">
                    Crafted using time-honoured methods, premium ingredients and pure desi ghee.
                  </p>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                  <div className="group relative rounded-3xl bg-white/90 backdrop-blur p-8 border border-[#E6DCCB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4]" />
                    <h3 className="text-lg font-semibold text-[#4A3A28] mb-2 text-center mt-2">Dink Ladoo</h3>
                    <p className="text-sm text-[#6B5A46] text-center leading-relaxed">
                      Strength, stamina & seasonal immunity with edible gum (dink).
                    </p>
                  </div>

                  <div className="group relative rounded-3xl bg-white/90 backdrop-blur p-8 border border-[#E6DCCB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4]" />
                    <h3 className="text-lg font-semibold text-[#4A3A28] mb-2 text-center mt-2">Besan Ladoo</h3>
                    <p className="text-sm text-[#6B5A46] text-center leading-relaxed">
                      Balanced energy, better digestion and healthy fats for everyday nourishment.
                    </p>
                  </div>

                  <div className="group relative rounded-3xl bg-white/90 backdrop-blur p-8 border border-[#E6DCCB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4]" />
                    <h3 className="text-lg font-semibold text-[#4A3A28] mb-2 text-center mt-2">Ravanaral Ladoo</h3>
                    <p className="text-sm text-[#6B5A46] text-center leading-relaxed">
                      Light, aromatic and easy to digest – a gentle treat for any time of day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-700">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            {category === "corporate-packs-and-festive-gifting" ? (
              <div className="max-w-2xl mx-auto bg-[#FFF8F1] rounded-2xl p-8 border border-[#E6DCCB]">
                <p className="text-lg text-[#4A3A28] font-medium">
                  Explore all products on the <span className="font-bold">home page</span> — <span className="font-bold">discounts will be applied</span> and confirmed at the time of order confirmation.
                </p>
              </div>
            ) : (
              <p className="text-slate-700">No products found.</p>
            )}
          </div>
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
