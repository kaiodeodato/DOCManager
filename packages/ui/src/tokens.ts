/**
 * DOC Manager design tokens — premium AI SaaS (white surfaces, blue accents).
 * CSS variables live in tokens.css; this map is the typed JS companion.
 */

export const tokens = {
  color: {
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    accentMuted: "#eff6ff",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    ring: "#93c5fd",
    card: "#ffffff",
    overlay: "rgb(15 23 42 / 0.45)",
  },
  colorDark: {
    background: "#0b1220",
    foreground: "#e2e8f0",
    muted: "#94a3b8",
    border: "#1e293b",
    accent: "#3b82f6",
    accentHover: "#60a5fa",
    accentMuted: "#1e3a8a",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
    ring: "#1d4ed8",
    card: "#111827",
    overlay: "rgb(0 0 0 / 0.55)",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px rgb(15 23 42 / 0.05)",
    md: "0 4px 16px rgb(15 23 42 / 0.08)",
    lg: "0 12px 40px rgb(15 23 42 / 0.1)",
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
    12: "3rem",
  },
  typography: {
    fontSans: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    fontMono: '"IBM Plex Mono", ui-monospace, monospace',
    textXs: "0.75rem",
    textSm: "0.875rem",
    textMd: "1rem",
    textLg: "1.125rem",
    textXl: "1.25rem",
    text2xl: "1.5rem",
    leadingTight: "1.25",
    leadingNormal: "1.5",
    weightMedium: "500",
    weightSemibold: "600",
  },
  motion: {
    fast: "120ms",
    normal: "200ms",
    slow: "320ms",
  },
} as const;

export type TokenCategory = keyof typeof tokens;

export type TokenSwatch = {
  category: TokenCategory;
  name: string;
  cssVar: string;
  value: string;
};

function swatchesFor(
  category: TokenCategory,
  prefix: string,
  entries: Record<string, string>,
): TokenSwatch[] {
  return Object.entries(entries).map(([name, value]) => ({
    category,
    name,
    cssVar: `--dm-${prefix}-${name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
    value,
  }));
}

/** Flat list for docs / preview UIs (light theme + structural tokens). */
export const TOKEN_SWATCHES: readonly TokenSwatch[] = [
  ...swatchesFor("color", "color", tokens.color),
  ...swatchesFor("radius", "radius", tokens.radius),
  ...swatchesFor("shadow", "shadow", tokens.shadow),
  ...swatchesFor("space", "space", tokens.space),
];

/** Brand identity constants for documentation and product chrome. */
export const brand = {
  name: "DOC Manager",
  tagline: "Enterprise document intelligence",
  accentName: "Blue 600",
  surface: "White / slate ink",
  radiusLanguage: "Large soft corners",
  shadowLanguage: "Soft elevation",
} as const;
