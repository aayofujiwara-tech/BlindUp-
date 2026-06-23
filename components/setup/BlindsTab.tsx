"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { PRESETS } from "@/lib/presets";
import type { Level } from "@/lib/presets";
import { useGameStore } from "@/lib/store";
import LevelEditor from "./LevelEditor";
import ShareDialog from "./ShareDialog";
import AuthSection from "./AuthSection";

export default function BlindsTab() {
  const t = useTranslations("setup");
  const locale = useLocale();
  const router = useRouter();
  const { levels, setLevels } = useGameStore();
  const [editLevels, setEditLevels] = useState<Level[]>(levels);
  const [showShare, setShowShare] = useState(false);

  const handlePreset = (id: string) => {
    const p = PRESETS.find((p) => p.id === id);
    if (p) {
      setEditLevels(p.levels);
      setLevels(p.levels);
    }
  };

  const handleStart = () => {
    setLevels(editLevels);
    router.push(`/${locale}/timer`);
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("presets")}</h2>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePreset(p.id)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-[var(--accent)] hover:text-black text-sm font-medium transition"
            >
              {locale === "ja" ? p.nameJa : p.nameEn}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("customLevels")}</h2>
        <LevelEditor levels={editLevels} onChange={setEditLevels} />
      </section>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-xl font-bold text-black transition hover:brightness-110"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {t("startGame")}
        </button>
        <button
          onClick={() => setShowShare(true)}
          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium text-sm transition"
        >
          {t("shareUrl")}
        </button>
      </div>
      <AuthSection levels={editLevels} />
      {showShare && <ShareDialog levels={editLevels} onClose={() => setShowShare(false)} />}
    </div>
  );
}