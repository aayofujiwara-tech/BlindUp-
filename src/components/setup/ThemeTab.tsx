import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PRESET_THEMES, applyTheme, saveTheme, loadTheme, type ThemeConfig } from "@/lib/theme";
import { useGameStore } from "@/lib/store";

export default function ThemeTab() {
  const { t } = useTranslation("setup");
  const { ttsEnabled, ttsVolume, setTtsEnabled, setTtsVolume } = useGameStore();
  const [theme, setTheme] = useState<ThemeConfig>(() => loadTheme());

  useEffect(() => {
    const stored = loadTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const updateTheme = useCallback(
    (partial: Partial<ThemeConfig>) => {
      const next = { ...theme, ...partial };
      setTheme(next);
      applyTheme(next);
      saveTheme(next);
    },
    [theme]
  );

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateTheme({ bgImage: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-3">{t("themePresets")}</h2>
        <div className="grid grid-cols-2 gap-2">
          {(["dark", "casino", "midnight", "classic"] as const).map((id) => {
            const pt = PRESET_THEMES[id];
            const labels: Record<string, string> = { dark: t("dark"), casino: t("casino"), midnight: t("midnight"), classic: t("classic") };
            return (
              <button key={id} onClick={() => updateTheme(pt)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10">
                <span className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: pt.accent }} />
                <span className="text-sm">{labels[id]}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("bgImage")}</h2>
        <label className="cursor-pointer px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm inline-block transition">
          {t("uploadBg")}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleBgUpload} />
        </label>
        {theme.bgImage && (
          <button onClick={() => updateTheme({ bgImage: null })} className="ml-3 text-sm text-red-400 hover:text-red-300">×</button>
        )}
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("overlay")}: {theme.overlay}%</h2>
        <input type="range" min={0} max={80} value={theme.overlay} onChange={(e) => updateTheme({ overlay: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("accentColor")}</h2>
        <div className="flex items-center gap-3">
          <input type="color" value={theme.accent} onChange={(e) => updateTheme({ accent: e.target.value })} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
          <input type="text" value={theme.accent} onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && updateTheme({ accent: e.target.value })} className="bg-white/10 rounded-lg px-3 py-1.5 text-sm font-mono w-28" />
        </div>
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("textColor")}</h2>
        <div className="flex gap-2">
          {(["#ffffff", "#000000"] as const).map((c) => (
            <button key={c} onClick={() => updateTheme({ textColor: c })} className={`px-4 py-2 rounded-lg text-sm border transition ${theme.textColor === c ? "border-[var(--accent)]" : "border-white/20"}`} style={{ background: c === "#ffffff" ? "#1a1a2e" : "#f0f0f0", color: c === "#ffffff" ? "#fff" : "#000" }}>
              {c === "#ffffff" ? t("white") : t("black")}
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-medium opacity-60 mb-2">{t("ttsEnabled")}</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ttsEnabled} onChange={(e) => setTtsEnabled(e.target.checked)} />
          <span className="text-sm">{t("ttsEnabled")}</span>
        </label>
        {ttsEnabled && (
          <div className="mt-3">
            <p className="text-sm opacity-60 mb-1">{t("ttsVolume")}: {Math.round(ttsVolume * 100)}%</p>
            <input type="range" min={0} max={1} step={0.1} value={ttsVolume} onChange={(e) => setTtsVolume(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
          </div>
        )}
      </section>
    </div>
  );
}
