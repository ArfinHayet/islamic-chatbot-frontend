"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

export function MuteToggle() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();

  return (
    <button
      className="game-control-btn"
      onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
      title={state.muted ? t("gameUnmute") : t("gameMute")}
    >
      {state.muted ? "🔇" : "🔊"}
    </button>
  );
}
