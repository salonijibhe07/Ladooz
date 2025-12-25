// src/app/(shop)/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
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

/* eslint-disable react-hooks/set-state-in-effect */

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      setProduct(data.product);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);


  const addToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id, quantity }),
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart");
    }
  };

  const addToWishlist = async () => {
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id }),
      });
      alert("Added to wishlist!");
    } catch (error) {
      console.error("Failed to add to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 bg-white rounded-lg p-8 mb-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {product.images[selectedImage] && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[500px] object-contain"
                />
              )}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded overflow-hidden ${
                    selectedImage === index
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2">
              <span className="text-gray-500">{product.category.name}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded">
                <span className="font-semibold">{product.ratings}</span>
                <Star size={16} fill="white" />
              </div>
              <span className="text-gray-600">
                {product.reviewCount} ratings & reviews
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-green-600 font-semibold">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Offers */}
            <div className="mb-6 border-t border-b py-4">
              <h3 className="font-semibold mb-3">Available offers</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-semibold">●</span>
                  <span>
                    Bank Offer: 5% Unlimited Cashback on Flipkart Axis Bank
                    Credit Card
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-semibold">●</span>
                  <span>
                    Special Price: Get extra 10% off (price inclusive of
                    discount)
                  </span>
                </p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  ({product.stock} available)
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  <ShoppingCart size={20} />
                  ADD TO CART
                </button>
                <button
                  onClick={addToWishlist}
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:border-red-500 hover:text-red-500 transition"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-t pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="text-gray-600" size={20} />
                  <span>Free delivery on orders above ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="text-gray-600" size={20} />
                  <span>7 Days Return Policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="text-gray-600" size={20} />
                  <span>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        {product.highlights.length > 0 && (
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <ul className="space-y-2">
              {product.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">●</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="bg-white rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b py-3">
                  <span className="font-semibold w-1/3">{key}</span>
                  <span className="text-gray-700 w-2/3">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1">
                    <span className="font-semibold">{review.rating}</span>
                    <Star size={14} fill="white" />
                  </div>
                  <span className="font-semibold">{review.userName}</span>
                  {review.verified && (
                    <span className="text-xs text-gray-500">
                      ✓ Verified Purchase
                    </span>
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
