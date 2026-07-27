"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";
import { FullscreenToggle } from "./FullscreenToggle";
import { LiteModeToggle } from "./LiteModeToggle";
import { ProgressExport } from "./ProgressExport";
import { MuteToggle } from "./MuteToggle";

const VIRTUES_CONFIG = [
  { key: "honesty", icon: "🤝" },
  { key: "patience", icon: "⏳" },
  { key: "generosity", icon: "🎁" },
  { key: "compassion", icon: "❤️" },
  { key: "justice", icon: "⚖️" },
  { key: "humility", icon: "🌱" },
];

const MAX_VIRTUE_POINTS = 15;

export function MobileMenuDrawer({ containerRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, SCENARIOS_PER_LEVEL } = useGame();
  const { t } = useLocale();
  const { virtues, currentLevel, currentScenarioIndex } = state;

  return (
    <>
      {/* Mobile Three-Dot Menu Button */}
      <button
        className="game-mobile-menu-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Game Menu"
        title="Open Game Menu"
      >
        ⋮
      </button>

      {/* Slide-Over Right Drawer Overlay */}
      {isOpen && (
        <div className="game-drawer-backdrop" onClick={() => setIsOpen(false)}>
          <div className="game-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="game-drawer-header">
              <div className="game-drawer-title">
                ★ {t("gameLevel")} {currentLevel} • {Math.min(currentScenarioIndex + 1, SCENARIOS_PER_LEVEL)} {t("gameOf")} {SCENARIOS_PER_LEVEL}
              </div>
              <button
                className="game-drawer-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Quick Action Controls */}
            <div className="game-drawer-actions">
              <FullscreenToggle containerRef={containerRef} />
              <LiteModeToggle />
              <ProgressExport />
              <MuteToggle />
            </div>

            {/* Vertical Virtue Scores List */}
            <div className="game-drawer-section">
              <div className="game-drawer-section-title">{t("gameVirtueScore")}</div>
              <div className="game-drawer-virtues">
                {VIRTUES_CONFIG.map(({ key, icon }) => {
                  const val = virtues[key] || 0;
                  const pct = Math.min(100, Math.max(8, (val / MAX_VIRTUE_POINTS) * 100));
                  const trKey = `virtue${key.charAt(0).toUpperCase() + key.slice(1)}`;
                  const fullLabel = t(trKey) || key;

                  return (
                    <div key={key} className="game-drawer-virtue-item">
                      <div className="game-drawer-virtue-info">
                        <span>{icon} {fullLabel}</span>
                        <span className="game-hud-val">+{val}</span>
                      </div>
                      <div className="game-hud-bar" style={{ width: "100%", height: "8px" }}>
                        <div className="game-hud-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
