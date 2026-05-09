"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getThemeTokens } from "@/lib/themeTokens";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("dark") === "true" : false,
  );

  useEffect(() => {
    localStorage.setItem("dark", String(dark));
  }, [dark]);

  const theme = useMemo(() => getThemeTokens(dark), [dark]);
  const value = useMemo(() => ({ dark, setDark, theme }), [dark, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
