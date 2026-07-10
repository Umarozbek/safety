"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";

export function RoleGuard({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace("/login");
    }
  }, [user, loading, allow, router]);

  if (loading || !user || !allow.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        {t("loading")}
      </div>
    );
  }

  return <>{children}</>;
}
