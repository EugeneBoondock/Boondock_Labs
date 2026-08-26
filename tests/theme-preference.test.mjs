import assert from "node:assert/strict";
import test from "node:test";

import {
  getNextTheme,
  resolveThemePreference,
} from "../src/app/theme-preference.mjs";

test("uses a valid saved theme instead of the system preference", () => {
  assert.equal(resolveThemePreference("light", true), "light");
  assert.equal(resolveThemePreference("dark", false), "dark");
});

test("falls back to the system preference for an invalid saved value", () => {
  assert.equal(resolveThemePreference(null, true), "dark");
  assert.equal(resolveThemePreference("sepia", false), "light");
});

test("returns the opposite color theme", () => {
  assert.equal(getNextTheme("dark"), "light");
  assert.equal(getNextTheme("light"), "dark");
});
