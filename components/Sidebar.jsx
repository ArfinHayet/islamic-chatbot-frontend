"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { LangPill } from "@/components/ui/LangPill";

const NAV_ITEMS = [
  { id: "chat", key: "chat", Icon: Icons.Chat },
  { id: "prayer", key: "prayerTitle", Icon: Icons.Prayer },
  { id: "dua", key: "dua", Icon: Icons.Book },
  { id: "about", key: "about", Icon: Icons.Info },
  { id: "settings", key: "settings", Icon: Icons.Settings },
];

const FOOTER_LINKS = [
  { id: "faq", key: "faq" },
  { id: "privacy", key: "privacy" },
  { id: "terms", key: "terms" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeSection = pathname === "/" ? "chat" : pathname.slice(1);

  const { lang, setLang, t } = useLocale();
  const { dark, setDark, theme } = useTheme();
  const { setSidebarOpen } = useUi();
  const { setMessages, clearChat } = useChat();

  return (
    <aside
      style={{
        width: 224,
        height: "100%",
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
        transition: "background .25s",
      }}
    >
      <IslamicPattern dark={dark} />

      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}`, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              flexShrink: 0,
              overflow: "hidden",
              boxShadow: "0 3px 10px rgba(26,107,90,0.3)",
            }}
          >
            <img src="/favicon.png" alt="Noor AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div
              style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif", letterSpacing: 0.3 }}
            >
              {t("appName")}
            </div>
            <div
              style={{
                fontSize: 10,
                color: theme.accent,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 500,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {t("appTagline")}
            </div>
          </div>
        </div>
      </div>

      {/* New chat button */}
      <div style={{ padding: "14px 14px 8px" }}>
        <button
          onClick={() => {
            clearChat();
            router.push("/chat");
            setSidebarOpen(false);
          }}
          style={{
            width: "100%",
            padding: "9px 14px",
            background: theme.accentBg,
            border: `1px solid ${theme.accent}`,
            borderRadius: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            color: theme.accent,
            fontSize: 13,
            fontWeight: 600,
            transition: "background .18s",
          }}
        >
          <Icons.Plus /> {t("newChat")}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: "4px 10px", flex: 1 }}>
        {NAV_ITEMS.map(({ id, key, Icon: NavIcon }) => {
          const active = activeSection === id;
          return (
            <Link
              key={id}
              href={`/${id}`}
              className="sidebar-item"
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                marginBottom: 2,
                background: active ? theme.accentBg : "transparent",
                borderRadius: 10,
                color: active ? theme.accent : theme.textSec,
                fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>
                {React.createElement(NavIcon)}
              </span>
              {t(key)}
              {active && (
                <span
                  style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: theme.accent }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: lang + dark toggle */}
      <div style={{ padding: "12px 14px 14px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <LangPill lang={lang} setLang={setLang} theme={theme} setMessages={setMessages} />
          <button
            onClick={() => setDark((d) => !d)}
            title={dark ? t("lightMode") : t("darkMode")}
            style={{
              background: dark ? theme.accent : theme.bgTer,
              border: `1px solid ${theme.borderMed}`,
              borderRadius: 99,
              width: 42,
              height: 24,
              cursor: "pointer",
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: dark ? "flex-end" : "flex-start",
              transition: "all .25s",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: dark ? "white" : theme.textSec,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .25s",
              }}
            >
              {dark ? <Icons.Moon /> : <Icons.Sun />}
            </div>
          </button>
        </div>
        <div style={{ fontSize: 10.5, color: theme.textTer, textAlign: "center", marginBottom: 10 }}>
          {t("langSelected")}
        </div>
        <div
          aria-label={t("legalLinks")}
          style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}
        >
          {FOOTER_LINKS.map(({ id, key }) => (
            <Link
              key={id}
              href={`/${id}`}
              onClick={() => setSidebarOpen(false)}
              style={{ color: activeSection === id ? theme.accent : theme.textTer, fontSize: 10.5, textDecoration: "none" }}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
