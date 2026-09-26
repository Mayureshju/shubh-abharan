"use client";

import { useState } from "react";

export type SizeRow = { size: string; price: string; sale: string; stock: string };
type Row = SizeRow & { id: number };

const STOCK_OPTIONS = [
  ["available", "In stock"],
  ["made-to-order", "Made to order"],
  ["sold-out", "Sold out"],
] as const;

function discount(price: string, sale: string): string | null {
  const list = Number(price);
  const offer = Number(sale);
  if (!price || !sale || !(list > 0) || !(offer >= 0)) return null;
  if (offer >= list) return "invalid";
  return `${Math.round(((list - offer) / list) * 100)}% off`;
}

function Money({
  name,
  value,
  onChange,
  label,
  required,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}) {
  return (
    <span className="money-input">
      <span aria-hidden="true">₹</span>
      <input
        name={name}
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        placeholder="0"
      />
    </span>
  );
}

function DiscountNote({ price, sale }: { price: string; sale: string }) {
  const note = discount(price, sale);
  if (!note) return null;
  return note === "invalid" ? (
    <small className="price-note" data-tone="red">Must be lower than list price</small>
  ) : (
    <small className="price-note" data-tone="green">{note}</small>
  );
}

export function PricingFields({
  isSize: initialIsSize,
  single: initialSingle,
  sizes,
}: {
  isSize: boolean;
  single: Omit<SizeRow, "size">;
  sizes: SizeRow[];
}) {
  const [isSize, setIsSize] = useState(initialIsSize);
  const [single, setSingle] = useState(initialSingle);
  const [rows, setRows] = useState<Row[]>(() =>
    (sizes.length > 0 ? sizes : [{ size: "", price: initialSingle.price, sale: "", stock: "available" }]).map(
      (row, id) => ({ ...row, id }),
    ),
  );
  const [nextId, setNextId] = useState(rows.length);

  const updateRow = (id: number, patch: Partial<SizeRow>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  return (
    <div className="admin-form">
      <label className="switch">
        <input
          name="isSize"
          type="checkbox"
          role="switch"
          checked={isSize}
          onChange={(event) => setIsSize(event.target.checked)}
        />
        <span className="switch-track" aria-hidden="true" />
        <span>
          <strong>Sold in sizes</strong>
          <small className="admin-muted">Each size gets its own price and stock, e.g. ring sizes or bangle sizes.</small>
        </span>
      </label>

      {isSize ? (
        <div className="size-table">
          <div className="size-head" aria-hidden="true">
            <span>Size</span>
            <span>List price</span>
            <span>Sale price</span>
            <span>Stock</span>
            <span />
          </div>
          <ul>
            {rows.map((row, index) => {
              const n = index + 1;
              return (
                <li key={row.id} className="size-row">
                  <label>
                    <span className="size-label">Size</span>
                    <input
                      name="variantSize"
                      value={row.size}
                      onChange={(event) => updateRow(row.id, { size: event.target.value })}
                      required
                      aria-label={`Size ${n}`}
                      placeholder="e.g. 7"
                    />
                  </label>
                  <label>
                    <span className="size-label">List price</span>
                    <Money name="variantPrice" value={row.price} onChange={(price) => updateRow(row.id, { price })} label={`Size ${n} list price`} required />
                  </label>
                  <label>
                    <span className="size-label">Sale price</span>
                    <Money name="variantSale" value={row.sale} onChange={(sale) => updateRow(row.id, { sale })} label={`Size ${n} sale price`} />
                    <DiscountNote price={row.price} sale={row.sale} />
                  </label>
                  <label>
                    <span className="size-label">Stock</span>
                    <select
                      name="variantStock"
                      value={row.stock}
                      onChange={(event) => updateRow(row.id, { stock: event.target.value })}
                      aria-label={`Size ${n} stock`}
                    >
                      {STOCK_OPTIONS.map(([value, text]) => (
                        <option key={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setRows((current) => current.filter((entry) => entry.id !== row.id))}
                    disabled={rows.length === 1}
                    aria-label={`Remove size ${n}`}
                    title="Remove size"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="admin-btn admin-btn-sm"
            onClick={() => {
              const last = rows.at(-1);
              setRows([...rows, { id: nextId, size: "", price: last?.price ?? "", sale: last?.sale ?? "", stock: "available" }]);
              setNextId(nextId + 1);
            }}
          >
            + Add size
          </button>
        </div>
      ) : (
        <div className="admin-form-row admin-form-row-3">
          <label className="admin-field">
            <span>List price</span>
            <Money name="price" value={single.price} onChange={(price) => setSingle({ ...single, price })} label="List price" required />
          </label>
          <label className="admin-field">
            <span>Sale price</span>
            <Money name="salePrice" value={single.sale} onChange={(sale) => setSingle({ ...single, sale })} label="Sale price" />
            <DiscountNote price={single.price} sale={single.sale} />
            {!discount(single.price, single.sale) && <small>Optional. Leave empty when not on sale.</small>}
          </label>
          <label className="admin-field">
            <span>Stock</span>
            <select name="availability" value={single.stock} onChange={(event) => setSingle({ ...single, stock: event.target.value })}>
              {STOCK_OPTIONS.map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
