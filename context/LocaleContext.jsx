"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS } from "@/lib/translations";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("lang") || "bn" : "bn",
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useCallback((key) => TRANSLATIONS[lang][key] ?? key, [lang]);
  const font = lang === "bn" ? "Hind Siliguri, sans-serif" : "DM Sans, sans-serif";
  const userInitials = lang === "bn" ? "আ" : "A";

  const value = useMemo(
    () => ({ lang, setLang, t, font, userInitials }),
    [lang, setLang, t, font, userInitials],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
