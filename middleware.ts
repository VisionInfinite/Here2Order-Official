import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Get the pathname from the request
  const { pathname } = req.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook",
    "/api/uploadthing",
  ];

  // Allow public routes and static files
  if (
    publicRoutes.includes(pathname) ||
    pathname.includes("clerk") || 
    pathname.includes("_next") ||
    pathname.includes("static")
  ) {
    return NextResponse.next();
  }

  // Get auth state
  const { userId } = await auth();

  // If trying to access dashboard without auth, redirect to sign-in
  if (!userId && pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Stop Middleware running on static files and API routes
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Skip static files
    "/",                            // Match root route
    "/(api|trpc)(.*)",             // Match API routes
  ],
};
