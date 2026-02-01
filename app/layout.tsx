// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ladoozi - Handcrafted Sweets Online",
  description: "Authentic handmade ladoos delivered to your doorstep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header and Footer can also be client components */}
        
        <main>{children}</main>
        
      </body>
    </html>
  );
}
