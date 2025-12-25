// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { status, trackingNumber } = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
