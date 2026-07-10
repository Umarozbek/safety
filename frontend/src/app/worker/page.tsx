"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/role-guard";
import { TopBar } from "@/components/top-bar";
import { useLocale } from "@/lib/i18n/locale-context";
import { fetchMyJobs, finishJobAssignment } from "@/lib/api";
import { JobAssignment, JobAssignmentStatus } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n/translations";
import { JobStatusPill } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";

const STATUS_KEY: Record<JobAssignmentStatus, TranslationKey> = {
  ASSIGNED: "jobAssignmentStatus_ASSIGNED",
  IN_PROGRESS: "jobAssignmentStatus_IN_PROGRESS",
  FINISHED: "jobAssignmentStatus_FINISHED",
};

export default function WorkerDashboardPage() {
  const { t } = useLocale();
  const [jobs, setJobs] = useState<JobAssignment[]>([]);
  const [finishingId, setFinishingId] = useState<number | null>(null);

  function load() {
    fetchMyJobs().then(setJobs).catch(() => {});
  }

  useEffect(load, []);

  async function handleFinish(id: number) {
    setFinishingId(id);
    try {
      await finishJobAssignment(id);
      load();
    } finally {
      setFinishingId(null);
    }
  }

  function mapUrl(address: string) {
    return `https://map.kakao.com/?q=${encodeURIComponent(address)}`;
  }

  const pending = jobs.filter((j) => j.status !== "FINISHED");
  const finished = jobs.filter((j) => j.status === "FINISHED");

  return (
    <RoleGuard allow={["WORKER"]}>
      <TopBar title={t("workerDashboard")} />
      <main className="flex-1 bg-[var(--bg)] p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-3">
          <h2 className="px-1 text-sm font-semibold text-[var(--text)]">
            {t("myJobs")}
          </h2>

          {jobs.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] py-12 text-center text-sm text-[var(--text-faint)]">
              {t("noJobsAssigned")}
            </div>
          )}

          {pending.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              t={t}
              mapUrl={mapUrl}
              finishing={finishingId === job.id}
              onFinish={() => handleFinish(job.id)}
            />
          ))}

          {finished.length > 0 && (
            <>
              <h3 className="px-1 pt-3 text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                {t("finished")}
              </h3>
              {finished.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  t={t}
                  mapUrl={mapUrl}
                  finishing={false}
                  onFinish={() => {}}
                />
              ))}
            </>
          )}
        </div>
      </main>
    </RoleGuard>
  );
}

function JobCard({
  job,
  t,
  mapUrl,
  finishing,
  onFinish,
}: {
  job: JobAssignment;
  t: (key: TranslationKey) => string;
  mapUrl: (address: string) => string;
  finishing: boolean;
  onFinish: () => void;
}) {
  const isFinished = job.status === "FINISHED";
  return (
    <div
      className={`rounded-xl border bg-[var(--surface)] p-4 shadow-sm ${
        isFinished ? "border-[var(--border)] opacity-70" : "border-[var(--border)]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="tabular font-semibold text-[var(--text)]">
          {job.order?.orderNumber}
        </span>
        <JobStatusPill status={job.status} label={t(STATUS_KEY[job.status])} />
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--text-faint)]">{t("assignedDate")}</dt>
          <dd className="tabular text-[var(--text)]">
            {new Date(job.assignedDate).toLocaleDateString()}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 pt-1 text-[var(--text-faint)]">
            {t("address")}
          </dt>
          <dd className="flex flex-1 items-center justify-end gap-1.5 text-right text-[var(--text)]">
            <span>{job.order?.site.address}</span>
            {job.order?.site.address && (
              <CopyButton value={job.order.site.address} />
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[var(--text-faint)]">{t("sizeSqm")}</dt>
          <dd className="tabular text-[var(--text)]">
            {job.order?.site.sizeSqm} ㎡
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-3">
        {job.order?.site.address && (
          <a
            href={mapUrl(job.order.site.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {t("viewOnMap")}
          </a>
        )}
        {!isFinished && (
          <Button
            size="md"
            disabled={finishing}
            onClick={onFinish}
            className="ml-auto"
          >
            {t("markFinished")}
          </Button>
        )}
      </div>
    </div>
  );
}
