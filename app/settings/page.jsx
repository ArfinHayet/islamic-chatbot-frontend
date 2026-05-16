"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { TRANSLATIONS } from "@/lib/translations";

function SettingsSection({ t, lang, setLang, theme, dark, setDark, setMessages }) {
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
}

export default function SettingsPage() {
  const { t, lang, setLang } = useLocale();
  const { theme, dark, setDark } = useTheme();
  const { setMessages } = useChat();

  return (
    <SettingsSection
      t={t}
      lang={lang}
      setLang={setLang}
      theme={theme}
      dark={dark}
      setDark={setDark}
      setMessages={setMessages}
    />
  );
}
