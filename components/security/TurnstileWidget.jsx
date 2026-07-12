"use client";

import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileWidget({
  siteKey,
  onVerify,
  resetKey,
  compact = false,
  fullPage = false,
  appearance = "always",
  statusText = "Verifying...",
}) {
  const { dark, theme } = useTheme();
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [verifiedResetKey, setVerifiedResetKey] = useState(null);
  const isVerified = verifiedResetKey === resetKey;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let checkInterval;
    const checkTurnstile = () => {
      if (window.turnstile) {
        setTurnstileReady(true);
        if (checkInterval) clearInterval(checkInterval);
        return true;
      }
      return false;
    };

    if (!checkTurnstile()) {
      checkInterval = setInterval(checkTurnstile, 50);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    const turnstile = window.turnstile;

    if (!turnstileReady || !siteKey || !containerRef.current || !turnstile) return undefined;

    if (widgetIdRef.current !== null) {
      turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: dark ? "dark" : "light",
      size: compact ? "compact" : "normal",
      appearance,
      callback: (token) => {
        setVerifiedResetKey(resetKey);
        onVerify(token);
      },
      "expired-callback": () => {
        setVerifiedResetKey(null);
        onVerify("");
      },
      "error-callback": () => {
        setVerifiedResetKey(null);
        onVerify("");
      },
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [appearance, compact, dark, onVerify, resetKey, turnstileReady, siteKey]);

  if (!siteKey) {
    return (
      <div style={{ color: "#e11d48", fontSize: 13, lineHeight: 1.5 }}>
        Turnstile is not configured. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY.
      </div>
    );
  }

  if (fullPage) {
    return (
      <>
        <Script src={TURNSTILE_SCRIPT_SRC} strategy="afterInteractive" onReady={() => setTurnstileReady(true)} />
        <div
          style={{
            minHeight: isVerified ? 0 : "100dvh",
            display: isVerified ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            padding: 24,
            background: theme.bg,
            color: theme.text,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: theme.textSec,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {statusText}
          </div>
          <div ref={containerRef} />
        </div>
      </>
    );
  }

  return (
    <>
      <Script src={TURNSTILE_SCRIPT_SRC} strategy="afterInteractive" onReady={() => setTurnstileReady(true)} />
      <div
        ref={containerRef}
        style={{
          minHeight: isVerified ? 0 : compact ? 58 : 65,
          display: isVerified ? "none" : "flex",
          alignItems: "center",
          justifyContent: compact ? "flex-start" : "center",
          borderRadius: 8,
          background: theme.bgTer,
          border: `1px solid ${theme.border}`,
          overflow: "hidden",
        }}
      />
    </>
  );
}
