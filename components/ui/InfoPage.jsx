"use client";

import React from "react";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";

export function InfoPage({ eyebrow, title, subtitle, sections, updated }) {
  const { lang } = useLocale();
  const { theme } = useTheme();

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 48px" }}>
      <article style={{ width: "100%", maxWidth: 820, margin: "0 auto" }}>
        <header style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 11,
              color: theme.accent,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {eyebrow}
          </div>
          <h1
            style={{
              fontSize: 26,
              lineHeight: 1.25,
              color: theme.text,
              margin: "0 0 10px",
              fontFamily: "Cinzel, serif",
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 14, color: theme.textSec, lineHeight: 1.75, margin: 0 }}>{subtitle}</p>
          {updated && (
            <p style={{ fontSize: 12, color: theme.textTer, marginTop: 10 }}>
              {lang === "bn" ? "সর্বশেষ আপডেট" : lang === "ur" ? "آخری تازہ کاری" : "Last updated"}: {updated}
            </p>
          )}
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sections.map((section) => (
            <section
              key={section.title}
              style={{
                background: theme.bgSec,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <h2 style={{ fontSize: 17, color: theme.text, margin: "0 0 10px", fontWeight: 700 }}>{section.title}</h2>
              {section.body && (
                <p style={{ fontSize: 13.5, color: theme.textSec, lineHeight: 1.8, margin: "0 0 10px" }}>
                  {section.body}
                </p>
              )}
              {section.items && (
                <ul style={{ margin: 0, padding: 0, paddingInlineStart: 18, color: theme.textSec, fontSize: 13.5, lineHeight: 1.8 }}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
