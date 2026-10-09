import { z } from "zod";

/**
 * Checkout details, validated the same way in the browser and in the
 * placeOrder server action — see commerce/cart-checkout. Imports nothing but
 * zod, so scripts/check-checkout.mjs can run it under plain node.
 *
 * The payload is always a full billing block and a full receiver block. When
 * "Deliver to my billing address" is ticked, the client copies billing into
 * the receiver before validating, so there are no conditional branches here.
 */

const name = z
  .string()
  .trim()
  .min(2, "Enter a name of at least two letters.")
  .max(80, "Keep the name under 80 characters.");

/** Stored as the bare ten digits; a +91, 91 or 0 prefix, spaces and dashes are dropped. */
const phone = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number."));

const address = z
  .string()
  .trim()
  .min(5, "Enter the full address.")
  .max(300, "Keep the address under 300 characters.");

const pincode = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a 6-digit pincode.");

export const checkoutDetailsSchema = z.object({
  billing: z.object({ name, phone, address }),
  receiver: z.object({ name, phone, address, pincode }),
  giftMessage: z.string().trim().max(200, "Keep the gift message under 200 characters.").optional(),
});

export type CheckoutDetailsInput = z.input<typeof checkoutDetailsSchema>;
export type CheckoutDetails = z.output<typeof checkoutDetailsSchema>;

export const GIFT_MESSAGE_MAX = 200;

/** First message per field path ("billing.phone"), for inline errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
