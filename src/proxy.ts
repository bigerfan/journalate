import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Runs before every page request matched below. It only checks that a session cookie EXISTS,
// without validating it, so this is a convenience redirect and not a security check.
// Real validation happens in requireUser() on the API and in server components.
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/trades/:path*", "/onboarding"],
};
