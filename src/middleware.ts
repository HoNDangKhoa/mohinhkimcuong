import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const session = await verifySessionToken(request.cookies.get(sessionCookieName())?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|mp4|ico)$).*)"],
};
