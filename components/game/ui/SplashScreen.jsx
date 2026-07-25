"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

export function SplashScreen() {
  const { dispatch } = useGame();
  const { t } = useLocale();

  const handleStart = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="game-splash">
      <div className="game-splash-ornament">
        <div className="game-splash-ornament-inner" />
      </div>
      <h1 className="game-splash-title">{t("game")}</h1>
      <p className="game-splash-desc">{t("gameEnterDesc")}</p>
      <button className="game-splash-btn" onClick={handleStart}>
        {t("gameEnterCity")}
      </button>
    </div>
  );
}
