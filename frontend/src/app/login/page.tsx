"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(username, password);
      router.push(ROLE_HOME[user.role]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(t("invalidCredentials"));
      } else {
        setError(t("serverUnreachable"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      <NetBackdrop />

      <div className="relative w-full max-w-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)]">
              <NetMark />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              {t("appTitle")}
            </span>
          </div>
          <LanguageToggle />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-8px_rgba(16,24,40,0.10)]">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-[var(--text)]">
              {t("loginSubtitle")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            {error && (
              <p className="rounded-md bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? t("loggingIn") : t("loginButton")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function NetMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function NetBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      aria-hidden="true"
    >
      <defs>
        <pattern id="net" width="42" height="42" patternUnits="userSpaceOnUse">
          <path
            d="M0 0 L42 42 M42 0 L0 42"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#net)" />
    </svg>
  );
}
