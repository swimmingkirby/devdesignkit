import { ThemeTokens } from "@/lib/types/theme"

export const presetThemes: Record<string, ThemeTokens> = {
  minimal: {
    colors: {
      background: "#ffffff",
      foreground: "#09090b",
      primary: "#09090b",
      primaryForeground: "#fafafa",
      secondary: "#f4f4f5",
      secondaryForeground: "#09090b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      destructive: "#ef4444",
      destructiveForeground: "#fafafa",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#09090b",
      accent: "#8b5cf6",
      accentForeground: "#fafafa",
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
      medium: "6px",
      large: "8px",
    },
    spacing: {
      base: "4px",
    },
    shadows: {
      base: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    },
  },
  rounded: {
    colors: {
      background: "#ffffff",
      foreground: "#0f172a",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",
      muted: "#f8fafc",
      mutedForeground: "#64748b",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#3b82f6",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
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
      small: "8px",
      medium: "12px",
      large: "16px",
    },
    spacing: {
      base: "4px",
    },
    shadows: {
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      large: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
  brutalist: {
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#ffffff",
      secondaryForeground: "#000000",
      muted: "#f5f5f5",
      mutedForeground: "#737373",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      border: "#000000",
      input: "#000000",
      ring: "#000000",
      accent: "#000000",
      accentForeground: "#ffffff",
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "Menlo, Monaco, Courier, monospace",
      sizes: {
        body: "18px",
        heading: ["56px", "40px", "28px"],
        caption: "14px",
      },
    },
    radius: {
      small: "0px",
      medium: "0px",
      large: "0px",
    },
    spacing: {
      base: "2px",
    },
    shadows: {
      base: "4px 4px 0px 0px rgb(0 0 0 / 1)",
      large: "8px 8px 0px 0px rgb(0 0 0 / 1)",
    },
  },
  playful: {
    colors: {
      background: "#fef3c7",
      foreground: "#78350f",
      primary: "#ec4899",
      primaryForeground: "#ffffff",
      secondary: "#fce7f3",
      secondaryForeground: "#9f1239",
      muted: "#fef3c7",
      mutedForeground: "#92400e",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#fbbf24",
      input: "#fbbf24",
      ring: "#ec4899",
      accent: "#10b981",
      accentForeground: "#ffffff",
    },
    fonts: {
      sans: "Poppins, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "Menlo, Monaco, Courier, monospace",
      sizes: {
        body: "16px",
        heading: ["48px", "36px", "24px"],
        caption: "14px",
      },
    },
    radius: {
      small: "12px",
      medium: "16px",
      large: "24px",
    },
    spacing: {
      base: "8px",
    },
    shadows: {
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      large: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
  dark: {
    colors: {
      background: "#09090b",
      foreground: "#fafafa",
      primary: "#ffffff",
      primaryForeground: "#09090b",
      secondary: "#27272a",
      secondaryForeground: "#fafafa",
      muted: "#18181b",
      mutedForeground: "#a1a1aa",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#27272a",
      input: "#27272a",
      ring: "#ffffff",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
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
      medium: "6px",
      large: "10px",
    },
    spacing: {
      base: "4px",
    },
    shadows: {
      base: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
      large: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
    },
  },
  custom: {
    colors: {
      background: "#ffffff",
      foreground: "#1e1b4b",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#e0e7ff",
      secondaryForeground: "#312e81",
      muted: "#f5f3ff",
      mutedForeground: "#6b21a8",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#c7d2fe",
      input: "#c7d2fe",
      ring: "#6366f1",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
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
      small: "6px",
      medium: "8px",
      large: "12px",
    },
    spacing: {
      base: "4px",
    },
    shadows: {
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      large: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
}

export const themeLabels: Record<string, string> = {
  minimal: "Minimal Light",
  rounded: "Soft Rounded",
  brutalist: "Brutalist",
  playful: "Playful",
  dark: "Dark Minimal",
  custom: "Custom (from inspiration)",
}

export type ThemeKey = keyof typeof presetThemes

