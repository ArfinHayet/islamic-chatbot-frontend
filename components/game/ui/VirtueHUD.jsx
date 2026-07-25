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

export function VirtueHUD() {
  const { state, SCENARIOS_PER_LEVEL } = useGame();
  const { t } = useLocale();
  const { virtues, currentLevel, currentScenarioIndex } = state;

  return (
    <div className="game-hud">
      <div className="game-hud-items">
        {VIRTUES_CONFIG.map(({ key, icon }) => {
          const val = virtues[key] || 0;
          const pct = Math.min(100, Math.max(8, (val / MAX_VIRTUE_POINTS) * 100));
          const trKey = `virtue${key.charAt(0).toUpperCase() + key.slice(1)}`;
          const fullLabel = t(trKey) || key;

          return (
            <div key={key} className="game-hud-item" title={`${fullLabel}: ${val} points`}>
              <span className="game-hud-icon">{icon}</span>
              <span className="game-hud-label">{fullLabel}</span>
              <div className="game-hud-bar">
                <div className="game-hud-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="game-hud-val">+{val}</span>
            </div>
          );
        })}
      </div>

      <div className="game-hud-level">
        ★ {t("gameLevel")} {currentLevel} • {Math.min(currentScenarioIndex + 1, SCENARIOS_PER_LEVEL)} {t("gameOf")} {SCENARIOS_PER_LEVEL}
      </div>
    </div>
  );
}
