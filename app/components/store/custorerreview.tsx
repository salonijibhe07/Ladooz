"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Mrs. Ruta",
    text: "The taste of LADOOZI ladoos is absolutely authentic and homely. The quality of ingredients is clearly premium, and the packing keeps everything fresh. Delivery was on time and very well managed."
  },
  {
    name: "Avanti",
    text: "I loved how perfectly balanced the sweetness was. The ladoos tasted fresh, the packaging was neat and hygienic, and my order reached me exactly within the promised delivery time."
  },
  {
    name: "Ankita",
    text: "LADOOZI exceeded my expectations in taste and quality. Each ladoo felt freshly prepared. The packing was elegant and secure, making it perfect for gifting. Delivery was quick and smooth."
  },
  {
    name: "Mrs. Deshpande",
    text: "The traditional taste reminded me of homemade ladoos. Quality is consistently excellent, packing is clean and sturdy, and delivery was prompt without any follow-ups needed."
  },
  {
    name: "Mr. Tushar",
    text: "From flavor to finish, everything was impressive. The ladoos were rich in taste, well-packed, and delivered right on schedule. Very professional service."
  },
  {
    name: "Mr. Avinash",
    text: "I truly appreciate the quality and freshness of LADOOZI ladoos. The packaging maintained the texture perfectly, and the delivery was timely and hassle-free."
  },
  {
    name: "Mr. Sameer",
    text: "Excellent taste with premium quality ingredients. The packing was strong and hygienic, and the delivery was completed within the committed time. Highly reliable brand."
  },
  {
    name: "Priyanka",
    text: "The ladoos were delicious and not overly sweet, which I loved. Packaging was attractive and secure, and delivery was fast and well-coordinated."
  },
  {
    name: "Pradeep",
    text: "LADOOZI offers consistent quality and great taste. The packing ensured zero damage, and delivery was punctual. A brand I trust for both family and festive orders."
  }
];

export default function CustomerReviewsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const next = () =>
    setIndex((prev) => (prev + 1) % reviews.length);

  return (
    <section className="bg-[#FFF8F1] py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3A28] mb-4">
          💬 What Our Customers Think
        </h2>
        <p className="text-[#6B4F2E] text-lg max-w-3xl mx-auto">
          Trusted by <span className="font-semibold">200+ happy customers</span> for
          authentic taste, premium ingredients, hygienic packaging, and reliable delivery.
        </p>

        <p className="mt-3 font-medium text-[#8A6A3D]">
          LADOOZI – Crafted with Care. Trusted by Many.
        </p>

        {/* Review Card */}
        <div className="relative mt-16">

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-[#F0E2C5] p-10 max-w-3xl mx-auto transition-all duration-700">
            <div className="flex justify-center mb-5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[#C8A24D] text-xl">★</span>
              ))}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              “{reviews[index].text}”
            </p>

            <p className="font-semibold text-[#4A3A28] text-lg">
              — {reviews[index].name}
            </p>
          </div>

          <div
  role="button"
  onClick={prev}
  className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-black hover:text-gray-500 transition"
>
  <ChevronLeft size={36} />
</div>

<div
  role="button"
  onClick={next}
  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-black hover:text-gray-500 transition"
>
  <ChevronRight size={36} />
</div>

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-[#C8A24D]" : "bg-[#E8D8AE]"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
