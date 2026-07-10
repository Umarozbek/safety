"use client";

import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageToggle() {
  const { t, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--text)]"
    >
      {t("languageToggle")}
    </button>
  );
}
