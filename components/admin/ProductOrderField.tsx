"use client";

import { useState } from "react";

export function ProductOrderField({
  name,
  slugs,
  labels,
}: {
  name: string;
  slugs: string[];
  labels: Record<string, string>;
}) {
  const [order, setOrder] = useState(slugs);
  const [dragging, setDragging] = useState<number | null>(null);

  function move(index: number, delta: number) {
    const next = index + delta;
    if (next < 0 || next >= order.length) return;
    setOrder((current) => {
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={order.join("\n")} />
      <ol className="admin-table-wrap">
        {order.map((slug, index) => (
          <li
            key={slug}
            draggable
            onDragStart={() => setDragging(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragging == null || dragging === index) return;
              setOrder((current) => {
                const copy = [...current];
                const [item] = copy.splice(dragging, 1);
                copy.splice(index, 0, item);
                return copy;
              });
              setDragging(null);
            }}
            onDragEnd={() => setDragging(null)}
            className="flex items-center justify-between gap-3 border-b border-[#d8dee4] px-3 py-2 last:border-b-0"
            style={{ cursor: "grab" }}
          >
            <span>{labels[slug] ?? slug}</span>
            <span className="flex gap-2">
              <button type="button" className="admin-btn admin-btn-sm" aria-label={`Move ${labels[slug] ?? slug} up`} onClick={() => move(index, -1)}>
                Up
              </button>
              <button type="button" className="admin-btn admin-btn-sm" aria-label={`Move ${labels[slug] ?? slug} down`} onClick={() => move(index, 1)}>
                Down
              </button>
            </span>
          </li>
        ))}
        {order.length === 0 && <li className="admin-empty">No products.</li>}
      </ol>
    </div>
  );
}
