"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MOCK_HISTORY_DATA } from "@/lib/mockHistory";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [section, setSection] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({ notifications: true, madhab: "hanafi", saveHistory: true });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const [history, setHistory] = useState(MOCK_HISTORY_DATA.bn);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width:768px)").matches : false,
  );

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width:768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstall(false);
    setInstallPrompt(null);
  }, [installPrompt]);

  const value = useMemo(
    () => ({
      section,
      setSection,
      sidebarOpen,
      setSidebarOpen,
      settings,
      setSettings,
      history,
      setHistory,
      installPrompt,
      setInstallPrompt,
      showInstall,
      setShowInstall,
      handleInstall,
      isDesktop,
    }),
    [section, sidebarOpen, settings, history, installPrompt, showInstall, handleInstall, isDesktop],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
