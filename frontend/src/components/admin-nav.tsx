"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { useAuth } from "@/lib/auth-context";
import { LanguageToggle } from "@/components/language-toggle";

const LINKS = [
  { href: "/admin", labelKey: "adminDashboard", icon: GridIcon },
  { href: "/admin/orders", labelKey: "navOrders", icon: BoxIcon },
  { href: "/admin/customers", labelKey: "navCustomers", icon: BuildingIcon },
  { href: "/admin/cities", labelKey: "navCities", icon: PinIcon },
  { href: "/admin/teams", labelKey: "navTeams", icon: UsersIcon },
  { href: "/admin/workers", labelKey: "navWorkers", icon: HardHatIcon },
] as const;

export function AdminSidebar() {
  const { t } = useLocale();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)]">
          <NetMark />
        </div>
        <span className="text-sm font-semibold leading-tight text-[var(--text)]">
          {t("appTitle")}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--accent-soft)] text-[var(--accent-soft-text)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
              }`}
            >
              <Icon active={active} />
              {t(link.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <LanguageToggle />
        </div>
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-soft-text)]">
            {user?.username.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--text)]">
              {user?.username}
            </p>
            <p className="text-xs text-[var(--text-faint)]">
              {t("roleAdmin")}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label={t("logout")}
            title={t("logout")}
            className="shrink-0 rounded-md p-1.5 text-[var(--text-faint)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NetMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function iconStroke(active: boolean) {
  return active ? "var(--accent-soft-text)" : "currentColor";
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={iconStroke(active)} strokeWidth="2" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={iconStroke(active)} strokeWidth="2" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={iconStroke(active)} strokeWidth="2" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={iconStroke(active)} strokeWidth="2" />
    </svg>
  );
}

function BoxIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 8 12 3 3 8v8l9 5 9-5V8Z"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M3 8l9 5 9-5M12 13v8" stroke={iconStroke(active)} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1" stroke={iconStroke(active)} strokeWidth="2" />
      <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" stroke={iconStroke(active)} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Z"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.3" stroke={iconStroke(active)} strokeWidth="2" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke={iconStroke(active)} strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={iconStroke(active)} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 9a3 3 0 1 0 0-6M18 20c0-2.6-1.7-4.8-4-5.6" stroke={iconStroke(active)} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HardHatIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 15a8 8 0 0 1 16 0"
        stroke={iconStroke(active)}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="2" y="15" width="20" height="3" rx="1" stroke={iconStroke(active)} strokeWidth="2" />
      <path d="M12 7V4" stroke={iconStroke(active)} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
