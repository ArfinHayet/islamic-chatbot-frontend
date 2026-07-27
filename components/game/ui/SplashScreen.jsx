"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

const VIRTUES_CONFIG = [
  { key: "honesty", icon: "🤝" },
  { key: "patience", icon: "⏳" },
  { key: "generosity", icon: "🎁" },
  { key: "compassion", icon: "❤️" },
  { key: "justice", icon: "⚖️" },
  { key: "humility", icon: "🌱" },
];

const MAX_VIRTUE_POINTS = 15;

export function SplashScreen({ containerRef }) {
  const { state, dispatch, SCENARIOS_PER_LEVEL } = useGame();
  const { t } = useLocale();
  const { virtues, currentLevel, currentScenarioIndex } = state;

  const hasSavedProgress =
    currentLevel > 1 ||
    currentScenarioIndex > 0 ||
    Object.values(virtues).some((v) => v > 0);

  const triggerFullscreenSafely = () => {
    try {
      const elem = containerRef?.current || document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } catch {
      // Mobile Safari / older browsers fallback
    }
  };

  const handleResume = () => {
    triggerFullscreenSafely();
    dispatch({ type: "START_GAME" });
  };

  const handleNewGame = () => {
    dispatch({ type: "RESET_PROGRESS" });
    triggerFullscreenSafely();
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="game-splash">
      <div className="game-splash-ornament">
        <div className="game-splash-ornament-inner" />
      </div>

      <h1 className="game-splash-title">{t("game")}</h1>

      {hasSavedProgress ? (
        /* Saved Progress Resume Card */
        <div className="game-splash-progress-card">
          <div className="game-splash-progress-header">
            ★ {t("gameLevel")} {currentLevel} • {Math.min(currentScenarioIndex + 1, SCENARIOS_PER_LEVEL)} {t("gameOf")} {SCENARIOS_PER_LEVEL}
          </div>

          {/* Virtue Health Bars */}
          <div className="game-splash-virtues-grid">
            {VIRTUES_CONFIG.map(({ key, icon }) => {
              const val = virtues[key] || 0;
              const pct = Math.min(100, Math.max(8, (val / MAX_VIRTUE_POINTS) * 100));
              const trKey = `virtue${key.charAt(0).toUpperCase() + key.slice(1)}`;
              const fullLabel = t(trKey) || key;

              return (
                <div key={key} className="game-splash-virtue-item">
                  <div className="game-splash-virtue-label">
                    <span>{icon} {fullLabel}</span>
                    <span className="game-hud-val">+{val}</span>
                  </div>
                  <div className="game-hud-bar" style={{ width: "100%", height: "7px" }}>
                    <div className="game-hud-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resume & New Game Buttons */}
          <div className="game-splash-actions">
            <button className="game-splash-btn" onClick={handleResume}>
              ▶ Resume Game
            </button>
            <button className="game-splash-btn-secondary" onClick={handleNewGame}>
              ↺ Start New Journey
            </button>
          </div>
        </div>
      ) : (
        /* Fresh Game Start */
        <>
          <p className="game-splash-desc">{t("gameEnterDesc")}</p>
          <button className="game-splash-btn" onClick={handleResume}>
            {t("gameEnterCity")}
          </button>
        </>
      )}
    </div>
  );
}
