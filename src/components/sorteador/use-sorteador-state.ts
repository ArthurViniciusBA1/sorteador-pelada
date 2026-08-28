"use client";

import { useReducer } from "react";
import { type ParsedPlayer, parseRoster } from "@/lib/roster-parser";
import { type DrawConfig, type DrawResult, drawTeams, suggestNumTeams } from "@/lib/team-draw";

export type WizardStep = "paste" | "players" | "configure" | "confirm" | "results" | "finish";

export type WizardState = {
  step: WizardStep;
  rawRosterText: string;
  players: ParsedPlayer[];
  config: DrawConfig;
  goalkeeperIds: Set<string>;
  drawResult: DrawResult | null;
  teamNames: Record<string, string>;
};

export type WizardAction =
  | { type: "SET_RAW_TEXT"; text: string }
  | { type: "ADD_MANUAL_PLAYER"; name: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "SET_CONFIG"; patch: Partial<DrawConfig> }
  | { type: "TOGGLE_GOALKEEPER"; id: string }
  | { type: "DRAW" }
  | { type: "REDRAW" }
  | { type: "RENAME_TEAM"; teamId: string; name: string }
  | { type: "GO_TO_STEP"; step: WizardStep };

const initialState: WizardState = {
  step: "paste",
  rawRosterText: "",
  players: [],
  config: { numTeams: 2, playersPerTeam: 5, fixedGoalkeepers: false },
  goalkeeperIds: new Set(),
  drawResult: null,
  teamNames: {},
};

let manualPlayerCounter = 0;

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_RAW_TEXT":
      return { ...state, rawRosterText: action.text, players: parseRoster(action.text) };

    case "ADD_MANUAL_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      const id = `manual-${manualPlayerCounter++}`;
      return {
        ...state,
        players: [...state.players, { id, name, originSection: "manual" }],
      };
    }

    case "RENAME_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, name } : p)),
      };
    }

    case "REMOVE_PLAYER": {
      const goalkeeperIds = new Set(state.goalkeeperIds);
      goalkeeperIds.delete(action.id);
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
        goalkeeperIds,
      };
    }

    case "SET_CONFIG":
      return { ...state, config: { ...state.config, ...action.patch } };

    case "TOGGLE_GOALKEEPER": {
      const goalkeeperIds = new Set(state.goalkeeperIds);
      if (goalkeeperIds.has(action.id)) {
        goalkeeperIds.delete(action.id);
      } else {
        goalkeeperIds.add(action.id);
      }
      return { ...state, goalkeeperIds };
    }

    case "DRAW": {
      const drawResult = drawTeams(state.players, state.goalkeeperIds, state.config);
      return { ...state, drawResult, step: "results" };
    }

    case "REDRAW": {
      const drawResult = drawTeams(state.players, state.goalkeeperIds, state.config);
      return { ...state, drawResult };
    }

    case "RENAME_TEAM":
      return {
        ...state,
        teamNames: { ...state.teamNames, [action.teamId]: action.name },
      };

    case "GO_TO_STEP": {
      if (action.step === "configure") {
        const confirmedCount = state.players.length;
        // Keep whatever playersPerTeam the user already had, only shrinking it if the
        // roster got smaller since the last visit and it no longer fits at all.
        const playersPerTeam = Math.min(state.config.playersPerTeam, Math.max(1, confirmedCount));
        const numTeams = suggestNumTeams(confirmedCount, playersPerTeam);
        return {
          ...state,
          step: action.step,
          config: { ...state.config, playersPerTeam, numTeams },
        };
      }
      return { ...state, step: action.step };
    }

    default:
      return state;
  }
}

export function useSorteadorState() {
  return useReducer(reducer, initialState);
}
