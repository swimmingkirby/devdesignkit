import { ThemeTokens } from "@/lib/types/theme"
import { presetThemes } from "@/lib/themes/preset-themes"

/**
 * Normalizes any theme input (Preset ID, Legacy Theme Object, or Partial ThemeTokens)
 * into a strict, complete ThemeTokens object ready for export.
 */
export function normalizeTheme(themeOrId: string | any): ThemeTokens {
  // 1. Handle Preset ID
  if (typeof themeOrId === "string") {
    const preset = presetThemes[themeOrId]
    if (preset) {
      return convertLegacyToNewTokens(preset.tokens)
    }
    // Fallback if ID not found (shouldn't happen)
    return getDefaultTheme()
  }

  // 2. Handle Legacy Theme Object (has 'typography.scale' etc)
  if (themeOrId.typography && themeOrId.typography.scale) {
    return convertLegacyToNewTokens(themeOrId)
  }

  // 3. Handle Already New Format (validate & fill defaults)
  if (themeOrId.colors && themeOrId.fonts && themeOrId.radius) {
    return fillDefaults(themeOrId)
  }

  // 4. Fallback
  return getDefaultTheme()
}

function convertLegacyToNewTokens(legacy: any): ThemeTokens {
  return {
    colors: {
      background: legacy.colors.background,
      foreground: legacy.colors.foreground,
      primary: legacy.colors.primary,
      primaryForeground: legacy.colors.primaryForeground || "#ffffff",
      secondary: legacy.colors.secondary || legacy.colors.muted,
      secondaryForeground: legacy.colors.secondaryForeground || legacy.colors.foreground,
      muted: legacy.colors.muted,
      mutedForeground: legacy.colors.mutedForeground || legacy.colors.foreground,
      destructive: legacy.colors.destructive || "#ef4444",
      destructiveForeground: legacy.colors.destructiveForeground || "#ffffff",
      border: legacy.colors.border || legacy.colors.muted,
      input: legacy.colors.input || legacy.colors.border || legacy.colors.muted,
      ring: legacy.colors.primary,
      accent: legacy.colors.accent,
      accentForeground: legacy.colors.accentForeground,
      card: legacy.colors.background, // Default card to bg
      cardForeground: legacy.colors.foreground,
      popover: legacy.colors.background,
      popoverForeground: legacy.colors.foreground,
    },
    fonts: {
      sans: `${legacy.typography.headingFont}, system-ui, sans-serif`,
      serif: "Georgia, serif",
      mono: "Menlo, Monaco, Courier, monospace",
      sizes: {
        body: legacy.typography.scale === "sm" ? "14px" : legacy.typography.scale === "lg" ? "18px" : "16px",
        heading: legacy.typography.scale === "sm" ? ["36px", "28px", "20px"] : legacy.typography.scale === "lg" ? ["56px", "40px", "28px"] : ["48px", "36px", "24px"],
        caption: "14px",
      },
    },
    radius: {
      small: `${Math.max(0, legacy.radius - 4)}px`,
      medium: `${legacy.radius}px`,
      large: `${legacy.radius + 4}px`,
    },
    spacing: {
      base: legacy.spacing === "compact" ? "2px" : legacy.spacing === "spacious" ? "8px" : "4px",
    },
    shadows: {
      base: legacy.shadows === "soft" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : legacy.shadows === "strong" ? "4px 4px 0px 0px rgb(0 0 0 / 1)" : "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      large: legacy.shadows === "soft" ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : legacy.shadows === "strong" ? "8px 8px 0px 0px rgb(0 0 0 / 1)" : "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    },
  }
}

function fillDefaults(partial: any): ThemeTokens {
  const def = getDefaultTheme()
  return {
    colors: { ...def.colors, ...partial.colors },
    fonts: {
      ...def.fonts,
      ...partial.fonts,
      sizes: { ...def.fonts.sizes, ...(partial.fonts?.sizes || {}) },
    },
    radius: { ...def.radius, ...partial.radius },
    spacing: { ...def.spacing, ...partial.spacing },
    shadows: { ...def.shadows, ...partial.shadows },
  }
}

function getDefaultTheme(): ThemeTokens {
  return {
    colors: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#18181b",
      primaryForeground: "#fafafa",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      destructive: "#ef4444",
      destructiveForeground: "#fafafa",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#18181b",
      card: "#ffffff",
      cardForeground: "#09090b",
      popover: "#ffffff",
      popoverForeground: "#09090b",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "Menlo, Monaco, Courier, monospace",
      sizes: {
        body: "16px",
        heading: ["48px", "36px", "24px"],
        caption: "14px",
      },
    },
    radius: {
      small: "4px",
      medium: "8px",
      large: "16px",
    },
    spacing: {
      base: "4px",
    },
    shadows: {
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
  }
}
