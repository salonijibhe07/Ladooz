// src/app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get current month stats
    const [
      currentMonthOrders,
      lastMonthOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: thisMonth },
        },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
        },
        _sum: { total: true },
        _count: true,
      }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    const currentRevenue = currentMonthOrders._sum.total || 0;
    const lastRevenue = lastMonthOrders._sum.total || 0;
    const revenueChange =
      lastRevenue > 0
        ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
        : 0;

    const currentOrderCount = currentMonthOrders._count || 0;
    const lastOrderCount = lastMonthOrders._count || 0;
    const ordersChange =
      lastOrderCount > 0
        ? ((currentOrderCount - lastOrderCount) / lastOrderCount) * 100
        : 0;

    const stats = {
      totalRevenue: currentRevenue,
      totalOrders: currentOrderCount,
      totalProducts,
      totalUsers,
      revenueChange: Math.round(revenueChange),
      ordersChange: Math.round(ordersChange),
    };

    const formattedOrders = recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.user.name,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json({ stats, recentOrders: formattedOrders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
