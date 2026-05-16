"use client";

import { TRANSLATIONS } from "@/lib/translations";

export function LangPill({ lang, setLang, theme, setMessages }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: theme.bgTer,
        border: `1px solid ${theme.borderMed}`,
        borderRadius: 99,
        padding: 3,
        gap: 2,
      }}
    >
      {[
        { code: "bn", label: "বাং" },
        { code: "en", label: "EN" },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => {
            setLang(code);
            setMessages((prev) => {
              prev[0] = { id: 0, role: "assistant", content: TRANSLATIONS[code].greeting, streaming: false };
              return [...prev];
            });
          }}
          style={{
            padding: "4px 11px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: 0.3,
            transition: "background 0.2s, color 0.2s",
            background: lang === code ? theme.accent : "transparent",
            color: lang === code ? "white" : theme.textSec,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
