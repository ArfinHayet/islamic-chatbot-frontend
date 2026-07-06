"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS } from "@/lib/translations";

const LocaleContext = createContext(null);

const FONTS = {
  bn: "Hind Siliguri, sans-serif",
  en: "DM Sans, sans-serif",
  ur: "'Noto Nastaliq Urdu', 'Hind Siliguri', serif",
};

const USER_INITIALS = { bn: "আ", en: "A", ur: "ع" };

// Urdu is written right-to-left
const RTL_LANGS = ["ur"];

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "bn";
    const stored = localStorage.getItem("lang");
    return TRANSLATIONS[stored] ? stored : "bn";
  });

  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key) => (TRANSLATIONS[lang] ?? TRANSLATIONS.bn)[key] ?? TRANSLATIONS.en[key] ?? key,
    [lang],
  );
  const font = FONTS[lang] ?? FONTS.en;
  const userInitials = USER_INITIALS[lang] ?? USER_INITIALS.en;

  const value = useMemo(
    () => ({ lang, setLang, t, font, userInitials, dir }),
    [lang, setLang, t, font, userInitials, dir],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
