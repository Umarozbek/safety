"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/role-guard";
import { TopBar } from "@/components/top-bar";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { fetchCities, fetchCityOverview, fetchOrders } from "@/lib/api";
import { City, CityOverview, Order, OrderStatus } from "@/lib/types";
import { StatTile } from "@/components/ui/stat-tile";
import { Field, Label, Select } from "@/components/ui/input";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";
import { OrderStatusPill } from "@/components/ui/pill";

const STATUS_OPTIONS: OrderStatus[] = [
  "RECEIVED",
  "IN_PRODUCTION",
  "DELIVERED",
  "INSTALLED",
  "COMPLETED",
];

const STATUS_KEY: Record<OrderStatus, TranslationKey> = {
  RECEIVED: "statusReceived",
  IN_PRODUCTION: "statusInProduction",
  DELIVERED: "statusDelivered",
  INSTALLED: "statusInstalled",
  COMPLETED: "statusCompleted",
};

export default function BossDashboardPage() {
  const { t } = useLocale();
  const [overview, setOverview] = useState<CityOverview[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [cityFilter, setCityFilter] = useState<number | "">("");

  useEffect(() => {
    fetchCityOverview().then(setOverview).catch(() => {});
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    fetchOrders({
      status: statusFilter || undefined,
      cityId: cityFilter || undefined,
    })
      .then(setOrders)
      .catch(() => {});
  }, [statusFilter, cityFilter]);

  const totalCompleted = overview.reduce((sum, c) => sum + c.completedSqm, 0);
  const totalPending = overview.reduce((sum, c) => sum + c.pendingSqm, 0);
  const activeTeams = new Set(
    orders.flatMap((o) => o.jobAssignments.map((ja) => ja.teamId)),
  ).size;

  const maxSqm = Math.max(
    1,
    ...overview.map((c) => c.completedSqm + c.pendingSqm),
  );

  return (
    <RoleGuard allow={["BOSS"]}>
      <TopBar title={t("bossDashboard")} />
      <main className="flex-1 bg-[var(--bg)] p-4 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <StatTile label={t("activeTeams")} value={activeTeams} />
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
              {t("cityOverview")}
            </h2>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
              <div className="space-y-4">
                {overview.length === 0 && (
                  <p className="py-6 text-center text-sm text-[var(--text-faint)]">
                    {t("noData")}
                  </p>
                )}
                {overview.map((c) => {
                  const total = c.completedSqm + c.pendingSqm;
                  const completedPct = (c.completedSqm / maxSqm) * 100;
                  const pendingPct = (c.pendingSqm / maxSqm) * 100;
                  return (
                    <div key={c.id}>
                      <div className="mb-1.5 flex items-baseline justify-between text-sm">
                        <span className="font-medium text-[var(--text)]">
                          {c.name}
                        </span>
                        <span className="tabular text-xs text-[var(--text-faint)]">
                          {total.toLocaleString()} ㎡ &middot; {c.siteCount}{" "}
                          {t("siteCount")}
                        </span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                        <div
                          className="h-full bg-[var(--status-completed-text)]"
                          style={{ width: `${completedPct}%` }}
                        />
                        <div
                          className="h-full bg-[var(--status-delivered-text)]"
                          style={{ width: `${pendingPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {overview.length > 0 && (
                <div className="mt-4 flex gap-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--status-completed-text)]" />
                    {t("completedArea")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--status-delivered-text)]" />
                    {t("pendingArea")}
                  </span>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-sm font-semibold text-[var(--text)]">
                {t("navOrders")}
              </h2>
              <div className="flex flex-wrap gap-3">
                <Field>
                  <Label>{t("filterByStatus")}</Label>
                  <Select
                    aria-label={t("filterByStatus")}
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as OrderStatus | "")
                    }
                    className="w-44"
                  >
                    <option value="">{t("all")}</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {t(STATUS_KEY[s])}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field>
                  <Label>{t("filterByCity")}</Label>
                  <Select
                    aria-label={t("filterByCity")}
                    value={cityFilter}
                    onChange={(e) =>
                      setCityFilter(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-44"
                  >
                    <option value="">{t("all")}</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>

            <Table>
              <Thead>
                <Th>{t("orderNumber")}</Th>
                <Th>{t("customer")}</Th>
                <Th>{t("city")}</Th>
                <Th>{t("sizeSqm")}</Th>
                <Th>{t("status")}</Th>
                <Th>{t("assignedTeam")}</Th>
              </Thead>
              <tbody>
                {orders.length === 0 && (
                  <EmptyRow colSpan={6} label={t("noData")} />
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[var(--border)]">
                    <Td className="font-medium tabular">
                      {order.orderNumber}
                    </Td>
                    <Td>{order.customer.companyName}</Td>
                    <Td>{order.site.city.name}</Td>
                    <Td className="tabular">{order.site.sizeSqm} ㎡</Td>
                    <Td>
                      <OrderStatusPill
                        status={order.status}
                        label={t(STATUS_KEY[order.status])}
                      />
                    </Td>
                    <Td>
                      {order.jobAssignments[0]?.team.name ?? (
                        <span className="text-[var(--text-faint)]">
                          {t("noTeamAssigned")}
                        </span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </section>
        </div>
      </main>
    </RoleGuard>
  );
}
