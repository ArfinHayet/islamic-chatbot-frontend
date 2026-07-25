"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

export function ReflectionPanel() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();
  const { currentScenario, selectedOption, phase } = state;

  if (phase !== "reflection" || selectedOption === null) return null;

  const option = currentScenario?.options?.[selectedOption];
  if (!option) return null;

  const handleContinue = () => {
    dispatch({ type: "PROCEED_AFTER_REFLECTION" });
  };

  const virtueKey = `virtue${option.virtue.charAt(0).toUpperCase() + option.virtue.slice(1)}`;
  const translatedVirtue = t(virtueKey) || option.virtue;

  return (
    <div className="game-reflection-panel">
      <div className="game-reflection-virtue game-reflection-virtue-flash">
        ✦ +{option.delta} {translatedVirtue}
      </div>
      <p className="game-reflection-text">"{option.reflection}"</p>
      <button className="game-continue-btn" onClick={handleContinue}>
        {t("gameContinue")}
      </button>
    </div>
  );
}
