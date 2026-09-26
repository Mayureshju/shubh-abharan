export const ORDER_NEXT: Record<string, string[]> = {
  pending_payment: ["cancelled"],
  paid: ["packing", "cancelled"],
  packing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

export function nextStatuses(status: string): string[] {
  return ORDER_NEXT[status] ?? [];
}
