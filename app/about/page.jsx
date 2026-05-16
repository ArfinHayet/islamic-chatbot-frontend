"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { IslamicPattern } from "@/components/ui/IslamicPattern";

function AboutSection({ theme, t }) {
      
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
                        referrerPolicy="no-referrer"
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
}

export default function AboutPage() {
  const { t } = useLocale();
  const { theme } = useTheme();

  return <AboutSection theme={theme} t={t} />;
}
