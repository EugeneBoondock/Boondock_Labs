/**
 * @param {string | null} savedTheme
 * @param {boolean} systemPrefersDark
 * @returns {"light" | "dark"}
 */
export function resolveThemePreference(savedTheme, systemPrefersDark) {
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return systemPrefersDark ? "dark" : "light";
}

/**
 * @param {"light" | "dark"} currentTheme
 * @returns {"light" | "dark"}
 */
export function getNextTheme(currentTheme) {
  return currentTheme === "dark" ? "light" : "dark";
}
