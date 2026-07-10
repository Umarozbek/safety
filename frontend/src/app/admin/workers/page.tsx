"use client";

import { useEffect, useState } from "react";
import { createWorker, deleteWorker, fetchTeams, fetchWorkers } from "@/lib/api";
import { Team, Worker, WorkerRole } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";

export default function WorkersPage() {
  const { t } = useLocale();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [teamId, setTeamId] = useState<number | "">("");
  const [role, setRole] = useState<WorkerRole>("INSTALLATION");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchWorkers().then(setWorkers).catch(() => {});
    fetchTeams().then(setTeams).catch(() => {});
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (teamId === "") return;
    setSubmitting(true);
    try {
      await createWorker({ name, phone, teamId, role });
      setName("");
      setPhone("");
      setTeamId("");
      setRole("INSTALLATION");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("confirmDelete"))) return;
    await deleteWorker(id);
    load();
  }

  return (
    <div>
      <PageHeader title={t("navWorkers")} />

      <Card className="mb-6">
        <CardHeader>{t("newWorker")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end"
          >
            <Field>
              <Label>{t("workerName")}</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("workerPhone")}</Label>
              <Input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("team")}</Label>
              <Select
                required
                value={teamId}
                onChange={(e) => setTeamId(Number(e.target.value))}
              >
                <option value="">-</option>
                {teams.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>{t("workerRole")}</Label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as WorkerRole)}
              >
                <option value="INSTALLATION">{t("roleInstallation")}</option>
                <option value="PRODUCTION">{t("roleProduction")}</option>
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
          <Th>{t("workerName")}</Th>
          <Th>{t("workerPhone")}</Th>
          <Th>{t("team")}</Th>
          <Th>{t("workerRole")}</Th>
          <Th>{t("actions")}</Th>
        </Thead>
        <tbody>
          {workers.length === 0 && <EmptyRow colSpan={5} label={t("noData")} />}
          {workers.map((w) => (
            <tr key={w.id} className="border-t border-[var(--border)]">
              <Td className="font-medium">{w.name}</Td>
              <Td className="tabular">{w.phone}</Td>
              <Td>{w.team?.name ?? "-"}</Td>
              <Td>
                {w.role === "INSTALLATION"
                  ? t("roleInstallation")
                  : t("roleProduction")}
              </Td>
              <Td>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                  onClick={() => handleDelete(w.id)}
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
