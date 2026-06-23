import { useState } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/NavBar";
import BlindsTab from "@/components/setup/BlindsTab";
import ThemeTab from "@/components/setup/ThemeTab";
import PlayersTab from "@/components/setup/PlayersTab";

type Tab = "blinds" | "theme" | "players";

export default function Setup() {
  const { t } = useTranslation("setup");
  const [tab, setTab] = useState<Tab>("blinds");

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="relative z-10 flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        <div className="flex gap-1 mb-6 bg-white/10 rounded-xl p-1">
          {(["blinds", "theme", "players"] as Tab[]).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                tab === id ? "bg-[var(--accent)] text-black" : "hover:bg-white/10"
              }`}
            >
              {id === "blinds" ? t("blindsTab") : id === "theme" ? t("themeTab") : t("playersTab")}
            </button>
          ))}
        </div>
        {tab === "blinds" && <BlindsTab />}
        {tab === "theme" && <ThemeTab />}
        {tab === "players" && <PlayersTab />}
      </div>
    </div>
  );
}
