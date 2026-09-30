import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const isAdminHost = host === "admin.beanathlete.in";
  const pathname = request.nextUrl.pathname;

  if (isAdminHost) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-beanathlete-admin", "1");

    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    if (!pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? "/admin" : `/admin${pathname}`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if ((host === "beanathlete.in" || host === "www.beanathlete.in") && pathname.startsWith("/admin")) {
    const url = new URL(`https://admin.beanathlete.in${pathname.replace(/^\/admin/, "") || "/"}`);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|mp4|webm)$).*)"],
};
