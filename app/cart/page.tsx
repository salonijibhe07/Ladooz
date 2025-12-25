"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

// -------------------- Reusable Button Component --------------------
function Button({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-6 py-3 rounded font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-60 transition ${className}`}
    >
      {children}
    </button>
  );
}

// -------------------- Cart Page --------------------
export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data.cartItems || []);
      setTotal(data.total || 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      void fetchCart();
    } catch {
      // ignore
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      void fetchCart();
    } catch {
      // ignore
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => (window.location.href = "/")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white rounded-lg p-6 shadow sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{(total * 0.18).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{total > 500 ? "FREE" : "₹40"}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>
                      ₹
                      {(total + total * 0.18 + (total > 500 ? 0 : 40)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full text-center" onClick={() => (window.location.href = "/checkout")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
