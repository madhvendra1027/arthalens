import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Immediately redirect any legacy /demo route to home
  if (pathname.startsWith("/demo")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const sessionToken = request.cookies.get("arthalens_session")?.value;

  // Protected routes requiring active session
  const isProtectedPath = pathname.startsWith("/analytics");

  if (isProtectedPath && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow visiting public and authenticated routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.png|apple-touch-icon.png|og-image.png|site.webmanifest|sitemap.xml|robots.txt).*)",
  ],
};
