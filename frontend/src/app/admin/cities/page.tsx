"use client";

import { useEffect, useState } from "react";
import { createCity, fetchCities } from "@/lib/api";
import { City, CityStatus } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";
import { CityStatusPill } from "@/components/ui/pill";

export default function CitiesPage() {
  const { t } = useLocale();
  const [cities, setCities] = useState<City[]>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<CityStatus>("PLANNED");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchCities().then(setCities).catch(() => {});
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCity({ name, status });
      setName("");
      setStatus("PLANNED");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader title={t("navCities")} />

      <Card className="mb-6">
        <CardHeader>{t("newCity")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end"
          >
            <Field>
              <Label>{t("cityName")}</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("cityStatus")}</Label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as CityStatus)}
              >
                <option value="PLANNED">{t("cityPlanned")}</option>
                <option value="ACTIVE_INSTALLED">{t("cityActive")}</option>
              </Select>
            </Field>
            <Button type="submit" disabled={submitting}>
              {t("create")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Table>
        <Thead>
          <Th>{t("cityName")}</Th>
          <Th>{t("cityStatus")}</Th>
        </Thead>
        <tbody>
          {cities.length === 0 && <EmptyRow colSpan={2} label={t("noData")} />}
          {cities.map((c) => (
            <tr key={c.id} className="border-t border-[var(--border)]">
              <Td className="font-medium">{c.name}</Td>
              <Td>
                <CityStatusPill
                  status={c.status}
                  label={
                    c.status === "ACTIVE_INSTALLED"
                      ? t("cityActive")
                      : t("cityPlanned")
                  }
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
