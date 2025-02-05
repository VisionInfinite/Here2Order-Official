import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, string[]> = {
  '/dashboard': ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CUSTOMER'],
  '/dashboard/admin': ['SUPER_ADMIN'],
  '/dashboard/restaurant': ['RESTAURANT_ADMIN'],
  '/dashboard/menu': ['RESTAURANT_ADMIN'],
};

export async function withRoleAuth(req: NextRequest) {
  try {
    // Get the user's session
    const session = await clerkClient.sessions.getSession(
      req.headers.get("authorization") || ""
    );

    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Get the user's role from metadata
    const user = await clerkClient.users.getUser(session.userId);
    const userRole = user.publicMetadata.role as string;

    // Check route permissions
    const path = req.nextUrl.pathname;
    const requiredRoles = Object.entries(protectedRoutes)
      .find(([route]) => path.startsWith(route))?.[1];

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
} 