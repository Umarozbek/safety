"use client";

import { useEffect, useState } from "react";
import {
  createJobAssignment,
  createOrder,
  fetchCities,
  fetchCustomers,
  fetchOrders,
  fetchTeams,
  updateOrderStatus,
} from "@/lib/api";
import { City, Customer, Order, OrderStatus, Team } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translations";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";
import { OrderStatusPill } from "@/components/ui/pill";
import { CopyButton } from "@/components/ui/copy-button";

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

export default function OrdersPage() {
  const { t } = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [cityFilter, setCityFilter] = useState<number | "">("");

  const [customerId, setCustomerId] = useState<number | "">("");
  const [requestedDate, setRequestedDate] = useState("");
  const [siteCityId, setSiteCityId] = useState<number | "">("");
  const [address, setAddress] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function loadOrders() {
    fetchOrders({
      status: statusFilter || undefined,
      cityId: cityFilter || undefined,
    })
      .then(setOrders)
      .catch(() => {});
  }

  useEffect(loadOrders, [statusFilter, cityFilter]);

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(() => {});
    fetchCities().then(setCities).catch(() => {});
    fetchTeams().then(setTeams).catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (customerId === "" || siteCityId === "") return;
    setSubmitting(true);
    try {
      await createOrder({
        customerId,
        requestedDate,
        site: {
          cityId: siteCityId,
          address,
          sizeSqm: Number(sizeSqm),
          mapLink: mapLink || undefined,
        },
      });
      setCustomerId("");
      setRequestedDate("");
      setSiteCityId("");
      setAddress("");
      setSizeSqm("");
      setMapLink("");
      loadOrders();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    loadOrders();
  }

  async function handleAssignTeam(orderId: number, teamId: number) {
    await createJobAssignment({
      orderId,
      teamId,
      assignedDate: new Date().toISOString().slice(0, 10),
    });
    loadOrders();
  }

  return (
    <div>
      <PageHeader title={t("navOrders")} />

      <Card className="mb-6">
        <CardHeader>{t("newOrder")}</CardHeader>
        <CardBody>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field>
                <Label>{t("customer")}</Label>
                <Select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                >
                  <option value="">-</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>{t("requestedDate")}</Label>
                <Input
                  required
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t("city")}</Label>
                <Select
                  required
                  value={siteCityId}
                  onChange={(e) => setSiteCityId(Number(e.target.value))}
                >
                  <option value="">-</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field>
                <Label>{t("address")}</Label>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t("sizeSqm")}</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={sizeSqm}
                  onChange={(e) => setSizeSqm(e.target.value)}
                />
              </Field>
              <Field>
                <Label>{t("mapLink")}</Label>
                <Input
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                />
              </Field>
            </div>
            <Button type="submit" disabled={submitting}>
              {t("create")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="mb-4 flex flex-wrap gap-3">
        <Field>
          <Label>{t("filterByStatus")}</Label>
          <Select
            aria-label={t("filterByStatus")}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
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

      <Table>
        <Thead>
          <Th>{t("orderNumber")}</Th>
          <Th>{t("customer")}</Th>
          <Th>{t("city")}</Th>
          <Th>{t("address")}</Th>
          <Th>{t("sizeSqm")}</Th>
          <Th>{t("status")}</Th>
          <Th>{t("assignedTeam")}</Th>
        </Thead>
        <tbody>
          {orders.length === 0 && <EmptyRow colSpan={7} label={t("noData")} />}
          {orders.map((order) => {
            const assignment = order.jobAssignments[0];
            const cityTeams = teams.filter(
              (tm) => tm.cityId === order.site.cityId,
            );
            return (
              <tr key={order.id} className="border-t border-[var(--border)]">
                <Td className="font-medium tabular">{order.orderNumber}</Td>
                <Td>{order.customer.companyName}</Td>
                <Td>{order.site.city.name}</Td>
                <Td>
                  <div className="flex max-w-[220px] items-center gap-1.5">
                    <span className="truncate text-[var(--text-muted)]">
                      {order.site.address}
                    </span>
                    <CopyButton value={order.site.address} />
                  </div>
                </Td>
                <Td className="tabular">{order.site.sizeSqm} ㎡</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <OrderStatusPill
                      status={order.status}
                      label={t(STATUS_KEY[order.status])}
                    />
                    <Select
                      aria-label={t("status")}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      className="w-auto px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {t(STATUS_KEY[s])}
                        </option>
                      ))}
                    </Select>
                  </div>
                </Td>
                <Td>
                  {assignment ? (
                    <span className="font-medium">{assignment.team.name}</span>
                  ) : (
                    <Select
                      aria-label={t("assignTeam")}
                      defaultValue=""
                      onChange={(e) =>
                        e.target.value &&
                        handleAssignTeam(order.id, Number(e.target.value))
                      }
                      className="w-auto px-2 py-1 text-xs"
                    >
                      <option value="">{t("assignTeam")}</option>
                      {cityTeams.map((tm) => (
                        <option key={tm.id} value={tm.id}>
                          {tm.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
