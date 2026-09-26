"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Message form with no application endpoint. When a contact email exists,
 * submit composes mailto:. When it does not, the form states that nothing
 * was sent — it does not invent a reply.
 */

const FIELD =
  "mt-1 w-full rounded-input border border-on-surface bg-transparent px-3 py-2 text-body placeholder:text-muted";

export function ContactForm({ to }: { to: string | null }) {
  const [status, setStatus] = useState<"idle" | "mailto" | "unsent">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!to) {
      setStatus("unsent");
      return;
    }

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${email}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("mailto");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-measure">
      <p>
        <label htmlFor="contact-name" className="text-caption uppercase text-muted">
          Name
        </label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" className={FIELD} />
      </p>
      <p className="mt-4">
        <label htmlFor="contact-email" className="text-caption uppercase text-muted">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={FIELD}
        />
      </p>
      <p className="mt-4">
        <label htmlFor="contact-message" className="text-caption uppercase text-muted">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={6} className={FIELD} />
      </p>
      <p className="mt-tight">
        <Button type="submit" variant="primary">
          Send
        </Button>
      </p>
      {status === "unsent" ? (
        <p className="mt-4 text-body text-muted" role="status">
          This storefront has no mail endpoint. The message was not sent.
        </p>
      ) : null}
      {status === "mailto" ? (
        <p className="mt-4 text-body text-muted" role="status">
          Opening a mail composition to the supplied address.
        </p>
      ) : null}
    </form>
  );
}
