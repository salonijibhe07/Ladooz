'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, Phone, Mail, MapPin, ChevronDown, Package, Award, Leaf, Users, Star, Shield, Clock, Gift } from 'lucide-react';
import StoreFooter from '../components/store/StoreFooter';
import StoreHeader, { type StoreHeaderCategory } from '../components/store/StoreHeader';
export default function LadooziPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [categories, setCategories] = useState<StoreHeaderCategory[]>([]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const cats = (data?.categories ?? []).map((c: any) => ({ id: String(c.id ?? c.slug ?? c.name), name: c.name, slug: c.slug }));
        if (active) setCategories(cats);
      } catch {
        // ignore fetch errors on static info page
      }
    })();
    return () => { active = false; };
  }, []);

  

  const features = [
    { icon: Heart, title: "100% Homemade", desc: "Crafted with love in small batches" },
    { icon: Sparkles, title: "Pure Desi Ghee", desc: "Only the finest ingredients" },
    { icon: Shield, title: "No Preservatives", desc: "Natural & fresh always" },
    { icon: Award, title: "Jaggery-based", desc: "Healthy traditional sweetness" }
  ];

  const healthBenefits = [
    { icon: Leaf, title: "Jaggery-based", desc: "No refined sugar" },
    { icon: Users, title: "Family Safe", desc: "For kids, elders & pregnant women" },
    { icon: Star, title: "Energy Boost", desc: "Natural strength & nourishment" },
    { icon: Shield, title: "Gluten-free Options", desc: "Some variants available" }
  ];

  const process = [
    { title: "Finest Ingredients Selected", desc: "Handpicked nuts, grains, millets, jaggery, and pure desi ghee", icon: "🌾" },
    { title: "Slow Roasting for Authentic Flavor", desc: "Ingredients are roasted on a gentle flame to release natural aroma", icon: "🔥" },
    { title: "Traditional Hand Mixing", desc: "Age-old techniques preserve texture, taste, and nutrition", icon: "👐" },
    { title: "Hand-Rolled with Precision", desc: "Every ladoo is individually hand-shaped", icon: "✨" },
    { title: "Fresh Batches Only", desc: "Small-batch preparation ensures freshness and hygiene", icon: "🎯" },
    { title: "Packed with Care", desc: "Packed to retain softness, aroma, and purity", icon: "📦" }
  ];

  const giftingOptions = [
    { icon: Gift, title: "Custom Packaging", desc: "Beautifully presented for any occasion" },
    { icon: Heart, title: "Personalized Cards", desc: "Add your special message" },
    { icon: Package, title: "Bulk Orders", desc: "Perfect for corporate & events" },
    { icon: Sparkles, title: "Festive Combos", desc: "Special celebration boxes" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <StoreHeader categories={categories} />
          

      {/* Hero Section */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6 leading-tight">
              Where Homemade Goodness<br />
              <span className="text-amber-800">Meets Healthy Living</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-amber-900 mb-4 font-medium italic">
              "Ladoo toh ghar ka hi chahiye."
            </p>
            
            <p className="text-lg text-amber-800 mb-10 max-w-2xl mx-auto">
              Handcrafted with pure desi ghee, jaggery, and tradition. From our home kitchen to your sweetest moments.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/919881902097"
                className="bg-amber-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Phone size={20} />
                Order on WhatsApp
              </a>
              <a
                href="#story"
                className="bg-white text-amber-900 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all border-2 border-amber-600 hover:border-amber-700"
              >
                Read Our Story
              </a>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-amber-900">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-yellow-300">
                <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span className="font-medium">Zero Preservatives</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-yellow-300">
                <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span className="font-medium">Pure Desi Ghee</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-yellow-300">
                <div className="w-6 h-6 bg-amber-700 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <span className="font-medium">Small Batch Fresh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              What Makes Us Special
            </h2>
            <p className="text-amber-700 text-lg">Sweetness you can trust, crafted with care</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-gradient-to-b from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 transition-all hover:shadow-lg border border-yellow-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-4 shadow-md">
                  <feature.icon className="text-yellow-50" size={28} />
                </div>
                <h3 className="font-bold text-lg text-amber-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-amber-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-5xl mb-4 inline-block">✨</span>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              The Sweet Beginning of Ladoozi
            </h2>
            <div className="w-32 h-1 bg-yellow-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-amber-200">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-medium text-amber-900 italic">
                Every great journey begins with a small, meaningful moment...
              </p>
              
              <p>
                For years, our home was known for its ladoos — not just as sweets, but as <span className="font-semibold text-yellow-700">symbols of care, strength, and celebration</span>. Whether it was a festival, a long journey, a child's exam day, a mother's recovery, or a family gathering, one thing never changed:
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border-l-4 border-yellow-600 p-6 rounded-r-2xl my-8">
                <p className="text-2xl font-bold text-amber-900 italic">
                  "Ladoo toh ghar ka hi chahiye."
                </p>
              </div>
              
              <p>
                Family, friends, and neighbours who tasted our ladoos all said the same thing: <span className="font-semibold text-orange-700">"You should share this sweetness with the world!"</span>
              </p>
              
              <p>
                What began as a heartfelt compliment slowly grew into a dream — a dream to preserve traditional recipes passed down through generations, a dream to bring back pure, homemade, preservative-free ladoos made the right way — with patience, honesty, and love.
              </p>
              
              <p className="text-xl font-semibold text-amber-900">
                And so, Ladoozi was born.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-8">
                {[
                  "Every ladoo is slow-roasted on a gentle flame",
                  "Every ingredient is carefully selected",
                  "Every batch is made fresh in small quantities",
                  "Every sweet carries the warmth of home",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-xl font-medium text-amber-900 pt-6">
                From our home to yours — thank you for letting us be a part of your sweetest moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crafting Process */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Our Premium Crafting Process
            </h2>
            <p className="text-gray-600 text-lg">Made with love, precision, and tradition</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-amber-50 rounded-2xl p-8 border-2 border-amber-200 hover:border-yellow-500 transition-all hover:shadow-lg">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Health & Nutrition
            </h2>
            <p className="text-gray-600 text-lg">Nourishment that cares for your wellbeing</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {healthBenefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-green-200">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-green-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Additional Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Traditional Dink ladoos support postpartum recovery",
                "Millets & nut-based ladoos boost energy & immunity",
                "Sugar-free options available",
                "Vegan options (plant-based, no ghee)",
                "No frying — only slow roasting",
                "Fitness-friendly with portion control"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gifting Options */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Perfect for Every Occasion
            </h2>
            <p className="text-gray-600 text-lg">Make every moment sweeter with thoughtful gifting</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {giftingOptions.map((option, idx) => (
              <div key={idx} className="bg-amber-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-amber-200">
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <option.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-3xl p-8 shadow-lg text-center border border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Perfect for:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Diwali", "Raksha Bandhan", "Weddings", "Baby Announcements", "Corporate Gifting", "Festivals"].map((occasion, idx) => (
                <span key={idx} className="px-6 py-3 bg-white rounded-full text-gray-800 font-medium border-2 border-amber-300 shadow-sm">
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-yellow-50 to-amber-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              What We Believe In
            </h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { title: "Authenticity", desc: "Original homemade recipes", icon: "🏠" },
              { title: "Purity", desc: "Pure desi ghee, jaggery, no preservatives", icon: "✨" },
              { title: "Hygiene", desc: "Clean, home-style preparation", icon: "🧼" },
              { title: "Love", desc: "Handcrafted with personal care", icon: "❤️" },
              { title: "Customer Delight", desc: "Happiness in every box", icon: "😊" }
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-amber-200">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-100 to-yellow-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 text-lg">We'd love to hear from you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <a href="https://wa.me/919881902097" target="_blank" className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl hover:shadow-xl transition-all border-2 border-amber-200 hover:border-yellow-500">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Phone size={32} className="text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1 text-gray-800">WhatsApp</p>
                <p className="text-yellow-700 font-medium">9881902097</p>
              </div>
            </a>
            
            <a href="mailto:bhaktipataskar10@gmail.com" className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl hover:shadow-xl transition-all border-2 border-amber-200 hover:border-yellow-500">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail size={32} className="text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1 text-gray-800">Email</p>
                <p className="text-yellow-700 text-sm break-all font-medium">bhaktipataskar10@gmail.com</p>
              </div>
            </a>
            
            <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg border-2 border-amber-200">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin size={32} className="text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1 text-gray-800">Location</p>
                <p className="text-yellow-700 font-medium">Pune, Maharashtra</p>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-3 bg-white p-6 rounded-2xl shadow-md border border-amber-200">
            <p className="text-gray-700 text-lg font-medium">
              <Clock className="inline mr-2 text-yellow-600" size={20} />
              Customer Care: Mon–Sat | 9:00 AM – 7:00 PM
            </p>
            <p className="text-sm text-gray-600">
              <Shield className="inline mr-2 text-yellow-600" size={18} />
              FSSAI License: 21522169000184
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Thank you for choosing Ladoozi 💛</h2>
          <p className="text-xl mb-8 text-amber-100 italic">Homemade. Heartmade.</p>
          <a href="https://wa.me/919881902097" className="inline-flex items-center gap-3 bg-white text-amber-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <Phone size={24} />
            Place Your Order Now
          </a>
        </div>
      </section>
      <StoreFooter />
    </div>
  );
}