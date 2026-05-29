"use client";

import React from "react";
import { useAppShell } from "@/components/AppShell";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { TypingDots } from "@/components/ui/TypingDots";
import { MarkdownMessage } from "@/components/ui/MarkdownMessage";
import { SurahAudioPlayer } from "@/components/ui/SurahAudioPlayer";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function ChatContent() {
  const {
    messages,
    isLoading,
    input,
    copiedId,
    copyMessage,
    captchaToken,
    captchaPass,
    verifyCaptchaToken,
    captchaResetKey,
    bottomRef,
    textareaRef,
    sendMessage,
    handleInput,
    handleKeyDown,
    handleStop,
  } = useChat();
  const { t } = useLocale();
  const { theme } = useTheme();
  const { handleFocus } = useAppShell();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {!captchaPass && (
        <TurnstileWidget
          siteKey={turnstileSiteKey}
          resetKey={captchaResetKey}
          onVerify={verifyCaptchaToken}
          fullPage
          appearance="interaction-only"
          statusText="Verifying your browser..."
        />
      )}

      {/* Messages list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Welcome screen */}
        {messages.length === 1 && (
          <div
            className="chat-column"
            style={{ textAlign: "center", padding: "32px 12px 24px", animation: "fadeSlideUp .5s ease" }}
          >
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
              style={{ fontSize: 13.5, color: theme.textSec, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 20px" }}
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
            className="msg-row chat-column"
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                maxWidth: msg.role === "user" ? "min(78%,520px)" : "100%",
                background: msg.role === "user" ? theme.userBubble : theme.botBubble,
                color: msg.role === "user" ? theme.userText : theme.text,
                padding: msg.role === "user" ? "12px 16px" : "16px 18px",
                borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                fontSize: 14,
                lineHeight: 1.75,
                border: msg.role === "assistant" ? `1px solid ${theme.border}` : "none",
                boxShadow: theme.shadow,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <div style={{ display: "block", width: "100%" }} className="markdown-message">
                {msg.content ? (
                  <MarkdownMessage content={msg.content} theme={theme} isUser={msg.role === "user"} />
                ) : (
                  msg.streaming ? "" : "…"
                )}
              </div>
              {msg.role === "assistant" && msg.media?.type === "quran_recitation" && (
                <SurahAudioPlayer media={msg.media} theme={theme} />
              )}
              {msg.streaming && <TypingDots />}
              {msg.role === "assistant" && msg.content && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 4,
                    marginTop: 8,
                    paddingTop: 6,
                    borderTop: `1px solid ${theme.border}`,
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); copyMessage && copyMessage(msg.id, msg.content); }}
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
                      if (navigator.share) navigator.share({ text: msg.content });
                      else copyMessage && copyMessage(msg.id, msg.content);
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
          className="chat-column"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-end",
            background: theme.inputBg,
            border: `1.5px solid ${theme.borderMed}`,
            borderRadius: 14,
            padding: "8px 8px 8px 14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
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
            disabled={!isLoading && !captchaPass && !captchaToken}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              cursor: !isLoading && !captchaPass && !captchaToken ? "not-allowed" : "pointer",
              flexShrink: 0,
              background: isLoading ? "#c0392b" : input.trim() && (captchaPass || captchaToken) ? theme.accent : theme.bgTer,
              color: isLoading || (input.trim() && (captchaPass || captchaToken)) ? "white" : theme.textTer,
              opacity: !isLoading && !captchaPass && !captchaToken ? 0.65 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={isLoading ? "Stop" : "Send"}
          >
            {isLoading ? <Icons.Stop /> : <Icons.Send />}
          </button>
        </div>
        {/* <p style={{ fontSize: 11, color: theme.textTer, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          {t("disclaimer")}
        </p> */}
        <p style={{ fontSize: 10.5, color: theme.textTer, textAlign: "center", marginTop: 2, lineHeight: 1.5 }}>
          {t("termsAgree")} <a href='/terms' target='_blank' rel='noopener noreferrer' style={{ color: theme.accent, textDecoration: "underline" }}>{t("termsSection")}</a>
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return <ChatContent />;
}
