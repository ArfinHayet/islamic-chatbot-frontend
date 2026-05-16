"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { useUi } from "@/context/UiContext";
import { IslamicPattern } from "@/components/ui/IslamicPattern";
import { useApi } from "@/hooks/useApi";
import { PRAYER_TIMES_URL } from "@/lib/constants";

const PRAYER_KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const PRAYER_ICONS = {
  Fajr: "pi pi-star",
  Sunrise: "pi pi-sun",
  Dhuhr: "pi pi-circle-fill",
  Asr: "pi pi-clock",
  Maghrib: "pi pi-palette",
  Isha: "pi pi-moon",
};

function PrayerSection({ t, theme, settings }) {
      const { request } = useApi();
      const [prayerData, setPrayerData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
      const [now, setNow] = useState(new Date());
      const [countdown, setCountdown] = useState("");
      const [clockMode, setClockMode] = useState("digital"); // "digital" | "analog"
      const [madhab, setMadhab] = useState(settings?.madhab ?? "standard"); // local override
      const [rawData, setRawData] = useState(null); // cache full API response
      const madhabRef = useRef(madhab);
  
      // ── Tick every second ───────────────────────────────────────────────────────
      useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
      }, []);
  
      useEffect(() => {
        madhabRef.current = madhab;
      }, [madhab]);

      const fetchPrayers = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
          const json = await request(PRAYER_TIMES_URL);
          const entry = json.data[0];
          setRawData(entry); // cache both madhab entries
          const idx = madhabRef.current === "hanafi" ? "1" : "0";
          setPrayerData(entry[idx].data);
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      }, [request]);
  
      // Fetch only once on mount
      useEffect(() => {
        fetchPrayers();
      }, [fetchPrayers]);
  
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
}

export default function PrayerPage() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { settings } = useUi();

  return <PrayerSection t={t} theme={theme} settings={settings} />;
}
