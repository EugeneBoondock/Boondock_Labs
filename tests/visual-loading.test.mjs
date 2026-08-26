import assert from "node:assert/strict";
import test from "node:test";

import {
  retainVisualAfterFirstEntry,
  shouldMountAnimatedVisual,
} from "../src/app/visual-loading.mjs";

test("keeps an animated visual unmounted before it nears the viewport", () => {
  assert.equal(shouldMountAnimatedVisual(false, false), false);
});

test("keeps an animated visual unmounted when reduced motion is requested", () => {
  assert.equal(shouldMountAnimatedVisual(true, true), false);
});

test("mounts an animated visual near the viewport when motion is allowed", () => {
  assert.equal(shouldMountAnimatedVisual(true, false), true);
});

test("keeps a visual mounted after it has entered the loading range", () => {
  assert.equal(retainVisualAfterFirstEntry(true, false), true);
});

test("does not mount a visual before its first viewport entry", () => {
  assert.equal(retainVisualAfterFirstEntry(false, false), false);
});
