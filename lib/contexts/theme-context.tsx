"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { ThemeTokens } from "@/lib/types/theme"

const defaultTheme: ThemeTokens = {
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

interface ThemeContextType {
  theme: ThemeTokens;
  activeThemeId: string;
  updateTheme: (updates: Partial<ThemeTokens>, newThemeId?: string) => void;
  setThemeId: (id: string) => void;
  resetTheme: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Applies theme tokens as CSS custom properties
 */
function applyThemeVariables(theme: ThemeTokens) {
  const root = document.documentElement

  // Colors
  root.style.setProperty("--color-background", theme.colors.background)
  root.style.setProperty("--color-foreground", theme.colors.foreground)
  root.style.setProperty("--color-primary", theme.colors.primary)
  root.style.setProperty("--color-primary-foreground", theme.colors.primaryForeground)
  root.style.setProperty("--color-secondary", theme.colors.secondary)
  root.style.setProperty("--color-secondary-foreground", theme.colors.secondaryForeground)
  root.style.setProperty("--color-muted", theme.colors.muted)
  root.style.setProperty("--color-muted-foreground", theme.colors.mutedForeground)
  root.style.setProperty("--color-destructive", theme.colors.destructive)
  root.style.setProperty("--color-destructive-foreground", theme.colors.destructiveForeground)
  root.style.setProperty("--color-border", theme.colors.border)
  root.style.setProperty("--color-input", theme.colors.input)
  root.style.setProperty("--color-ring", theme.colors.ring)

  if (theme.colors.accent) {
    root.style.setProperty("--color-accent", theme.colors.accent)
  }
  if (theme.colors.accentForeground) {
    root.style.setProperty("--color-accent-foreground", theme.colors.accentForeground)
  }

  // Fonts
  root.style.setProperty("--font-sans", theme.fonts.sans)
  root.style.setProperty("--font-serif", theme.fonts.serif)
  root.style.setProperty("--font-mono", theme.fonts.mono)
  root.style.setProperty("--font-size-body", theme.fonts.sizes.body)
  root.style.setProperty("--font-size-caption", theme.fonts.sizes.caption)

  // Heading sizes
  theme.fonts.sizes.heading.forEach((size, index) => {
    root.style.setProperty(`--font-size-heading-${index + 1}`, size)
  })

  // Radius
  root.style.setProperty("--radius-sm", theme.radius.small)
  root.style.setProperty("--radius-md", theme.radius.medium)
  root.style.setProperty("--radius-lg", theme.radius.large)

  // Spacing
  root.style.setProperty("--spacing-base", theme.spacing.base)

  // Shadows
  root.style.setProperty("--shadow-base", theme.shadows.base)
  root.style.setProperty("--shadow-lg", theme.shadows.large)
}

interface HistoryState {
  theme: ThemeTokens;
  id: string;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeTokens>(defaultTheme)
  const [activeThemeId, setActiveThemeId] = useState<string>("minimal-light")

  // History stacks
  const [history, setHistory] = useState<HistoryState[]>([])
  const [future, setFuture] = useState<HistoryState[]>([])

  const updateTheme = useCallback((updates: Partial<ThemeTokens>, newThemeId?: string) => {
    setTheme((prevTheme) => {
      // Save current state to history before updating
      setHistory(prev => [...prev, { theme: prevTheme, id: activeThemeId }])
      setFuture([]) // Clear future on new change

      const newTheme = {
        ...prevTheme,
        ...updates,
        colors: { ...prevTheme.colors, ...updates.colors },
        fonts: updates.fonts ? {
          ...prevTheme.fonts,
          ...updates.fonts,
          sizes: updates.fonts.sizes ? {
            ...prevTheme.fonts.sizes,
            ...updates.fonts.sizes,
          } : prevTheme.fonts.sizes,
        } : prevTheme.fonts,
        radius: updates.radius ? { ...prevTheme.radius, ...updates.radius } : prevTheme.radius,
        spacing: updates.spacing ? { ...prevTheme.spacing, ...updates.spacing } : prevTheme.spacing,
        shadows: updates.shadows ? { ...prevTheme.shadows, ...updates.shadows } : prevTheme.shadows,
      };

      return newTheme;
    });

    if (newThemeId) {
      setActiveThemeId(newThemeId)
    } else {
      // If we modify a preset, it becomes "custom" effectively, but we might want to keep the ID 
      // if we are just tweaking it. For now, let's keep the ID unless explicitly changed.
      // Or maybe switch to 'custom' if it's a modification? 
      // The user didn't specify, but usually tweaking a preset makes it custom.
      // However, for "Reset" to work, we need to know what it WAS.
      // So let's keep the ID.
    }
  }, [activeThemeId])

  const setThemeId = useCallback((id: string) => {
    setActiveThemeId(id)
  }, [])

  const undo = useCallback(() => {
    if (history.length === 0) return

    const previous = history[history.length - 1]
    const newHistory = history.slice(0, -1)

    setFuture(prev => [{ theme, id: activeThemeId }, ...prev])
    setHistory(newHistory)
    setTheme(previous.theme)
    setActiveThemeId(previous.id)
  }, [history, theme, activeThemeId])

  const redo = useCallback(() => {
    if (future.length === 0) return

    const next = future[0]
    const newFuture = future.slice(1)

    setHistory(prev => [...prev, { theme, id: activeThemeId }])
    setFuture(newFuture)
    setTheme(next.theme)
    setActiveThemeId(next.id)
  }, [future, theme, activeThemeId])

  const resetTheme = useCallback(() => {
    // This resets to global default. 
    // For per-theme reset, we'll handle it in the component or pass an arg here.
    // But to keep interface simple, let's just use updateTheme with the default tokens.
    updateTheme(defaultTheme, "minimal-light")
  }, [updateTheme])

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    applyThemeVariables(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      activeThemeId,
      updateTheme,
      setThemeId,
      resetTheme,
      undo,
      redo,
      canUndo: history.length > 0,
      canRedo: future.length > 0
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

