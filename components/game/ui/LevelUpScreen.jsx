"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

const VIRTUE_KEYS = ["honesty", "patience", "generosity", "compassion", "justice", "humility"];

export function LevelUpScreen() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();
  const { virtues, currentLevel, phase } = state;

  if (phase !== "level_up") return null;

  const handleNextLevel = () => {
    dispatch({ type: "NEXT_LEVEL" });
  };

  return (
    <div className="game-level-screen">
      <div className="game-level-card">
        <div className="game-splash-ornament">
          <div className="game-splash-ornament-inner" />
        </div>
        <h2 className="game-level-title">{t("gameLevelUp")}</h2>
        <p className="game-level-subtitle">
          {t("gameLevelComplete")} {currentLevel - 1}
        </p>

        <div className="game-virtue-summary">
          {VIRTUE_KEYS.map((key) => {
            const val = virtues[key] || 0;
            const trKey = `virtue${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const label = t(trKey) || key;
            return (
              <div key={key} className="game-virtue-card">
                <div className="game-virtue-card-name">{label}</div>
                <div className="game-virtue-card-value">+{val}</div>
              </div>
            );
          })}
        </div>

        <button className="game-splash-btn" onClick={handleNextLevel}>
          {t("gameNextLevel")}
        </button>
      </div>
    </div>
  );
}
