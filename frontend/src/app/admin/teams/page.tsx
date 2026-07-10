"use client";

import { useEffect, useState } from "react";
import { createTeam, deleteTeam, fetchCities, fetchTeams } from "@/lib/api";
import { City, Team } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";

export default function TeamsPage() {
  const { t } = useLocale();
  const [teams, setTeams] = useState<Team[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [name, setName] = useState("");
  const [cityId, setCityId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchTeams().then(setTeams).catch(() => {});
    fetchCities().then(setCities).catch(() => {});
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (cityId === "") return;
    setSubmitting(true);
    try {
      await createTeam({ name, cityId });
      setName("");
      setCityId("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("confirmDelete"))) return;
    await deleteTeam(id);
    load();
  }

  return (
    <div>
      <PageHeader title={t("navTeams")} />

      <Card className="mb-6">
        <CardHeader>{t("newTeam")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end"
          >
            <Field>
              <Label>{t("teamName")}</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("city")}</Label>
              <Select
                required
                value={cityId}
                onChange={(e) => setCityId(Number(e.target.value))}
              >
                <option value="">-</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
          <Th>{t("teamName")}</Th>
          <Th>{t("city")}</Th>
          <Th>{t("members")}</Th>
          <Th>{t("actions")}</Th>
        </Thead>
        <tbody>
          {teams.length === 0 && <EmptyRow colSpan={4} label={t("noData")} />}
          {teams.map((team) => (
            <tr key={team.id} className="border-t border-[var(--border)]">
              <Td className="font-medium">{team.name}</Td>
              <Td>{team.city.name}</Td>
              <Td className="tabular">{team.workers.length}</Td>
              <Td>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                  onClick={() => handleDelete(team.id)}
                >
                  {t("delete")}
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
