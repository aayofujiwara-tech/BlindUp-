"use client";
import { useTranslations } from "next-intl";
import { useGameStore } from "@/lib/store";
import { activateTts } from "@/lib/tts";

export default function TimerControls() {
  const t = useTranslations("timer");
  const { isRunning, setIsRunning, nextLevel, prevLevel, resetTimer, currentLevelIndex } = useGameStore();

  const handleStart = () => {
    activateTts();
    setIsRunning(true);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <button
        onClick={prevLevel}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
      >
        ◀ Prev
      </button>
      <button
        onClick={resetTimer}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
      >
        ↺
      </button>
      <button
        onClick={isRunning ? () => setIsRunning(false) : handleStart}
        className="px-8 py-3 rounded-xl text-black font-bold text-lg transition hover:brightness-110"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {isRunning ? t("pause") : currentLevelIndex === 0 ? t("start") : t("resume")}
      </button>
      <button
        onClick={nextLevel}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
      >
        Next ▶
      </button>
    </div>
  );
}