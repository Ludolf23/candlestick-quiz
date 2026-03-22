// ─── Design Tokens ────────────────────────────────────────────────────────────
// Hier tauschst du Farben aus wenn du ein neues Quiz-Theme brauchst

export const DARK = {
  bg:        "#0d1117",
  surface:   "#161b22",
  surfaceHi: "#1c2333",
  border:    "#30363d",
  borderHi:  "#484f58",
  text:      "#e6edf3",
  textMuted: "#7d8590",
  textDim:   "#484f58",
  green:     "#3fb950",
  greenBg:   "#0d2216",
  greenBdr:  "#238636",
  red:       "#f85149",
  redBg:     "#2d1318",
  redBdr:    "#da3633",
  yellow:    "#e3b341",
  yellowBg:  "#2b2006",
  yellowBdr: "#9e6a03",
  blue:      "#58a6ff",
  blueBg:    "#0c1929",
  blueBdr:   "#1f6feb",
  purple:    "#bc8cff",
  accent:    "#f0b429",
};

export const LIGHT = {
  bg:        "#f6f8fa",
  surface:   "#ffffff",
  surfaceHi: "#f0f2f5",
  border:    "#d0d7de",
  borderHi:  "#afb8c1",
  text:      "#1f2328",
  textMuted: "#57606a",
  textDim:   "#afb8c1",
  green:     "#1a7f37",
  greenBg:   "#dafbe1",
  greenBdr:  "#82e09a",
  red:       "#cf222e",
  redBg:     "#ffebe9",
  redBdr:    "#ff8182",
  yellow:    "#9a6700",
  yellowBg:  "#fff8c5",
  yellowBdr: "#d4a72c",
  blue:      "#0969da",
  blueBg:    "#ddf4ff",
  blueBdr:   "#54aeff",
  purple:    "#8250df",
  accent:    "#9a6700",
};

export const font = {
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  sans: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
};

// C wird dynamisch gesetzt (dark/light) – wird von App.jsx gesteuert
export let C = DARK;
export function setThemeTokens(theme) {
  C = theme === "light" ? LIGHT : DARK;
}
