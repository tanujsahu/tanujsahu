export type ColorTheme = "dark" | "light";

export const themeStorageKey = "portfolio-theme";

export function applyColorTheme(theme: ColorTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function readColorTheme(): ColorTheme {
  try {
    return window.localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}
