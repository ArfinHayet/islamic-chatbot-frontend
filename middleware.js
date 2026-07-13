import { NextResponse } from "next/server";

const COUNTRY_LANG_MAP = {
  BD: "bn", // Bangladesh → Bangla
  PK: "ur", // Pakistan → Urdu
  // Arabic-speaking countries → Arabic
  SA: "ar", // Saudi Arabia
  AE: "ar", // United Arab Emirates
  EG: "ar", // Egypt
  QA: "ar", // Qatar
  KW: "ar", // Kuwait
  BH: "ar", // Bahrain
  OM: "ar", // Oman
  JO: "ar", // Jordan
  IQ: "ar", // Iraq
  SY: "ar", // Syria
  LB: "ar", // Lebanon
  PS: "ar", // Palestine
  YE: "ar", // Yemen
  LY: "ar", // Libya
  DZ: "ar", // Algeria
  MA: "ar", // Morocco
  TN: "ar", // Tunisia
  SD: "ar", // Sudan
  MR: "ar", // Mauritania
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
