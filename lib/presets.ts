export type LevelType = "blind" | "break";

export interface Level {
  type: LevelType;
  sb?: number;
  bb?: number;
  ante?: number;
  duration: number;
}

export interface Preset {
  id: string;
  nameJa: string;
  nameEn: string;
  startingStack: number;
  levels: Level[];
}

export const PRESETS: Preset[] = [
  {
    id: "standard",
    nameJa: "スタンダード",
    nameEn: "Standard",
    startingStack: 10000,
    levels: [
      { type: "blind", sb: 50, bb: 100, duration: 15 },
      { type: "blind", sb: 75, bb: 150, duration: 15 },
      { type: "blind", sb: 100, bb: 200, duration: 15 },
      { type: "blind", sb: 150, bb: 300, duration: 15 },
      { type: "break", duration: 10 },
      { type: "blind", sb: 200, bb: 400, ante: 50, duration: 20 },
      { type: "blind", sb: 300, bb: 600, ante: 75, duration: 20 },
      { type: "blind", sb: 400, bb: 800, ante: 100, duration: 20 },
      { type: "blind", sb: 600, bb: 1200, ante: 150, duration: 20 },
      { type: "break", duration: 10 },
      { type: "blind", sb: 800, bb: 1600, ante: 200, duration: 20 },
      { type: "blind", sb: 1000, bb: 2000, ante: 300, duration: 20 },
      { type: "blind", sb: 1500, bb: 3000, ante: 400, duration: 20 },
      { type: "blind", sb: 2000, bb: 4000, ante: 500, duration: 20 },
    ],
  },
  {
    id: "turbo",
    nameJa: "ターボ",
    nameEn: "Turbo",
    startingStack: 10000,
    levels: [
      { type: "blind", sb: 100, bb: 200, duration: 10 },
      { type: "blind", sb: 150, bb: 300, duration: 10 },
      { type: "blind", sb: 200, bb: 400, ante: 50, duration: 10 },
      { type: "blind", sb: 300, bb: 600, ante: 75, duration: 10 },
      { type: "break", duration: 5 },
      { type: "blind", sb: 400, bb: 800, ante: 100, duration: 10 },
      { type: "blind", sb: 600, bb: 1200, ante: 150, duration: 10 },
      { type: "blind", sb: 800, bb: 1600, ante: 200, duration: 10 },
      { type: "blind", sb: 1000, bb: 2000, ante: 300, duration: 10 },
      { type: "blind", sb: 1500, bb: 3000, ante: 400, duration: 10 },
    ],
  },
  {
    id: "deepstack",
    nameJa: "ディープスタック",
    nameEn: "Deep Stack",
    startingStack: 20000,
    levels: [
      { type: "blind", sb: 25, bb: 50, duration: 20 },
      { type: "blind", sb: 50, bb: 100, duration: 20 },
      { type: "blind", sb: 75, bb: 150, duration: 20 },
      { type: "blind", sb: 100, bb: 200, duration: 20 },
      { type: "break", duration: 15 },
      { type: "blind", sb: 150, bb: 300, duration: 30 },
      { type: "blind", sb: 200, bb: 400, ante: 50, duration: 30 },
      { type: "blind", sb: 300, bb: 600, ante: 75, duration: 30 },
      { type: "blind", sb: 400, bb: 800, ante: 100, duration: 30 },
      { type: "break", duration: 15 },
      { type: "blind", sb: 600, bb: 1200, ante: 150, duration: 30 },
      { type: "blind", sb: 800, bb: 1600, ante: 200, duration: 30 },
      { type: "blind", sb: 1000, bb: 2000, ante: 300, duration: 30 },
      { type: "blind", sb: 1500, bb: 3000, ante: 400, duration: 30 },
      { type: "break", duration: 15 },
      { type: "blind", sb: 2000, bb: 4000, ante: 500, duration: 30 },
      { type: "blind", sb: 3000, bb: 6000, ante: 700, duration: 30 },
    ],
  },
];