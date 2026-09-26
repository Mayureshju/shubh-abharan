const TONES: Record<string, "green" | "blue" | "amber" | "red"> = {
  paid: "green",
  delivered: "green",
  captured: "green",
  authorized: "green",
  active: "green",
  packing: "blue",
  shipped: "blue",
  pending_payment: "amber",
  pending_collection: "amber",
  created: "amber",
  cancelled: "red",
  refunded: "red",
  failed: "red",
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return (
    <span className="admin-pill" data-tone={TONES[status]}>
      {label ?? status.replaceAll("_", " ")}
    </span>
  );
}
