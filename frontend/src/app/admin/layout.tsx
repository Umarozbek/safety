"use client";

import { RoleGuard } from "@/components/role-guard";
import { AdminSidebar } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden bg-[var(--bg)] p-5 sm:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
