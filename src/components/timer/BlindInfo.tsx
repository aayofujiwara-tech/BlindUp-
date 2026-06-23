import { useTranslation } from "react-i18next";
import type { Level } from "@/lib/presets";
import { useGameStore } from "@/lib/store";

interface Props {
  level: Level;
  levelIndex: number;
}

export default function BlindInfo({ level, levelIndex }: Props) {
  const { t } = useTranslation("timer");
  const { levels } = useGameStore();
  const blindLevelCount = levels.slice(0, levelIndex + 1).filter((l) => l.type === "blind").length;

  if (level.type === "break") {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
          {t("break")}
        </p>
        <p className="text-5xl font-bold mt-2">{level.duration} min</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-lg opacity-60 mb-1">
        {t("level")} {blindLevelCount}
      </p>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <Chip label={t("sb")} value={level.sb ?? 0} />
        <Chip label={t("bb")} value={level.bb ?? 0} />
        {level.ante ? <Chip label={t("ante")} value={level.ante} /> : null}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs opacity-50 uppercase tracking-wider">{label}</span>
      <span className="text-4xl font-bold" style={{ color: "var(--accent)" }}>
        {value.toLocaleString()}
      </span>
    </div>
  );
}
