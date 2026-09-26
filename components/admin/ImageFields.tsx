"use client";

import { useRef, useState } from "react";

type ImageRow = {
  id: number;
  src: string;
  alt: string;
  role: string;
  /** Local object URL shown while the upload is in flight. */
  preview?: string;
  progress?: number;
  error?: string;
};

const ROLES = [
  ["macro", "Close-up"],
  ["scale", "Scale"],
  ["worn", "Worn"],
  ["detail", "Detail"],
] as const;

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

function uploadWithProgress(file: File, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as { url?: string; error?: string };
        if (xhr.status < 300 && json.url) resolve(json.url);
        else reject(new Error(json.error ?? "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    const data = new FormData();
    data.append("file", file);
    xhr.send(data);
  });
}

export function ImageFields({ images }: { images: { src: string; alt: string; role: string }[] }) {
  const nextId = useRef(images.length);
  const input = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImageRow[]>(images.map((image, index) => ({ ...image, id: index })));
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  function update(id: number, patch: Partial<ImageRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function moveTo(from: number, to: number) {
    setRows((current) => {
      if (to < 0 || to >= current.length || from === to) return current;
      const copy = [...current];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  function remove(id: number) {
    setRows((current) => {
      const row = current.find((entry) => entry.id === id);
      if (row?.preview) URL.revokeObjectURL(row.preview);
      return current.filter((entry) => entry.id !== id);
    });
  }

  async function start(id: number, file: File) {
    try {
      const url = await uploadWithProgress(file, (progress) => update(id, { progress }));
      setRows((current) =>
        current.map((row) => {
          if (row.id !== id) return row;
          if (row.preview) URL.revokeObjectURL(row.preview);
          return { ...row, src: url, preview: undefined, progress: undefined, error: undefined };
        }),
      );
    } catch (error) {
      update(id, { progress: undefined, error: (error as Error).message });
    }
  }

  function addFiles(list: FileList | File[] | null) {
    const files = Array.from(list ?? []);
    const rejected: string[] = [];
    for (const file of files) {
      if (!ACCEPT.includes(file.type)) {
        rejected.push(`${file.name}: not a JPEG, PNG, WebP or AVIF image`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejected.push(`${file.name}: larger than 10 MB`);
        continue;
      }
      const id = nextId.current++;
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      setRows((current) => [
        ...current,
        { id, src: "", alt, role: current.length === 0 ? "macro" : "detail", preview: URL.createObjectURL(file), progress: 0 },
      ]);
      void start(id, file);
    }
    setNotice(rejected.join(". "));
  }

  const uploading = rows.some((row) => row.progress !== undefined);

  return (
    <div className="img-uploader" data-uploading={uploading || undefined}>
      <div
        className="img-dropzone"
        data-over={dragOver || undefined}
        onDragOver={(event) => {
          if (dragging !== null) return;
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          if (dragging !== null) return;
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        <p>
          <strong>Drag photos here</strong> or{" "}
          <button type="button" className="img-browse" onClick={() => input.current?.click()}>
            browse files
          </button>
        </p>
        <p className="admin-muted">JPEG, PNG, WebP or AVIF · up to 10 MB each · the first photo is the main image</p>
        <input
          ref={input}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          hidden
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {notice && (
        <p className="admin-alert" data-tone="red" role="alert">
          {notice}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {uploading ? "Uploading images" : ""}
      </p>

      {rows.length > 0 && (
        <ul className="img-grid">
          {rows.map((image, index) => {
            const shown = image.src || image.preview;
            const n = index + 1;
            return (
              <li
                key={image.id}
                className="img-card"
                data-dragging={dragging === index || undefined}
                data-error={image.error ? true : undefined}
                draggable
                onDragStart={(event) => {
                  setDragging(index);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => {
                  if (dragging === null) return;
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  if (dragging === null) return;
                  event.preventDefault();
                  moveTo(dragging, index);
                  setDragging(null);
                }}
                onDragEnd={() => setDragging(null)}
              >
                <input type="hidden" name="imageSrc" value={image.src} />
                <div className="img-thumb">
                  {shown ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary or local URL
                    <img src={shown} alt="" />
                  ) : (
                    <span className="admin-muted">No preview</span>
                  )}
                  {index === 0 && !image.error && <span className="img-badge">Main</span>}
                  {image.progress !== undefined && (
                    <div className="img-progress" role="progressbar" aria-label={`Image ${n} upload`} aria-valuenow={image.progress} aria-valuemin={0} aria-valuemax={100}>
                      <span style={{ width: `${image.progress}%` }} />
                      <small>{image.progress}%</small>
                    </div>
                  )}
                  {image.error && <div className="img-error">{image.error}</div>}
                  <div className="img-tools">
                    {index > 0 && (
                      <button type="button" onClick={() => moveTo(index, 0)} aria-label={`Make image ${n} the main image`} title="Make main">
                        ★
                      </button>
                    )}
                    <button type="button" onClick={() => moveTo(index, index - 1)} disabled={index === 0} aria-label={`Move image ${n} earlier`} title="Move left">
                      ←
                    </button>
                    <button type="button" onClick={() => moveTo(index, index + 1)} disabled={index === rows.length - 1} aria-label={`Move image ${n} later`} title="Move right">
                      →
                    </button>
                    <button type="button" onClick={() => remove(image.id)} aria-label={`Remove image ${n}`} title="Remove" data-danger>
                      ✕
                    </button>
                  </div>
                </div>
                <label className="img-meta">
                  <span className="sr-only">Image {n} alt text</span>
                  <input
                    name="imageAlt"
                    value={image.alt}
                    onChange={(event) => update(image.id, { alt: event.target.value })}
                    placeholder="Alt text, e.g. ring on hand"
                  />
                </label>
                <label className="img-meta">
                  <span className="sr-only">Image {n} type</span>
                  <select name="imageRole" value={image.role} onChange={(event) => update(image.id, { role: event.target.value })}>
                    {ROLES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      <details className="img-url">
        <summary>Add image by URL</summary>
        <UrlAdder
          onAdd={(src) => {
            const id = nextId.current++;
            setRows((current) => [...current, { id, src, alt: "", role: current.length === 0 ? "macro" : "detail" }]);
          }}
        />
      </details>
    </div>
  );
}

function UrlAdder({ onAdd }: { onAdd: (src: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="admin-actions" style={{ marginTop: 8 }}>
      <label className="admin-field" style={{ flex: 1 }}>
        <span className="sr-only">Image URL</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="https://…" type="url" />
      </label>
      <button
        type="button"
        className="admin-btn"
        disabled={!value.trim()}
        onClick={() => {
          onAdd(value.trim());
          setValue("");
        }}
      >
        Add
      </button>
    </div>
  );
}
