export function StatTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
      <p className="tabular mt-1.5 text-2xl font-semibold tracking-tight text-[var(--text)]">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-normal text-[var(--text-faint)]">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
