import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("arthalens_session")?.value;

  // Unprotected / Public Explorer Paths
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/gdp") ||
    pathname.startsWith("/global") ||
    pathname.startsWith("/methodology") ||
    pathname.startsWith("/deflator") ||
    pathname.startsWith("/revisions") ||
    pathname.startsWith("/consistency") ||
    pathname.startsWith("/ratings") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/sources") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml";

  // If user is trying to access protected routes without a session cookie
  if (!isPublicPath && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated and visits /login, redirect to dashboard
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
