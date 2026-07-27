"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { getGameScenarioUrl } from "@/lib/constants";

const STORAGE_KEY = "virtue_quest_progress";
const SCENARIOS_PER_LEVEL = 5;
const MAX_LEVEL = 3;

const DISTRICTS = ["home", "marketplace", "madrasa"];

const FALLBACK_SCENARIOS = [
  {
    id: "fb_1",
    situationText: "You see a lost traveler asking for directions near the marketplace.",
    options: [
      { text: "Guide them personally with kindness", virtue: "compassion", delta: 3, reflectionText: "Guiding others brings warmth and community spirit." },
      { text: "Point them to the nearest shopkeeper", virtue: "generosity", delta: 2, reflectionText: "Directing others wisely is helpful and considerate." },
      { text: "Hurry past to attend to your own tasks", virtue: "patience", delta: 1, reflectionText: "Staying focused is understandable, though small acts of help matter." }
    ]
  },
  {
    id: "fb_2",
    situationText: "A shopkeeper accidentally gives you extra change after a purchase.",
    options: [
      { text: "Return the excess money immediately", virtue: "honesty", delta: 4, reflectionText: "Honesty in trade preserves trust and moral integrity." },
      { text: "Inform the merchant of their mistake politely", virtue: "justice", delta: 3, reflectionText: "Justice and fairness build a righteous community." },
      { text: "Place the excess into a charity box nearby", virtue: "generosity", delta: 2, reflectionText: "Charity cleanses wealth, though returning extra change is best." }
    ]
  },
  {
    id: "fb_3",
    situationText: "Someone speaks in a heated tone due to a minor misunderstanding.",
    options: [
      { text: "Respond calmly and listen with patience", virtue: "patience", delta: 4, reflectionText: "Patience extinguishes anger like cool water." },
      { text: "Forgive their harsh tone with humility", virtue: "humility", delta: 3, reflectionText: "Humility protects your heart from pride and resentment." },
      { text: "Quietly step away to avoid conflict", virtue: "compassion", delta: 2, reflectionText: "Avoiding unnecessary conflict maintains peace." }
    ]
  },
  {
    id: "fb_4",
    situationText: "An elderly neighbor needs help carrying heavy bags up the street.",
    options: [
      { text: "Offer immediate help and carry the bags", virtue: "compassion", delta: 4, reflectionText: "Helping elders earns blessings and strengthens community bonds." },
      { text: "Walk beside them to offer support", virtue: "generosity", delta: 3, reflectionText: "Kind companionship brings joy to those in need." },
      { text: "Politely greet them as you pass by", virtue: "humility", delta: 1, reflectionText: "A pleasant greeting is good, though active help is even better." }
    ]
  },
  {
    id: "fb_5",
    situationText: "A dispute arises between two merchants over a shared space.",
    options: [
      { text: "Propose a fair and equal compromise", virtue: "justice", delta: 4, reflectionText: "Fairness and justice restore peace among neighbors." },
      { text: "Listen carefully to both sides first", virtue: "patience", delta: 3, reflectionText: "Patient listening is the foundation of wise resolution." },
      { text: "Encourage mutual forgiveness and generosity", virtue: "generosity", delta: 2, reflectionText: "Encouraging harmony cleanses hearts of malice." }
    ]
  }
];

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
      return {
        ...state,
        ...action.payload,
        phase: "idle",
        currentScenario: null,
        selectedOption: null,
      };

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
      return { ...state, error: action.payload };

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

    case "RESET_PROGRESS":
      return {
        ...INITIAL_STATE,
        muted: state.muted,
        liteMode: state.liteMode,
      };

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

  // Auto-recover scenario loading if in active gameplay phase but currentScenario is null
  useEffect(() => {
    if (
      state.phase !== "idle" &&
      state.phase !== "level_up" &&
      state.phase !== "game_complete" &&
      state.phase !== "loading_scenario" &&
      !state.currentScenario
    ) {
      dispatch({ type: "NEXT_SCENARIO" });
    }
  }, [state.phase, state.currentScenario]);

  // Fetch scenario when phase transitions to loading_scenario
  useEffect(() => {
    if (state.phase !== "loading_scenario") return;

    let cancelled = false;
    const district = getDistrictForScenario(state.currentScenarioIndex, state.currentLevel);

    (async () => {
      try {
        const targetUrl = getGameScenarioUrl();
        const res = await axios.post(targetUrl, {
          level: state.currentLevel,
          district,
          excludeIds: state.seenScenarioIds,
        }, { timeout: 2500 });

        if (!cancelled) {
          const scenario = res.data?.data || res.data;
          if (scenario && scenario.situationText) {
            dispatch({ type: "SCENARIO_LOADED", payload: scenario });
            return;
          }
          throw new Error("Invalid scenario response format");
        }
      } catch (err) {
        console.warn("Scenario API fetch failed, loading fallback scenario:", err);
        if (!cancelled) {
          const fallback = FALLBACK_SCENARIOS[(state.currentScenarioIndex + state.currentLevel) % FALLBACK_SCENARIOS.length];
          dispatch({ type: "SCENARIO_LOADED", payload: fallback });
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
  }, [state]);

  const importProgress = useCallback((code) => {
    try {
      const parsed = JSON.parse(atob(code));
      if (parsed && parsed.currentLevel) {
        dispatch({ type: "IMPORT_PROGRESS", payload: parsed });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        SCENARIOS_PER_LEVEL,
        MAX_LEVEL,
        exportProgress,
        importProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
