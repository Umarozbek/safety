"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCityOverview } from "@/lib/api";
import { CityOverview } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";

export default function AdminHomePage() {
  const { t } = useLocale();
  const [overview, setOverview] = useState<CityOverview[]>([]);

  useEffect(() => {
    fetchCityOverview().then(setOverview).catch(() => {});
  }, []);

  const totalCompleted = overview.reduce((s, c) => s + c.completedSqm, 0);
  const totalPending = overview.reduce((s, c) => s + c.pendingSqm, 0);
  const totalSites = overview.reduce((s, c) => s + c.siteCount, 0);

  return (
    <div>
      <PageHeader title={t("adminDashboard")} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          label={t("completedArea")}
          value={totalCompleted.toLocaleString()}
          unit="㎡"
        />
        <StatTile
          label={t("pendingArea")}
          value={totalPending.toLocaleString()}
          unit="㎡"
        />
        <StatTile label={t("siteCount")} value={totalSites} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickLink href="/admin/orders" label={t("navOrders")} />
        <QuickLink href="/admin/customers" label={t("navCustomers")} />
        <QuickLink href="/admin/teams" label={t("navTeams")} />
        <QuickLink href="/admin/workers" label={t("navWorkers")} />
      </div>

      <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
        {t("cityOverview")}
      </h2>
      <Table>
        <Thead>
          <Th>{t("cityName")}</Th>
          <Th>{t("completedArea")}</Th>
          <Th>{t("pendingArea")}</Th>
          <Th>{t("siteCount")}</Th>
        </Thead>
        <tbody>
          {overview.length === 0 && <EmptyRow colSpan={4} label={t("noData")} />}
          {overview.map((c) => (
            <tr key={c.id} className="border-t border-[var(--border)]">
              <Td className="font-medium">{c.name}</Td>
              <Td className="tabular">{c.completedSqm.toLocaleString()} ㎡</Td>
              <Td className="tabular">{c.pendingSqm.toLocaleString()} ㎡</Td>
              <Td className="tabular">{c.siteCount}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-soft-text)]"
    >
      {label}
    </Link>
  );
}
