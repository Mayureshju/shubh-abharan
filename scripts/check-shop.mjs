#!/usr/bin/env node
/** Shop page-number window. */

import assert from "node:assert/strict";
import { pageItems } from "../components/shop/pages.ts";

assert.deepEqual(pageItems(1, 1), [1]);
assert.deepEqual(pageItems(1, 3), [1, 2, 3]);
assert.deepEqual(pageItems(1, 10), [1, 2, null, 10]);
assert.deepEqual(pageItems(5, 10), [1, null, 4, 5, 6, null, 10]);
assert.deepEqual(pageItems(3, 10), [1, 2, 3, 4, null, 10]);
assert.deepEqual(pageItems(10, 10), [1, null, 9, 10]);

console.log("check-shop: ok");
