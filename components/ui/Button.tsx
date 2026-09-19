"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * Four presentations, no more. A view presents at most one `primary` — that
 * part is a review rule, since a component cannot see its siblings.
 *
 * Square by construction: the radius scale is cleared in globals.css, so pill
 * geometry is not reachable from a utility class.
 *
 * Disabled and pending are signalled by border treatment and text, never by
 * colour alone — see the non-colour encoding requirement in
 * specs/design-system/responsive-accessibility.
 */

type Variant = "primary" | "quiet" | "inline" | "icon";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: Variant;
  children: ReactNode;
  /**
   * Asynchronous action in flight. Communicates busy state and refuses repeat
   * activation, without removing the control from the focus order.
   */
  pending?: boolean;
  /** Text announced while pending. Defaults to a generic phrase. */
  pendingLabel?: string;
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 text-caption uppercase " +
  "transition-[background-color,color,border-color,opacity] duration-[var(--duration-quick)] " +
  "ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

/** Minimum 44px touch target, including for caption-sized labels. */
const TARGET = "min-h-11 px-6";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-on-surface text-surface border border-on-surface " +
    "hover:bg-transparent hover:text-on-surface " +
    "active:opacity-90 " +
    "disabled:border-dashed disabled:bg-transparent disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:bg-transparent aria-disabled:text-muted",
  quiet:
    "bg-transparent text-on-surface border border-on-surface " +
    "hover:bg-on-surface hover:text-surface " +
    "active:opacity-90 " +
    "disabled:border-dashed disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:text-muted",
  inline:
    "bg-transparent text-on-surface border-0 p-0 min-h-11 " +
    "underline underline-offset-4 hover:no-underline " +
    "disabled:no-underline disabled:line-through disabled:text-muted " +
    "aria-disabled:no-underline aria-disabled:line-through aria-disabled:text-muted",
  icon:
    "bg-transparent text-on-surface border border-transparent size-11 p-0 " +
    "hover:border-on-surface " +
    "disabled:border-dashed disabled:border-line disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:border-line aria-disabled:text-muted",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "quiet",
    children,
    pending = false,
    pendingLabel = "Working",
    className,
    disabled,
    onClick,
    type = "button",
    ...rest
  },
  ref,
) {
  const sizing = variant === "inline" || variant === "icon" ? "" : TARGET;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      // aria-disabled rather than disabled while pending: the control keeps
      // focus instead of dropping the user back to the document.
      aria-disabled={pending || undefined}
      aria-busy={pending || undefined}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      className={`${BASE} ${sizing} ${VARIANTS[variant]} ${className ?? ""}`}
      {...rest}
    >
      {children}
      {pending ? (
        <span className="text-muted" aria-hidden="true">
          &middot;&middot;&middot;
        </span>
      ) : null}
      {pending ? <span className="sr-only">{pendingLabel}</span> : null}
    </button>
  );
});
