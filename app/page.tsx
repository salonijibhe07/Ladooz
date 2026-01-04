"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import StoreHeader from "./components/store/StoreHeader";
import StoreFooter from "./components/store/StoreFooter";
import { FaHome, FaShieldAlt, FaGift, FaTruck } from "react-icons/fa";
import { Dumbbell, Wheat, Feather } from "lucide-react";
import ContactPage from "./contact/page";

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
  const catScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dx: number) => {
    const el = catScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [cartMsg, setCartMsg] = useState<Record<string, string | null>>({});

  // Benefits icons data (typed to avoid union-inferred tuple issues)
  const benefitItems: { title: string; desc: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { title: "Dink Ladoo", desc: "Strength, stamina & seasonal immunity with edible gum (dink).", Icon: Dumbbell },
    { title: "Besan Ladoo", desc: "Balanced energy, better digestion and healthy fats for everyday nourishment.", Icon: Wheat },
    { title: "Ravanaral Ladoo", desc: "Light, aromatic and easy to digest – a gentle treat for any time of day.", Icon: Feather },
  ];

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




      

      {/* ================= CATEGORIES ================= */}
      <section className="container-max py-16">
        <h2 className="text-2xl font-serif font-bold text-[#4A3A28] mb-6 text-center">
          Explore Our Range
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="bg-white rounded-2xl border border-[#E6DCCB] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4]" />
              <div className="p-5 text-center">
                <p className="font-semibold text-[#4A3A28] inline-block border-b border-transparent hover:border-[#C8A24D] transition truncate">
                  {category.name}
                </p>
              </div>
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
                <div className="flex justify-center">
                  <button
                    className="px-4 py-2 text-sm bg-[#C8A24D] hover:bg-[#B8963D] text-white rounded-full font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!!adding[product.id]}
                    onClick={() => {
                      window.location.assign(`/products/${product.id}`);
                    }}
                  >
                    {adding[product.id] ? "Buying..." : "Buy Now"}
                  </button>
                  {cartMsg[product.id] && (
                    <div className="text-xs mt-2 text-[#4A3A28]" role="status">{cartMsg[product.id]}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

          {/* ================= FESTIVE GIFTING ================= */}
{/* ================= FESTIVE GIFTING – PREMIUM EXPERIENCE ================= */}
<section className="relative py-28 bg-gradient-to-b from-[#FBF8F3] via-[#F7F2EA] to-[#FBF8F3] overflow-hidden">
  
  {/* soft festive background */}
  <div className="absolute inset-0 bg-[url('/patterns/indian-swirls.svg')] opacity-[0.05]" />

  <div className="container-max relative">
    
    {/* HERO STORY */}
    <div className="text-center max-w-5xl mx-auto mb-20">
      <span className="inline-block mb-4 px-5 py-1 rounded-full bg-[#E6D3A3] text-[#4A3A28] text-sm font-medium tracking-wide">
        FESTIVE GIFTING BY LADOOZI
      </span>

      <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3A28] mb-6">
        When Festivals Feel Like Home
      </h2>

      <p className="text-lg leading-relaxed">
        In India, festivals are not just dates on a calendar — they are emotions.
        LADOOZI brings you thoughtfully handcrafted laddoos made the traditional
        way, turning every celebration into a memory worth sharing.
      </p>
    </div>

    {/* FESTIVAL JOURNEY */}
    <div className="grid md:grid-cols-3 gap-10 mb-24">
      
      {/* DIWALI */}
      <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
          DIWALI
        </div>

        <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
          A Box Full of Light & Warmth
        </h3>

        <p className="mb-5">
          Light up Diwali with laddoos made using pure ingredients, elegant
          festive packaging, and the richness of tradition — perfect for homes,
          teams, and corporate celebrations.
        </p>

        <ul className="space-y-2 text-sm">
          <li>• Freshly handcrafted laddoos</li>
          <li>• Premium festive packaging</li>
          <li>• Ideal for personal & corporate gifting</li>
          <li>• Delivery across India</li>
        </ul>
      </div>

      {/* RAKSHA BANDHAN */}
      <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
          RAKSHA BANDHAN
        </div>

        <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
          Sweetness That Travels Distance
        </h3>

        <p className="mb-5">
          Celebrate the bond of love with laddoos that speak from the heart.
          LADOOZI Raksha Bandhan gift boxes are designed to make siblings feel
          close, even miles apart.
        </p>

        <ul className="space-y-2 text-sm">
          <li>• Brother–sister gifting</li>
          <li>• Family celebrations</li>
          <li>• Long-distance surprises</li>
        </ul>
      </div>

      {/* GANESH */}
      <div className="relative bg-white rounded-[2.5rem] p-9 shadow-md hover:shadow-xl transition">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#C8A24D] text-white inline-flex items-center justify-center h-9 md:h-10 px-7 rounded-full text-sm md:text-base shadow-md whitespace-nowrap leading-none">
          GANESH FESTIVAL
        </div>

        <h3 className="font-serif font-bold text-xl md:text-2xl text-[#4A3A28] mb-4 mt-3">
          Sweet Beginnings with Devotion
        </h3>

        <p className="mb-5">
          Welcome Lord Ganesha with laddoos prepared with devotion, following
          time-honored recipes that reflect purity, authenticity, and faith.
        </p>

        <ul className="space-y-2 text-sm">
          <li>• Ganesh Chaturthi offerings</li>
          <li>• Home & society celebrations</li>
          <li>• Community gifting</li>
        </ul>
      </div>
    </div>

    {/* HEALTH PROMISE */}
    <div className="relative bg-white rounded-[3rem] p-12 shadow-lg max-w-6xl mx-auto mb-24 text-center">
      <span className="inline-block mb-4 px-5 py-1 rounded-full bg-[#E6D3A3] text-[#4A3A28] text-sm font-medium">
        HEALTH-FOCUSED FESTIVE GIFTING
      </span>

      <h3 className="font-serif font-bold text-3xl text-[#4A3A28] mb-5">
        Because Celebration Should Feel Good Too
      </h3>

      <p className="mb-8 max-w-4xl mx-auto">
        LADOOZI offers festive gifting options made without refined sugar,
        naturally sweetened with dates and jaggery — so every age group can
        celebrate without compromise.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium">
        <div>✔ No refined sugar</div>
        <div>✔ Dates & jaggery sweetened</div>
        <div>✔ Premium dry fruits</div>
        <div>✔ Safe for all age groups</div>
      </div>
    </div>

    

  </div>
</section>


{/* TRUST STRIP */}
<section className="bg-[#FFF8F1] py-12">
  <div className="max-w-6xl mx-auto px-4 text-center">
    
    <h3 className="font-serif font-bold text-2xl md:text-3xl text-[#4A3A28] mb-3">
      Why Families & Corporates Trust LADOOZI
    </h3>

    <p className="text-[#6B5A46] mb-10">
      Crafted with purity, delivered with care
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

      {/* Card 1 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
        <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaHome size={32} /></div>
        <h4 className="font-semibold text-[#4A3A28] mb-2">
          100% Homemade
        </h4>
        <p className="text-sm text-[#6B5A46]">
          Freshly handcrafted using traditional family recipes
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
        <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaShieldAlt size={32} /></div>
        <h4 className="font-semibold text-[#4A3A28] mb-2">
          Hygienic Preparation
        </h4>
        <p className="text-sm text-[#6B5A46]">
          Prepared in small batches with strict hygiene standards
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
        <div className="text-[#8B5E34] mx-auto mb-4 w-fit"><FaGift size={32} /></div>
        <h4 className="font-semibold text-[#4A3A28] mb-2">
          Custom Festive Boxes
        </h4>
        <p className="text-sm text-[#6B5A46]">
          Thoughtfully curated gifting for festivals & occasions
        </p>
      </div>

      {/* Card 4 */}
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
</section>






      {/* ================= BENEFITS ================= */}
      <section id="benefits" className="relative py-24 bg-[#F7F2EA]">
        {/* subtle texture */}
        <div className="absolute inset-0 bg-[url('/patterns/indian-swirls.svg')] opacity-[0.04]" />

        <div className="container-max relative">
          {/* Heading */}
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

          {/* Cards */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {benefitItems.map(({ title, desc, Icon }) => (
              <div
                key={title as string}
                className="group relative rounded-3xl bg-white/90 backdrop-blur p-8 border border-[#E6DCCB] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                {/* accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-[#EBDCB4] via-[#C8A24D] to-[#EBDCB4]" />

                {/* icon bubble */}
                <div className="mx-auto -mt-6 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FBF8F3] border border-[#E6DCCB] shadow-sm">
                  <Icon className="text-[#C8A24D]" size={20} />
                </div>

                <h3 className="text-lg font-semibold text-[#4A3A28] mb-2 text-center">{title}</h3>
                <p className="text-sm text-[#6B5A46] text-center leading-relaxed" aria-label={`${title} benefit description`}>
                  {desc}
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORPORATE GIFTING ================= */}
<section className="container-max py-20">
  <div className="bg-white rounded-3xl shadow-md p-8 md:p-12">
    <h2 className="text-3xl font-serif font-bold text-[#4A3A28] mb-4 text-center">
      Corporate Gifting Solutions
    </h2>

    <p className="text-center max-w-3xl mx-auto mb-8">
      Make every gesture memorable. Whether gifting employees, clients, partners,
      or extended teams, LADOOZI delivers exquisite handcrafted laddoos with
      hassle-free multi-address shipping.
    </p>

    <div className="grid md:grid-cols-2 gap-10 items-start">
      {/* CONTACT INFO */}
      <div>
        <div className="rounded-2xl border border-[#E6DCCB] bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-[#4A3A28] mb-4">Contact for more details</h3>
          <div className="space-y-4">
            {/* Email block */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-[#E6DCCB] bg-[#FBF8F3]">
              <div className="mt-0.5 text-[#C8A24D]" aria-hidden>
                {/* Mail icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m22 8-10 6L2 8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#6B5A46]">Email</p>
                <div className="font-medium text-[#4A3A28] leading-relaxed">
                  <p className="break-all">ladoozi@gmail.com</p>
                  <p className="break-all">Info@ladoozi.com</p>
                </div>
              </div>
            </div>
            {/* WhatsApp block */}
            <div className="flex items-start gap-3 p-3 rounded-xl border border-[#E6DCCB] bg-[#FBF8F3]">
              <div className="mt-0.5 text-[#25D366]" aria-hidden>
                {/* WhatsApp icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 11.5c0 4.694-3.806 8.5-8.5 8.5a8.45 8.45 0 0 1-4.02-1.017L4 21l1.017-3.48A8.45 8.45 0 0 1 3.5 11.5C3.5 6.806 7.306 3 12 3s8 3.806 8 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9.5 8.5c0 3 3 6 5.5 6 .3 0 .6-.05.9-.15.2-.07.5.08.6.28.14.28.5 1.02.5 1.12 0 .2-.4.7-1 1-1 .5-2 .5-3 .3-3.2-.6-6.3-3.7-6.9-6.9-.2-1 0-2 .3-3 .3-.6.8-1 1-1 .1 0 .9.36 1.17.51.2.1.35.4.28.6-.1.3-.15.6-.15.9Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#6B5A46]">WhatsApp</p>
                <p className="font-medium text-[#4A3A28] leading-relaxed">9881902097</p>
              </div>
            </div>
            {/* CTA buttons */}
            <div className="flex gap-3 pt-1">
              <a
                href={`https://wa.me/919881902097?text=${encodeURIComponent('Hello! I would like to inquire about Corporate Gifting with LADOOZI.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#25D366] text-[#0b3b22] bg-[#e9f9ef] hover:bg-[#d6f3e1] transition"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:info@ladoozi.com?subject=${encodeURIComponent('Corporate Gifting Inquiry')}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[#E6DCCB] text-[#4A3A28] bg-white hover:bg-[#FBF8F3] transition"
              >
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E6DCCB] bg-white p-4 md:p-6 shadow-sm">
        <ContactPage />
      </div>
    </div>
  </div>
</section>


      <StoreFooter/>
    </div>
  );
}
