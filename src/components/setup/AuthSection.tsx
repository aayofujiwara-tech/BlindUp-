import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Level } from "@/lib/presets";
import { useGameStore } from "@/lib/store";

interface SavedPreset {
  id: string;
  name: string;
  memo: string;
  levels: Level[];
}

interface Props {
  levels: Level[];
}

export default function AuthSection({ levels }: Props) {
  const { t } = useTranslation("setup");
  const { setLevels } = useGameStore();
  const [user, setUser] = useState<User | null>(null);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadPresets(u.uid);
    });
    return unsub;
  }, []);

  const loadPresets = async (uid: string) => {
    try {
      const q = query(collection(db, "users", uid, "presets"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPresets(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedPreset, "id">) })));
    } catch {}
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setPresets([]);
  };

  const handleSave = async () => {
    if (!user) return;
    if (presets.length >= 5) { setError(t("maxPresetsError")); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "users", user.uid, "presets"), {
        name, memo, levels, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setShowSave(false); setName(""); setMemo("");
      await loadPresets(user.uid);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "presets", id));
    await loadPresets(user.uid);
  };

  if (!user) {
    return (
      <div className="mt-2">
        <button onClick={handleLogin} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
          {t("login")} (Google)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-60">{user.email}</span>
        <div className="flex gap-2">
          <button onClick={() => setShowSave(!showSave)} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[var(--accent)] hover:text-black text-sm transition">
            {t("savePreset")}
          </button>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
            {t("logout")}
          </button>
        </div>
      </div>
      {showSave && (
        <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input type="text" placeholder={t("presetName")} value={name} onChange={(e) => setName(e.target.value)} className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-[var(--accent)]" />
          <input type="text" placeholder={t("presetMemo")} value={memo} onChange={(e) => setMemo(e.target.value)} className="bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 ring-[var(--accent)]" />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !name} className="px-4 py-2 rounded-lg text-black text-sm font-medium disabled:opacity-50 transition" style={{ backgroundColor: "var(--accent)" }}>
              {t("save")}
            </button>
            <button onClick={() => setShowSave(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
      {presets.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm opacity-60">{t("savedPresets")}</h3>
          {presets.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                {p.memo && <p className="text-xs opacity-50">{p.memo}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLevels(p.levels)} className="text-xs px-3 py-1 rounded bg-[var(--accent)] text-black font-medium">Load</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
