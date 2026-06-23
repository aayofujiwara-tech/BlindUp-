"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locale === "ja" ? "en" : "ja";
  const newPath = pathname.replace(`/${locale}/`, `/${otherLocale}/`);

  return (
    <nav className="relative z-20 flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>
          BlindUp
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/timer`} className="text-sm hover:text-[var(--accent)] transition">
          {t("timer")}
        </Link>
        <Link href={`/${locale}/setup`} className="text-sm hover:text-[var(--accent)] transition">
          {t("setup")}
        </Link>
        <button
          onClick={() => router.push(newPath)}
          className="text-xs px-2 py-1 rounded border border-white/30 hover:bg-white/10 transition"
        >
          {locale === "ja" ? "EN" : "JA"}
        </button>
      </div>
    </nav>
  );
}