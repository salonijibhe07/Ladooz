
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { calculateCouponDiscount } from "@/lib/coupons";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const { shippingAddress, paymentMethod, couponCode: rawCoupon } = await request.json();

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate total weight
    const totalWeight = cartItems.reduce(
      (sum, item) => sum + (item.product.weight || 0) * item.quantity,
      0
    );

    // Apply coupon if provided
    let discount = 0;
    let couponCode: string | undefined;
    if (rawCoupon) {
      const res = await calculateCouponDiscount({ couponCode: rawCoupon, subtotal });
      if (!res.ok) {
        return NextResponse.json({ error: res.reason }, { status: 400 });
      }
      discount = res.discount;
      couponCode = res.couponCode;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = 0; // No tax
    
    // Shipping logic: Free for Pune, Free for orders above 2kg outside Pune
    const city = shippingAddress?.city?.toLowerCase() || '';
    const isPune = city.includes('pune');
    const shippingCost = (isPune || totalWeight >= 2) ? 0 : 50; // 50 Rs for orders < 2kg outside Pune
    
    const total = taxableAmount + tax + shippingCost;

    const orderNumber = `ORD${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        discount,
        couponCode,
        tax,
        shippingCost,
        total,
        paymentMethod,
        shippingAddress,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
