"use client";

import { usePathname } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { LangPill } from "@/components/ui/LangPill";

const NAV_ITEMS = [
  { id: "chat", key: "chat" },
  { id: "prayer", key: "prayerTitle" },
  { id: "dua", key: "dua" },
  { id: "about", key: "about" },
  { id: "settings", key: "settings" },
  { id: "faq", key: "faq" },
  { id: "privacy", key: "privacy" },
  { id: "terms", key: "terms" },
];

export function MobileHeader() {
  const pathname = usePathname();
  const activeSection = pathname === "/" ? "chat" : pathname.slice(1);
  const activeKey = NAV_ITEMS.find((i) => i.id === activeSection)?.key ?? "chat";

  const { lang, setLang, t } = useLocale();
  const { dark, setDark, theme } = useTheme();
  const { setSidebarOpen, showInstall, setShowInstall, handleInstall } = useUi();
  const { setMessages } = useChat();

  return (
    <>
      {showInstall && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "linear-gradient(135deg, #6d28d9, #8b5cf6)",
            borderRadius: 14,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 32px rgba(109,40,217,0.45)",
            border: "1px solid rgba(240,180,41,0.3)",
            maxWidth: "90vw",
            animation: "fadeSlideUp .3s ease",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img src="/favicon.png" style={{ width: 24, height: 24, borderRadius: 6 }} alt="Noor AI" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Install Noor AI</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)" }}>
              Add to home screen for best experience
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowInstall(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "white",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              style={{
                background: theme.accent,
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Install
            </button>
          </div>
        </div>
      )}

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.headerBg,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          transition: "background .25s",
        }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          style={{ background: "none", border: "none", color: theme.text, cursor: "pointer", padding: 4 }}
        >
          <Icons.Menu />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
            {t(activeKey)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangPill lang={lang} setLang={setLang} theme={theme} setMessages={setMessages} />
          <button
            onClick={() => setDark((d) => !d)}
            style={{ background: "none", border: "none", color: theme.textSec, cursor: "pointer", padding: 4 }}
          >
            {dark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>
    </>
  );
}
