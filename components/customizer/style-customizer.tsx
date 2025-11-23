"use client"

import * as React from "react"
import { useTheme } from "@/lib/contexts/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "@/components/ui/color-picker"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CustomizerHeader } from "./customizer-header"
import { ActionBar } from "./action-bar"
import { LayoutDashboard, TrendingUp, BarChart3, FolderKanban, Users, Database, FileText, HelpCircle, Settings, Search, ChevronUp, Plus, Pencil, Home, ChevronRight } from "lucide-react"
import { presetThemes } from "@/lib/themes/preset-themes"
import { ThemeTokens } from "@/lib/types/theme"
import { useScrapedData } from "@/lib/hooks/use-scraped-data"
import { ScrapedComponentRenderer, ScrapedLayoutRenderer } from "./scraped-component-renderer"

// Helper to convert legacy theme tokens to new format
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

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Raleway", label: "Raleway" },
]

export function StyleCustomizer() {
  const { theme: rawTheme, updateTheme, activeThemeId } = useTheme()
  // Type assertion to include optional properties
  const theme = rawTheme as ThemeTokens & {
    fonts: ThemeTokens['fonts'] & {
      heading?: string
      secondary?: string
      weights?: {
        normal: string
        medium?: string
        semibold?: string
        bold: string
      }
    }
  }
  const { scrapedData, hasScrapedData } = useScrapedData()
  const [selectedTheme, setSelectedTheme] = React.useState<string>("minimal-light")
  const [barHeights, setBarHeights] = React.useState<number[]>([])
  const [importedThemeName, setImportedThemeName] = React.useState<string | null>(null)
  const [showSuccessBanner, setShowSuccessBanner] = React.useState(false)
  const isImportingRef = React.useRef(false) // Track if we're importing to prevent theme reset

  // UX Settings state (local only, not connected to theme tokens yet)
  const [uxSettings, setUxSettings] = React.useState({
    touchTarget: false,
    interactivePadding: "medium" as "small" | "medium" | "large",
    enforceContrast: false,
    focusRings: true,
    reducedMotion: false,
    density: "cozy" as "compact" | "cozy" | "spacious",
    formSpacing: "default" as "tight" | "default" | "wide",
    strongErrors: true,
    strongHover: true,
    autoValidationMessages: false,
    lineHeight: "normal" as "normal" | "relaxed" | "loose",
    bodyFontSize: "md" as "small" | "medium" | "large",
    headingsEnabled: true,
  })

  // Check for imported theme from scraper on mount
  React.useEffect(() => {
    const importedThemeJson = sessionStorage.getItem("importedTheme");
    const importedThemeUrl = sessionStorage.getItem("importedThemeUrl");
    const themeName = sessionStorage.getItem("importedThemeName");

    if (importedThemeJson) {
      try {
        const importedTheme = JSON.parse(importedThemeJson) as ThemeTokens;

        console.log("📥 Importing theme from scraper:");
        console.log("  Name:", themeName);
        console.log("  URL:", importedThemeUrl);
        console.log("  Theme data:", importedTheme);

        // Set flag to prevent handleThemeChange from overwriting
        isImportingRef.current = true;

        // Set the theme name FIRST (before changing selectedTheme)
        setImportedThemeName(themeName || "Imported Theme");

        // Update the selected theme to "custom" to reflect imported theme
        // setSelectedTheme("custom"); // Removed local state

        // Apply the theme - use setTimeout to ensure state updates are batched
        setTimeout(() => {
          console.log("🎨 Applying imported theme NOW...");
          updateTheme(importedTheme, "custom"); // Update with ID
          console.log("✓ Theme applied via updateTheme()");
        }, 0);

        // Show success banner (auto-dismisses)
        setShowSuccessBanner(true);

        // Clear from session storage after applying
        sessionStorage.removeItem("importedTheme");
        sessionStorage.removeItem("importedThemeUrl");
        sessionStorage.removeItem("importedThemeName");

        // Show success message
        console.log(`✓ Applied theme "${themeName}" from: ${importedThemeUrl || "scraper"}`);
        console.log("  Primary color:", importedTheme.colors.primary);
        console.log("  Background:", importedTheme.colors.background);

        // Keep the importing flag set for longer to prevent race conditions
        setTimeout(() => {
          isImportingRef.current = false;
          console.log("🔓 Import protection released");
        }, 500);

        // Auto-dismiss success banner after 5 seconds
        setTimeout(() => {
          setShowSuccessBanner(false);
        }, 5000);
      } catch (error) {
        console.error("Failed to apply imported theme:", error);
        alert("Failed to apply imported theme. Check console for details.");
      }
    }
  }, [updateTheme]);

  // Stub function for future backend extraction integration
  function applyExtractedTheme(tokens: ThemeTokens) {
    // TODO: this will be used by backend extraction later
    updateTheme(tokens)
  }

  // Handle theme selection from dropdown
  const handleThemeChange = React.useCallback((themeKey: string) => {
    console.log(`🎨 Theme selector changed to: ${themeKey}`);

    // If we're currently importing, ignore this change
    if (isImportingRef.current) {
      console.log(`⏭️  Ignoring theme change during import`);
      return;
    }

    // setSelectedTheme(themeKey) // Removed local state

    // If switching to "custom" and we have an imported theme name, don't load preset
    // This preserves the imported theme from the scraper
    if (themeKey === "custom" && importedThemeName) {
      console.log(`✓ Keeping imported theme: ${importedThemeName}`);
      updateTheme({}, "custom")
      return;
    }

    const selectedThemeData = presetThemes[themeKey]
    if (selectedThemeData) {
      console.log(`✓ Loading preset theme: ${themeKey}`);
      // Convert the old theme structure to new ThemeTokens structure
      const tokens = convertLegacyToNewTokens(selectedThemeData.tokens)
      updateTheme(tokens, themeKey)
    } else {
      updateTheme({}, themeKey)
    }

    // Clear imported theme name when switching to a non-custom preset theme
    if (themeKey !== "custom") {
      setImportedThemeName(null)
    }
  }, [updateTheme, importedThemeName])

  const handleReset = React.useCallback(() => {
    if (activeThemeId === "custom") {
      // If custom, maybe we can't reset easily unless we stored the original custom state?
      // For now, let's just do nothing or maybe reset to minimal-light?
      // Or if importedThemeName exists, re-import?
      // Let's just log for now.
      console.log("Resetting custom theme not fully supported yet");
      return;
    }

    // Re-apply the preset
    const selectedThemeData = presetThemes[activeThemeId]
    if (selectedThemeData) {
      console.log(`↺ Resetting theme: ${activeThemeId}`);
      const tokens = convertLegacyToNewTokens(selectedThemeData.tokens)
      updateTheme(tokens)
    }
  }, [activeThemeId, updateTheme])

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [key]: value,
      },
    })
  }

  const handleFontsChange = (
    key: keyof ThemeTokens['fonts'] | 'heading' | 'secondary',
    value: string
  ) => {
    updateTheme({
      fonts: {
        ...theme.fonts,
        [key]: value,
      },
    })
  }

  const handleFontSizeChange = (
    key: keyof typeof theme.fonts.sizes,
    value: string | string[]
  ) => {
    updateTheme({
      fonts: {
        ...theme.fonts,
        sizes: {
          ...theme.fonts.sizes,
          [key]: value,
        },
      },
    })
  }

  // Initialize theme on mount
  React.useEffect(() => {
    // We use activeThemeId from context now, so we might not need to force update on mount
    // unless we want to ensure the preset is loaded.
    // But updateTheme is stable.
    // Let's keep it safe.
    const initialTheme = presetThemes[activeThemeId]
    if (initialTheme) {
      const tokens = convertLegacyToNewTokens(initialTheme.tokens)
      // Don't trigger update if it matches? Hard to check.
      // Actually, context initializes with defaultTheme.
      // If activeThemeId is minimal-light, we should ensure tokens match.
      updateTheme(tokens)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generate bar heights only on client to avoid hydration mismatch
  React.useEffect(() => {
    setBarHeights(Array.from({ length: 12 }, () => Math.random() * 60 + 20))
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#2C2C2C] text-white overflow-hidden">
      {/* Top Bar - Logo and Auth */}
      <CustomizerHeader />

      {/* Second Bar - Theme Selector and Actions */}
      <ActionBar
        selectedTheme={activeThemeId}
        onThemeChange={handleThemeChange}
        onReset={handleReset}
        importedThemeName={importedThemeName}
        isImporting={isImportingRef.current}
      />

      {/* Imported Theme Notification */}
      {showSuccessBanner && importedThemeName && (
        <div className="bg-green-950/30 border-b border-green-900/50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">
                ✓ Theme "{importedThemeName}" imported successfully
              </span>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-green-500/70 hover:text-green-400 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Customization Panel */}
        <aside className="w-[480px] max-w-[480px] min-w-[480px] flex flex-col border-r border-[#444] bg-[#2C2C2C] shrink-0">
          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#444 #2C2C2C',
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-track {
                background: #2C2C2C;
              }
              div::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 4px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `}</style>
            <div className="p-6">
              {/* Theme Preview Card */}
              <div className="mb-6 p-4 bg-[#1E1E1E] rounded-lg border border-[#444]">
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                  Current Theme Preview
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {/* Palette Row */}
                  <div className="flex items-center gap-1.5 bg-[#111] p-1.5 rounded-full border border-[#333]">
                    {[
                      { color: theme.colors.primary, label: "Primary" },
                      { color: theme.colors.background, label: "Background" },
                      { color: theme.colors.foreground, label: "Foreground" },
                      { color: theme.colors.accent || theme.colors.primary, label: "Accent" },
                      { color: theme.colors.muted, label: "Muted" },
                    ].map((swatch, i) => (
                      <div
                        key={i}
                        className="group relative"
                      >
                        <div
                          className="h-6 w-6 rounded-full border border-[#444] shadow-sm cursor-help transition-transform hover:scale-110"
                          style={{ backgroundColor: swatch.color }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          {swatch.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-px flex-1 bg-[#333]" />
                </div>
                <div className="text-xs text-gray-400">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Font:</span>
                    <span className="text-gray-300 truncate ml-2">{theme.fonts.sans.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500">Radius:</span>
                    <span className="text-gray-300">{theme.radius.medium}</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[#1E1E1E] text-gray-400 p-1 rounded-lg mb-6">
                  <TabsTrigger
                    value="colors"
                    className="rounded-md data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white transition-all data-[state=active]:shadow-sm text-xs"
                  >
                    Colors
                  </TabsTrigger>
                  <TabsTrigger
                    value="typography"
                    className="rounded-md data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white transition-all data-[state=active]:shadow-sm text-xs"
                  >
                    Type
                  </TabsTrigger>
                  <TabsTrigger
                    value="other"
                    className="rounded-md data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white transition-all data-[state=active]:shadow-sm text-xs"
                  >
                    Other
                  </TabsTrigger>
                  <TabsTrigger
                    value="ux-principles"
                    className="rounded-md data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white transition-all data-[state=active]:shadow-sm text-xs"
                  >
                    UX
                  </TabsTrigger>
                </TabsList>

                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-0 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                    Color Palette
                  </div>
                  <Accordion type="multiple" defaultValue={["primary", "base"]} className="w-full space-y-2">
                    {/* Primary Colors */}
                    <AccordionItem value="primary" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Primary Colors
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
                        <ColorPicker
                          label="Primary"
                          value={theme.colors.primary}
                          onChange={(value) => handleColorChange("primary", value)}
                        />
                        {theme.colors.primaryForeground && (
                          <ColorPicker
                            label="Primary Foreground"
                            value={theme.colors.primaryForeground}
                            onChange={(value) => handleColorChange("primaryForeground", value)}
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Secondary Colors */}
                    {(theme.colors.secondary || theme.colors.secondaryForeground) && (
                      <AccordionItem value="secondary" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                          Secondary Colors
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 pb-4">
                          {theme.colors.secondary && (
                            <ColorPicker
                              label="Secondary"
                              value={theme.colors.secondary}
                              onChange={(value) => handleColorChange("secondary", value)}
                            />
                          )}
                          {theme.colors.secondaryForeground && (
                            <ColorPicker
                              label="Secondary Foreground"
                              value={theme.colors.secondaryForeground}
                              onChange={(value) => handleColorChange("secondaryForeground", value)}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Accent Colors */}
                    {(theme.colors.accent || theme.colors.accentForeground) && (
                      <AccordionItem value="accent" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                          Accent Colors
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 pb-4">
                          {theme.colors.accent && (
                            <ColorPicker
                              label="Accent"
                              value={theme.colors.accent}
                              onChange={(value) => handleColorChange("accent", value)}
                            />
                          )}
                          {theme.colors.accentForeground && (
                            <ColorPicker
                              label="Accent Foreground"
                              value={theme.colors.accentForeground}
                              onChange={(value) => handleColorChange("accentForeground", value)}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Base Colors */}
                    <AccordionItem value="base" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Base Colors
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <ColorPicker
                          label="Background"
                          value={theme.colors.background}
                          onChange={(value) => handleColorChange("background", value)}
                        />
                        <ColorPicker
                          label="Foreground"
                          value={theme.colors.foreground}
                          onChange={(value) => handleColorChange("foreground", value)}
                        />
                        <ColorPicker
                          label="Muted"
                          value={theme.colors.muted}
                          onChange={(value) => handleColorChange("muted", value)}
                        />
                        {theme.colors.mutedForeground && (
                          <ColorPicker
                            label="Muted Foreground"
                            value={theme.colors.mutedForeground}
                            onChange={(value) => handleColorChange("mutedForeground", value)}
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    {/* Destructive Colors */}
                    {(theme.colors.destructive || theme.colors.destructiveForeground) && (
                      <AccordionItem value="destructive" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                          Destructive Colors
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 pb-4">
                          {theme.colors.destructive && (
                            <ColorPicker
                              label="Destructive"
                              value={theme.colors.destructive}
                              onChange={(value) => handleColorChange("destructive", value)}
                            />
                          )}
                          {theme.colors.destructiveForeground && (
                            <ColorPicker
                              label="Destructive Foreground"
                              value={theme.colors.destructiveForeground}
                              onChange={(value) => handleColorChange("destructiveForeground", value)}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Border and Input Colors */}
                    <AccordionItem value="border-input" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Border & Input
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <ColorPicker
                          label="Border"
                          value={theme.colors.border}
                          onChange={(value) => handleColorChange("border", value)}
                        />
                        <ColorPicker
                          label="Input"
                          value={theme.colors.input}
                          onChange={(value) => handleColorChange("input", value)}
                        />
                        <ColorPicker
                          label="Ring (Focus)"
                          value={theme.colors.ring}
                          onChange={(value) => handleColorChange("ring", value)}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="mt-0 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                    Typography System
                  </div>
                  <Accordion type="multiple" defaultValue={["font-family", "font-sizes"]} className="w-full space-y-2">
                    <AccordionItem value="font-family" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Font Families
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Sans Serif</Label>
                          <Input
                            value={theme.fonts.sans}
                            onChange={(e) => handleFontsChange("sans", e.target.value)}
                            placeholder="Inter, system-ui, sans-serif"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                          <p className="text-xs text-gray-500 leading-relaxed">Primary font for UI and body text</p>
                        </div>

                        {theme.fonts.heading && (
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-xs font-medium">Heading Font</Label>
                            <Input
                              value={theme.fonts.heading}
                              onChange={(e) => handleFontsChange("heading", e.target.value)}
                              placeholder="Playfair Display, serif"
                              className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                            />
                            <p className="text-xs text-gray-500 leading-relaxed">Distinct font for headings</p>
                          </div>
                        )}

                        {theme.fonts.secondary && (
                          <div className="space-y-2">
                            <Label className="text-gray-300 text-xs font-medium">Secondary Font</Label>
                            <Input
                              value={theme.fonts.secondary}
                              onChange={(e) => handleFontsChange("secondary", e.target.value)}
                              placeholder="Open Sans, sans-serif"
                              className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                            />
                            <p className="text-xs text-gray-500 leading-relaxed">Alternative font for special elements</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Serif</Label>
                          <Input
                            value={theme.fonts.serif}
                            onChange={(e) => handleFontsChange("serif", e.target.value)}
                            placeholder="Georgia, serif"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Monospace</Label>
                          <Input
                            value={theme.fonts.mono}
                            onChange={(e) => handleFontsChange("mono", e.target.value)}
                            placeholder="Menlo, Monaco, Courier, monospace"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="font-sizes" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Font Sizes
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Body Size</Label>
                          <Input
                            value={theme.fonts.sizes.body}
                            onChange={(e) => handleFontSizeChange("body", e.target.value)}
                            placeholder="16px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">H1 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[0] || "48px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[0] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="48px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">H2 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[1] || "36px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[1] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="36px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">H3 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[2] || "24px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[2] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="24px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Caption Size</Label>
                          <Input
                            value={theme.fonts.sizes.caption}
                            onChange={(e) => handleFontSizeChange("caption", e.target.value)}
                            placeholder="14px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {theme.fonts.weights && (
                      <AccordionItem value="font-weights" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                          Font Weights
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2 pt-2 pb-4">
                          <div className="text-xs text-gray-400 mb-2">
                            Detected from scraped website
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Normal</span>
                            <span className="text-gray-500">{theme.fonts.weights.normal}</span>
                          </div>
                          {theme.fonts.weights.medium && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">Medium</span>
                              <span className="text-gray-500">{theme.fonts.weights.medium}</span>
                            </div>
                          )}
                          {theme.fonts.weights.semibold && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">Semibold</span>
                              <span className="text-gray-500">{theme.fonts.weights.semibold}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Bold</span>
                            <span className="text-gray-500">{theme.fonts.weights.bold}</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                  </Accordion>
                </TabsContent>

                {/* Other Tab */}
                <TabsContent value="other" className="mt-0 space-y-3">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">
                    Styling Properties
                  </div>
                  <Accordion type="multiple" defaultValue={["radius", "spacing"]} className="w-full space-y-2">
                    <AccordionItem value="radius" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Border Radius
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Small Radius</Label>
                          <Input
                            value={theme.radius.small}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, small: e.target.value } })}
                            placeholder="4px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Medium Radius</Label>
                          <Input
                            value={theme.radius.medium}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, medium: e.target.value } })}
                            placeholder="8px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Large Radius</Label>
                          <Input
                            value={theme.radius.large}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, large: e.target.value } })}
                            placeholder="16px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="spacing" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Spacing
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Base Spacing</Label>
                          <Input
                            value={theme.spacing.base}
                            onChange={(e) => updateTheme({ spacing: { base: e.target.value } })}
                            placeholder="4px"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Base unit for spacing (e.g., 4px, 8px)
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shadow" className="border-[#444] bg-[#1E1E1E] rounded-lg px-4 border">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-200 py-3 text-sm font-medium">
                        Shadows
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Base Shadow</Label>
                          <Input
                            value={theme.shadows.base}
                            onChange={(e) => updateTheme({ shadows: { ...theme.shadows, base: e.target.value } })}
                            placeholder="0 1px 3px 0 rgb(0 0 0 / 0.1)"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Small shadow for subtle elevation
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-xs font-medium">Large Shadow</Label>
                          <Input
                            value={theme.shadows.large}
                            onChange={(e) => updateTheme({ shadows: { ...theme.shadows, large: e.target.value } })}
                            placeholder="0 10px 15px -3px rgb(0 0 0 / 0.1)"
                            className="bg-[#0F0F0F] border-[#444] text-white hover:border-[#555] focus:border-primary transition-colors h-9 text-sm"
                          />
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Large shadow for high elevation elements
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                {/* UX Principles Tab */}
                <TabsContent value="ux-principles" className="mt-0 space-y-6">
                  {/* Interaction & Touch Targets */}
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Interaction & Touch Targets
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Enforce Minimum Touch Target (44px)</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Ensures all clickable elements meet accessibility size guidelines.</p>
                        </div>
                        <Switch
                          checked={uxSettings.touchTarget}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, touchTarget: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                      <div className="space-y-2 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <Label className="text-gray-300 text-sm font-medium">Interactive Element Padding</Label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">Adds horizontal & vertical padding to interactive components.</p>
                        <RadioGroup
                          value={uxSettings.interactivePadding}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, interactivePadding: value as "small" | "medium" | "large" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="padding-small" />
                            <Label htmlFor="padding-small" className="text-sm text-gray-300 cursor-pointer">Small (8px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="padding-medium" />
                            <Label htmlFor="padding-medium" className="text-sm text-gray-300 cursor-pointer">Medium (12px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="padding-large" />
                            <Label htmlFor="padding-large" className="text-sm text-gray-300 cursor-pointer">Large (16px)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Accessibility */}
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Accessibility
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Enforce WCAG AA Contrast</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Automatically adjusts color contrast to meet AA standards.</p>
                        </div>
                        <Switch
                          checked={uxSettings.enforceContrast}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, enforceContrast: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Enable Visible Focus Rings</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Improves keyboard navigation visibility.</p>
                        </div>
                        <Switch
                          checked={uxSettings.focusRings}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, focusRings: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Reduce Motion / Animations</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Replaces motion-heavy transitions with subtle fades.</p>
                        </div>
                        <Switch
                          checked={uxSettings.reducedMotion}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, reducedMotion: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Density & Spacing */}
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Density & Spacing
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <Label className="text-gray-300 text-sm font-medium">Layout Density</Label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">Controls layout spacing for content-heavy or airy designs.</p>
                        <RadioGroup
                          value={uxSettings.density}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, density: value as "compact" | "cozy" | "spacious" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="density-compact" />
                            <Label htmlFor="density-compact" className="text-sm text-gray-300 cursor-pointer">Compact</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cozy" id="density-cozy" />
                            <Label htmlFor="density-cozy" className="text-sm text-gray-300 cursor-pointer">Cozy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spacious" id="density-spacious" />
                            <Label htmlFor="density-spacious" className="text-sm text-gray-300 cursor-pointer">Spacious</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <Label className="text-gray-300 text-sm font-medium">Form Field Spacing</Label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">Adjust vertical spacing between form inputs.</p>
                        <RadioGroup
                          value={uxSettings.formSpacing}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, formSpacing: value as "tight" | "default" | "wide" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tight" id="form-tight" />
                            <Label htmlFor="form-tight" className="text-sm text-gray-300 cursor-pointer">Tight (12px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="form-default" />
                            <Label htmlFor="form-default" className="text-sm text-gray-300 cursor-pointer">Default (20px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wide" id="form-wide" />
                            <Label htmlFor="form-wide" className="text-sm text-gray-300 cursor-pointer">Wide (32px)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Feedback & States */}
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Feedback & States
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">High-Visibility Error States</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Use stronger colors + icons for errors.</p>
                        </div>
                        <Switch
                          checked={uxSettings.strongErrors}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, strongErrors: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Strengthen Hover & Active States</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Makes interactive elements feel more alive and clear.</p>
                        </div>
                        <Switch
                          checked={uxSettings.strongHover}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, strongHover: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Show Validation Messages by Default</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Show form feedback without requiring blur or submit.</p>
                        </div>
                        <Switch
                          checked={uxSettings.autoValidationMessages}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, autoValidationMessages: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Readability */}
                  <div className="space-y-4">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      Readability
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <Label className="text-gray-300 text-sm font-medium">Line Height</Label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">Adjust spacing between lines of text for better readability.</p>
                        <RadioGroup
                          value={uxSettings.lineHeight}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, lineHeight: value as "normal" | "relaxed" | "loose" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="line-normal" />
                            <Label htmlFor="line-normal" className="text-sm text-gray-300 cursor-pointer">Normal (1.5)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="relaxed" id="line-relaxed" />
                            <Label htmlFor="line-relaxed" className="text-sm text-gray-300 cursor-pointer">Relaxed (1.625)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="loose" id="line-loose" />
                            <Label htmlFor="line-loose" className="text-sm text-gray-300 cursor-pointer">Loose (2)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <Label className="text-gray-300 text-sm font-medium">Base Font Size</Label>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">Increase default text size for better legibility.</p>
                        <RadioGroup
                          value={uxSettings.bodyFontSize}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, bodyFontSize: value as "small" | "medium" | "large" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="font-small" />
                            <Label htmlFor="font-small" className="text-sm text-gray-300 cursor-pointer">Small (14px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="font-medium" />
                            <Label htmlFor="font-medium" className="text-sm text-gray-300 cursor-pointer">Medium (16px)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="font-large" />
                            <Label htmlFor="font-large" className="text-sm text-gray-300 cursor-pointer">Large (18px)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-start justify-between gap-4 bg-[#1E1E1E] p-4 rounded-lg border border-[#444]">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm font-medium">Consistent Section Headings</Label>
                          <p className="text-xs text-gray-500 leading-relaxed">Improves hierarchy for long pages.</p>
                        </div>
                        <Switch
                          checked={uxSettings.headingsEnabled}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, headingsEnabled: checked })}
                          className="shrink-0 data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Preview with Tabs */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#2C2C2C]">
          <Tabs defaultValue="components" className="flex-1 flex flex-col overflow-hidden">
            {/* Options Bar - Preview Tabs */}
            <div className="h-12 flex items-center px-6 border-b border-[#444] bg-[#2C2C2C] shrink-0">
              <TabsList className="bg-transparent p-0 gap-6 h-full">
                <TabsTrigger
                  value="components"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Components
                </TabsTrigger>
                <TabsTrigger
                  value="typography"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Typography
                </TabsTrigger>
                <TabsTrigger
                  value="colors"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Colors
                </TabsTrigger>

                {/* Dynamic tabs from scraped layouts */}
                {hasScrapedData && scrapedData?.layouts?.sections && scrapedData.layouts.sections.length > 0 && (
                  <>
                    {scrapedData.layouts.sections.map((section, index) => (
                      <TabsTrigger
                        key={`layout-${index}`}
                        value={`layout-${section.type.toLowerCase().replace(/\s+/g, '-')}`}
                        className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        {section.type}
                        {section.confidence === "high" && (
                          <span className="ml-1 text-xs text-green-400">✓</span>
                        )}
                      </TabsTrigger>
                    ))}
                  </>
                )}

                {/* Default template tabs */}
                <TabsTrigger
                  value="dashboard"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-primary px-2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Pricing
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Preview Canvas - Full Space */}
            <div
              className="flex-1 overflow-y-auto p-8"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.foreground,
                // Apply all theme colors as CSS variables for child components
                "--background": theme.colors.background,
                "--foreground": theme.colors.foreground,
                "--card": theme.colors.background,
                "--card-foreground": theme.colors.foreground,
                "--popover": theme.colors.background,
                "--popover-foreground": theme.colors.foreground,
                "--primary": theme.colors.primary,
                "--primary-foreground": theme.colors.primaryForeground,
                "--secondary": theme.colors.secondary,
                "--secondary-foreground": theme.colors.secondaryForeground,
                "--muted": theme.colors.muted,
                "--muted-foreground": theme.colors.mutedForeground,
                "--accent": theme.colors.accent,
                "--accent-foreground": theme.colors.accentForeground,
                "--destructive": theme.colors.destructive,
                "--destructive-foreground": theme.colors.destructiveForeground,
                "--border": theme.colors.border,
                "--input": theme.colors.input,
                "--ring": theme.colors.ring,
                "--radius": theme.radius.medium,
              } as React.CSSProperties}
            >
              <TabsContent value="components" className="mt-0 space-y-8">
                {/* Forms & Inputs Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Forms & Inputs</h3>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <Label>Button</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button>Primary</Button>
                      <Button variant="outline">Outline</Button>
                      {theme.colors.secondary && (
                        <Button variant="secondary">Secondary</Button>
                      )}
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="space-y-2 max-w-sm">
                    <Label>Input</Label>
                    <Input placeholder="Enter text..." />
                  </div>

                  {/* Select */}
                  <div className="space-y-2 max-w-sm">
                    <Label>Select</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Slider */}
                  <div className="space-y-2 max-w-sm">
                    <Label>Slider</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                </div>

                <Separator />

                {/* Layout Components */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Layout Components</h3>

                  {/* Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle style={{ fontFamily: theme.fonts.sans }}>
                          Card Component
                        </CardTitle>
                        <CardDescription>
                          This is a card with your theme applied
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p style={{ fontFamily: theme.fonts.sans }}>
                          Your design system is taking shape!
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle style={{ fontFamily: theme.fonts.sans }}>
                          Another Card
                        </CardTitle>
                        <CardDescription>
                          Consistent styling across components
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p style={{ fontFamily: theme.fonts.sans }}>
                          All components respect your theme tokens.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs */}
                  <div>
                    <Label className="mb-2 block">Tabs</Label>
                    <Tabs defaultValue="tab1" className="w-full max-w-md">
                      <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1">Content for Tab 1</TabsContent>
                      <TabsContent value="tab2">Content for Tab 2</TabsContent>
                      <TabsContent value="tab3">Content for Tab 3</TabsContent>
                    </Tabs>
                  </div>

                  {/* Accordion */}
                  <div>
                    <Label className="mb-2 block">Accordion</Label>
                    <Accordion type="single" collapsible className="w-full max-w-md">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Accordion Item 1</AccordionTrigger>
                        <AccordionContent>
                          This is the content for the first accordion item.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Accordion Item 2</AccordionTrigger>
                        <AccordionContent>
                          This is the content for the second accordion item.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Accordion Item 3</AccordionTrigger>
                        <AccordionContent>
                          This is the content for the third accordion item.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <Separator />

                {/* Navigation Components */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Navigation</h3>

                  {/* Breadcrumb (Manual Implementation) */}
                  <div className="space-y-2">
                    <Label>Breadcrumb</Label>
                    <nav className="flex items-center space-x-2 text-sm">
                      <a href="#" className="hover:underline flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        Home
                      </a>
                      <ChevronRight className="h-4 w-4" />
                      <a href="#" className="hover:underline">Components</a>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-muted-foreground">Current Page</span>
                    </nav>
                  </div>

                  {/* Pagination (Manual Implementation) */}
                  <div className="space-y-2">
                    <Label>Pagination</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Previous</Button>
                      <Button variant="outline" size="sm">1</Button>
                      <Button size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </div>

                {/* Scraped Components from Inspiration Website */}
                {hasScrapedData && scrapedData?.components && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>
                          Components from Inspiration Website
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Imported
                        </span>
                      </div>

                      {/* Scraped Buttons */}
                      {scrapedData.components.buttons && scrapedData.components.buttons.length > 0 && (
                        <div className="space-y-2">
                          <Label>Scraped Buttons ({scrapedData.components.buttons.length})</Label>
                          <div className="flex flex-wrap gap-2">
                            {scrapedData.components.buttons.slice(0, 5).map((btn, idx) => (
                              <ScrapedComponentRenderer key={`btn-${idx}`} component={btn} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scraped Cards */}
                      {scrapedData.components.cards && scrapedData.components.cards.length > 0 && (
                        <div className="space-y-2">
                          <Label>Scraped Cards ({scrapedData.components.cards.length})</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {scrapedData.components.cards.slice(0, 4).map((card, idx) => (
                              <ScrapedComponentRenderer key={`card-${idx}`} component={card} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scraped Nav Items */}
                      {scrapedData.components.navItems && scrapedData.components.navItems.length > 0 && (
                        <div className="space-y-2">
                          <Label>Scraped Navigation ({scrapedData.components.navItems.length})</Label>
                          <div className="flex flex-wrap gap-2">
                            {scrapedData.components.navItems.slice(0, 5).map((nav, idx) => (
                              <ScrapedComponentRenderer key={`nav-${idx}`} component={nav} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Dynamic Layout TabsContent from Scraped Data */}
              {hasScrapedData && scrapedData?.layouts?.sections && scrapedData.layouts.sections.map((section, index) => (
                <TabsContent
                  key={`layout-content-${index}`}
                  value={`layout-${section.type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mt-0"
                >
                  <ScrapedLayoutRenderer
                    layoutType={section.type}
                    confidence={section.confidence}
                    framework={section.framework}
                    layoutSection={section}
                    {...({} as any)}
                  />
                </TabsContent>
              ))}

              <TabsContent value="typography" className="mt-0 space-y-8">
                <div className="space-y-6">
                  <div>
                    <h1
                      className="font-bold mb-4"
                      style={{
                        fontFamily: theme.fonts.heading || theme.fonts.sans,
                        fontSize: theme.fonts.sizes.heading[0] || "48px"
                      }}
                    >
                      Heading 1
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.heading || theme.fonts.sans} · Size: {theme.fonts.sizes.heading[0]}
                    </p>
                  </div>

                  <div>
                    <h2
                      className="font-semibold mb-4"
                      style={{
                        fontFamily: theme.fonts.heading || theme.fonts.sans,
                        fontSize: theme.fonts.sizes.heading[1] || "36px"
                      }}
                    >
                      Heading 2
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.heading || theme.fonts.sans} · Size: {theme.fonts.sizes.heading[1]}
                    </p>
                  </div>

                  <div>
                    <h3
                      className="font-semibold mb-4"
                      style={{
                        fontFamily: theme.fonts.heading || theme.fonts.sans,
                        fontSize: theme.fonts.sizes.heading[2] || "24px"
                      }}
                    >
                      Heading 3
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.heading || theme.fonts.sans} · Size: {theme.fonts.sizes.heading[2]}
                    </p>
                  </div>

                  <div>
                    <h4
                      className="font-semibold mb-4"
                      style={{
                        fontFamily: theme.fonts.heading || theme.fonts.sans,
                        fontSize: "20px"
                      }}
                    >
                      Heading 4
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.heading || theme.fonts.sans} · Size: 20px
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <p
                      className="mb-4"
                      style={{
                        fontFamily: theme.fonts.sans,
                        fontSize: theme.fonts.sizes.body
                      }}
                    >
                      This is body text using your selected font. It demonstrates how regular paragraph text will appear with your theme.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.sans} · Size: {theme.fonts.sizes.body}
                    </p>
                  </div>

                  {theme.fonts.secondary && (
                    <div>
                      <p
                        className="mb-4"
                        style={{
                          fontFamily: theme.fonts.secondary,
                          fontSize: theme.fonts.sizes.body
                        }}
                      >
                        This is text with your secondary font, if you have one defined from the scraped website.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Font: {theme.fonts.secondary} · Size: {theme.fonts.sizes.body}
                      </p>
                    </div>
                  )}

                  <div>
                    <p
                      className="mb-4 opacity-70"
                      style={{
                        fontFamily: theme.fonts.sans,
                        fontSize: theme.fonts.sizes.caption
                      }}
                    >
                      This is caption text with reduced opacity, perfect for descriptions and secondary information.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Font: {theme.fonts.sans} · Size: {theme.fonts.sizes.caption}
                    </p>
                  </div>

                  <div>
                    <code
                      className="block p-4 rounded"
                      style={{
                        fontFamily: theme.fonts.mono,
                        fontSize: theme.fonts.sizes.caption,
                        backgroundColor: theme.colors.muted
                      }}
                    >
                      const example = "Monospace font for code";
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Font: {theme.fonts.mono} · Size: {theme.fonts.sizes.caption}
                    </p>
                  </div>
                </div>

                {theme.fonts.weights && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Font Weights</h3>
                      <div className="space-y-2">
                        <p style={{ fontFamily: theme.fonts.sans, fontWeight: theme.fonts.weights.normal }}>
                          Normal weight ({theme.fonts.weights.normal})
                        </p>
                        {theme.fonts.weights.medium && (
                          <p style={{ fontFamily: theme.fonts.sans, fontWeight: theme.fonts.weights.medium }}>
                            Medium weight ({theme.fonts.weights.medium})
                          </p>
                        )}
                        {theme.fonts.weights.semibold && (
                          <p style={{ fontFamily: theme.fonts.sans, fontWeight: theme.fonts.weights.semibold }}>
                            Semibold weight ({theme.fonts.weights.semibold})
                          </p>
                        )}
                        <p style={{ fontFamily: theme.fonts.sans, fontWeight: theme.fonts.weights.bold }}>
                          Bold weight ({theme.fonts.weights.bold})
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="colors" className="mt-0 space-y-8">
                {/* Primary Theme Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Primary Theme Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Background */}
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">Background</p>
                        <p className="text-xs opacity-60">{theme.colors.background}</p>
                      </div>
                    </div>

                    {/* Foreground */}
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.foreground,
                          borderColor: theme.colors.border
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">Foreground</p>
                        <p className="text-xs opacity-60">{theme.colors.foreground}</p>
                      </div>
                    </div>

                    {/* Primary */}
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.border
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">Primary</p>
                        <p className="text-xs opacity-60">{theme.colors.primary}</p>
                      </div>
                    </div>

                    {/* Primary Foreground */}
                    {theme.colors.primaryForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.primaryForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Primary Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.primaryForeground}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secondary & Accent Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Secondary & Accent Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Secondary */}
                    {theme.colors.secondary && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.secondary,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Secondary</p>
                          <p className="text-xs opacity-60">{theme.colors.secondary}</p>
                        </div>
                      </div>
                    )}

                    {/* Secondary Foreground */}
                    {theme.colors.secondaryForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.secondaryForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Secondary Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.secondaryForeground}</p>
                        </div>
                      </div>
                    )}

                    {/* Accent */}
                    {theme.colors.accent && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.accent,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Accent</p>
                          <p className="text-xs opacity-60">{theme.colors.accent}</p>
                        </div>
                      </div>
                    )}

                    {/* Accent Foreground */}
                    {theme.colors.accentForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.accentForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Accent Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.accentForeground}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* UI Component Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>UI Component Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Card */}
                    {theme.colors.card && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.card,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Card</p>
                          <p className="text-xs opacity-60">{theme.colors.card}</p>
                        </div>
                      </div>
                    )}

                    {/* Card Foreground */}
                    {theme.colors.cardForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.cardForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Card Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.cardForeground}</p>
                        </div>
                      </div>
                    )}

                    {/* Popover */}
                    {theme.colors.popover && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.popover,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Popover</p>
                          <p className="text-xs opacity-60">{theme.colors.popover}</p>
                        </div>
                      </div>
                    )}

                    {/* Popover Foreground */}
                    {theme.colors.popoverForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.popoverForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Popover Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.popoverForeground}</p>
                        </div>
                      </div>
                    )}

                    {/* Muted */}
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.muted,
                          borderColor: theme.colors.border
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">Muted</p>
                        <p className="text-xs opacity-60">{theme.colors.muted}</p>
                      </div>
                    </div>

                    {/* Muted Foreground */}
                    {theme.colors.mutedForeground && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.mutedForeground,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Muted Foreground</p>
                          <p className="text-xs opacity-60">{theme.colors.mutedForeground}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Utility & Form Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Utility & Form Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Border */}
                    {theme.colors.border && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border-2"
                          style={{
                            backgroundColor: theme.colors.border,
                            borderColor: theme.colors.foreground
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Border</p>
                          <p className="text-xs opacity-60">{theme.colors.border}</p>
                        </div>
                      </div>
                    )}

                    {/* Input */}
                    {theme.colors.input && (
                      <div className="space-y-2">
                        <div
                          className="w-full aspect-square rounded-lg border"
                          style={{
                            backgroundColor: theme.colors.input,
                            borderColor: theme.colors.border
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium">Input</p>
                          <p className="text-xs opacity-60">{theme.colors.input}</p>
                        </div>
                      </div>
                    )}

                    {/* Ring */}
                    <div className="space-y-2">
                      <div
                        className="w-full aspect-square rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.border
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">Ring</p>
                        <p className="text-xs opacity-60">{theme.colors.primary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0 h-full">
                <div className="flex flex-col h-full rounded-lg overflow-hidden border shadow-xl" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                  {/* Top Navigation Bar */}
                  <header className="h-16 border-b flex items-center justify-between px-6 shrink-0 z-10" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                    <div className="flex items-center gap-2 font-bold text-xl" style={{ color: theme.colors.primary }}>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}>
                        <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <span style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>Nexus</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 opacity-50" />
                        <Input
                          placeholder="Search..."
                          className="w-64 pl-9 h-9"
                          style={{ backgroundColor: theme.colors.muted, borderColor: "transparent" }}
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <HelpCircle className="h-5 w-5 opacity-70" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full relative">
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                        <Settings className="h-5 w-5 opacity-70" />
                      </Button>
                      <div className="h-8 w-8 rounded-full border overflow-hidden" style={{ borderColor: theme.colors.border }}>
                        <img src="https://github.com/shadcn.png" alt="User" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </header>

                  <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 flex flex-col border-r hidden md:flex" style={{ backgroundColor: theme.colors.muted, borderColor: theme.colors.border }}>
                      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        <div className="space-y-1">
                          <p className="px-2 text-xs font-semibold uppercase tracking-wider opacity-50 mb-2" style={{ fontFamily: theme.fonts.sans }}>Platform</p>
                          <Button variant="secondary" className="w-full justify-start gap-3 shadow-sm">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 opacity-70 hover:opacity-100">
                            <BarChart3 className="h-4 w-4" /> Analytics
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 opacity-70 hover:opacity-100">
                            <Users className="h-4 w-4" /> Customers
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 opacity-70 hover:opacity-100">
                            <FolderKanban className="h-4 w-4" /> Projects
                          </Button>
                        </div>

                        <div className="space-y-1">
                          <p className="px-2 text-xs font-semibold uppercase tracking-wider opacity-50 mb-2" style={{ fontFamily: theme.fonts.sans }}>Finance</p>
                          <Button variant="ghost" className="w-full justify-start gap-3 opacity-70 hover:opacity-100">
                            <TrendingUp className="h-4 w-4" /> Transactions
                          </Button>
                          <Button variant="ghost" className="w-full justify-start gap-3 opacity-70 hover:opacity-100">
                            <FileText className="h-4 w-4" /> Invoices
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border-t" style={{ borderColor: theme.colors.border }}>
                        <div className="rounded-lg p-3 bg-black/5 dark:bg-white/5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}>
                              <span className="text-xs font-bold">Pro</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Pro Plan</p>
                              <p className="text-xs opacity-60">Expires in 12 days</p>
                            </div>
                          </div>
                          <Button size="sm" className="w-full text-xs h-7">Upgrade</Button>
                        </div>
                      </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-opacity-50" style={{ backgroundColor: theme.colors.background }}>
                      <div className="p-8 space-y-8">
                        {/* Page Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>Dashboard</h2>
                            <p className="text-muted-foreground">Overview of your project performance.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Search className="h-4 w-4" /> Filter
                            </Button>
                            <Button size="sm" className="gap-2">
                              <Plus className="h-4 w-4" /> New Project
                            </Button>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: TrendingUp },
                            { label: "Subscriptions", value: "+2350", change: "+180.1%", icon: Users },
                            { label: "Sales", value: "+12,234", change: "+19%", icon: BarChart3 },
                            { label: "Active Now", value: "+573", change: "+201", icon: LayoutDashboard },
                          ].map((stat, i) => (
                            <Card key={i}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium opacity-70">{stat.label}</CardTitle>
                                <stat.icon className="h-4 w-4 opacity-50" />
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold" style={{ fontFamily: theme.fonts.sans }}>{stat.value}</div>
                                <p className="text-xs opacity-60 mt-1">
                                  <span className="text-green-500 font-medium">{stat.change}</span> from last month
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                          {/* Main Chart */}
                          <Card className="col-span-4">
                            <CardHeader>
                              <CardTitle style={{ fontFamily: theme.fonts.sans }}>Overview</CardTitle>
                              <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                              <div className="h-[300px] flex items-end justify-between gap-2 px-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                                    <div
                                      className="w-full rounded-t transition-all duration-500 group-hover:opacity-80 relative"
                                      style={{
                                        height: barHeights[i] ? `${barHeights[i]}%` : '20%',
                                        backgroundColor: theme.colors.primary,
                                        borderRadius: `${theme.radius.small} ${theme.radius.small} 0 0`
                                      }}
                                    >
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        ${Math.floor(Math.random() * 5000) + 1000}
                                      </div>
                                    </div>
                                    <div className="text-[10px] text-center opacity-50 uppercase">
                                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Recent Sales */}
                          <Card className="col-span-3">
                            <CardHeader>
                              <CardTitle style={{ fontFamily: theme.fonts.sans }}>Recent Sales</CardTitle>
                              <CardDescription>You made 265 sales this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {[
                                  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
                                  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
                                  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
                                  { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                                  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
                                ].map((sale, i) => (
                                  <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full border flex items-center justify-center font-medium text-xs mr-4" style={{ backgroundColor: theme.colors.muted, borderColor: theme.colors.border }}>
                                      {sale.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium leading-none">{sale.name}</p>
                                      <p className="text-xs text-muted-foreground">{sale.email}</p>
                                    </div>
                                    <div className="ml-auto font-medium" style={{ fontFamily: theme.fonts.mono }}>{sale.amount}</div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </main>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0 h-full">
                <div className="flex flex-col h-full rounded-lg overflow-y-auto border shadow-xl" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                  {/* Navbar Placeholder */}
                  <header className="h-16 border-b flex items-center justify-between px-6 shrink-0" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                    <div className="flex items-center gap-2 font-bold text-xl" style={{ color: theme.colors.primary }}>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}>
                        <span style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>N</span>
                      </div>
                      <span style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>Nexus</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                      <a href="#" className="opacity-70 hover:opacity-100">Features</a>
                      <a href="#" className="opacity-70 hover:opacity-100">Testimonials</a>
                      <a href="#" className="opacity-100">Pricing</a>
                    </nav>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm">Log in</Button>
                      <Button size="sm">Get Started</Button>
                    </div>
                  </header>

                  <main className="flex-1 p-8 md:p-12">
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>
                        Simple, transparent pricing
                      </h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that's right for you. All plans include a 14-day free trial. No credit card required.
                      </p>

                      {/* Billing Toggle */}
                      <div className="flex items-center justify-center gap-4 mt-8">
                        <span className="text-sm font-medium opacity-70">Monthly</span>
                        <Switch />
                        <span className="text-sm font-medium">Yearly <span className="text-xs text-green-500 font-bold ml-1">SAVE 20%</span></span>
                      </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                      {[
                        {
                          name: "Starter",
                          price: "$0",
                          desc: "Perfect for side projects",
                          features: ["Up to 3 projects", "Community support", "1GB storage", "Basic analytics"]
                        },
                        {
                          name: "Pro",
                          price: "$29",
                          desc: "For growing teams",
                          popular: true,
                          features: ["Unlimited projects", "Priority support", "10GB storage", "Advanced analytics", "Custom domains", "Team collaboration"]
                        },
                        {
                          name: "Enterprise",
                          price: "$99",
                          desc: "For large organizations",
                          features: ["Unlimited everything", "24/7 Phone support", "Unlimited storage", "Custom reporting", "SSO & Audit logs", "Dedicated account manager"]
                        },
                      ].map((tier, i) => (
                        <Card key={tier.name} className={`relative flex flex-col ${tier.popular ? 'border-2 shadow-lg scale-105 z-10' : ''}`} style={{ borderColor: tier.popular ? theme.colors.primary : theme.colors.border }}>
                          {tier.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: theme.colors.primary, color: theme.colors.primaryForeground }}>
                              Most Popular
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="text-xl" style={{ fontFamily: theme.fonts.sans }}>{tier.name}</CardTitle>
                            <CardDescription>{tier.desc}</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                              <span className="text-4xl font-bold" style={{ fontFamily: theme.fonts.sans }}>{tier.price}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <ul className="space-y-3 mb-6">
                              {tier.features.map((feature) => (
                                <li key={feature} className="text-sm flex items-start gap-3">
                                  <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: theme.colors.primary + '20', color: theme.colors.primary }}>
                                    <span className="text-[10px]">✓</span>
                                  </div>
                                  <span className="opacity-80">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <div className="p-6 pt-0 mt-auto">
                            <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                              {tier.price === "$0" ? "Start for free" : "Get started"}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                      <h3 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: theme.fonts.heading || theme.fonts.sans }}>
                        Frequently Asked Questions
                      </h3>
                      <Accordion type="single" collapsible className="w-full">
                        {[
                          { q: "Can I cancel my subscription at any time?", a: "Yes, you can cancel your plan at any time from your account settings. You will continue to have access until the end of your billing cycle." },
                          { q: "What happens when my trial ends?", a: "If you haven't upgraded to a paid plan by the end of your trial, your account will automatically be downgraded to the Free plan." },
                          { q: "Do you offer discounts for non-profits?", a: "Yes, we offer a 50% discount for registered non-profit organizations. Please contact our sales team for more information." },
                          { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption to protect your data. We are SOC 2 Type II compliant and regularly undergo security audits." },
                        ].map((faq, i) => (
                          <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>

                    {/* Footer Placeholder */}
                    <footer className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground" style={{ borderColor: theme.colors.border }}>
                      <div className="flex justify-center gap-6 mb-4">
                        <a href="#" className="hover:text-foreground">Terms</a>
                        <a href="#" className="hover:text-foreground">Privacy</a>
                        <a href="#" className="hover:text-foreground">Cookies</a>
                        <a href="#" className="hover:text-foreground">Contact</a>
                      </div>
                      <p>© 2024 Nexus Inc. All rights reserved.</p>
                    </footer>
                  </main>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

