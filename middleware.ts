// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuthTokenPayload } from "@/lib/auth";

// export function middleware(request: NextRequest) {
//   // const token = request.cookies.get("token")?.value;
//   const token = true;
//   const { pathname } = request.nextUrl;

//   // Admin routes protection
//   if (pathname.startsWith("/admin")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     try {
//       const decoded = getAuthTokenPayload(request);

//       if (decoded.role !== "ADMIN") {
//         return NextResponse.redirect(new URL("/", request.url));
//       }
//     } catch (error) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   // Protected user routes
//   if (
//     pathname.startsWith("/cart") ||
//     pathname.startsWith("/checkout") ||
//     pathname.startsWith("/orders")
//   ) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/cart", "/checkout", "/orders/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
