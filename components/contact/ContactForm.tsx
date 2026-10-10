"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Message form with no application endpoint. When a contact email exists,
 * submit composes mailto:. When it does not, the status line states that
 * nothing was sent — it does not invent a reply.
 *
 * Validation is the browser's own: each field declares its constraint, and
 * submit copies `validationMessage` into an inline error linked to the field
 * instead of the native bubble. There is no error colour in the palette, so an
 * invalid field is marked by a heavier border and a line of text.
 *
 * Submit stays disabled until hydration. Without script a form with no
 * `action` submits as GET, which would put the message in the URL.
 *
 * The order number is revealed by CSS (`:has()` on the form) when the order
 * topic is checked, and only reaches the mail for that topic.
 */

const TOPICS = [
  { id: "order", label: "An order" },
  { id: "piece", label: "A piece in the catalogue" },
  { id: "other", label: "Something else" },
] as const;

const FIELD_BOX =
  "mt-1 w-full rounded-input border border-on-surface bg-transparent px-2.5 text-[0.875rem] leading-5 " +
  "placeholder:text-muted aria-[invalid=true]:border-2";
const FIELD = `${FIELD_BOX} h-9`;
const AREA = `${FIELD_BOX} py-1.5`;
const LABEL = "text-caption uppercase text-muted";

type Errors = Partial<Record<string, string>>;

const subscribeNoop = () => () => {};

function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`contact-${name}-error`} className="mt-2 text-caption text-accent">
      {message}
    </p>
  );
}

export function ContactForm({ to }: { to: string | null }) {
  // false on the server and during hydration, true once the client has taken over.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  // aria-invalid is always explicit: Chrome otherwise exposes an unchecked
  // required radio group as invalid before anyone has submitted.
  const describedBy = (name: string) =>
    errors[name]
      ? { "aria-invalid": true, "aria-describedby": `contact-${name}-error` }
      : { "aria-invalid": false };

  function clearError(name: string) {
    if (!errors[name]) return;
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const invalid = Array.from(form.elements).filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement =>
        (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
        !el.validity.valid,
    );
    if (invalid.length > 0) {
      setErrors(Object.fromEntries(invalid.map((el) => [el.name, el.validationMessage])));
      setStatus("");
      invalid[0].focus();
      return;
    }
    setErrors({});

    if (!to) {
      setStatus("This storefront has no contact email yet. The message was not sent.");
      return;
    }

    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const topic = TOPICS.find((t) => t.id === field("topic")) ?? TOPICS[2];
    const order = topic.id === "order" ? field("order") : "";
    const body = [
      field("message"),
      "",
      ...(order ? [`Order: ${order}`] : []),
      `Reply to: ${field("name")} <${field("email")}>`,
    ].join("\n");
    const subject = `${topic.label} — ${field("name")}`;

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(
      `Your email app should open with this message addressed to ${to}. If nothing opened, write to ${to} directly.`,
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onChange={(event) => clearError((event.nativeEvent.target as HTMLInputElement).name)}
      className="group max-w-measure"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL}>Name</label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" className={FIELD} {...describedBy("name")} />
          <FieldError name="name" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL}>Email</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" className={FIELD} {...describedBy("email")} />
          <FieldError name="email" message={errors.email} />
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className={LABEL}>Topic</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <label
              key={topic.id}
              htmlFor={`topic-${topic.id}`}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-3 rounded-input border border-on-surface px-4 text-body transition-colors duration-[var(--duration-quick)] has-checked:bg-lavender has-checked:text-charcoal"
            >
              <input
                id={`topic-${topic.id}`}
                type="radio"
                name="topic"
                value={topic.id}
                required
                className="size-4 accent-charcoal"
                {...describedBy("topic")}
              />
              {topic.label}
            </label>
          ))}
        </div>
        <FieldError name="topic" message={errors.topic} />
      </fieldset>

      <div className="mt-6 hidden group-has-[#topic-order:checked]:block">
        <label htmlFor="contact-order" className={LABEL}>Order number (optional)</label>
        <input id="contact-order" name="order" type="text" autoComplete="off" className={FIELD} />
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" className={LABEL}>Message</label>
        <textarea id="contact-message" name="message" required rows={5} className={AREA} {...describedBy("message")} />
        <FieldError name="message" message={errors.message} />
      </div>

      <p className="mt-tight">
        <Button type="submit" variant="primary" disabled={!hydrated}>
          Send message
        </Button>
      </p>

      {/* Always present, so the change of text is announced. */}
      <p role="status" className="mt-4 text-body text-muted">
        {status}
      </p>
    </form>
  );
}
