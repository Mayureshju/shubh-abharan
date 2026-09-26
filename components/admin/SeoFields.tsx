"use client";

import { useState } from "react";

function Counter({ length, limit }: { length: number; limit: number }) {
  return (
    <small className="seo-count" data-over={length > limit || undefined}>
      {length}/{limit}
    </small>
  );
}

export function SeoFields({
  title: initialTitle,
  description: initialDescription,
  fallbackTitle,
  fallbackDescription,
  path,
}: {
  title: string;
  description: string;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const shownTitle = title || fallbackTitle || "Product title";
  const shownDescription = description || fallbackDescription || "Add a description to control how this page appears in search results.";

  return (
    <div className="admin-form">
      <div className="seo-preview" aria-label="Search result preview">
        <small>{path}</small>
        <strong>{shownTitle}</strong>
        <p>{shownDescription.length > 160 ? `${shownDescription.slice(0, 157)}…` : shownDescription}</p>
      </div>
      <label className="admin-field">
        <span className="field-head">
          SEO title <Counter length={title.length} limit={60} />
        </span>
        <input name="seoTitle" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={70} placeholder={fallbackTitle} />
      </label>
      <label className="admin-field">
        <span className="field-head">
          SEO description <Counter length={description.length} limit={160} />
        </span>
        <textarea
          name="seoDescription"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={200}
          placeholder="Defaults to the product description"
        />
      </label>
    </div>
  );
}
