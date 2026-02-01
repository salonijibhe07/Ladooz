"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Address = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    // Fetch cart summary and compute totals with stored coupon
    (async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        const st = data.total || 0;
        setSubtotal(st);

        const saved = typeof window !== "undefined" ? localStorage.getItem("appliedCoupon") : null;
        setAppliedCoupon(saved);

        let disc = 0;
        if (saved) {
          try {
            const applyRes = await fetch("/api/coupons/apply", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ couponCode: saved }),
            });
            const applyData = await applyRes.json();
            if (applyRes.ok) {
              disc = applyData.discount || 0;
            }
          } catch {
            // ignore apply errors
          }
        }
        setDiscount(disc);

        const taxable = Math.max(0, st - disc);
        const tax = 0; // No tax
        const shipping = 0; // Will be calculated based on city and weight at order time
        setCartTotal(taxable + tax + shipping);
      } catch {
        // ignore
      }
    })();
  }, []);

  const valid = useMemo(() => {
    const a = address;
    return (
      a.name.trim() &&
      /^\+?\d{10,15}$/.test(a.phone.replace(/\s/g, "")) &&
      a.addressLine1.trim() &&
      a.city.trim() &&
      a.state.trim() &&
      /^\d{6}$/.test(a.pincode)
    );
  }, [address]);

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod: "GPAY_QR",
          couponCode: (typeof window !== "undefined" ? localStorage.getItem("appliedCoupon") : null) || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to place order");
      }
      const orderId: string = data.order.id;
      router.replace(`/order-success/${orderId}`);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

        <div className="bg-white rounded-xl p-6 shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input className="mt-1 w-full border rounded p-2" value={address.name} onChange={(e)=>setAddress({...address, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input className="mt-1 w-full border rounded p-2" value={address.phone} onChange={(e)=>setAddress({...address, phone: e.target.value})} placeholder="10-digit" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input className="mt-1 w-full border rounded p-2" value={address.addressLine1} onChange={(e)=>setAddress({...address, addressLine1: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
              <input className="mt-1 w-full border rounded p-2" value={address.addressLine2} onChange={(e)=>setAddress({...address, addressLine2: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input className="mt-1 w-full border rounded p-2" value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input className="mt-1 w-full border rounded p-2" value={address.state} onChange={(e)=>setAddress({...address, state: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input className="mt-1 w-full border rounded p-2" value={address.pincode} onChange={(e)=>setAddress({...address, pincode: e.target.value})} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <div className="text-gray-600">Payable Now</div>
              <div className="text-2xl font-bold text-green-600">₹{cartTotal.toLocaleString()}</div>
            </div>
            <button
              disabled={!valid || loading}
              onClick={placeOrder}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
