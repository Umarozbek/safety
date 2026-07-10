"use client";

import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageToggle } from "@/components/language-toggle";

const ROLE_LABEL_KEY = {
  BOSS: "roleBoss",
  ADMIN: "roleAdmin",
  WORKER: "roleWorker",
} as const;

export function TopBar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const { t } = useLocale();

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)]">
          <NetMark />
        </div>
        <h1 className="text-base font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-[var(--text)]">
              {user.username}
            </p>
            <p className="text-xs text-[var(--text-faint)]">
              {t(ROLE_LABEL_KEY[user.role])}
            </p>
          </div>
        )}
        <LanguageToggle />
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--bg)]"
        >
          {t("logout")}
        </button>
      </div>
    </header>
  );
}

function NetMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3h18M3 9h18M3 15h18M3 21h18M6 3v18M12 3v18M18 3v18"
        stroke="var(--accent-contrast)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}
