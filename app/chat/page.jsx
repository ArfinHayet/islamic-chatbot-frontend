"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppShell } from "@/components/AppShell";
import { useChat } from "@/context/ChatContext";
import { useLocale } from "@/context/LocaleContext";
import { useTheme } from "@/context/ThemeContext";
import { Icons } from "@/components/islamic-chat/Icons";
import { TypingDots } from "@/components/ui/TypingDots";

function MarkdownMessage({ content, theme, isUser }) {
  const textColor = isUser ? theme.userText : theme.text;
  const mutedColor = isUser ? "rgba(255,255,255,0.72)" : theme.textSec;
  const borderColor = isUser ? "rgba(255,255,255,0.22)" : theme.border;
  const codeBg = isUser ? "rgba(0,0,0,0.18)" : theme.bgTer;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p style={{ margin: "0 0 0.75em" }}>{children}</p>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: isUser ? "white" : theme.accent, fontWeight: 600, textDecoration: "underline" }}
          >
            {children}
          </a>
        ),
        h1: ({ children }) => (
          <h1 style={{ color: textColor, fontSize: 18, lineHeight: 1.35, margin: "0 0 0.55em", fontWeight: 700 }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ color: textColor, fontSize: 16, lineHeight: 1.4, margin: "0 0 0.55em", fontWeight: 700 }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ color: textColor, fontSize: 15, lineHeight: 1.45, margin: "0 0 0.5em", fontWeight: 700 }}>
            {children}
          </h3>
        ),
        ul: ({ children }) => <ul style={{ margin: "0 0 0.75em 1.25em", padding: 0 }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ margin: "0 0 0.75em 1.25em", padding: 0 }}>{children}</ol>,
        li: ({ children }) => <li style={{ margin: "0.2em 0", paddingLeft: 2 }}>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote
            style={{
              margin: "0 0 0.75em",
              padding: "0.55em 0.8em",
              borderLeft: `3px solid ${isUser ? "rgba(255,255,255,0.42)" : theme.accent}`,
              background: isUser ? "rgba(255,255,255,0.12)" : theme.bgTer,
              color: mutedColor,
              borderRadius: 8,
            }}
          >
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = Boolean(className);
          return isBlock ? (
            <code className={className}>{children}</code>
          ) : (
            <code
              style={{
                background: codeBg,
                border: `1px solid ${borderColor}`,
                borderRadius: 5,
                padding: "0.08em 0.35em",
                fontSize: "0.92em",
                fontFamily: "DM Mono, monospace",
              }}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre
            style={{
              margin: "0 0 0.75em",
              padding: "0.8em 0.9em",
              overflowX: "auto",
              background: codeBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              fontSize: 12.5,
              lineHeight: 1.65,
            }}
          >
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div style={{ overflowX: "auto", margin: "0 0 0.75em" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 260 }}>{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th
            style={{
              border: `1px solid ${borderColor}`,
              padding: "6px 8px",
              textAlign: "left",
              background: codeBg,
              fontWeight: 700,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => <td style={{ border: `1px solid ${borderColor}`, padding: "6px 8px" }}>{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ChatContent() {
  const {
    messages,
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
  } = useChat();
  const { t } = useLocale();
  const { theme } = useTheme();
  const { handleFocus } = useAppShell();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
        <p style={{ fontSize: 11, color: theme.textTer, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          {t("disclaimer")}
        </p>
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
