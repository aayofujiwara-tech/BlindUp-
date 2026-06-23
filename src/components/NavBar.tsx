import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t, i18n } = useTranslation("nav");
  const locale = i18n.language;

  const toggleLang = () => {
    const next = locale === "ja" ? "en" : "ja";
    i18n.changeLanguage(next);
    localStorage.setItem("i18nextLng", next);
  };

  return (
    <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>
          BlindUp
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/timer" className="text-sm hover:text-[var(--accent)] transition">
          {t("timer")}
        </Link>
        <Link to="/setup" className="text-sm hover:text-[var(--accent)] transition">
          {t("setup")}
        </Link>
        <button
          onClick={toggleLang}
          className="text-xs px-2 py-1 rounded border border-white/30 hover:bg-white/10 transition"
        >
          {locale === "ja" ? "EN" : "JA"}
        </button>
      </div>
    </nav>
  );
}
