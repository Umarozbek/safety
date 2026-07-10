"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? ROLE_HOME[user.role] : "/login");
  }, [user, loading, router]);

  return (
    <div className="flex flex-1 items-center justify-center text-gray-500">
      {t("loading")}
    </div>
  );
}
