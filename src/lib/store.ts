import { create } from "zustand";
import type { Level } from "./presets";
import { PRESETS } from "./presets";

export interface Player {
  id: string;
  name: string;
  stack: number;
}

interface GameState {
  levels: Level[];
  currentLevelIndex: number;
  secondsLeft: number;
  isRunning: boolean;
  players: Player[];
  ttsEnabled: boolean;
  ttsVolume: number;
  setLevels: (levels: Level[]) => void;
  setCurrentLevelIndex: (idx: number) => void;
  setSecondsLeft: (s: number) => void;
  setIsRunning: (v: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setTtsEnabled: (v: boolean) => void;
  setTtsVolume: (v: number) => void;
  nextLevel: () => void;
  prevLevel: () => void;
  resetTimer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  levels: PRESETS[0].levels,
  currentLevelIndex: 0,
  secondsLeft: PRESETS[0].levels[0].duration * 60,
  isRunning: false,
  players: [],
  ttsEnabled: true,
  ttsVolume: 1,
  setLevels: (levels) => {
    const firstDuration = levels[0]?.duration ?? 15;
    set({ levels, currentLevelIndex: 0, secondsLeft: firstDuration * 60, isRunning: false });
  },
  setCurrentLevelIndex: (idx) => {
    const { levels } = get();
    const level = levels[idx];
    if (level) set({ currentLevelIndex: idx, secondsLeft: level.duration * 60 });
  },
  setSecondsLeft: (s) => set({ secondsLeft: s }),
  setIsRunning: (v) => set({ isRunning: v }),
  setPlayers: (players) => set({ players }),
  setTtsEnabled: (v) => set({ ttsEnabled: v }),
  setTtsVolume: (v) => set({ ttsVolume: v }),
  nextLevel: () => {
    const { levels, currentLevelIndex } = get();
    const next = currentLevelIndex + 1;
    if (next < levels.length) {
      set({ currentLevelIndex: next, secondsLeft: levels[next].duration * 60, isRunning: true });
    } else {
      set({ isRunning: false });
    }
  },
  prevLevel: () => {
    const { levels, currentLevelIndex } = get();
    const prev = Math.max(0, currentLevelIndex - 1);
    set({ currentLevelIndex: prev, secondsLeft: levels[prev].duration * 60, isRunning: false });
  },
  resetTimer: () => {
    const { levels, currentLevelIndex } = get();
    const level = levels[currentLevelIndex];
    if (level) set({ secondsLeft: level.duration * 60, isRunning: false });
  },
}));
