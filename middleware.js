import { NextResponse } from "next/server";

const COUNTRY_LANG_MAP = {
  BD: "bn", // Bangladesh → Bangla
  PK: "ur", // Pakistan → Urdu
};

const COOKIE_NAME = "detected-lang";

export function middleware(request) {
  const response = NextResponse.next();

  // Only set the cookie if not already set (respect existing preference)
  if (!request.cookies.has(COOKIE_NAME)) {
    const country = request.headers.get("x-vercel-ip-country") ?? "";
    const lang = COUNTRY_LANG_MAP[country] ?? "en";
    response.cookies.set(COOKIE_NAME, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
