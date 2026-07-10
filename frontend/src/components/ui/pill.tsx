import { OrderStatus, JobAssignmentStatus, CityStatus } from "@/lib/types";

const orderStatusVars: Record<OrderStatus, string> = {
  RECEIVED: "received",
  IN_PRODUCTION: "production",
  DELIVERED: "delivered",
  INSTALLED: "installed",
  COMPLETED: "completed",
};

export function OrderStatusPill({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  const v = orderStatusVars[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `var(--status-${v}-bg)`,
        color: `var(--status-${v}-text)`,
      }}
    >
      {label}
    </span>
  );
}

export function JobStatusPill({
  status,
  label,
}: {
  status: JobAssignmentStatus;
  label: string;
}) {
  const v =
    status === "FINISHED"
      ? "completed"
      : status === "IN_PROGRESS"
        ? "delivered"
        : "received";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `var(--status-${v}-bg)`,
        color: `var(--status-${v}-text)`,
      }}
    >
      {label}
    </span>
  );
}

export function CityStatusPill({
  status,
  label,
}: {
  status: CityStatus;
  label: string;
}) {
  const v = status === "ACTIVE_INSTALLED" ? "completed" : "received";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `var(--status-${v}-bg)`,
        color: `var(--status-${v}-text)`,
      }}
    >
      {label}
    </span>
  );
}
