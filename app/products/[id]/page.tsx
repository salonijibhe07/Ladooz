"use client";

import { useEffect, useState } from "react";
import { Heart, RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  brand?: string;
  ratings: number;
  reviewCount: number;
  highlights: string[];
  specifications?: Record<string, unknown>;
  category: {
    name: string;
    slug: string;
  };
  reviews: Review[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartStatus, setCartStatus] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const addToCart = async () => {
    console.log("[AddToCart] clicked", { productId: product?.id, quantity });
    setCartStatus(null);
    if (!product?.id) return;
    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (res.status === 401) {
        setCartStatus("Please login to add items to your cart.");
        window.location.assign(`/login?redirect=/products/${params.id}`);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[AddToCart] server error", data);
        setCartStatus((data?.error as string) || "Failed to add to cart. Please try again.");
        return;
      }
      setCartStatus("Added to cart!");
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const [wishlisted, setWishlisted] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!params.id) return;
      try {
        const res = await fetch("/api/wishlist", { credentials: "include" });
        if (!res.ok) return; // ignore auth errors; user might be logged out
        const data = await res.json().catch(() => ({}));
        const items: { wishlistItems?: { productId: string }[] } = data || {};
        const has = !!items.wishlistItems?.some((it) => it.productId === params.id);
        if (active) setWishlisted(has);
      } catch {}
      finally {
        if (active) setCheckingWishlist(false);
      }
    })();
    return () => { active = false; };
  }, [params.id]);

  const toggleWishlist = async () => {
    if (!product?.id) return;
    try {
      if (!wishlisted) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.status === 401) {
          window.location.assign(`/login?redirect=/products/${params.id}`);
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert((data?.error as string) || "Failed to add to wishlist");
          return;
        }
        setWishlisted(true);
      } else {
        const res = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.assign(`/login?redirect=/products/${params.id}`);
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert((data?.error as string) || "Failed to remove from wishlist");
          return;
        }
        setWishlisted(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 md:p-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[420px] md:h-[500px] object-contain"
                />
              ) : null}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded overflow-hidden ${
                    selectedImage === index ? "border-primary-500" : "border-gray-200"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="text-gray-500">{product.category.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-primary-500 text-white px-3 py-1 rounded">
                <span className="font-semibold">{product.ratings}</span>
                <Star size={16} fill="white" />
              </div>
              <span className="text-gray-600">
                {product.reviewCount} ratings & reviews
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-primary-500">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.comparePrice ? (
                  <>
                    <span className="text-xl md:text-2xl text-gray-400 line-through">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                    <span className="text-lg md:text-xl text-primary-500 font-semibold">
                      {discount}% off
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Product Options */}
            <div className="mb-6 space-y-4">
              {/* Size selector */}
              <div>
                <div className="mb-2 font-semibold">Size</div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-2 rounded-lg border-2 border-primary-500 text-primary-600 font-medium bg-primary-50"
                    aria-pressed="true"
                  >
                    Box of 15 (500 g)
                  </button>
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <label className="mb-2 block font-semibold" htmlFor="quantity-select">Quantity</label>
                <div className="flex items-center gap-3">
                  <select
                    id="quantity-select"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {Array.from({ length: Math.min(10, Math.max(1, product.stock)) }, (_, i) => i + 1).map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">({product.stock} available)</span>
                </div>
              </div>

              {/* Offer highlights */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2">
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                

                <button
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-700 py-3 rounded-lg font-semibold hover:bg-primary-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={addingToCart}
                >
                  <ShoppingCart size={20} />
                  ADD TO CART
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center gap-2 border-2 py-3 px-6 rounded-lg font-semibold transition ${wishlisted ? "border-red-200 text-red-600 bg-red-50" : "border-gray-300 hover:border-red-400 hover:text-red-500"}`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} className={wishlisted ? "text-red-600" : undefined} fill={wishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Policies */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="text-gray-600" size={20} />
                  <span>Free delivery for Pune</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="text-gray-600" size={20} />
                  <span>No Return Policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="text-gray-600" size={20} />
                  <span>No Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        {product.highlights.length > 0 && (
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <ul className="space-y-2">
              {product.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">●</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Product Description */}
        <div className="bg-white rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b py-3">
                  <span className="font-semibold w-1/3">{key}</span>
                  <span className="text-gray-700 w-2/3">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings & Reviews */}
        <div className="bg-white rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary-500 text-white px-3 py-1 rounded flex items-center gap-1">
                    <span className="font-semibold">{review.rating}</span>
                    <Star size={14} fill="white" />
                  </div>
                  <span className="font-semibold">{review.userName}</span>
                  {review.verified && (
                    <span className="text-xs text-gray-500">✓ Verified Purchase</span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
