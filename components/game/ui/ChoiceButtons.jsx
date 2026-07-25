"use client";

import React from "react";
import { useGame } from "@/context/GameContext";

export function ChoiceButtons() {
  const { state, dispatch } = useGame();
  const { currentScenario, phase, selectedOption } = state;

  if (!currentScenario?.options) return null;

  const isAwaiting = phase === "awaiting_choice";
  const isCommitted = phase === "choice_committed" || phase === "reflection";

  if (!isAwaiting && !isCommitted) return null;

  const handleSelect = (index) => {
    if (!isAwaiting) return;
    dispatch({ type: "COMMIT_CHOICE", payload: index });
    // Short camera beat before moving to reflection
    setTimeout(() => {
      dispatch({ type: "SHOW_REFLECTION" });
    }, 400);
  };

  return (
    <div className="game-choices">
      {currentScenario.options.map((option, idx) => {
        const isSelected = selectedOption === idx;
        return (
          <button
            key={idx}
            className={`game-choice-btn ${isSelected ? "selected" : ""}`}
            onClick={() => handleSelect(idx)}
            disabled={!isAwaiting}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}
