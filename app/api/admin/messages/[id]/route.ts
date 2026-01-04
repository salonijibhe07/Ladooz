import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    requireAdmin(request);
    const message = await prisma.contactMessage.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        // Select only core fields to avoid mismatches on older DBs
        message: true,
        createdAt: true,
      },
    });
    if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Backward-compatible mapping in case `read` column hasn't been migrated yet
    const safeMessage = { ...message, read: (message as any).read ?? false } as typeof message;
    return NextResponse.json({ message: safeMessage });
  } catch (e: any) {
    const msg = e?.message || "Failed to fetch message";
    const status = msg === "Not authenticated" || msg === "Invalid token" ? 401 : msg === "Forbidden" ? 403 : 500;
    if (process.env.NODE_ENV !== "production") console.error(`GET /api/admin/messages/${id} error:`, e);
    return NextResponse.json({ error: msg, details: process.env.NODE_ENV !== "production" ? String(e?.stack || e) : undefined }, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    requireAdmin(request);
    const body = (await request.json()) as { read?: boolean };

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read === undefined ? true : !!body.read },
    });

    return NextResponse.json({ message: updated });
  } catch (e: any) {
    const msg = e?.message || "Failed to update message";
    const status = msg === "Not authenticated" || msg === "Invalid token" ? 401 : msg === "Forbidden" ? 403 : 500;
    if (process.env.NODE_ENV !== "production") console.error(`PATCH /api/admin/messages/${id} error:`, e);
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    requireAdmin(request);

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    const msg = e?.message || "Failed to delete message";
    const status = msg === "Not authenticated" || msg === "Invalid token" ? 401 : msg === "Forbidden" ? 403 : 500;
    if (process.env.NODE_ENV !== "production") console.error(`DELETE /api/admin/messages/${id} error:`, e);
    return NextResponse.json({ error: msg }, { status });
  }
}
