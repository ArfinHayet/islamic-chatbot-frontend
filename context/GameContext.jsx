"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { GAME_SCENARIO_URL } from "@/lib/constants";

const STORAGE_KEY = "virtue_quest_progress";
const SCENARIOS_PER_LEVEL = 5;
const MAX_LEVEL = 3;

const DISTRICTS = ["home", "marketplace", "madrasa"];

const INITIAL_STATE = {
  phase: "idle",
  currentLevel: 1,
  currentScenarioIndex: 0,
  currentScenario: null,
  selectedOption: null,
  virtues: { honesty: 0, patience: 0, generosity: 0, compassion: 0, justice: 0, humility: 0 },
  seenScenarioIds: [],
  muted: false,
  liteMode: false,
  error: null,
};

function getDistrictForScenario(scenarioIndex, level) {
  return DISTRICTS[(scenarioIndex + (level - 1)) % DISTRICTS.length];
}

function gameReducer(state, action) {
  switch (action.type) {
    case "RESTORE":
      return { ...state, ...action.payload, phase: action.payload.phase === "loading_scenario" ? "idle" : action.payload.phase };

    case "START_GAME":
      return { ...state, phase: "loading_scenario", error: null };

    case "SCENARIO_LOADED":
      return {
        ...state,
        phase: "awaiting_choice",
        currentScenario: action.payload,
        selectedOption: null,
        error: null,
      };

    case "SCENARIO_ERROR":
      return { ...state, phase: "idle", error: action.payload };

    case "INTRO_COMPLETE":
      return { ...state, phase: "awaiting_choice" };

    case "COMMIT_CHOICE": {
      const option = state.currentScenario?.options?.[action.payload];
      if (!option) return state;
      return {
        ...state,
        phase: "choice_committed",
        selectedOption: action.payload,
      };
    }

    case "SHOW_REFLECTION":
      return { ...state, phase: "reflection" };

    case "PROCEED_AFTER_REFLECTION": {
      const option = state.currentScenario?.options?.[state.selectedOption];
      if (!option) return state;

      const newVirtues = { ...state.virtues };
      newVirtues[option.virtue] = (newVirtues[option.virtue] || 0) + option.delta;

      const newSeenIds = state.currentScenario?.id
        ? [...state.seenScenarioIds, state.currentScenario.id]
        : state.seenScenarioIds;

      const nextIndex = state.currentScenarioIndex + 1;

      if (nextIndex >= SCENARIOS_PER_LEVEL) {
        if (state.currentLevel >= MAX_LEVEL) {
          return {
            ...state,
            phase: "game_complete",
            virtues: newVirtues,
            seenScenarioIds: newSeenIds,
            currentScenarioIndex: nextIndex,
            currentScenario: null,
            selectedOption: null,
          };
        }
        return {
          ...state,
          phase: "level_up",
          virtues: newVirtues,
          seenScenarioIds: newSeenIds,
          currentScenarioIndex: nextIndex,
          currentScenario: null,
          selectedOption: null,
        };
      }

      return {
        ...state,
        phase: "loading_scenario",
        virtues: newVirtues,
        seenScenarioIds: newSeenIds,
        currentScenarioIndex: nextIndex,
        currentScenario: null,
        selectedOption: null,
      };
    }

    case "NEXT_SCENARIO":
      return { ...state, phase: "loading_scenario", error: null };

    case "NEXT_LEVEL":
      return {
        ...state,
        phase: "loading_scenario",
        currentLevel: state.currentLevel + 1,
        currentScenarioIndex: 0,
        error: null,
      };

    case "RESET_GAME":
      return { ...INITIAL_STATE, muted: state.muted, liteMode: state.liteMode };

    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };

    case "TOGGLE_LITE_MODE":
      return { ...state, liteMode: !state.liteMode };

    case "IMPORT_PROGRESS":
      return { ...state, ...action.payload, phase: "idle" };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const initialized = useRef(false);

  // Restore from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && parsed.currentLevel) {
          dispatch({ type: "RESTORE", payload: parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (!initialized.current) return;
    try {
      const toSave = {
        phase: state.phase,
        currentLevel: state.currentLevel,
        currentScenarioIndex: state.currentScenarioIndex,
        virtues: state.virtues,
        seenScenarioIds: state.seenScenarioIds,
        muted: state.muted,
        liteMode: state.liteMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [state]);

  // Fetch scenario when phase transitions to loading_scenario
  useEffect(() => {
    if (state.phase !== "loading_scenario") return;

    let cancelled = false;
    const district = getDistrictForScenario(state.currentScenarioIndex, state.currentLevel);

    (async () => {
      try {
        const res = await axios.post(GAME_SCENARIO_URL, {
          level: state.currentLevel,
          district,
          excludeIds: state.seenScenarioIds,
        });
        if (!cancelled) {
          const scenario = res.data?.data || res.data;
          dispatch({ type: "SCENARIO_LOADED", payload: scenario });
        }
      } catch (err) {
        if (!cancelled) {
          dispatch({ type: "SCENARIO_ERROR", payload: err.message || "Failed to load scenario" });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [state.phase, state.currentLevel, state.currentScenarioIndex, state.seenScenarioIds]);

  const exportProgress = useCallback(() => {
    const data = {
      currentLevel: state.currentLevel,
      currentScenarioIndex: state.currentScenarioIndex,
      virtues: state.virtues,
      seenScenarioIds: state.seenScenarioIds,
    };
    return btoa(JSON.stringify(data));
  }, [state.currentLevel, state.currentScenarioIndex, state.virtues, state.seenScenarioIds]);

  const importProgress = useCallback((code) => {
    try {
      const parsed = JSON.parse(atob(code));
      if (parsed && typeof parsed === "object" && parsed.currentLevel && parsed.virtues) {
        dispatch({ type: "IMPORT_PROGRESS", payload: parsed });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, exportProgress, importProgress, SCENARIOS_PER_LEVEL, MAX_LEVEL }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
