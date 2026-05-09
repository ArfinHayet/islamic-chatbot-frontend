"use client";

import axios from "axios";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";

import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { MOCK_HISTORY_DATA } from "@/lib/mockHistory";
import { TRANSLATIONS } from "@/lib/translations";

import { Icons } from "./Icons";

function IslamicPattern({ dark }) {
  const c = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ip" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={c} strokeWidth="0.8" />
          <circle cx="30" cy="30" r="12" fill="none" stroke={c} strokeWidth="0.8" />
          <path d="M30 18 L42 30 L30 42 L18 30 Z" fill="none" stroke={c} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip)" />
    </svg>
  );
}

function BotAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #1a6b5a 0%, #0d4a3e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(26,107,90,0.35)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" />
        <path
          d="M8 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM13 11.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
          fill="white"
        />
        <path
          d="M9 15.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function UserAvatar({ initials = "A" }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg, #2d5a8e 0%, #1a3a5c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "white",
        boxShadow: "0 2px 8px rgba(45,90,142,0.35)",
      }}
    >
      {initials}
    </div>
  );
}

// ── TYPING DOTS ───────────────────────────────────────────────
function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 4 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            opacity: 0.4,
            animation: "typingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}

// Extracted ChatSection to top-level to avoid remounting on App re-renders
function ChatSection({
  messages,
  theme,
  t,
  bottomRef,
  textareaRef,
  handleInput,
  handleKeyDown,
  handleFocus,
  isLoading,
  input,
  handleStop,
  sendMessage,
  userInitials,
  copyMessage,
  copiedId,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Welcome */}
        {messages.length === 1 && (
          <div style={{ textAlign: "center", padding: "32px 20px 24px", animation: "fadeSlideUp .5s ease" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                margin: "0 auto 16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(26,107,90,0.3)",
              }}
            >
              <img src="/favicon.png" alt="Noor AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div
              style={{ fontSize: 20, fontWeight: 600, color: theme.text, marginBottom: 6, fontFamily: "Cinzel, serif" }}
            >
              {t("welcomeTitle")}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: theme.textSec,
                lineHeight: 1.7,
                maxWidth: 360,
                margin: "0 auto 20px",
              }}
            >
              {t("welcomeSubtitle")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {t("quickPrompts").map((q, i) => (
                <button
                  key={i}
                  className="quick-chip"
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    background: theme.bgSec,
                    border: `1px solid ${theme.borderMed}`,
                    color: theme.textSec,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="msg-row"
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            {msg.role === "assistant" ? <BotAvatar /> : <UserAvatar initials={userInitials} />}
            <div
              style={{
                maxWidth: "min(76%,520px)",
                background: msg.role === "user" ? theme.userBubble : theme.botBubble,
                color: msg.role === "user" ? theme.userText : theme.text,
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                fontSize: 14,
                lineHeight: 1.75,
                border: msg.role === "assistant" ? `1px solid ${theme.border}` : "none",
                boxShadow: theme.shadow,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                position: "relative",
                paddingRight: 56, // space for copy button
              }}
            >
              <div style={{ display: "block", width: "100%", marginRight: msg.role == "assistent" ? "" : "12px" }}>
                {msg.content || (msg.streaming ? "" : "…")}
              </div>
              {msg.streaming && <TypingDots />}

              {msg.content && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyMessage && copyMessage(msg.id, msg.content);
                    }}
                    title="Copy message"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: copiedId === msg.id ? theme.accent : theme.textTer,
                      cursor: "pointer",
                      padding: 6,
                      borderRadius: 8,
                      fontSize: 15,
                    }}
                  >
                    <i className={copiedId === msg.id ? "pi pi-check" : "pi pi-copy"} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({ text: msg.content });
                      } else {
                        copyMessage && copyMessage(msg.id, msg.content);
                      }
                    }}
                    title="Share message"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: theme.textTer,
                      cursor: "pointer",
                      padding: 6,
                      borderRadius: 8,
                      fontSize: 15,
                    }}
                  >
                    <i className="pi pi-share-alt" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${theme.border}`, background: theme.bgSec }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: theme.inputBg,
            border: `1.5px solid ${theme.borderMed}`,
            borderRadius: 14,
            padding: "8px 8px 8px 14px",
            boxShadow:
              theme.shadow && !theme.shadow.includes("rgba(0,0,0,0.08)") ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={t("placeholder")}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: theme.text,
              fontSize: 14,
              lineHeight: 1.6,
              minHeight: 24,
              maxHeight: 180,
              overflowY: "auto",
            }}
          />
          <button
            className="send-btn"
            onClick={isLoading ? handleStop : sendMessage}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              background: isLoading ? "#c0392b" : input.trim() ? theme.accent : theme.bgTer,
              color: isLoading || input.trim() ? "white" : theme.textTer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={isLoading ? "Stop" : "Send"}
          >
            {isLoading ? <Icons.Stop /> : <Icons.Send />}
          </button>
        </div>
        <p
          style={{
            fontSize: 11,
            color: theme.textTer,
            textAlign: "center",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}

// ── LANGUAGE PILL TOGGLE ──────────────────────────────────────
// Compact BN / EN switcher used in sidebar and mobile header
function LangPill({ lang, setLang, theme, setMessages }) {
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

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════
export function IslamicChatClient() {
  const { lang, setLang, t, font, userInitials } = useLocale();
  const { dark, setDark, theme } = useTheme();
  const {
    messages,
    setMessages,
    isLoading,
    input,
    copiedId,
    copyMessage,
    bottomRef,
    textareaRef,
    sendMessage,
    handleInput,
    handleKeyDown,
    handleStop,
    clearChat,
  } = useChat();

  const {
    section,
    setSection,
    sidebarOpen,
    setSidebarOpen,
    settings,
    history,
    setHistory,
    showInstall,
    setShowInstall,
    handleInstall,
    isDesktop,
  } = useUi();

  const appRootRef = useRef(null);

  useEffect(() => {
    setHistory(MOCK_HISTORY_DATA[lang]);
  }, [lang, setHistory]);

  useEffect(() => {
    const syncVP = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const h = Math.round(vv.height);
        const top = Math.round(vv.offsetTop);
        // Direct DOM update — takes effect this frame, no React reconcile needed.
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
    // Always add window.resize as a fallback — some Facebook WebView builds
    // don't fire visualViewport events but do fire window resize.
    window.addEventListener("resize", syncVP);
    return () => {
      if (vv) {
        vv.removeEventListener("resize", syncVP);
        vv.removeEventListener("scroll", syncVP);
      }
      window.removeEventListener("resize", syncVP);
    };
  }, []);

  // ── Global CSS ────────────────────────────────────────────
  const css = useMemo(
    () => `
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600&family=Cinzel:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${theme.scrollbar};border-radius:99px}
    @keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    /* Use a simple fade for message updates to avoid vertical "shaking" when content streams */
    .msg-row{animation:fadeIn .18s ease forwards}
    .sidebar-item{transition:background .18s,color .18s}
    .sidebar-item:hover{background:${theme.accentBgHov}}
    .send-btn{transition:background .18s,transform .12s}
    .send-btn:hover{transform:scale(1.06)}
    .send-btn:active{transform:scale(.94)}
    .overlay{animation:fadeIn .2s ease}
    .hist-item{transition:background .15s;cursor:pointer}
    .hist-item:hover{background:${theme.bgHov}}
    .quick-chip{transition:background .15s,border-color .15s;cursor:pointer}
    .quick-chip:hover{background:${theme.accentBg};border-color:${theme.accent};color:${theme.accent}}
    textarea:focus{outline:none}
    textarea{resize:none}
    .toggle-switch{position:relative;display:inline-block;width:40px;height:22px}
    .toggle-switch input{opacity:0;width:0;height:0}
    .toggle-slider{position:absolute;inset:0;cursor:pointer;background:${theme.border};border-radius:22px;transition:.3s;border:1px solid ${theme.borderMed}}
    .toggle-slider:before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;left:3px;bottom:3px;background:${theme.textSec};transition:.3s}
    .toggle-switch input:checked+.toggle-slider{background:${theme.accent};border-color:${theme.accent}}
    .toggle-switch input:checked+.toggle-slider:before{transform:translateX(18px);background:white}
    @media(min-width:768px){.desktop-only{display:flex !important}.mobile-only{display:none !important}}
    `,
    [dark, lang, theme.scrollbar],
  );

  const handleFocus = () => {
    // Facebook WebView: keyboard appearance often doesn't fire visualViewport/resize
    // events reliably, or fires them mid-animation with partial height.
    // Poll the viewport at several intervals until it stabilises.
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
        if (appRootRef.current) {
          appRootRef.current.style.height = `${h}px`;
        }
      }
    };
    // Run immediately, then at 100 / 300 / 600 ms to catch slow keyboard animations.
    poll();
    [100, 300, 600].forEach((ms) => setTimeout(poll, ms));
  };

  const navItems = [
    { id: "chat", key: "chat", Icon: Icons.Chat },
    { id: "prayer", key: "prayerTitle", Icon: Icons.Prayer },
    { id: "dua", key: "dua", Icon: Icons.Book },
    // { id: "history", key: "history", Icon: Icons.History },
    { id: "about", Icon: Icons.Info, key: "about" },
    { id: "settings", key: "settings", Icon: Icons.Settings },
  ];

  const PrayerSection = () => {
    const [prayerData, setPrayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [now, setNow] = useState(new Date());
    const [countdown, setCountdown] = useState("");
    const [clockMode, setClockMode] = useState("digital"); // "digital" | "analog"
    const [madhab, setMadhab] = useState(settings?.madhab ?? "standard"); // local override

    const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    const PRAYER_ICONS = {
      Fajr: "pi pi-star",
      Sunrise: "pi pi-sun",
      Dhuhr: "pi pi-circle-fill",
      Asr: "pi pi-clock",
      Maghrib: "pi pi-palette",
      Isha: "pi pi-moon",
    };

    // ── Tick every second ───────────────────────────────────────────────────────
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const [rawData, setRawData] = useState(null); // cache full API response

    const fetchPrayers = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("https://islamic-chatbot-lac.vercel.app/api/v1/chat/prayer-times");
        const json = await res.json();
        const entry = json.data[0];
        setRawData(entry); // cache both madhab entries
        const idx = madhab === "hanafi" ? "1" : "0";
        setPrayerData(entry[idx].data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch only once on mount
    useEffect(() => {
      fetchPrayers();
    }, []);

    // Switch data locally when madhab changes — no refetch
    useEffect(() => {
      if (!rawData) return;
      const idx = madhab === "hanafi" ? "1" : "0";
      setPrayerData(rawData[idx].data);
    }, [madhab, rawData]);

    // ── Countdown ────────────────────────────────────────────────────────────────
    useEffect(() => {
      if (!prayerData) return;
      const toDate = (str) => {
        const [h, m] = str.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };
      const times = PRAYER_KEYS.map((k) => ({
        key: k,
        date: toDate(prayerData.timings[k]),
      }));
      const future = times.filter((t) => t.date > new Date());
      const next = future.length ? future[0] : times[0];
      const diff = next.date - new Date();
      const totalSec = Math.max(0, Math.floor(diff / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, [now, prayerData]);

    // ── Helpers ──────────────────────────────────────────────────────────────────
    const formatTime = (time24) => {
      if (!time24) return "";
      const [hourStr, minuteStr] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const minute = minuteStr ?? "00";
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${period}`;
    };

    const getStatus = (key, timings) => {
      const toDate = (str) => {
        const [h, m] = str.split(":").map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return d;
      };
      const times = PRAYER_KEYS.map((k) => ({ key: k, date: toDate(timings[k]) }));
      const future = times.filter((t) => t.date > now);
      const next = future.length ? future[0] : times[0];
      const prev = times.filter((t) => t.date <= now);
      const current = prev.length ? prev[prev.length - 1] : null;
      if (current && current.key === key) return "current";
      if (next.key === key) return "next";
      return "done";
    };

    // ── Analog Clock (pure SVG — no extra library needed) ───────────────────────
    const AnalogClock = ({ date }) => {
      const size = 180;
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2 - 10;

      const sec = date.getSeconds();
      const min = date.getMinutes();
      const hr = date.getHours() % 12;

      const toRad = (deg) => (deg - 90) * (Math.PI / 180);
      const hand = (angle, length, width, color) => {
        const rad = toRad(angle);
        const x2 = cx + length * Math.cos(rad);
        const y2 = cy + length * Math.sin(rad);
        return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />;
      };

      const hrAngle = (hr + min / 60) * 30;
      const minAngle = (min + sec / 60) * 6;
      const secAngle = sec * 6;

      const ticks = Array.from({ length: 60 }, (_, i) => {
        const isMajor = i % 5 === 0;
        const rad = toRad(i * 6);
        const outer = r;
        const inner = r - (isMajor ? 10 : 5);
        return (
          <line
            key={i}
            x1={cx + outer * Math.cos(rad)}
            y1={cy + outer * Math.sin(rad)}
            x2={cx + inner * Math.cos(rad)}
            y2={cy + inner * Math.sin(rad)}
            stroke={isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
            strokeWidth={isMajor ? 2 : 1}
          />
        );
      });

      return (
        <svg width={size} height={size} style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}>
          {/* Face */}
          <circle cx={cx} cy={cy} r={r} fill="#0d2e27" stroke="rgba(110,231,183,0.3)" strokeWidth={2} />
          {/* Ticks */}
          {ticks}
          {/* Hour numbers */}
          {[12, 3, 6, 9].map((n, i) => {
            const angle = (i * 90 - 90) * (Math.PI / 180);
            return (
              <text
                key={n}
                x={cx + (r - 22) * Math.cos(angle)}
                y={cy + (r - 22) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize={11}
                fontFamily="DM Mono, monospace"
              >
                {n}
              </text>
            );
          })}
          {/* Hands */}
          {hand(hrAngle, r * 0.5, 4, "white")}
          {hand(minAngle, r * 0.7, 3, "rgba(110,231,183,1)")}
          {hand(secAngle, r * 0.82, 1.5, "#f59e0b")}
          {/* Center cap */}
          <circle cx={cx} cy={cy} r={5} fill="#6ee7b7" />
        </svg>
      );
    };

    // ── Digital Clock display ────────────────────────────────────────────────────
    const DigitalClock = ({ date }) => {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      const period = date.getHours() >= 12 ? "PM" : "AM";
      const h12 = date.getHours() % 12 || 12;
      return (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              fontFamily: "DM Mono, monospace",
              color: "white",
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            {String(h12).padStart(2, "0")}
            <span style={{ color: "#6ee7b7", animation: "blink 1s step-end infinite" }}>:</span>
            {mm}
            <span style={{ color: "#6ee7b7", animation: "blink 1s step-end infinite" }}>:</span>
            {ss}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: 3 }}>
            {period} · {date.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
        </div>
      );
    };

    // ── Madhab Dropdown ──────────────────────────────────────────────────────────
    const MadhabDropdown = () => (
      <div style={{ position: "relative", display: "inline-block" }}>
        <select
          value={madhab}
          onChange={(e) => setMadhab(e.target.value)}
          style={{
            appearance: "none",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(110,231,183,0.3)",
            borderRadius: 99,
            color: "white",
            fontSize: 12,
            fontFamily: "DM Mono, monospace",
            padding: "6px 32px 6px 14px",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            outline: "none",
          }}
        >
          <option value="standard" style={{ background: "#0d2e27" }}>
            Standard
          </option>
          <option value="hanafi" style={{ background: "#0d2e27" }}>
            Hanafi
          </option>
        </select>
        <i
          className="pi pi-chevron-down"
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10,
            color: "#6ee7b7",
            pointerEvents: "none",
          }}
        />
      </div>
    );

    // ── Clock Mode Tab ───────────────────────────────────────────────────────────
    const ClockTabs = () => (
      <div
        style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          padding: 3,
          gap: 2,
        }}
      >
        {["digital", "analog"].map((mode) => (
          <button
            key={mode}
            onClick={() => setClockMode(mode)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "capitalize",
              background: clockMode === mode ? "#6ee7b7" : "transparent",
              color: clockMode === mode ? "#0d2e27" : "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
          >
            {mode === "digital" ? "⏱ Digital" : "🕐 Analog"}
          </button>
        ))}
      </div>
    );

    const madhabItems = [
      { label: "Standard", icon: "pi pi-globe" },
      { label: "Hanafi", icon: "pi pi-star" },
    ];

    const [activeMadhabIndex, setActiveMadhabIndex] = useState(madhab === "hanafi" ? 1 : 0);

    const MadhabTabs = () => (
      <div
        style={{
          display: "inline-flex",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99,
          padding: 3,
          gap: 2,
        }}
      >
        {[
          { label: "🌍 Standard", value: "standard" },
          { label: "☪️ Hanafi", value: "hanafi" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setMadhab(opt.value)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              fontWeight: 600,
              letterSpacing: 0.5,
              background: madhab === opt.value ? "#6ee7b7" : "transparent",
              color: madhab === opt.value ? "#0d2e27" : "rgba(255,255,255,0.6)",
              transition: "all 0.2s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );

    // ── Render guards ────────────────────────────────────────────────────────────
    const prayerNames = t("prayerNames");

    if (loading)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: theme.textSec,
            fontSize: 14,
          }}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: 22, marginRight: 10, color: theme.accent }} />
          {t("prayerLoading")}
        </div>
      );

    if (error)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 14,
          }}
        >
          <i className="pi pi-exclamation-circle" style={{ fontSize: 32, color: "#e74c3c" }} />
          <p style={{ color: theme.textSec, fontSize: 14 }}>{t("prayerError")}</p>
          <button
            onClick={fetchPrayers}
            style={{
              padding: "8px 20px",
              borderRadius: 99,
              background: theme.accent,
              border: "none",
              color: "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t("prayerRetry")}
          </button>
        </div>
      );

    const { timings, date } = prayerData;

    // ── Main render ──────────────────────────────────────────────────────────────
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* ── Date / Clock card ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a6b5a, #0d4a3e)",
            borderRadius: 16,
            padding: "24px 20px",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <IslamicPattern dark={true} />

          {/* Top row: Madhab selector left, Clock tabs right */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MadhabTabs />
            <ClockTabs />
          </div>

          {/* Clock display */}
          <div
            style={{
              position: "relative",
              marginBottom: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
            }}
          >
            {clockMode === "digital" ? <DigitalClock date={now} /> : <AnalogClock date={now} />}
          </div>

          {/* Hijri date */}
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", marginBottom: 6, letterSpacing: 0.5 }}>
              {date.gregorian.weekday.en} · {date.readable}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "white",
                fontFamily: "Cinzel, serif",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              {date.hijri.day} {date.hijri.month.en} {date.hijri.year} AH
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>
              {date.hijri.month.ar} · {date.hijri.weekday.ar}
            </div>

            {/* Countdown */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 99,
                padding: "8px 20px",
                backdropFilter: "blur(6px)",
              }}
            >
              <i className="pi pi-hourglass" style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginRight: 4 }}>{t("nextPrayer")}</span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  fontFamily: "DM Mono, monospace",
                  letterSpacing: 2,
                }}
              >
                {countdown}
              </span>
            </div>
          </div>
        </div>

        {/* ── Prayer time cards ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PRAYER_KEYS.map((key) => {
            const status = getStatus(key, timings);
            const isCurrent = status === "current";
            const isNext = status === "next";

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1px solid ${isCurrent ? theme.accent : isNext ? theme.borderMed : theme.border}`,
                  background: isCurrent ? theme.accentBg : theme.bgSec,
                  transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isCurrent ? theme.accent : isNext ? theme.accentBg : theme.bgTer,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={PRAYER_ICONS[key]}
                      style={{ fontSize: 16, color: isCurrent ? "white" : isNext ? theme.accent : theme.textTer }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isCurrent ? theme.accent : theme.text }}>
                      {prayerNames[key]}
                    </div>
                    <div style={{ fontSize: 11.5, color: theme.textTer }}>{key}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {(isCurrent || isNext) && (
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: 99,
                        background: isCurrent ? theme.accent : theme.accentBg,
                        color: isCurrent ? "white" : theme.accent,
                      }}
                    >
                      {isCurrent ? t("currentPrayer") : t("nextPrayer")}
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: isCurrent ? theme.accent : theme.text,
                      fontFamily: "DM Mono, monospace",
                      letterSpacing: 0.5,
                    }}
                  >
                    {formatTime(timings[key])}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DUA_DATA = [
    {
      id: 1,
      cat: "morning",
      icon: "🌅",
      color: "accent",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      transliteration: "Alhamdulillahil-ladhi ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor",
      source: "Bukhari",
      en: {
        name: "Upon Waking",
        sub: "Start of the day",
        meaning: "All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.",
      },
      bn: {
        name: "ঘুম থেকে জাগার দোয়া",
        sub: "দিনের শুরু",
        meaning: "সমস্ত প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করলেন এবং তাঁর কাছেই পুনরুত্থান।",
      },
    },
    {
      id: 2,
      cat: "morning",
      icon: "🛡️",
      color: "purple",
      arabic:
        "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      transliteration:
        "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim",
      source: "Abu Dawud",
      en: {
        name: "Morning Protection",
        sub: "Seeking Allah's protection",
        meaning:
          "In the name of Allah, with whose name nothing is harmed on earth or in the heavens, and He is the All-Hearing, All-Knowing.",
      },
      bn: {
        name: "সকালের সুরক্ষার দোয়া",
        sub: "আল্লাহর সুরক্ষা চাওয়া",
        meaning: "আল্লাহর নামে, যার নামের সাথে পৃথিবী বা আকাশে কিছুই ক্ষতি করতে পারে না। তিনি সর্বশ্রোতা, সর্বজ্ঞ।",
      },
    },
    {
      id: 3,
      cat: "morning",
      icon: "☀️",
      color: "amber",
      arabic:
        "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration:
        "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
      source: "Muslim",
      en: {
        name: "Morning Remembrance",
        sub: "Praise at dawn",
        meaning:
          "We have reached the morning, and sovereignty belongs to Allah. Praise is for Allah. None is worthy of worship except Allah alone, no partner has He. His is the dominion, His is the praise, and He is able to do all things.",
      },
      bn: {
        name: "সকালের জিকির",
        sub: "ফজরের সময়",
        meaning:
          "আমরা সকালে পৌঁছেছি এবং রাজত্ব আল্লাহর। প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো মাবুদ নেই, তিনি একা, তাঁর কোনো অংশীদার নেই। রাজত্ব তাঁর, প্রশংসা তাঁর, তিনি সর্বশক্তিমান।",
      },
    },
    {
      id: 4,
      cat: "evening",
      icon: "🌇",
      color: "amber",
      arabic:
        "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration:
        "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
      source: "Muslim",
      en: {
        name: "At Sunset",
        sub: "Evening remembrance",
        meaning:
          "We have reached the evening, and sovereignty belongs to Allah. Praise is for Allah. None is worthy of worship except Allah alone, no partner has He. His is the dominion, His is the praise, and He is able to do all things.",
      },
      bn: {
        name: "সন্ধ্যার দোয়া",
        sub: "সন্ধ্যার জিকির",
        meaning:
          "আমরা সন্ধ্যায় পৌঁছেছি এবং রাজত্ব আল্লাহর। প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো মাবুদ নেই, তিনি একা, তাঁর কোনো অংশীদার নেই। রাজত্ব তাঁর, প্রশংসা তাঁর, তিনি সর্বশক্তিমান।",
      },
    },
    {
      id: 5,
      cat: "evening",
      icon: "🌃",
      color: "blue",
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
      transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
      source: "Tirmidhi",
      en: {
        name: "Evening Remembrance",
        sub: "Nightly dua",
        meaning:
          "O Allah, by You we enter the evening and by You we enter the morning. By You we live and by You we die, and to You is the final return.",
      },
      bn: {
        name: "রাতের স্মরণ",
        sub: "রাতের দোয়া",
        meaning:
          "হে আল্লাহ, তোমার মাধ্যমে আমরা সন্ধ্যায় পৌঁছাই ও সকালে পৌঁছাই, তোমার মাধ্যমে বাঁচি ও মরি, এবং তোমার কাছেই প্রত্যাবর্তন।",
      },
    },
    {
      id: 6,
      cat: "prayer",
      icon: "🕌",
      color: "accent",
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      transliteration: "Allahummaf-tah li abwaba rahmatik",
      source: "Muslim",
      en: {
        name: "Entering the Masjid",
        sub: "Before prayer",
        meaning: "O Allah, open for me the gates of Your mercy.",
      },
      bn: {
        name: "মসজিদে প্রবেশের দোয়া",
        sub: "নামাজের আগে",
        meaning: "হে আল্লাহ, আমার জন্য তোমার রহমতের দরজা খুলে দাও।",
      },
    },
    {
      id: 7,
      cat: "prayer",
      icon: "🚶",
      color: "blue",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      transliteration: "Allahumma inni as'aluka min fadlik",
      source: "Ibn Majah",
      en: {
        name: "Leaving the Masjid",
        sub: "After prayer",
        meaning: "O Allah, I ask You of Your bounty.",
      },
      bn: {
        name: "মসজিদ থেকে বের হওয়ার দোয়া",
        sub: "নামাজের পরে",
        meaning: "হে আল্লাহ, আমি তোমার অনুগ্রহ চাই।",
      },
    },
    {
      id: 8,
      cat: "prayer",
      icon: "🤲",
      color: "purple",
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْهَرَمِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ",
      transliteration:
        "Allahumma inni a'udhu bika minal-'ajzi wal-kasali wal-jubni wal-harami wal-bukhli, wa a'udhu bika min 'adhabil-qabri wa min fitnatil-mahya wal-mamat",
      source: "Bukhari",
      en: {
        name: "After Salah",
        sub: "Post-prayer supplication",
        meaning:
          "O Allah, I seek refuge in You from incapacity, laziness, cowardice, senility, and miserliness. And I seek refuge in You from the punishment of the grave and the trials of life and death.",
      },
      bn: {
        name: "নামাজের পরের দোয়া",
        sub: "সালাতের পর",
        meaning:
          "হে আল্লাহ, আমি অক্ষমতা, অলসতা, কাপুরুষতা, বার্ধক্য ও কৃপণতা থেকে আশ্রয় চাই। এবং কবরের আজাব ও জীবন-মৃত্যুর ফিতনা থেকে আশ্রয় চাই।",
      },
    },
    {
      id: 9,
      cat: "food",
      icon: "🍽️",
      color: "coral",
      arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
      transliteration: "Bismillahi wa 'ala barakatillah",
      source: "Abu Dawud",
      en: {
        name: "Before Eating",
        sub: "Bismillah dua",
        meaning: "In the name of Allah and with the blessings of Allah.",
      },
      bn: {
        name: "খাওয়ার আগের দোয়া",
        sub: "বিসমিল্লাহ",
        meaning: "আল্লাহর নামে এবং আল্লাহর বরকতে।",
      },
    },
    {
      id: 10,
      cat: "food",
      icon: "✅",
      color: "accent",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
      transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alna muslimin",
      source: "Abu Dawud",
      en: {
        name: "After Eating",
        sub: "Gratitude for food",
        meaning: "Praise be to Allah who fed us, gave us drink, and made us Muslims.",
      },
      bn: {
        name: "খাওয়ার পরের দোয়া",
        sub: "খাবারের কৃতজ্ঞতা",
        meaning: "সেই আল্লাহর প্রশংসা যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।",
      },
    },
    {
      id: 11,
      cat: "food",
      icon: "🫙",
      color: "amber",
      arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ",
      transliteration: "Allahumma barik lana fihi wa at'imna khayran minh",
      source: "Tirmidhi",
      en: {
        name: "After Drinking Milk",
        sub: "Milk dua",
        meaning: "O Allah, bless us in it and grant us more of it.",
      },
      bn: {
        name: "দুধ পানের পর দোয়া",
        sub: "দুধ পানের সময়",
        meaning: "হে আল্লাহ, এতে আমাদের বরকত দাও এবং এর চেয়ে উত্তম দাও।",
      },
    },
    {
      id: 12,
      cat: "travel",
      icon: "✈️",
      color: "blue",
      arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Bismillahi tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah",
      source: "Abu Dawud",
      en: {
        name: "Leaving Home",
        sub: "Start of journey",
        meaning:
          "In the name of Allah, I place my trust in Allah, and there is no power or strength except through Allah.",
      },
      bn: {
        name: "বাড়ি থেকে বের হওয়ার দোয়া",
        sub: "সফরের শুরুতে",
        meaning: "আল্লাহর নামে, আল্লাহর উপর ভরসা করলাম। আল্লাহ ছাড়া কোনো শক্তি ও ক্ষমতা নেই।",
      },
    },
    {
      id: 13,
      cat: "travel",
      icon: "🚗",
      color: "purple",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      transliteration:
        "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
      source: "Quran 43:13-14",
      en: {
        name: "Boarding a Vehicle",
        sub: "Transport dua",
        meaning:
          "Glory to Him who subjected this to us; we were not capable of it on our own, and indeed to our Lord we will surely return.",
      },
      bn: {
        name: "যানবাহনে ওঠার দোয়া",
        sub: "গাড়িতে ওঠার সময়",
        meaning: "পবিত্র তিনি যিনি এটি আমাদের অধীন করেছেন, আমরা এর যোগ্য ছিলাম না। নিশ্চয়ই আমরা রবের কাছে ফিরে যাব।",
      },
    },
    {
      id: 14,
      cat: "travel",
      icon: "🏠",
      color: "accent",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      transliteration:
        "Allahumma inni as'aluka khayral-mawlaji wa khayral-makhraji, bismillahi walajnaa wa bismillahi kharajnaa wa 'alallahi rabbina tawakkalna",
      source: "Abu Dawud",
      en: {
        name: "Entering the Home",
        sub: "Coming home",
        meaning:
          "O Allah, I ask You for the good of entry and the good of exit. In the name of Allah we have entered, in the name of Allah we have left, and upon Allah our Lord we rely.",
      },
      bn: {
        name: "বাড়িতে প্রবেশের দোয়া",
        sub: "ঘরে ঢোকার সময়",
        meaning:
          "হে আল্লাহ, আমি প্রবেশ ও বের হওয়ার কল্যাণ চাই। আল্লাহর নামে প্রবেশ করলাম, আল্লাহর নামে বের হলাম এবং আল্লাহর উপর ভরসা করলাম।",
      },
    },
    {
      id: 15,
      cat: "distress",
      icon: "🤲",
      color: "pink",
      arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
      transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
      source: "Quran 21:87",
      en: {
        name: "Dua of Yunus (AS)",
        sub: "Relief from anxiety",
        meaning: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      },
      bn: {
        name: "ইউনুস (আ)-এর দোয়া",
        sub: "উদ্বেগ থেকে মুক্তির দোয়া",
        meaning: "তুমি ছাড়া কোনো মাবুদ নেই, তুমি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।",
      },
    },
    {
      id: 16,
      cat: "distress",
      icon: "⚖️",
      color: "amber",
      arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
      transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
      source: "Quran 2:250",
      en: {
        name: "Dua for Patience",
        sub: "In times of difficulty",
        meaning:
          "Our Lord! Shower us with perseverance, make our steps firm, and give us victory over the disbelieving people.",
      },
      bn: {
        name: "ধৈর্যের দোয়া",
        sub: "কঠিন সময়ে",
        meaning:
          "হে আমাদের রব! আমাদের উপর ধৈর্য ঢেলে দাও, আমাদের পা স্থির রাখো এবং কাফেরদের বিরুদ্ধে আমাদের সাহায্য করো।",
      },
    },
    {
      id: 17,
      cat: "distress",
      icon: "💙",
      color: "blue",
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      transliteration: "Hasbunallahu wa ni'mal-wakil",
      source: "Quran 3:173",
      en: {
        name: "In Time of Fear",
        sub: "Complete trust in Allah",
        meaning: "Allah is sufficient for us, and He is the best Disposer of affairs.",
      },
      bn: {
        name: "ভয়ের সময়ের দোয়া",
        sub: "আল্লাহর উপর পূর্ণ আস্থা",
        meaning: "আল্লাহই আমাদের জন্য যথেষ্ট, তিনিই সর্বোত্তম কার্যনির্বাহী।",
      },
    },
    {
      id: 18,
      cat: "sleep",
      icon: "🌙",
      color: "purple",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismikal-lahumma amutu wa ahya",
      source: "Bukhari",
      en: {
        name: "Before Sleeping",
        sub: "Night protection",
        meaning: "In Your name, O Allah, I die and I live.",
      },
      bn: {
        name: "ঘুমানোর আগের দোয়া",
        sub: "রাতের সুরক্ষা",
        meaning: "হে আল্লাহ, তোমার নামেই আমি মরি এবং বাঁচি।",
      },
    },
    {
      id: 19,
      cat: "sleep",
      icon: "🌌",
      color: "blue",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
      source: "Abu Dawud",
      en: {
        name: "Before Sleeping (2)",
        sub: "Protection on Judgment Day",
        meaning: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      },
      bn: {
        name: "ঘুমানোর আগের দোয়া (২)",
        sub: "কিয়ামতের আজাব থেকে সুরক্ষা",
        meaning: "হে আল্লাহ, যেদিন তুমি বান্দাদের পুনরুত্থিত করবে, সেদিন তোমার আজাব থেকে রক্ষা করো।",
      },
    },
    {
      id: 20,
      cat: "sleep",
      icon: "⭐",
      color: "amber",
      arabic:
        "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ وَوَجَّهْتُ وَجْهِي إِلَيْكَ وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ رَغْبَةً وَرَهْبَةً إِلَيْكَ لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
      transliteration:
        "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bikitabikal-ladhi anzalt, wa binabiyyikal-ladhi arsalt",
      source: "Bukhari",
      en: {
        name: "Sleeping Dua (Full)",
        sub: "Complete surrender to Allah",
        meaning:
          "O Allah, I submit myself to You, entrust my affairs to You, turn my face toward You, and lay myself against You out of hope and fear of You. There is no refuge or escape from You except to You. I believe in Your Book which You revealed and in Your Prophet whom You sent.",
      },
      bn: {
        name: "ঘুমানোর পূর্ণ দোয়া",
        sub: "আল্লাহর কাছে সম্পূর্ণ আত্মসমর্পণ",
        meaning:
          "হে আল্লাহ, আমি আমার নফসকে তোমার কাছে সমর্পণ করলাম, আমার বিষয় তোমার হাতে দিলাম, তোমার দিকে মুখ ফেরালাম, তোমার উপর হেলান দিলাম, আশা ও ভয়ে। তোমার থেকে কোনো আশ্রয় বা মুক্তি নেই, তুমি ছাড়া। আমি তোমার নাজিলকৃত কিতাব ও প্রেরিত নবীতে ঈমান আনলাম।",
      },
    },
    {
      id: 21,
      cat: "forgiveness",
      icon: "💚",
      color: "accent",
      arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      transliteration: "Astaghfirullaha al-'adhim al-ladhi la ilaha illa huwal-hayyul-qayyum wa atubu ilayh",
      source: "Tirmidhi",
      en: {
        name: "Seeking Forgiveness",
        sub: "Istighfar",
        meaning:
          "I seek forgiveness from Allah the Magnificent, besides whom there is no deity, the Ever-Living, the Sustainer of all, and I turn to Him in repentance.",
      },
      bn: {
        name: "ক্ষমা প্রার্থনার দোয়া",
        sub: "ইস্তেগফার",
        meaning: "আমি মহান আল্লাহর কাছে ক্ষমা চাই, যিনি চিরঞ্জীব, সর্বস্থায়ী। আমি তাঁর কাছে তওবা করছি।",
      },
    },
    {
      id: 22,
      cat: "forgiveness",
      icon: "🌿",
      color: "coral",
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      transliteration:
        "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya wa abu'u bidhanbi faghfir li fa'innahu la yaghfirudh-dhunuba illa ant",
      source: "Bukhari",
      en: {
        name: "Sayyidul Istighfar",
        sub: "Master of forgiveness duas",
        meaning:
          "O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant. I uphold Your covenant to the best of my ability. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
      },
      bn: {
        name: "সাইয়্যেদুল ইস্তেগফার",
        sub: "ক্ষমার সেরা দোয়া",
        meaning:
          "হে আল্লাহ, তুমি আমার রব। তুমি ছাড়া কোনো মাবুদ নেই। তুমি আমাকে সৃষ্টি করেছো এবং আমি তোমার বান্দা। আমি সাধ্যমতো তোমার অঙ্গীকারে অবিচল। আমার কৃতকর্মের অনিষ্ট থেকে আশ্রয় চাই। তোমার নেয়ামত স্বীকার করছি এবং গুনাহ স্বীকার করছি, তাই ক্ষমা করো, কারণ তুমি ছাড়া কেউ গুনাহ মাফ করে না।",
      },
    },
    {
      id: 23,
      cat: "forgiveness",
      icon: "🕊️",
      color: "blue",
      arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
      transliteration: "Rabbana zalamna anfusana wa illam taghfir lana wa tarhamna lanakunanna minal-khassirin",
      source: "Quran 7:23",
      en: {
        name: "Dua of Adam (AS)",
        sub: "Repentance",
        meaning:
          "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
      },
      bn: {
        name: "আদম (আ)-এর দোয়া",
        sub: "তওবার দোয়া",
        meaning:
          "হে আমাদের রব, আমরা নিজেদের উপর জুলুম করেছি। যদি তুমি আমাদের ক্ষমা না করো এবং দয়া না করো, তাহলে আমরা ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।",
      },
    },
    // ── HAJJ ──────────────────────────────────────────────────────────────────
    {
      id: 24,
      cat: "hajj",
      icon: "🕋",
      color: "accent",
      arabic:
        "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ",
      transliteration:
        "Labbayk Allahumma labbayk, labbayk la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak",
      source: "Bukhari & Muslim",
      en: {
        name: "Talbiyah",
        sub: "The pilgrim's chant",
        meaning:
          "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace, and sovereignty belong to You. You have no partner.",
      },
      bn: {
        name: "তালবিয়া",
        sub: "হাজীর আহবান",
        meaning:
          "হাজির হে আল্লাহ, হাজির। হাজির, তোমার কোনো অংশীদার নেই, হাজির। নিশ্চয়ই সকল প্রশংসা, নেয়ামত ও রাজত্ব তোমার। তোমার কোনো অংশীদার নেই।",
      },
    },
    {
      id: 25,
      cat: "hajj",
      icon: "🔄",
      color: "blue",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaaban-nar",
      source: "Quran 2:201",
      en: {
        name: "During Tawaf",
        sub: "While circling the Kaaba",
        meaning:
          "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
      },
      bn: {
        name: "তাওয়াফের দোয়া",
        sub: "কাবা প্রদক্ষিণকালে",
        meaning: "হে আমাদের রব, দুনিয়ায় কল্যাণ দাও এবং আখিরাতে কল্যাণ দাও এবং জাহান্নামের আজাব থেকে রক্ষা করো।",
      },
    },
    {
      id: 26,
      cat: "hajj",
      icon: "⬛",
      color: "purple",
      arabic:
        "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
      transliteration:
        "Bismillahi wallahu akbar, Allahumma imanan bika wa tasdiqan bikitabika wa wafa'an bi'ahdika wat-tiba'an lisunnati nabiyyika Muhammadin sallallahu 'alayhi wasallam",
      source: "Ahmad",
      en: {
        name: "Touching the Black Stone",
        sub: "Istilam — Hajar al-Aswad",
        meaning:
          "In the name of Allah, and Allah is the Greatest. O Allah, out of faith in You, belief in Your Book, fulfillment of Your covenant, and following the Sunnah of Your Prophet Muhammad (PBUH).",
      },
      bn: {
        name: "হাজরে আসওয়াদ স্পর্শের দোয়া",
        sub: "ইস্তিলাম",
        meaning:
          "আল্লাহর নামে, আল্লাহ মহান। হে আল্লাহ, তোমার উপর ঈমান, তোমার কিতাবের সত্যায়ন, তোমার অঙ্গীকার পালন এবং তোমার নবী মুহাম্মাদ (সা.)-এর সুন্নাহ অনুসরণের উদ্দেশ্যে।",
      },
    },
    {
      id: 27,
      cat: "hajj",
      icon: "🏔️",
      color: "amber",
      arabic:
        "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
      transliteration:
        "Allahu akbar, Allahu akbar, Allahu akbar, la ilaha illallahu wallahu akbar, Allahu akbar wa lillahil-hamd",
      source: "Ibn Majah",
      en: {
        name: "On Safa & Marwa",
        sub: "During Sa'i",
        meaning:
          "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. None has the right to be worshipped except Allah and Allah is the Greatest. Allah is the Greatest and all praise belongs to Allah.",
      },
      bn: {
        name: "সাফা-মারওয়ায় দোয়া",
        sub: "সাঈ-এর সময়",
        meaning:
          "আল্লাহ মহান, আল্লাহ মহান, আল্লাহ মহান। আল্লাহ ছাড়া কোনো মাবুদ নেই এবং আল্লাহ মহান। আল্লাহ মহান এবং সকল প্রশংসা আল্লাহর।",
      },
    },
    {
      id: 28,
      cat: "hajj",
      icon: "⛰️",
      color: "coral",
      arabic:
        "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ اللَّهُمَّ اهْدِنِي بِالْهُدَى وَتَقَبَّلْ مِنِّي وَاغْفِرْ لِي وَارْحَمْنِي",
      transliteration:
        "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir, Allahummahdini bilhuda wa taqabbal minni waghfir li warhamni",
      source: "Ibn Majah",
      en: {
        name: "On Mount Arafat",
        sub: "Day of Arafah — Wuquf",
        meaning:
          "None has the right to be worshipped except Allah alone, with no partner. His is the dominion, His is the praise, and He is over all things Omnipotent. O Allah, guide me with guidance, accept from me, forgive me, and have mercy on me.",
      },
      bn: {
        name: "আরাফাতের দোয়া",
        sub: "আরাফার দিন — উকুফ",
        meaning:
          "আল্লাহ ছাড়া কোনো মাবুদ নেই, তিনি একা, তাঁর কোনো অংশীদার নেই। রাজত্ব তাঁর, প্রশংসা তাঁর, তিনি সর্বশক্তিমান। হে আল্লাহ, আমাকে হেদায়েত দাও, আমার থেকে কবুল করো, ক্ষমা করো এবং রহম করো।",
      },
    },
    {
      id: 29,
      cat: "hajj",
      icon: "🌊",
      color: "accent",
      arabic:
        "اللَّهُمَّ إِنَّكَ قُلْتَ وَقَوْلُكَ الْحَقُّ ادْعُونِي أَسْتَجِبْ لَكُمْ وَإِنَّكَ لَا تُخْلِفُ الْمِيعَادَ",
      transliteration:
        "Allahumma innaka qulta wa qawlukal-haqq, 'ud'uni astajib lakum', wa innaka la tukhlifu al-mi'ad",
      source: "Ibn Abi Shaybah",
      en: {
        name: "At Zamzam Well",
        sub: "Drinking Zamzam water",
        meaning:
          "O Allah, You have said, and Your word is true: 'Call upon Me, I will respond to you.' And indeed You do not break Your promise.",
      },
      bn: {
        name: "জমজম কূপের দোয়া",
        sub: "জমজম পানি পানের সময়",
        meaning:
          "হে আল্লাহ, তুমি বলেছো এবং তোমার কথা সত্য: 'আমাকে ডাকো, আমি সাড়া দেব।' এবং নিশ্চয়ই তুমি প্রতিশ্রুতি ভঙ্গ করো না।",
      },
    },
    {
      id: 30,
      cat: "hajj",
      icon: "🪨",
      color: "pink",
      arabic: "اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا",
      transliteration: "Allahummaj'alhu hajjan mabruran wa dhanban maghfuran wa sa'yan mashkura",
      source: "Ibn Majah",
      en: {
        name: "Stoning Jamarat",
        sub: "Rami — throwing pebbles",
        meaning: "O Allah, make it an accepted Hajj, a forgiven sin, and an appreciated effort.",
      },
      bn: {
        name: "জামারাতে পাথর নিক্ষেপের দোয়া",
        sub: "রমি — পাথর ছোড়ার সময়",
        meaning: "হে আল্লাহ, এটিকে মাবরুর হজ, মাফকৃত গুনাহ এবং কবুলকৃত প্রচেষ্টা বানিয়ে দাও।",
      },
    },
    {
      id: 31,
      cat: "hajj",
      icon: "✂️",
      color: "blue",
      arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي",
      transliteration: "Allahummaghfir li warhamni wahdini warzuqni",
      source: "Muslim",
      en: {
        name: "After Halq/Taqsir",
        sub: "After shaving or cutting hair",
        meaning: "O Allah, forgive me, have mercy on me, guide me, and provide for me.",
      },
      bn: {
        name: "মাথা মুণ্ডন বা চুল কাটার দোয়া",
        sub: "হলক বা তাকসিরের পর",
        meaning: "হে আল্লাহ, আমাকে ক্ষমা করো, রহম করো, হেদায়েত দাও এবং রিজিক দাও।",
      },
    },
  ];

  const DUA_CATEGORIES = [
    { key: "all", en: "All Duas", bn: "সব দোয়া", tk: "duaCatAll" },
    { key: "morning", en: "Morning", bn: "সকাল", tk: "duaCatMorning" },
    { key: "evening", en: "Evening", bn: "সন্ধ্যা", tk: "duaCatEvening" },
    { key: "prayer", en: "Prayer", bn: "নামাজ", tk: "duaCatPrayer" },
    { key: "food", en: "Food", bn: "খাবার", tk: "duaCatFood" },
    { key: "travel", en: "Travel", bn: "সফর", tk: "duaCatTravel" },
    { key: "distress", en: "Distress", bn: "কষ্টে", tk: "duaCatDistress" },
    { key: "sleep", en: "Sleep", bn: "ঘুম", tk: "duaCatSleep" },
    { key: "forgiveness", en: "Forgiveness", bn: "ক্ষমা", tk: "duaCatForgive" },
    { key: "hajj", en: "Hajj", bn: "হজ্জ", tk: "duaCatHajj" },
  ];

  const duaColor = (colorKey, theme) => {
    const map = {
      accent: { bg: theme.accentBg, text: theme.accent },
      purple: { bg: "#EEEDFE", text: "#534AB7" },
      amber: { bg: "#FAEEDA", text: "#BA7517" },
      blue: { bg: "#E6F1FB", text: "#185FA5" },
      coral: { bg: "#FAECE7", text: "#993C1D" },
      pink: { bg: "#FBEAF0", text: "#993556" },
      teal: { bg: "#E1F5EE", text: "#0F6E56" },
      green: { bg: "#EAF3DE", text: "#3B6D11" },
    };
    return map[colorKey] || map.accent;
  };

  const DuaSection = () => {
    const [activeCat, setActiveCat] = React.useState("all");
    const [expandedId, setExpandedId] = React.useState(null);
    const [search, setSearch] = React.useState("");

    const L = lang; // "en" | "bn"  ← from your outer useState

    const filtered = React.useMemo(() => {
      const q = search.toLowerCase();
      return DUA_DATA.filter((d) => {
        const matchCat = activeCat === "all" || d.cat === activeCat;
        const matchSearch =
          !q ||
          d[L].name.toLowerCase().includes(q) ||
          d[L].meaning.toLowerCase().includes(q) ||
          d.transliteration.toLowerCase().includes(q);
        return matchCat && matchSearch;
      });
    }, [activeCat, search, L]);

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* ── Heading — mirrors SettingsSection exactly ── */}
        <h2
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: theme.text,
            marginBottom: 4,
            fontFamily: "Cinzel, serif",
          }}
        >
          {t("duaTitle")}
        </h2>
        <p style={{ fontSize: 12.5, color: theme.textSec, marginBottom: 16 }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

        {/* ── Search bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: theme.bgSec,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: "8px 12px",
            marginBottom: 14,
          }}
        >
          <span style={{ color: theme.textTer, display: "flex" }}>
            <Icons.Search />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("duaSearch")}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              color: theme.text,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.textTer,
                fontSize: 17,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* ── Category tabs — same pill style as your language buttons ── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: 2,
            marginBottom: 16,
          }}
        >
          {DUA_CATEGORIES.map(({ key, tk }) => {
            const isActive = activeCat === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveCat(key);
                  setExpandedId(null);
                }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${isActive ? theme.accent : theme.borderMed}`,
                  background: isActive ? theme.accentBg : "transparent",
                  color: isActive ? theme.accent : theme.textSec,
                  transition: "all .18s",
                }}
              >
                {t(tk)}
              </button>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: theme.bgSec,
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              padding: "32px 20px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 13, color: theme.textTer }}>{t("duaEmpty")}</span>
          </div>
        ) : (
          /* ── Dua cards — same structure as SettingsSection group cards ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((d) => {
              const isOpen = expandedId === d.id;
              const clr = duaColor(d.color, theme);
              const info = d[L];

              return (
                <div
                  key={d.id}
                  style={{
                    background: theme.bgSec,
                    borderRadius: 14,
                    border: `1px solid ${isOpen ? theme.accent : theme.border}`,
                    overflow: "hidden",
                    transition: "border-color .18s",
                  }}
                >
                  {/* Row header — identical layout to your settings rows */}
                  <div
                    onClick={() => setExpandedId(isOpen ? null : d.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "13px 16px",
                      cursor: "pointer",
                      borderBottom: isOpen ? `1px solid ${theme.border}` : "none",
                    }}
                  >
                    {/* Left side — icon + label/desc */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: clr.bg,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 17,
                        }}
                      >
                        {d.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, color: theme.text, fontWeight: 500 }}>{info.name}</div>
                        <div style={{ fontSize: 11.5, color: theme.textTer }}>{info.sub}</div>
                      </div>
                    </div>

                    {/* Chevron — same pattern as your accordions */}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke={theme.textTer}
                      strokeWidth="1.5"
                      style={{
                        flexShrink: 0,
                        transition: "transform .2s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ padding: "14px 16px 16px" }}>
                      {/* Arabic text */}
                      <div
                        style={{
                          fontSize: 21,
                          lineHeight: 2.1,
                          textAlign: "right",
                          direction: "rtl",
                          color: theme.text,
                          fontWeight: 600,
                          fontFamily: "'Amiri','Arabic Typesetting','Traditional Arabic',serif",
                          letterSpacing: 0.4,
                          marginBottom: 10,
                        }}
                      >
                        {d.arabic}
                      </div>

                      {/* Transliteration */}
                      <div
                        style={{
                          fontSize: 12.5,
                          color: theme.textSec,
                          fontStyle: "italic",
                          lineHeight: 1.7,
                          marginBottom: 12,
                        }}
                      >
                        {d.transliteration}
                      </div>

                      {/* Meaning box — bgTer card like your settings group header */}
                      <div
                        style={{
                          background: theme.bgTer,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 10,
                          padding: "10px 13px",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: theme.accent,
                            textTransform: "uppercase",
                            letterSpacing: 0.7,
                            marginBottom: 5,
                          }}
                        >
                          {t("duaMeaning")}
                        </div>
                        <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.65 }}>{info.meaning}</div>
                      </div>

                      {/* Source badge — same pill style as language buttons */}
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          padding: "3px 10px",
                          background: theme.accentBg,
                          color: theme.accent,
                          borderRadius: 99,
                          fontWeight: 600,
                        }}
                      >
                        📖 {t("duaSource")}: {d.source}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const Sidebar = ({ setMessages }) => (
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
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.text,
                fontFamily: "Cinzel, serif",
                letterSpacing: 0.3,
              }}
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

      <div style={{ padding: "14px 14px 8px" }}>
        <button
          onClick={() => {
            clearChat();
            setSection("chat");
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

      <nav style={{ padding: "4px 10px", flex: 1 }}>
        {navItems.map(({ id, key, Icon }) => {
          const route = `/${id}`;
          const active = section === id;
          return (
            <Link
              key={id}
              href={route}
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
                <Icon />
              </span>

              {t(key)}

              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: theme.accent,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

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
        {/* <div
          onClick={() => {
            setSection("profile");
            setSidebarOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 10,
            background: theme.bgTer,
            cursor: "pointer",
          }}
        >
          <UserAvatar initials={userInitials} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: theme.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {t("userName")}
            </div>
            <div style={{ fontSize: 11, color: theme.textSec }}>{t("member")}</div>
          </div>
        </div> */}
      </div>
    </aside>
  );

  // ──────────────────────────────────────────────────────────
  // HISTORY SECTION
  // ──────────────────────────────────────────────────────────
  const HistorySection = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${theme.border}` }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4, fontFamily: "Cinzel, serif" }}>
          {t("historyTitle")}
        </h2>
        <p style={{ fontSize: 12.5, color: theme.textSec }}>{t("historySubtitle")}</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: theme.textTer }}>
            <Icons.History />
            <p style={{ marginTop: 12, fontSize: 13.5 }}>{t("noHistory")}</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="hist-item"
              onClick={() => setSection("chat")}
              style={{
                padding: "12px 14px",
                borderRadius: 11,
                marginBottom: 6,
                border: `1px solid ${theme.border}`,
                background: theme.bgSec,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: theme.text,
                      marginBottom: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: theme.textSec,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.preview}
                  </div>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}
                >
                  <span style={{ fontSize: 11, color: theme.textTer }}>{item.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHistory((h) => h.filter((x) => x.id !== item.id));
                    }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: theme.textTer, padding: 2 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e74c3c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.textTer)}
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  {
    /* ── Footer ── */
  }

  const AboutSection = ({ theme, t }) => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      if (!form.name || !form.email || !form.message) {
        setStatus("error");
        return;
      }
      setLoading(true);
      setStatus("");
      try {
        const res = await fetch("/contacts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("success");
          setForm({ name: "", email: "", message: "" });
        } else throw new Error();
      } catch {
        setStatus("error");
      }
      setLoading(false);
    };

    const inputStyle = {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 14px",
      borderRadius: 8,
      border: `1px solid ${theme.border}`,
      background: theme.bgSec,
      color: theme.text,
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
    };

    const tagStyle = {
      display: "inline-block",
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 99,
      margin: "3px 3px 3px 0",
      background: theme.bgTer,
      color: theme.textSec,
      border: `1px solid ${theme.border}`,
    };

    const sectionLabel = {
      fontSize: 11,
      color: theme.accent,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    };

    const iconCircle = {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: theme.accentBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };

    const divider = {
      borderBottom: `1px solid ${theme.border}`,
      paddingBottom: 24,
      marginBottom: 24,
    };

    const devSkillTags = (skills) =>
      skills.map((s) => (
        <span key={s} style={tagStyle}>
          {s}
        </span>
      ));

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 48px" }}>
        {/* ── About the App ── */}
        <div style={divider}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={iconCircle}>
              <Icons.Chat />
            </div>
            <span style={sectionLabel}>{t("aboutLabel")}</span>
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: theme.text,
              margin: "0 0 10px",
              fontFamily: "Cinzel, serif",
            }}
          >
            {t("aboutAppTitle")}
          </h2>
          <p style={{ fontSize: 14, color: theme.textSec, lineHeight: 1.75, margin: "0 0 14px" }}>
            {t("aboutAppDesc")}
          </p>
          <div>
            {t("aboutTags").map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Developers ── */}
        <div style={divider}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={iconCircle}>
              <Icons.Profile />
            </div>
            <span style={sectionLabel}>{t("aboutDevsLabel")}</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutDevsSubtitle")}</p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              {
                initials: "AH",
                nameKey: "aboutDev1Name",
                roleKey: "aboutDev1Role",
                bioKey: "aboutDev1Bio",
                skillsKey: "aboutSkills1",
                avatarBg: theme.accentBg,
                avatarColor: theme.accent,
                avatarUrl:
                  "https://lh3.googleusercontent.com/a-/ALV-UjWw93hvXrYt1WhNueHLG0lQXyxpnExavnle9-AF7jh9kKOcN4o=s300-p-k-rw-no",
              },
              {
                initials: "RU",
                nameKey: "aboutDev2Name",
                roleKey: "aboutDev2Role",
                bioKey: "aboutDev2Bio",
                skillsKey: "aboutSkills2",
                avatarBg: "#5340b720",
                avatarColor: "#7f77dd",
                avatarUrl:
                  "https://lh3.googleusercontent.com/a/ACg8ocLJk_vtv_dHuJFyJPejdFG4YKuMsXUlz4iMaFSSjqy3aVWCsS8=s360-c-no",
              },
            ].map((dev) => (
              <div
                key={dev.initials}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: theme.bgSec,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: dev.avatarBg,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  {dev.avatarUrl ? (
                    <img
                      src={dev.avatarUrl}
                      alt={t(dev.nameKey)}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: dev.avatarColor }}>{dev.initials}</span>
                  )}
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: theme.text, margin: 0 }}>{t(dev.nameKey)}</p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 99,
                    marginTop: 5,
                    background: dev.avatarBg,
                    color: dev.avatarColor,
                  }}
                >
                  {t(dev.roleKey)}
                </span>
                <p style={{ fontSize: 13, color: theme.textSec, margin: "10px 0", lineHeight: 1.65 }}>
                  {t(dev.bioKey)}
                </p>
                <div>{devSkillTags(t(dev.skillsKey))}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              background: theme.bgTer,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "0 0 6px" }}>{t("aboutWeDoTitle")}</p>
            <p style={{ fontSize: 13, color: theme.textSec, lineHeight: 1.75, margin: 0 }}>{t("aboutWeDoDesc")}</p>
          </div>
        </div>

        {/* ── Contact ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={iconCircle}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span style={sectionLabel}>{t("aboutContactLabel")}</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textTer, margin: "0 0 16px" }}>{t("aboutContactSubtitle")}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="mailto:arfinhayet786@gmail.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: theme.accentBg,
                color: theme.accent,
                border: `1px solid ${theme.accent}40`,
                borderRadius: 10,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {t("aboutContactLabel")}
            </Link>

            <Link
              href="https://wa.me/8801533748448"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              style={{ display: "inline-flex", alignItems: "center", color: "#25D366", flexShrink: 0 }}
            >
              <svg width="36" height="36" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 3C8.82 3 3 8.82 3 16c0 2.35.63 4.67 1.83 6.69L3 29l6.49-1.8A13.01 13.01 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 2c6.08 0 11 4.92 11 11S22.08 27 16 27a10.96 10.96 0 0 1-5.56-1.52l-.4-.24-4.13 1.14 1.1-4-.27-.42A10.96 10.96 0 0 1 5 16c0-6.08 4.92-11 11-11zm-3.22 5.5c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44s1.05 2.83 1.2 3.03c.14.2 2.04 3.2 5 4.36.7.28 1.24.44 1.66.56.7.2 1.33.17 1.83.1.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.34-.3-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.2.27-.75.95-.92 1.15-.17.2-.34.22-.63.08-.3-.14-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.14-.17.18-.3.27-.5.1-.2.05-.37-.02-.52-.07-.14-.66-1.58-.9-2.16-.24-.57-.48-.5-.66-.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────
  // PROFILE SECTION
  // ──────────────────────────────────────────────────────────
  const ProfileSection = () => {
    const [name, setName] = useState(t("userName"));
    const [email, setEmail] = useState(t("userEmail"));
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || "?";

    const showToast = (msg, type = "ok") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 4000);
    };

    const handleSave = async () => {
      if (!name.trim()) {
        showToast(t("nameRequired"), "err");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        showToast(t("emailInvalid"), "err");
        return;
      }
      setSaving(true);

      try {
        const res = await axios.post(
          "https://islamic-chatbot-lac.vercel.app/api/v1/profile",
          {
            name,
            email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = res.data;

        let msg = t("savedSuccess");

        try {
          const txt = (data.content || []).map((c) => c.text || "").join("");

          const cleaned = txt.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);

          if (parsed.message) msg = parsed.message;
        } catch (_) {
          // silent fail for parsing
        }

        showToast(msg, "ok");
      } catch (error) {
        showToast(t("savedError"), "err");
      } finally {
        setSaving(false);
      }
    };

    const inputStyle = {
      width: "100%",
      padding: "9px 12px",
      borderRadius: 10,
      border: `1px solid ${theme.border}`,
      background: theme.bgSec,
      color: theme.text,
      fontSize: 13.5,
      outline: "none",
    };

    const labelStyle = {
      fontSize: 12,
      fontWeight: 600,
      color: theme.textSec,
      marginBottom: 5,
      display: "block",
    };

    const rowStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "11px 0",
      borderBottom: `1px solid ${theme.border}`,
    };

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        {/* Profile hero */}
        <div
          style={{
            textAlign: "center",
            padding: "28px 20px 24px",
            background: theme.bgSec,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <IslamicPattern dark={dark} />
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                margin: "0 auto 12px",
                background: "linear-gradient(135deg, #2d5a8e, #1a3a5c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "white",
                fontWeight: 700,
                border: `3px solid ${theme.accent}`,
              }}
            >
              {initials}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{name || t("userName")}</h2>
            <p style={{ fontSize: 13, color: theme.textSec, marginTop: 4 }}>{email || t("userEmail")}</p>
            <div
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "4px 14px",
                background: theme.accentBg,
                borderRadius: 99,
                border: `1px solid ${theme.accent}`,
                fontSize: 12,
                color: theme.accent,
                fontWeight: 600,
              }}
            >
              {t("membershipBasic")}
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div
          style={{
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 13.5, fontWeight: 600, color: theme.text, marginBottom: 14 }}>{t("profileTitle")}</h3>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{t("fullName")}</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fullNamePlaceholder")}
            />
          </div>
          <div>
            <label style={labelStyle}>{t("emailAddress")}</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>

        {/* Settings */}
        <div
          style={{
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontSize: 13.5, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{t("settingsTitle")}</h3>

          {/* Dark mode row */}
          <div style={rowStyle}>
            <div>
              <div style={{ fontSize: 13.5, color: theme.text }}>{t("darkMode")}</div>
              <div style={{ fontSize: 12, color: theme.textSec, marginTop: 2 }}>{t("darkModeSub")}</div>
            </div>
            <div
              onClick={() => setDark((v) => !v)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 99,
                background: dark ? theme.accent : theme.border,
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "white",
                  top: 3,
                  left: dark ? 21 : 3,
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>

          {/* Language row */}
          <div style={{ ...rowStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <div style={{ fontSize: 13.5, color: theme.text }}>{t("language")}</div>
              <div style={{ fontSize: 12, color: theme.textSec, marginTop: 2 }}>{t("languageSub")}</div>
            </div>
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                setMessages((prev) => {
                  prev[0] = {
                    id: 0,
                    role: "assistant",
                    content: TRANSLATIONS[e.target.value].greeting,
                    streaming: false,
                  };
                  return [...prev];
                });
              }}
              style={{
                padding: "7px 28px 7px 10px",
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: theme.bgSec,
                color: theme.text,
                fontSize: 13,
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 9px center",
                minWidth: 120,
              }}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              border: `1px solid ${toast.type === "ok" ? "#1D9E75" : "#E24B4A"}`,
              background: toast.type === "ok" ? "#E1F5EE" : "#FCEBEB",
              color: toast.type === "ok" ? "#085041" : "#791F1F",
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            cursor: saving ? "not-allowed" : "pointer",
            background: saving ? theme.border : theme.accent,
            border: "none",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            opacity: saving ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {saving ? t("saving") : t("saveChanges")}
        </button>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────
  // SETTINGS SECTION
  // ──────────────────────────────────────────────────────────
  const SettingsSection = () => {
    const groups = [
      {
        title: t("groupGeneral"),
        items: [
          {
            icon: <Icons.Globe />,
            label: t("language"),
            desc: t("languageDesc"),
            // Full language names in settings for clarity
            control: (
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { code: "bn", label: "বাংলা" },
                  { code: "en", label: "English" },
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
                      padding: "5px 12px",
                      borderRadius: 99,
                      cursor: "pointer",
                      border: `1px solid ${lang === code ? theme.accent : theme.borderMed}`,
                      background: lang === code ? theme.accentBg : "transparent",
                      color: lang === code ? theme.accent : theme.textSec,
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all .18s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ),
          },
          // {
          //   icon: <Icons.Bell />,
          //   label: t("notifications"),
          //   desc: t("notificationsDesc"),
          //   control: (
          //     <label className="toggle-switch">
          //       <input
          //         type="checkbox"
          //         checked={settings.notifications}
          //         onChange={(e) => setSettings((s) => ({ ...s, notifications: e.target.checked }))}
          //       />
          //       <span className="toggle-slider" />
          //     </label>
          //   ),
          // },
        ],
      },
      // {
      //   title: t("groupIslamic"),
      //   items: [
      //     {
      //       icon: <Icons.Book />,
      //       label: t("madhab"),
      //       desc: t("madhabDesc"),
      //       control: (
      //         <select
      //           value={settings.madhab}
      //           onChange={(e) => setSettings((s) => ({ ...s, madhab: e.target.value }))}
      //           style={{
      //             background: theme.bgTer,
      //             border: `1px solid ${theme.borderMed}`,
      //             borderRadius: 8,
      //             padding: "5px 10px",
      //             fontSize: 12.5,
      //             color: theme.text,
      //             cursor: "pointer",
      //           }}
      //         >
      //           {["hanafi", "maliki", "shafii", "hanbali"].map((m) => (
      //             <option key={m} value={m}>
      //               {t("madhab" + m.charAt(0).toUpperCase() + m.slice(1))}
      //             </option>
      //           ))}
      //         </select>
      //       ),
      //     },
      //     {
      //       icon: <Icons.History />,
      //       label: t("saveHistory"),
      //       desc: t("saveHistoryDesc"),
      //       control: (
      //         <label className="toggle-switch">
      //           <input
      //             type="checkbox"
      //             checked={settings.saveHistory}
      //             onChange={(e) => setSettings((s) => ({ ...s, saveHistory: e.target.checked }))}
      //           />
      //           <span className="toggle-slider" />
      //         </label>
      //       ),
      //     },
      //   ],
      // },
      {
        title: t("groupDisplay"),
        items: [
          {
            icon: dark ? <Icons.Moon /> : <Icons.Sun />,
            label: t("darkModeLabel"),
            desc: t("darkModeDesc"),
            control: (
              <label className="toggle-switch">
                <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            ),
          },
        ],
      },
    ];

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: theme.text, marginBottom: 4, fontFamily: "Cinzel, serif" }}>
          {t("settingsTitle")}
        </h2>
        <p style={{ fontSize: 12.5, color: theme.textSec, marginBottom: 20 }}>{t("settingsSubtitle")}</p>
        {groups.map((group, gi) => (
          <div
            key={gi}
            style={{
              background: theme.bgSec,
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${theme.border}`, background: theme.bgTer }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: theme.textSec,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                {group.title}
              </span>
            </div>
            {group.items.map((item, ii) => (
              <div
                key={ii}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "13px 16px",
                  borderBottom: ii < group.items.length - 1 ? `1px solid ${theme.border}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ color: theme.accent, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, color: theme.text, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 11.5, color: theme.textTer }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>{item.control}</div>
              </div>
            ))}
          </div>
        ))}
        <div
          style={{
            textAlign: "center",
            padding: 16,
            background: theme.bgSec,
            borderRadius: 14,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div style={{ fontSize: 12, color: theme.textTer, marginBottom: 4 }}>{t("version")}</div>
          <div style={{ fontSize: 11, color: theme.textTer }}>{t("bismillah")}</div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────
  // MOBILE HEADER
  // ──────────────────────────────────────────────────────────
  const MobileHeader = ({ setMessages }) => (
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
            <img src="/favicon.png" style={{ width: 24, height: 24, borderRadius: 6 }} />
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
          {/* <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "linear-gradient(135deg, #1a6b5a, #0d4a3e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div> */}
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: "Cinzel, serif" }}>
            {t(section)}
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

  // ──────────────────────────────────────────────────────────
  // ROOT RENDER
  // ──────────────────────────────────────────────────────────

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
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
        {/* ── Desktop sidebar ── */}
        <div className="desktop-only" style={{ display: "none", flexShrink: 0, height: "100%" }}>
          <Sidebar setMessages={setMessages} />
        </div>

        {/* ── Mobile drawer overlay ── */}
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
                  right: -44,
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

        {/* ── Main content ── */}
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
            <MobileHeader setMessages={setMessages} />
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
                {section === "chat"
                  ? t("welcomeTitle")
                  : section === "history"
                    ? t("historyTitle")
                    : section === "profile"
                      ? t("profileTitle")
                      : t("settingsTitle")}
              </h1>
              {section === "chat" && (
                <p style={{ fontSize: 12, color: theme.textTer, marginTop: 1 }}>{t("appSubtitle")}</p>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {section === "chat" && (
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

          {/* Section content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {section === "chat" && (
              <ChatSection
                messages={messages}
                theme={theme}
                t={t}
                font={font}
                bottomRef={bottomRef}
                clearChat={clearChat}
                textareaRef={textareaRef}
                handleInput={handleInput}
                handleKeyDown={handleKeyDown}
                handleFocus={handleFocus}
                isLoading={isLoading}
                input={input}
                handleStop={handleStop}
                sendMessage={sendMessage}
                userInitials={userInitials}
                copyMessage={copyMessage}
                copiedId={copiedId}
              />
            )}
            {section === "history" && <HistorySection />}
            {section === "prayer" && <PrayerSection />}
            {section === "dua" && <DuaSection theme={theme} />}
            {section === "about" && <AboutSection theme={theme} t={t} />}
            {/* {section === "profile" && <ProfileSection />} */}
            {section === "settings" && <SettingsSection setMessages={setMessages} />}
          </div>

          {isDesktop && (
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
          )}
        </main>
      </div>
    </>
  );
}
