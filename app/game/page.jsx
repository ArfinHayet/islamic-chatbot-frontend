"use client";

import React, { useState, useEffect, useRef } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { CityScene } from "@/components/game/CityScene";
import { LiteScene } from "@/components/game/LiteScene";
import { SplashScreen } from "@/components/game/ui/SplashScreen";
import { SituationPanel } from "@/components/game/ui/SituationPanel";
import { ChoiceButtons } from "@/components/game/ui/ChoiceButtons";
import { ReflectionPanel } from "@/components/game/ui/ReflectionPanel";
import { VirtueHUD } from "@/components/game/ui/VirtueHUD";
import { LevelUpScreen } from "@/components/game/ui/LevelUpScreen";
import { GameComplete } from "@/components/game/ui/GameComplete";
import { MuteToggle } from "@/components/game/ui/MuteToggle";
import { LiteModeToggle } from "@/components/game/ui/LiteModeToggle";
import { FullscreenToggle } from "@/components/game/ui/FullscreenToggle";
import { ProgressExport } from "@/components/game/ui/ProgressExport";
import { MobileMenuDrawer } from "@/components/game/ui/MobileMenuDrawer";
import { AudioEngine } from "@/components/game/audio/AudioEngine";
import { useLocale } from "@/context/LocaleContext";
import "@/app/game/game.css";

function GameInner() {
  const { state } = useGame();
  const { t } = useLocale();
  const [hasWebGL, setHasWebGL] = useState(true);
  const containerRef = useRef(null);

  // Check WebGL capability on mount safely
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
                 canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(true); // Default to WebGL
    }
  }, []);

  const use3D = hasWebGL && !state.liteMode;

  return (
    <div className="game-container" ref={containerRef}>
      {/* Audio Engine */}
      <AudioEngine />

      {/* 3D or 2D Scene Layer */}
      {use3D ? <CityScene /> : <LiteScene />}

      {/* Desktop Controls (Top Right Bar) */}
      <div className="game-controls desktop-only-controls">
        <FullscreenToggle containerRef={containerRef} />
        <LiteModeToggle />
        <ProgressExport />
        <MuteToggle />
      </div>

      {/* Mobile Right Drawer Trigger (Mobile Only Three-Dot Menu) */}
      <div className="mobile-only-controls">
        <MobileMenuDrawer containerRef={containerRef} />
      </div>

      {/* Idle Splash Screen */}
      {state.phase === "idle" && <SplashScreen containerRef={containerRef} />}

      {/* In-Game HUD & Overlay */}
      {state.phase !== "idle" && (
        <div className="game-overlay">
          <VirtueHUD />

          {/* Loading Indicator */}
          {state.phase === "loading_scenario" && (
            <div className="game-loading">
              <div className="game-loading-orb" />
              <div className="game-loading-text">{t("gameLoading")}</div>
            </div>
          )}

          {/* Situation & Choice Area */}
          <div className="game-panel-area">
            <SituationPanel />
            <ChoiceButtons />
            <ReflectionPanel />
          </div>

          {/* Level Up & Complete Overlays */}
          <LevelUpScreen />
          <GameComplete />
        </div>
      )}
    </div>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameInner />
    </GameProvider>
  );
}
