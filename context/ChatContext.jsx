"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { API_URL } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";
import { useLocale } from "@/context/LocaleContext";

const ChatContext = createContext(null);

function genUserId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `user_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function ChatProvider({ children }) {
  const { lang, t } = useLocale();
  const [userId, setUserId] = useState(() => genUserId());
  const [messages, setMessages] = useState(() => [
    { id: 0, role: "assistant", content: TRANSLATIONS[lang].greeting, streaming: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);

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
      const userMsg = { id: Date.now(), role: "user", content: text, streaming: false };
      const aId = Date.now() + 1;
      const assistantMsg = { id: aId, role: "assistant", content: "", streaming: true };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsLoading(true);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      abortRef.current = new AbortController();
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, message: text }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        const isMeaningless = (s) => {
          if (!s || typeof s !== "string") return true;
          const trimmed = s.trim();
          return trimmed === "" || trimmed === "[DONE]";
        };
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const clean = acc
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.replace(/^data:\s*/, ""))
            .map((l) => {
              try {
                const p = JSON.parse(l);
                if (p && p.type === "done") return "";
                return (
                  p.content ??
                  p.text ??
                  (p.delta && (p.delta.content ?? p.delta)) ??
                  p.choices?.[0]?.delta?.content ??
                  p.choices?.[0]?.text ??
                  ""
                );
              } catch {
                return l;
              }
            })
            .filter(Boolean)
            .join("");

          if (clean && !isMeaningless(clean)) {
            setMessages((prev) => prev.map((m) => (m.id === aId ? { ...m, content: clean } : m)));
          } else if (!clean && acc.replace(/\n/g, "").length > 0) {
            const raw = acc
              .split("\n")
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.replace(/^data:\s*/, ""))
              .map((l) => l.trim())
              .filter((l) => l && l !== "[DONE]")
              .join("\n")
              .trim();
            if (raw && !isMeaningless(raw))
              setMessages((prev) => prev.map((m) => (m.id === aId ? { ...m, content: raw } : m)));
          }
        }
      } catch (err) {
        if (err.name !== "AbortError")
          setMessages((prev) =>
            prev.map((m) => (m.id === aId ? { ...m, content: t("errorMsg"), streaming: false } : m)),
          );
      } finally {
        setMessages((prev) =>
          prev
            .map((m) => (m.id === aId ? { ...m, streaming: false } : m))
            .filter((m) => !(m.role === "assistant" && (!m.content || String(m.content).trim() === ""))),
        );
        setIsLoading(false);
      }
    },
    [input, isLoading, userId, t],
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
