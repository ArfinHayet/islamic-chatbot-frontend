"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

export function LiteModeToggle() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();

  return (
    <button
      className="game-control-btn"
      style={{ width: "auto", padding: "0 10px", fontSize: 12, fontWeight: 500 }}
      onClick={() => dispatch({ type: "TOGGLE_LITE_MODE" })}
      title={t("gameLiteMode")}
    >
      {state.liteMode ? "🎨 2D Mode" : "🏛️ 3D City"}
    </button>
  );
}
