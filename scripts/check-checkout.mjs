#!/usr/bin/env node
/**
 * Checkout validation — the trust boundary every order passes through.
 *
 * Loads lib/commerce/checkout-schema.ts directly (Node strips the types, as in
 * check-catalog.mjs) and asserts the cases commerce/cart-checkout names: phone
 * normalisation, malformed phone and pincode, and the gift-message ceiling.
 * Plain node:assert, no test runner.
 */

import assert from "node:assert/strict";

import { checkoutDetailsSchema, fieldErrors } from "../lib/commerce/checkout-schema.ts";

const person = { name: "Asha Rao", phone: "9876543210", address: "12 Marine Drive, Mumbai" };
const valid = { billing: person, receiver: { ...person, pincode: "400001" }, giftMessage: "" };

function errorsFor(details) {
  const result = checkoutDetailsSchema.safeParse(details);
  return result.success ? {} : fieldErrors(result.error);
}

// A complete self-delivery passes.
assert.equal(checkoutDetailsSchema.safeParse(valid).success, true, "valid details are accepted");

// +91, spaces and dashes are accepted and stored as the bare ten digits.
for (const entered of ["+91 98765 43210", "+91-98765-43210", "919876543210", "09876543210"]) {
  const parsed = checkoutDetailsSchema.parse({ ...valid, billing: { ...person, phone: entered } });
  assert.equal(parsed.billing.phone, "9876543210", `"${entered}" normalises`);
}

// A ten-digit number that merely starts with 91 keeps its digits.
assert.equal(
  checkoutDetailsSchema.parse({ ...valid, billing: { ...person, phone: "9123456789" } }).billing.phone,
  "9123456789",
);

// Nine digits, or a landline-style leading digit, are refused on that field.
assert.ok(errorsFor({ ...valid, billing: { ...person, phone: "987654321" } })["billing.phone"]);
assert.ok(errorsFor({ ...valid, billing: { ...person, phone: "2212345678" } })["billing.phone"]);

// A pincode is six digits and cannot start with zero.
for (const pincode of ["40001", "4000011", "040001", "40O001"]) {
  assert.ok(
    errorsFor({ ...valid, receiver: { ...valid.receiver, pincode } })["receiver.pincode"],
    `pincode "${pincode}" is refused`,
  );
}

// Gift message: 200 characters pass, 201 do not.
assert.equal(checkoutDetailsSchema.safeParse({ ...valid, giftMessage: "x".repeat(200) }).success, true);
assert.ok(errorsFor({ ...valid, giftMessage: "x".repeat(201) }).giftMessage);

// Blank names and addresses are refused after trimming.
const blanks = errorsFor({ ...valid, billing: { name: "  ", phone: person.phone, address: "   " } });
assert.ok(blanks["billing.name"] && blanks["billing.address"]);

console.log("check-checkout: ok");
