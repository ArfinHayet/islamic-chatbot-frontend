import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import React from "react";

export function MarkdownMessage({ content, theme, isUser }) {
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