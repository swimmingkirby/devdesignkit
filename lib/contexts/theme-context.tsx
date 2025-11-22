"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { ThemeTokens } from "@/lib/themes/theme-types"

const defaultTheme: ThemeTokens = {
  colors: {
    primary: "#09090b",
    primaryForeground: "#fafafa",
    secondary: "#f4f4f5",
    secondaryForeground: "#09090b",
    background: "#ffffff",
    foreground: "#09090b",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    accent: "#8b5cf6",
    accentForeground: "#fafafa",
    destructive: "#ef4444",
    destructiveForeground: "#fafafa",
    border: "#e4e4e7",
    input: "#e4e4e7",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    scale: "md",
  },
  radius: 8,
  spacing: "cozy",
  shadows: "normal",
}

interface ThemeContextType {
  theme: ThemeTokens;
  updateTheme: (updates: Partial<ThemeTokens>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeTokens>(defaultTheme)

  const updateTheme = useCallback((updates: Partial<ThemeTokens>) => {
    setTheme((prev) => ({
      ...prev,
      ...updates,
      colors: { ...prev.colors, ...updates.colors },
      typography: { ...prev.typography, ...updates.typography },
    }))
  }, [])

  const resetTheme = useCallback(() => {
    setTheme(defaultTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
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

