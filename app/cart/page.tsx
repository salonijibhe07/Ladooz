"use client";

import { useEffect, useState } from "react";
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
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const [couponsApplicable, setCouponsApplicable] = useState<any[]>([]);
  const [couponsOthers, setCouponsOthers] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

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
    // restore applied coupon from localStorage
    const saved = typeof window !== "undefined" ? localStorage.getItem("appliedCoupon") : null;
    if (saved) {
      setAppliedCoupon(saved);
      setCouponInput(saved);
      // attempt to re-apply against current cart after a delay to ensure cart is loaded
      setTimeout(() => {
        void applyCoupon(saved);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyCoupon = async (code?: string) => {
    try { new URL("/api/coupons/apply", window.location.href); } catch { /* env without window */ }

    const couponCode = (code ?? couponInput).trim();
    if (!couponCode) return;
    setApplying(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid coupon");
      setAppliedCoupon(data.couponCode);
      setDiscount(data.discount || 0);
      if (typeof window !== "undefined") localStorage.setItem("appliedCoupon", data.couponCode);
    } catch (e: any) {
      setCouponError(e?.message || "Failed to apply coupon");
      setAppliedCoupon(null);
      setDiscount(0);
      if (typeof window !== "undefined") localStorage.removeItem("appliedCoupon");
    } finally {
      setApplying(false);
    }
  };

  const fetchAvailableCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json().catch(() => ({}));
      setCouponsApplicable(Array.isArray(data.applicable) ? data.applicable : []);
      setCouponsOthers(Array.isArray(data.others) ? data.others : []);
    } catch {
      setCouponsApplicable([]);
      setCouponsOthers([]);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError(null);
    if (typeof window !== "undefined") localStorage.removeItem("appliedCoupon");
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    // Optimistic update - update UI immediately
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      );
      
      // Calculate new total based on updated items
      const newTotal = updatedItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );
      setTotal(newTotal);
      
      return updatedItems;
    });
    
    // Re-validate coupon if applied
    if (appliedCoupon) {
      void applyCoupon(appliedCoupon);
    }
    
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      // Don't fetch cart again - we already updated optimistically
      // void fetchCart();
    } catch {
      // If error, revert by fetching from server
      void fetchCart();
    }
  };

  const removeItem = async (productId: string) => {
    // Optimistic update - remove from UI immediately
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.product.id !== productId);
      
      // Calculate new total
      const newTotal = updatedItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );
      setTotal(newTotal);
      
      return updatedItems;
    });
    
    // Re-validate coupon if applied
    if (appliedCoupon) {
      void applyCoupon(appliedCoupon);
    }
    
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      // Don't fetch cart again - we already updated optimistically
      // void fetchCart();
    } catch {
      // If error, revert by fetching from server
      void fetchCart();
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
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Shipping (Pune):</strong> Free delivery for Pune.</li>
            <li><strong>Shipping (Outside Pune):</strong> Free delivery for orders above 2 kg.</li>
            <li><strong>Returns:</strong> No Return Policy.</li>
            <li><strong>Warranty:</strong> No Warranty.</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <h3 className="text-lg font-semibold mb-2">
                      {item.product.name}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center" style={{ minWidth: '120px' }}>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="cart-circle-btn"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0 12px', minWidth: '40px', textAlign: 'center', display: 'inline-block' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="cart-circle-btn"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="cart-unstyled-btn"
                      >
                        <Trash2 size={18} />
                        <span style={{ marginLeft: '8px' }}>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 shadow sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              {/* Coupon apply */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  {appliedCoupon ? (
                   <button onClick={removeCoupon} className="px-4 py-2 border rounded hover:bg-gray-50">Remove</button>
                 ) : (
                   <>
                     <button onClick={() => applyCoupon()} disabled={applying} className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                       {applying ? "Applying..." : "Apply"}
                     </button>
                     <button
                       type="button"
                       onClick={() => { setShowCouponList((s) => !s); if (!showCouponList) void fetchAvailableCoupons(); }}
                       className="px-3 py-2 border rounded hover:bg-gray-50"
                     >
                       View coupons
                     </button>
                   </>
                 )}
                </div>
                {couponError && <div className="text-red-600 text-sm mt-1">{couponError}</div>}
                {appliedCoupon && !couponError && (
                 <div className="text-green-700 text-sm mt-1">Applied: {appliedCoupon}</div>
               )}

               {showCouponList && (
                 <div className="mt-3 border rounded p-3 bg-gray-50">
                   <div className="text-sm font-medium mb-2">Available Coupons</div>
                   {loadingCoupons ? (
                     <div className="text-sm text-gray-600">Loading offers…</div>
                   ) : (
                     <div className="space-y-2">
                       {couponsApplicable.map((c) => (
                         <div key={c.code} className="flex items-center justify-between bg-white border rounded p-2">
                           <div>
                             <div className="font-semibold">{c.code}</div>
                             <div className="text-xs text-gray-600">{c.description}</div>
                           </div>
                           <button
                             className="text-blue-600 hover:underline text-sm"
                             onClick={() => { setCouponInput(c.code); void applyCoupon(c.code); setShowCouponList(false); }}
                           >
                             Apply
                           </button>
                         </div>
                       ))}
                       {couponsOthers.length > 0 && (
                         <>
                           <div className="text-xs text-gray-500 mt-2">Other coupons</div>
                           {couponsOthers.map((c) => (
                             <div key={c.code} className="flex items-center justify-between opacity-60 bg-white border rounded p-2">
                               <div>
                                 <div className="font-semibold">{c.code}</div>
                                 <div className="text-xs text-gray-600">{c.description}</div>
                                 {c.reason && <div className="text-[11px] text-gray-500">{c.reason}</div>}
                               </div>
                               <button
                                 className="text-blue-600 hover:underline text-sm"
                                 onClick={() => { setCouponInput(c.code); void applyCoupon(c.code); setShowCouponList(false); }}
                               >
                                 Try
                               </button>
                             </div>
                           ))}
                         </>
                       )}
                       {couponsApplicable.length === 0 && couponsOthers.length === 0 && (
                         <div className="text-sm text-gray-600">No coupons available right now.</div>
                       )}
                     </div>
                   )}
                 </div>
               )}
             </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Math.max(0, total).toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE*</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>
                      ₹{Math.max(0, total - discount).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">*Shipping calculated at checkout based on location and weight</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full text-center" onClick={() => (window.location.href = "/checkout")}>
                  Proceed to Checkout
                </Button>
                <a href="/products" className="w-full inline-flex items-center justify-center px-6 py-3 rounded font-semibold border hover:bg-gray-50 transition">
                  Add More Items
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
