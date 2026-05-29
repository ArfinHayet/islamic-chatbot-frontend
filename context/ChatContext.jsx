"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { CHAT_STREAM_URL, TURNSTILE_PASS_URL } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";
import { useLocale } from "@/context/LocaleContext";

const ChatContext = createContext(null);
const CAPTCHA_PASS_STORAGE_KEY = "noorAiCaptchaPass";

function unwrapApiResponse(payload) {
  return payload?.data ?? payload;
}

function genUserId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `user_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

function readStoredCaptchaPass() {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(CAPTCHA_PASS_STORAGE_KEY);
    if (!storedValue) return null;

    const storedPass = unwrapApiResponse(JSON.parse(storedValue));
    const expiresAtMs = Date.parse(storedPass?.expiresAt);
    if (!storedPass?.captchaPass || !expiresAtMs || expiresAtMs <= Date.now()) {
      window.localStorage.removeItem(CAPTCHA_PASS_STORAGE_KEY);
      return null;
    }

    return storedPass;
  } catch {
    return null;
  }
}

function writeStoredCaptchaPass(pass) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CAPTCHA_PASS_STORAGE_KEY, JSON.stringify(pass));
  } catch {
    // Storage can be unavailable in private browsing; the in-memory pass still works for this tab.
  }
}

function clearStoredCaptchaPass() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(CAPTCHA_PASS_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

export function ChatProvider({ children }) {
  const { lang, t } = useLocale();
  const { request } = useApi();
  const [userId, setUserId] = useState(() => genUserId());
  const [messages, setMessages] = useState(() => [
    { id: 0, role: "assistant", content: TRANSLATIONS[lang].greeting, streaming: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaPass, setCaptchaPass] = useState(() => readStoredCaptchaPass()?.captchaPass ?? "");
  const [captchaPassExpiresAt, setCaptchaPassExpiresAt] = useState(() => readStoredCaptchaPass()?.expiresAt ?? "");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const bottomRef = useRef(null);
  const scrollThrottleRef = useRef(0);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  const copyMessage = useCallback(async (id, text) => {
    try {
      const str = String(text ?? "");
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(str);
      } else if (typeof document !== "undefined") {
        const ta = document.createElement("textarea");
        ta.value = str;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch (e) {
      console.error("copy failed", e);
    }
  }, []);

  const verifyCaptchaToken = useCallback(
    async (token) => {
      if (!token) {
        setCaptchaToken("");
        setCaptchaPass("");
        setCaptchaPassExpiresAt("");
        clearStoredCaptchaPass();
        return;
      }

      setCaptchaToken(token);

      try {
        const payload = await request(TURNSTILE_PASS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ captchaToken: token }),
        });
        const pass = unwrapApiResponse(payload);

        if (!pass?.captchaPass || !pass?.expiresAt) {
          throw new Error("Invalid Turnstile pass response.");
        }

        setCaptchaToken("");
        setCaptchaPass(pass.captchaPass);
        setCaptchaPassExpiresAt(pass.expiresAt);
        writeStoredCaptchaPass(pass);
      } catch (error) {
        console.error("Turnstile pass exchange failed", error);
        setCaptchaToken("");
        setCaptchaPass("");
        setCaptchaPassExpiresAt("");
        clearStoredCaptchaPass();
        setCaptchaResetKey((current) => current + 1);
      }
    },
    [request],
  );

  useEffect(() => {
    const now = Date.now();
    const isStreaming = messages.some((m) => m.streaming);
    if (isStreaming) {
      if (now - scrollThrottleRef.current > 120) {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        scrollThrottleRef.current = now;
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      scrollThrottleRef.current = now;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (promptText) => {
      const text = (typeof promptText === "string" ? promptText : input).trim();
      if (!text || isLoading) return;
      if (!captchaPass && !captchaToken) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: "assistant", content: "Please complete the Turnstile verification first.", streaming: false },
        ]);
        return;
      }
      const userMsg = { id: Date.now(), role: "user", content: text, streaming: false };
      const aId = Date.now() + 1;
      const assistantMsg = { id: aId, role: "assistant", content: "", streaming: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsLoading(true);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      abortRef.current = new AbortController();
      try {
        const res = await request(CHAT_STREAM_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, message: text, captchaToken, captchaPass }),
          signal: abortRef.current.signal,
          parse: "response",
        });
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let contentAcc = "";
        const applyAssistantUpdate = (patch) => {
          setMessages((prev) => prev.map((m) => (m.id === aId ? { ...m, ...patch } : m)));
        };
        const readEventText = (eventText) =>
          eventText
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s*/, ""))
            .join("\n")
            .trim();
        const handleStreamPayload = (payloadText) => {
          if (!payloadText || payloadText === "[DONE]") return;

          try {
            const payload = JSON.parse(payloadText);

            if (payload.type === "chunk") {
              contentAcc += payload.text ?? payload.content ?? "";
              applyAssistantUpdate({ content: contentAcc });
              return;
            }

            if (payload.type === "media" && payload.media) {
              applyAssistantUpdate({ media: payload.media });
              return;
            }

            if (payload.type === "done") {
              if (payload.media) applyAssistantUpdate({ media: payload.media });
              return;
            }

            const text =
              payload.content ??
              payload.text ??
              (payload.delta && (payload.delta.content ?? payload.delta)) ??
              payload.choices?.[0]?.delta?.content ??
              payload.choices?.[0]?.text ??
              "";

            if (text) {
              contentAcc += text;
              applyAssistantUpdate({ content: contentAcc });
            }
          } catch {
            contentAcc += payloadText;
            applyAssistantUpdate({ content: contentAcc });
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";
          events.map(readEventText).forEach(handleStreamPayload);
        }

        const finalPayload = readEventText(buffer);
        handleStreamPayload(finalPayload);
      } catch (err) {
        if (err.status === 400 || err.status === 401) {
          setCaptchaToken("");
          setCaptchaPass("");
          setCaptchaPassExpiresAt("");
          clearStoredCaptchaPass();
          setCaptchaResetKey((current) => current + 1);
        }

        if (err.name !== "AbortError")
          setMessages((prev) =>
            prev.map((m) => (m.id === aId ? { ...m, content: t("errorMsg"), streaming: false } : m)),
          );
      } finally {
        setMessages((prev) =>
          prev
            .map((m) => (m.id === aId ? { ...m, streaming: false } : m))
            .filter((m) => !(m.role === "assistant" && !m.media && (!m.content || String(m.content).trim() === ""))),
        );
        if (!captchaPass) {
          setCaptchaToken("");
          setCaptchaResetKey((current) => current + 1);
        }
        setIsLoading(false);
      }
    },
    [captchaPass, captchaToken, input, isLoading, request, userId, t],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const handleStop = () => abortRef.current?.abort();

  const handleInput = useCallback((e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  }, []);

  const clearChat = useCallback(() => {
    setMessages([{ id: 0, role: "assistant", content: t("resetMsg"), streaming: false }]);
    setUserId(genUserId());
  }, [t]);

  const value = useMemo(
    () => ({
      userId,
      setUserId,
      messages,
      setMessages,
      isLoading,
      input,
      setInput,
      copiedId,
      copyMessage,
      captchaToken,
      setCaptchaToken,
      captchaPass,
      captchaPassExpiresAt,
      verifyCaptchaToken,
      captchaResetKey,
      bottomRef,
      textareaRef,
      abortRef,
      sendMessage,
      handleInput,
      handleKeyDown,
      handleStop,
      clearChat,
    }),
    [
      userId,
      messages,
      isLoading,
      input,
      copiedId,
      copyMessage,
      captchaToken,
      captchaPass,
      captchaPassExpiresAt,
      captchaResetKey,
      verifyCaptchaToken,
      sendMessage,
      handleInput,
      handleKeyDown,
      clearChat,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
