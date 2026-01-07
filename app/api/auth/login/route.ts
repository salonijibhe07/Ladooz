// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    // Trim and validate email format
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || trimmedEmail.length === 0) {
      return NextResponse.json(
        { error: "Email cannot be empty" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: trimmedEmail },
      });
    } catch (dbError) {
      console.error("Database error during user lookup:", {
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
        email: trimmedEmail,
      });
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Bcrypt error:", {
        message: bcryptError instanceof Error ? bcryptError.message : String(bcryptError),
        stack: bcryptError instanceof Error ? bcryptError.stack : undefined,
      });
      return NextResponse.json(
        { error: "Password verification error. Please try again." },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    let token;
    try {
      token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        getJwtSecret(),
        { expiresIn: "7d" }
      );
    } catch (jwtError) {
      console.error("JWT signing error:", {
        message: jwtError instanceof Error ? jwtError.message : String(jwtError),
        stack: jwtError instanceof Error ? jwtError.stack : undefined,
      });
      return NextResponse.json(
        { error: "Token generation error. Please try again." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    // Detailed error logging for production debugging
    console.error("Unexpected login error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
