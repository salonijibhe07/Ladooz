"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StoreHeader from "./components/store/StoreHeader";
import StoreFooter from "./components/store/StoreFooter";

/* ---------------- TYPES ---------------- */
type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Banner = {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
};

/* ---------------- PAGE ---------------- */
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes, bRes] = await Promise.all([
          fetch("/api/products?limit=9"),
          fetch("/api/categories"),
          fetch("/api/banners"),
        ]);

        const p = await pRes.json();
        const c = await cRes.json();
        const b = await bRes.json();

        setProducts(p.products || []);
        setCategories(c.categories || []);
        setBanners(b.banners || []);
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };
    load();
  }, []);

  const hero = useMemo(() => banners[0], [banners]);

  return (
    
    <div className="min-h-screen bg-[#FBF8F3] text-[#6B563A]">
      <StoreHeader categories={categories} initialSearch="" />
      {/* ================= HERO ================= */}
 {/* ================= HERO (Centered Text on Image) ================= */}
<section className="relative py-24">
  <div className="absolute inset-0 bg-[url('/patterns/indian-swirls.svg')] opacity-[0.04]" />

  <div className="container-max relative flex justify-center">
    <div
      className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl min-h-[420px] flex items-center justify-center text-center max-w-[1700px]"
      style={{
        backgroundImage: "url('/images/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ===== TEXT CONTENT ===== */}
      <div className="relative z-10 px-6 md:px-12 max-w-2xl text-white">
        <span className="inline-block bg-[#E6D3A3] text-[#4A3A28] px-4 py-1 rounded-full text-sm font-medium mb-4">
          Handmade • Pure • Premium
        </span>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          Welcome to LADOOZI
        </h1>

        <p className="text-lg mb-6">
          Where every ladoo tells a story of love, purity, and tradition —
          handcrafted with care using desi ghee and natural ingredients.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/products"
            className="bg-[#C8A24D] hover:bg-[#B8963D] text-white px-8 py-3 rounded-full font-semibold transition"
          >
            Shop Now
          </Link>
          <Link
            href="#benefits"
            className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10"
          >
            Know Benefits
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
{/* ================= ABOUT US ================= */}
<section className="bg-[#FBF8F3] py-24">
  <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* ===== TEXT CONTENT ===== */}
    <div>
      <span className="inline-block bg-[#E6D3A3] text-[#4A3A28] px-4 py-1 rounded-full text-sm font-medium mb-4">
        Our Story
      </span>

      <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3A28] mb-6">
        Where Homemade Goodness Meets Healthy Living
      </h2>

      <p className="text-lg mb-5 leading-relaxed">
        Ladoozi began with a simple lunchbox and a heartfelt passion for homemade
        goodness. Before becoming a full-time entrepreneur, our founder — a
        dedicated homemaker who also worked a corporate job — carried her lovingly
        prepared sweets in her daily tiffin.
      </p>

      <p className="text-lg mb-5 leading-relaxed">
        What started as a small gesture soon became a highlight for her colleagues.
        They eagerly waited for her ladoos, often requesting extra portions and
        asking if she could make them for their families.
      </p>

      <p className="text-lg mb-5 leading-relaxed">
        Encouraged by this love, she realized these ladoos were more than sweets —
        they were moments of comfort, nourishment, and tradition. With faith and
        purpose, she turned her passion into a homegrown brand.
      </p>

      <p className="text-lg leading-relaxed font-medium text-[#4A3A28]">
        This is how <span className="font-semibold">LADOOZI</span> was born — delivering
        fresh, wholesome, handcrafted ladoos made with care, purity, and the warmth
        of a mother’s kitchen.
      </p>
    </div>

    {/* ===== VISUAL / VALUES CARD ===== */}
    <div className="bg-white rounded-3xl shadow-lg p-10 relative">
      <h3 className="text-2xl font-serif font-bold text-[#4A3A28] mb-6 text-center">
        What LADOOZI Stands For
      </h3>

      <ul className="space-y-4 text-lg">
        <li className="flex gap-3 items-start">
          <span className="text-[#C8A24D]">✨</span>
          <span>Authentic homemade taste</span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="text-[#C8A24D]">✨</span>
          <span>Premium, carefully sourced ingredients</span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="text-[#C8A24D]">✨</span>
          <span>Health-focused traditional recipes</span>
        </li>
        <li className="flex gap-3 items-start">
          <span className="text-[#C8A24D]">✨</span>
          <span>Products made with love, honesty & tradition</span>
        </li>
      </ul>

      <div className="mt-8 p-6 bg-[#F7F2EA] rounded-2xl text-center text-[#4A3A28]">
        <p className="font-medium">
          From one lunchbox to many happy homes,
          <br />
          our journey continues — sweet, simple, and inspired by you.
        </p>
      </div>
    </div>

  </div>
</section>




      {/* ================= CATEGORIES ================= */}
      <section className="container-max py-16">
        <h2 className="text-2xl font-serif font-bold text-[#4A3A28] mb-10 text-center">
          Explore Our Range
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <p className="font-semibold text-[#4A3A28] text-lg">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="container-max py-16">
        <h2 className="text-2xl font-serif font-bold text-[#4A3A28] mb-10 text-center">
          Signature Ladoos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
            >
              <div className="relative aspect-square bg-[#F7F2EA]">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-[#4A3A28] text-lg mb-2">{product.name}</h3>
                <p className="font-medium mb-5">₹{product.price} / kg</p>
                <button className="w-full bg-[#C8A24D] hover:bg-[#B8963D] text-white py-2 rounded-full font-medium transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="benefits" className="bg-[#F7F2EA] py-20">
        <div className="container-max">
          <h2 className="text-2xl font-serif font-bold text-[#4A3A28] mb-12 text-center">
            Health & Tradition in Every Bite
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["✨ Dink Ladoo", "Strength, stamina & winter immunity"],
              ["✨ Besan Ladoo", "Energy, digestion & healthy fats"],
              ["✨ Ravanaral Ladoo", "Light, aromatic & easy to digest"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <h3 className="font-semibold text-[#4A3A28] text-lg mb-2">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        
      </section>
      <StoreFooter/>
    </div>
  );
}
