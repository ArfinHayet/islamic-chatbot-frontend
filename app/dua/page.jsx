"use client";

import React from "react";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "@/components/islamic-chat/Icons";
import DUA_DATA from "@/lib/dua-data.json";

export default function DuaPage() {
  const { t, lang } = useLocale();
  const { theme } = useTheme();

  
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
  

  return <DuaSection />;
}
