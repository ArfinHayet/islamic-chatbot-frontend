"use client";

import React, { createContext, useContext, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";

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

// ── Context so child pages can call handleFocus on the fixed root ──────────
const AppShellContext = createContext({ handleFocus: () => {} });
export const useAppShell = () => useContext(AppShellContext);

export function AppShell({ children }) {
  const pathname = usePathname();
  const activeSection = pathname === "/" ? "chat" : pathname.slice(1);

  const { lang, t } = useLocale();
  const { dark, theme } = useTheme();
  const { sidebarOpen, setSidebarOpen, isDesktop } = useUi();
  const { clearChat } = useChat();

  const appRootRef = useRef(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // ── VisualViewport sync (keyboard-aware layout on mobile) ──────────────────
  useEffect(() => {
    const syncVP = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const h = Math.round(vv.height);
        const top = Math.round(vv.offsetTop);
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = `${top}px`;
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", `${top}px`);
      } else {
        const h = window.innerHeight;
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = "0px";
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", "0px");
      }
    };
    syncVP();
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", syncVP);
      vv.addEventListener("scroll", syncVP);
    }
    window.addEventListener("resize", syncVP);
    return () => {
      if (vv) {
        vv.removeEventListener("resize", syncVP);
        vv.removeEventListener("scroll", syncVP);
      }
      window.removeEventListener("resize", syncVP);
    };
  }, []);

  // ── Textarea focus handler (Facebook WebView keyboard fix) ─────────────────
  const handleFocus = () => {
    const poll = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const h = Math.round(vv.height);
        const top = Math.round(vv.offsetTop);
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
          appRootRef.current.style.top = `${top}px`;
        }
        document.documentElement.style.setProperty("--app-height", `${h}px`);
        document.documentElement.style.setProperty("--vv-offset-top", `${top}px`);
      } else {
        const h = window.innerHeight;
        if (appRootRef.current) appRootRef.current.style.height = `${h}px`;
      }
    };
    poll();
    [100, 300, 600].forEach((ms) => setTimeout(poll, ms));
  };

  // ── Global CSS ─────────────────────────────────────────────────────────────
  const css = useMemo(
    () => `
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=Cinzel:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=Noto+Nastaliq+Urdu:wght@400;500;600&family=Noto+Naskh+Arabic:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html[lang="ur"] body{font-family:'Noto Nastaliq Urdu','Hind Siliguri',serif}
    html[lang="ur"] button,html[lang="ur"] input,html[lang="ur"] textarea{font-family:inherit}
    html[lang="ar"] body{font-family:'Noto Naskh Arabic','Amiri',serif}
    html[lang="ar"] button,html[lang="ar"] input,html[lang="ar"] textarea{font-family:inherit}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${theme.scrollbar};border-radius:99px}
    @keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .msg-row{animation:fadeIn .18s ease forwards}
    .sidebar-item{transition:background .18s,color .18s}
    .sidebar-item:hover{background:${theme.accentBgHov}}
    .send-btn{transition:background .18s,transform .12s}
    .send-btn:hover{transform:scale(1.06)}
    .send-btn:active{transform:scale(.94)}
    .overlay{animation:fadeIn .2s ease}
    .quick-chip{transition:background .15s,border-color .15s;cursor:pointer}
    .quick-chip:hover{background:${theme.accentBg};border-color:${theme.accent};color:${theme.accent}}
    textarea:focus{outline:none}
    textarea{resize:none}
    .chat-column{width:100%;max-width:760px;margin-left:auto;margin-right:auto}
    .markdown-message > :last-child{margin-bottom:0 !important}
    .toggle-switch{position:relative;display:inline-block;width:40px;height:22px}
    .toggle-switch input{opacity:0;width:0;height:0}
    .toggle-slider{position:absolute;inset:0;cursor:pointer;background:${theme.border};border-radius:22px;transition:.3s;border:1px solid ${theme.borderMed}}
    .toggle-slider:before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;left:3px;bottom:3px;background:${theme.textSec};transition:.3s}
    .toggle-switch input:checked+.toggle-slider{background:${theme.accent};border-color:${theme.accent}}
    .toggle-switch input:checked+.toggle-slider:before{transform:translateX(18px);background:white}
    @media(max-width:767px){.chat-column{max-width:none}}
    @media(min-width:768px){.desktop-only{display:flex !important}.mobile-only{display:none !important}}
    `,
    [theme],
  );

  if (!mounted) return null;

  if (pathname.startsWith("/admin")) {
    return (
      <AppShellContext.Provider value={{ handleFocus }}>
        <style>{css}</style>
        {children}
      </AppShellContext.Provider>
    );
  }

  return (
    <AppShellContext.Provider value={{ handleFocus }}>
      <style>{css}</style>
      <div
        ref={appRootRef}
        style={{
          position: "fixed",
          top: "var(--vv-offset-top, 0px)",
          left: 0,
          right: 0,
          display: "flex",
          height: "var(--app-height, 100dvh)",
          overflow: "hidden",
          background: theme.bg,
          color: theme.text,
          transition: "background .25s, color .25s",
        }}
      >
        {/* Desktop sidebar */}
        <div className="desktop-only" style={{ display: "none", flexShrink: 0, height: "100%" }}>
          <Sidebar />
        </div>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div className="overlay" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            />
            <div
              style={{
                position: "relative",
                width: 260,
                height: "100%",
                zIndex: 1,
                animation: "fadeSlideUp .25s ease",
              }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  position: "absolute",
                  top: 12,
                  insetInlineEnd: -44,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 99,
                  width: 34,
                  height: 34,
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.Close />
              </button>
              <div style={{ width: 260, height: "100%" }}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main column */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
            background: dark ? "#111827" : "#faf8f4",
            transition: "background .25s",
          }}
        >
          {/* Mobile header */}
          <div className="mobile-only">
            <MobileHeader />
          </div>

          {/* Desktop top bar */}
          <div
            className="desktop-only"
            style={{
              display: "none",
              padding: "14px 24px",
              borderBottom: `1px solid ${theme.border}`,
              background: theme.headerBg,
              backdropFilter: "blur(10px)",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
                {activeSection === "chat"
                  ? t("welcomeTitle")
                  : t(NAV_ITEMS.find((i) => i.id === activeSection)?.key ?? "settings")}
              </h1>
              {activeSection === "chat" && (
                <p style={{ fontSize: 12, color: theme.textTer, marginTop: 1 }}>{t("appSubtitle")}</p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {activeSection === "chat" && (
                <button
                  onClick={clearChat}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 9,
                    background: theme.bgTer,
                    border: `1px solid ${theme.border}`,
                    color: theme.textSec,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {t("newChat")}
                </button>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  background: theme.accentBg,
                  borderRadius: 99,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: theme.accent,
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 11.5, color: theme.accent, fontWeight: 500 }}>{t("active")}</span>
              </div>
            </div>
          </div>

          {/* Page content slot */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {children}
          </div>

          {/* Desktop footer */}
          {/* {isDesktop && (
            <footer
              className="desktop-only"
              style={{
                flexShrink: 0,
                borderTop: `1px solid ${theme.border}`,
                background: theme.headerBg,
                backdropFilter: "blur(10px)",
                padding: "10px 20px",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1d9e75, #0f6e56)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
                  Noor AI
                </span>
                <span style={{ fontSize: 11, color: theme.textTer }}>v2.0</span>
              </div>
              <span style={{ fontSize: 11, color: theme.textTer, textAlign: "center" }}>
                {lang === "bn" ? "বিসমিল্লাহির রাহমানির রাহিম" : "Bismillahir Rahmanir Rahim"}
              </span>
              <span style={{ fontSize: 11, color: theme.textTer }}>
                {lang === "bn" ? "আরফিন হায়েত ও রুম্মান কর্তৃক নির্মিত" : "Built by Arfin Hayet & Rumman"}
              </span>
            </footer>
          )} */}
        </main>
      </div>
    </AppShellContext.Provider>
  );
}
