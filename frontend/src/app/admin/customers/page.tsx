"use client";

import { useEffect, useState } from "react";
import { createCustomer, deleteCustomer, fetchCustomers } from "@/lib/api";
import { Customer } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Field, Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Td, EmptyRow } from "@/components/ui/table";

export default function CustomersPage() {
  const { t } = useLocale();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    fetchCustomers().then(setCustomers).catch(() => {});
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCustomer({
        companyName,
        contactPhone,
        contactPerson: contactPerson || undefined,
      });
      setCompanyName("");
      setContactPhone("");
      setContactPerson("");
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(t("confirmDelete"))) return;
    await deleteCustomer(id);
    load();
  }

  return (
    <div>
      <PageHeader title={t("navCustomers")} />

      <Card className="mb-6">
        <CardHeader>{t("newCustomer")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end"
          >
            <Field>
              <Label>{t("companyName")}</Label>
              <Input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("contactPhone")}</Label>
              <Input
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </Field>
            <Field>
              <Label>{t("contactPerson")}</Label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={submitting}>
              {t("create")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Table>
        <Thead>
          <Th>{t("companyName")}</Th>
          <Th>{t("contactPhone")}</Th>
          <Th>{t("contactPerson")}</Th>
          <Th>{t("actions")}</Th>
        </Thead>
        <tbody>
          {customers.length === 0 && <EmptyRow colSpan={4} label={t("noData")} />}
          {customers.map((c) => (
            <tr key={c.id} className="border-t border-[var(--border)]">
              <Td className="font-medium">{c.companyName}</Td>
              <Td className="tabular">{c.contactPhone}</Td>
              <Td>{c.contactPerson ?? "-"}</Td>
              <Td>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                  onClick={() => handleDelete(c.id)}
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
