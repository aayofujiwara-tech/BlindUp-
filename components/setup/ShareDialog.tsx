"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Level } from "@/lib/presets";
import { encodeConfig } from "@/lib/url";
import QRCode from "qrcode";

interface Props {
  levels: Level[];
  onClose: () => void;
}

export default function ShareDialog({ levels, onClose }: Props) {
  const t = useTranslations("setup");
  const locale = useLocale();
  const [includeBlinds, setIncludeBlinds] = useState(true);
  const [includeTheme, setIncludeTheme] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getUrl = () => {
    const data: Record<string, unknown> = {};
    if (includeBlinds) data.levels = levels;
    if (includeTheme) {
      try {
        const theme = localStorage.getItem("blindup_theme");
        if (theme) data.theme = JSON.parse(theme);
      } catch {}
    }
    const cfg = encodeConfig(data);
    return `${window.location.origin}/${locale}/timer?cfg=${cfg}`;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = getUrl();
    QRCode.toCanvas(canvasRef.current, url, { width: 180 });
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold">{t("shareTitle")}</h3>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeBlinds} onChange={(e) => setIncludeBlinds(e.target.checked)} />
          {t("includeBlinds")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeTheme} onChange={(e) => setIncludeTheme(e.target.checked)} />
          {t("includeTheme")}
        </label>
        <canvas ref={canvasRef} className="mx-auto rounded-lg" />
        <button onClick={handleCopy} className="w-full py-2 rounded-xl font-medium transition text-black" style={{ backgroundColor: "var(--accent)" }}>
          {copied ? t("copied") : t("shareUrl")}
        </button>
        <button onClick={onClose} className="text-sm opacity-60 hover:opacity-100">{t("cancel")}</button>
      </div>
    </div>
  );
}