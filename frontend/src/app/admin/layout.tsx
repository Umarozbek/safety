"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/role-guard";
import { AdminSidebar, AdminMobileTopBar } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminMobileTopBar onMenu={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden bg-[var(--bg)] p-5 sm:p-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
