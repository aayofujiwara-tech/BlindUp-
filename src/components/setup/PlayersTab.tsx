import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameStore, type Player } from "@/lib/store";

export default function PlayersTab() {
  const { t } = useTranslation("setup");
  const { players, setPlayers } = useGameStore();
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");

  const addPlayer = () => {
    if (!name) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      stack: Number(stack) || 0,
    };
    setPlayers([...players, newPlayer]);
    setName("");
    setStack("");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updateStack = (id: string, value: number) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, stack: value } : p)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t("playerName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-[var(--accent)]"
        />
        <input
          type="number"
          placeholder={t("playerStack")}
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          className="w-28 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-[var(--accent)]"
        />
        <button
          onClick={addPlayer}
          className="px-4 py-2 rounded-lg text-black text-sm font-medium transition hover:brightness-110"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {t("addPlayer")}
        </button>
      </div>
      {players.length > 0 && (
        <div className="flex flex-col gap-2">
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
              <span className="flex-1 font-medium">{p.name}</span>
              <input
                type="number"
                value={p.stack}
                onChange={(e) => updateStack(p.id, Number(e.target.value))}
                className="w-28 bg-white/10 rounded px-2 py-1 text-sm text-right outline-none"
              />
              <button onClick={() => removePlayer(p.id)} className="text-red-400 hover:text-red-300 text-lg leading-none">
                ×
              </button>
            </div>
          ))}
          <p className="text-xs opacity-50 mt-1">
            {players.length} players · Avg {Math.round(players.reduce((s, p) => s + p.stack, 0) / players.length).toLocaleString()} chips
          </p>
        </div>
      )}
    </div>
  );
}
