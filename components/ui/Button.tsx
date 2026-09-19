"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonClass, type ButtonVariant } from "./buttonClass";

/**
 * Four presentations, no more. A view presents at most one `primary` — that
 * part is a review rule, since a component cannot see its siblings.
 *
 * `primary` and `quiet` are pills via `--radius-pill`. `icon` stays square.
 *
 * Disabled and pending are signalled by border treatment and text, never by
 * colour alone — see the non-colour encoding requirement in
 * specs/design-system/responsive-accessibility.
 *
 * The class strings live in ./buttonClass so a navigating `<Link>` in a server
 * component can use the same four presentations without duplicating them or
 * nesting a button inside an anchor.
 */

type Variant = ButtonVariant;

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
      className={`${buttonClass(variant)} ${className ?? ""}`}
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
