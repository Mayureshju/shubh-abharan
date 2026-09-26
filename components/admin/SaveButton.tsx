"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  const [waiting, setWaiting] = useState(false);
  return (
    <button
      type="submit"
      className="admin-btn admin-btn-primary"
      disabled={pending}
      onClick={(event) => {
        // An image still uploading has no URL yet and would be dropped on save.
        if (event.currentTarget.form?.querySelector("[data-uploading]")) {
          event.preventDefault();
          setWaiting(true);
          setTimeout(() => setWaiting(false), 2500);
        }
      }}
    >
      {pending ? "Saving…" : waiting ? "Wait for uploads…" : label}
    </button>
  );
}
