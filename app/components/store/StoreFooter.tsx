"use client";
import Link from "next/link";

export default function StoreFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2F2418] text-[#E9DEC8]">
      <div className="container-max px-4 py-14">
        {/* TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* ABOUT */}
          <div>
            <h3 className="text-[#C8A24D] font-serif font-semibold mb-4 tracking-wide">
              ABOUT LADOOZI
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/FAQ" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

         

          {/* POLICY */}
          <div>
            <h3 className="text-[#C8A24D] font-serif font-semibold mb-4 tracking-wide">
              POLICIES
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-[#C8A24D] font-serif font-semibold mb-4 tracking-wide">
              CONNECT WITH US
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/9881902097" className="hover:text-white transition">
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>


          {/* SOCIAL */}
          <div>
            <h3 className="text-[#C8A24D] font-serif font-semibold mb-4 tracking-wide">
              Ladoozi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Thanks for choosing Ladoozi !
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Follow us on Social Media.
                </Link>
              </li>
              
              
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-[#4A3A28] mt-10 pt-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            © {year} <span className="text-[#C8A24D] font-medium">Ladoozi</span>.
            All rights reserved.
          </p>

          <p className="text-xs text-[#CBBFA6]">
            Handmade sweets • Pure desi ghee • Made with love
          </p>
        </div>
      </div>
    </footer>
  );
}
