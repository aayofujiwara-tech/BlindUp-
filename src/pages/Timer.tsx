import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGameStore } from "@/lib/store";
import { speak } from "@/lib/tts";
import { decodeConfig } from "@/lib/url";
import { applyTheme, type ThemeConfig } from "@/lib/theme";
import type { Level } from "@/lib/presets";
import TimerDisplay from "@/components/timer/TimerDisplay";
import BlindInfo from "@/components/timer/BlindInfo";
import TimerControls from "@/components/timer/TimerControls";
import NextLevelPreview from "@/components/timer/NextLevelPreview";
import PlayerStats from "@/components/timer/PlayerStats";
import NavBar from "@/components/NavBar";
import ProgressBar from "@/components/timer/ProgressBar";

export default function Timer() {
  const { t, i18n } = useTranslation("tts");
  const locale = i18n.language;
  const [searchParams] = useSearchParams();
  const {
    levels,
    currentLevelIndex,
    secondsLeft,
    isRunning,
    ttsEnabled,
    ttsVolume,
    setSecondsLeft,
    setLevels,
    nextLevel,
  } = useGameStore();

  const oneMinWarned = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cfgApplied = useRef(false);

  useEffect(() => {
    if (cfgApplied.current) return;
    cfgApplied.current = true;
    const cfg = searchParams.get("cfg");
    if (!cfg) return;
    const data = decodeConfig<{ levels?: Level[]; theme?: ThemeConfig }>(cfg);
    if (data?.levels) setLevels(data.levels);
    if (data?.theme) applyTheme({ ...data.theme, bgImage: null });
  }, []);

  const currentLevel = levels[currentLevelIndex];
  const totalSeconds = currentLevel ? currentLevel.duration * 60 : 0;

  const announce = useCallback(
    (text: string) => {
      if (ttsEnabled) speak(text, locale, ttsVolume);
    },
    [ttsEnabled, locale, ttsVolume]
  );

  const handleLevelUp = useCallback(() => {
    const nextIdx = currentLevelIndex + 1;
    if (nextIdx >= levels.length) return;
    const next = levels[nextIdx];
    oneMinWarned.current = false;
    if (next.type === "break") {
      announce(t("breakStart", { duration: next.duration }));
    } else if (next.ante) {
      announce(t("levelUpAnte", { level: nextIdx + 1, sb: next.sb, bb: next.bb, ante: next.ante }));
    } else {
      announce(t("levelUp", { level: nextIdx + 1, sb: next.sb, bb: next.bb }));
    }
    nextLevel();
  }, [currentLevelIndex, levels, nextLevel, announce, t]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const current = useGameStore.getState().secondsLeft;
      const next = current - 1;
      setSecondsLeft(next);
      if (next === 60 && !oneMinWarned.current) {
        oneMinWarned.current = true;
        announce(t("oneMinute"));
      }
      if (next <= 0) {
        handleLevelUp();
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, setSecondsLeft, handleLevelUp, announce, t]);

  if (!currentLevel) return <div className="text-white p-8">No levels configured</div>;

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 relative z-10">
        <div className="lg:hidden flex flex-col items-center px-4 py-6 gap-4">
          <BlindInfo level={currentLevel} levelIndex={currentLevelIndex} />
          <TimerDisplay secondsLeft={secondsLeft} />
          <ProgressBar secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
          <TimerControls />
          <NextLevelPreview levels={levels} currentIndex={currentLevelIndex} />
          <PlayerStats />
        </div>
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 px-8 py-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-4">
            <BlindInfo level={currentLevel} levelIndex={currentLevelIndex} />
            <NextLevelPreview levels={levels} currentIndex={currentLevelIndex} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <TimerDisplay secondsLeft={secondsLeft} />
            <ProgressBar secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
            <TimerControls />
          </div>
          <div className="flex flex-col gap-4">
            <PlayerStats />
          </div>
        </div>
      </div>
    </div>
  );
}
