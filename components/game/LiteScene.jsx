"use client";

import React from "react";
import { useGame } from "@/context/GameContext";

export function LiteScene() {
  const { state } = useGame();
  const district = state.currentScenario?.district || "home";

  return (
    <div className={`game-lite-bg game-lite-${district}`}>
      <div className="game-lite-pattern" />
    </div>
  );
}
