"use client";

import React, { useEffect, useRef, useState } from "react";
import { TRANSLATIONS } from "@/lib/translations";
import { Icons } from "@/components/islamic-chat/Icons";

const LANG_OPTIONS = [
  { code: "bn", short: "বাং", full: "বাংলা" },
  { code: "en", short: "EN", full: "English" },
  { code: "ur", short: "اردو", full: "اردو" },
  { code: "ar", short: "عربي", full: "العربية" },
];

// Compact dropdown: shows the current language, opens a menu with all of them.
// `openUp` flips the menu above the trigger (for the sidebar footer at the bottom of the screen).
// `align` anchors the menu to the trigger's start or end edge — use "start" when the trigger
// sits near the start of the screen (sidebar) so the menu grows inward instead of off-screen.
export function LangPill({ lang, setLang, theme, setMessages, openUp = false, align = "end" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LANG_OPTIONS.find((o) => o.code === lang) ?? LANG_OPTIONS[0];

  const selectLang = (code) => {
    setOpen(false);
    if (code === lang) return;
    setLang(code);
    setMessages((prev) => {
      prev[0] = { id: 0, role: "assistant", content: TRANSLATIONS[code].greeting, streaming: false };
      return [...prev];
    });
  };

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: theme.bgTer,
          border: `1px solid ${open ? theme.accent : theme.borderMed}`,
          borderRadius: 99,
          padding: "5px 11px",
          cursor: "pointer",
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: theme.textSec,
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ display: "flex", color: theme.accent }}>
          <Icons.Globe />
        </span>
        {current.short}
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            ...(align === "start" ? { insetInlineStart: 0 } : { insetInlineEnd: 0 }),
            ...(openUp ? { bottom: "calc(100% + 6px)" } : { top: "calc(100% + 6px)" }),
            zIndex: 300,
            minWidth: 140,
            maxWidth: "calc(100vw - 24px)",
            background: theme.bgSec,
            border: `1px solid ${theme.borderMed}`,
            borderRadius: 12,
            padding: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            animation: "fadeIn .15s ease",
          }}
        >
          {LANG_OPTIONS.map(({ code, full }) => {
            const active = lang === code;
            return (
              <button
                key={code}
                role="option"
                aria-selected={active}
                onClick={() => selectLang(code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  textAlign: "start",
                  background: active ? theme.accentBg : "transparent",
                  color: active ? theme.accent : theme.textSec,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {full}
                {active && (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 8.5l3.5 3.5L13 5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
