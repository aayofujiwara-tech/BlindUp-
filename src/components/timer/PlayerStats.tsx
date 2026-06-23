import { useTranslation } from "react-i18next";
import { useGameStore } from "@/lib/store";

export default function PlayerStats() {
  const { t } = useTranslation("timer");
  const { players } = useGameStore();
  if (players.length === 0) return null;

  const total = players.reduce((s, p) => s + p.stack, 0);
  const avg = players.length > 0 ? Math.round(total / players.length) : 0;

  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <p className="text-sm opacity-60">{t("players")}: {players.length}</p>
      <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
        {t("avgStack")}: {avg.toLocaleString()}
      </p>
    </div>
  );
}
