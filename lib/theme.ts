export interface ThemeConfig {
  accent: string;
  textColor: string;
  overlay: number;
  bgImage: string | null;
}

export const PRESET_THEMES: Record<string, ThemeConfig> = {
  dark: { accent: "#f59e0b", textColor: "#ffffff", overlay: 0, bgImage: null },
  casino: { accent: "#22c55e", textColor: "#ffffff", overlay: 30, bgImage: null },
  midnight: { accent: "#818cf8", textColor: "#ffffff", overlay: 50, bgImage: null },
  classic: { accent: "#dc2626", textColor: "#ffffff", overlay: 20, bgImage: null },
};

export function applyTheme(config: ThemeConfig) {
  document.documentElement.style.setProperty("--accent", config.accent);
  document.documentElement.style.setProperty("--text", config.textColor);
  document.documentElement.style.setProperty("--overlay-opacity", String(config.overlay / 100));
  if (config.bgImage) {
    document.body.style.backgroundImage = `url(${config.bgImage})`;
  } else {
    document.body.style.backgroundImage = "";
  }
}

const STORAGE_KEY = "blindup_theme";

export function saveTheme(config: ThemeConfig) {
  const { bgImage, ...rest } = config;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  if (bgImage && bgImage.startsWith("data:")) {
    localStorage.setItem("blindup_bg", bgImage);
  }
}

export function loadTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const bg = localStorage.getItem("blindup_bg");
    const base = raw ? JSON.parse(raw) : PRESET_THEMES.dark;
    return { ...base, bgImage: bg || null };
  } catch {
    return { ...PRESET_THEMES.dark, bgImage: null };
  }
}