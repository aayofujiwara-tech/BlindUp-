import { useTranslation } from "react-i18next";
import type { Level } from "@/lib/presets";

interface Props {
  levels: Level[];
  currentIndex: number;
}

export default function NextLevelPreview({ levels, currentIndex }: Props) {
  const { t } = useTranslation("timer");
  const next = levels[currentIndex + 1];
  if (!next) return null;

  return (
    <div className="text-center opacity-60 text-sm">
      <span className="mr-2">{t("next")}:</span>
      {next.type === "break" ? (
        <span>{t("break")} {next.duration}min</span>
      ) : (
        <span>
          {t("sb")} {next.sb?.toLocaleString()} / {t("bb")} {next.bb?.toLocaleString()}
          {next.ante ? ` / Ante ${next.ante.toLocaleString()}` : ""}
        </span>
      )}
    </div>
  );
}
