import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Public routes — no auth required
  const publicRoutes = ["/", "/login", "/signup", "/otp", "/auth/verify-kyc"];

  // Routes that are the "fix" destinations — bypass verification checks
  const verificationRoutes = ["/otp", "/auth/verify-kyc"];

  // Skip Next.js internals and static files
  if (pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  if (token) {
    // Redirect away from basic public/auth pages
    // if (isPublicRoute && !verificationRoutes.includes(pathname)) {
    //   return NextResponse.redirect(new URL("/transactions", request.url));
    // }

    // Enforce verification gate on all protected (non-public, non-verification) routes
    if (!isPublicRoute) {
      const phoneVerified = request.cookies.get("phone_verified")?.value;
      const kycVerified = request.cookies.get("kyc_verified")?.value;
      const kycLink = request.cookies.get("kyc_link")?.value;

      // 1️⃣ Phone must be verified first → OTP page (auto-triggers resend)
      if (phoneVerified === "false") {
        return NextResponse.redirect(new URL("/otp?init=resend", request.url));
      }

      // 2️⃣ KYC must be verified second → external KYC link
      if (phoneVerified === "true" && kycVerified === "false" && kycLink) {
        return NextResponse.redirect(kycLink);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
