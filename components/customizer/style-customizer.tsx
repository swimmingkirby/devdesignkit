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
import { CustomizerHeader } from "./customizer-header"
import { ActionBar } from "./action-bar"
import { LayoutDashboard, TrendingUp, BarChart3, FolderKanban, Users, Database, FileText, HelpCircle, Settings, Search, ChevronUp, Plus, Pencil, Home, ChevronRight } from "lucide-react"
import { presetThemes, ThemeKey } from "@/lib/themes"
import { ThemeTokens } from "@/lib/types/theme"

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
  const { theme, updateTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeKey>("minimal")
  const [barHeights, setBarHeights] = React.useState<number[]>([])
  const [importedThemeName, setImportedThemeName] = React.useState<string | null>(null)
  const [showSuccessBanner, setShowSuccessBanner] = React.useState(false)
  const isImportingRef = React.useRef(false) // Track if we're importing to prevent theme reset

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
        setSelectedTheme("custom");
        
        // Apply the theme - use setTimeout to ensure state updates are batched
        setTimeout(() => {
          console.log("🎨 Applying imported theme NOW...");
          updateTheme(importedTheme);
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
  const handleThemeChange = React.useCallback((themeKey: ThemeKey) => {
    console.log(`🎨 Theme selector changed to: ${themeKey}`);
    
    // If we're currently importing, ignore this change
    if (isImportingRef.current) {
      console.log(`⏭️  Ignoring theme change during import`);
      return;
    }
    
    setSelectedTheme(themeKey)
    
    // If switching to "custom" and we have an imported theme name, don't load preset
    // This preserves the imported theme from the scraper
    if (themeKey === "custom" && importedThemeName) {
      console.log(`✓ Keeping imported theme: ${importedThemeName}`);
      return; // Don't load the preset "custom" theme
    }
    
    const selectedThemeTokens = presetThemes[themeKey]
    if (selectedThemeTokens) {
      console.log(`✓ Loading preset theme: ${themeKey}`);
      updateTheme(selectedThemeTokens)
    }
    
    // Clear imported theme name when switching to a non-custom preset theme
    if (themeKey !== "custom") {
      setImportedThemeName(null)
    }
  }, [updateTheme, importedThemeName])

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [key]: value,
      },
    })
  }

  const handleFontsChange = (
    key: keyof typeof theme.fonts,
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
    const initialTheme = presetThemes[selectedTheme]
    if (initialTheme) {
      updateTheme(initialTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - updateTheme is stable from context

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
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
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
        <aside className="w-[300px] flex flex-col border-r border-[#444] bg-[#2C2C2C] shrink-0">
          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#1E1E1E] text-gray-400">
                  <TabsTrigger value="colors" className="data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white">Colors</TabsTrigger>
                  <TabsTrigger value="typography" className="data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white">Type</TabsTrigger>
                  <TabsTrigger value="other" className="data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white">Other</TabsTrigger>
                </TabsList>

                {/* Colors Tab */}
                <TabsContent value="colors" className="mt-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    {/* Primary Colors */}
                    <AccordionItem value="primary" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Primary Colors</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
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
                      <AccordionItem value="secondary" className="border-[#444]">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-300">Secondary Colors</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
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
                      <AccordionItem value="accent" className="border-[#444]">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-300">Accent Colors</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
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
                    <AccordionItem value="base" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Base Colors</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
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
                      <AccordionItem value="destructive" className="border-[#444]">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-300">Destructive Colors</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
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
                    <AccordionItem value="border-input" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Border & Input</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
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
                <TabsContent value="typography" className="mt-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="font-family" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Font Families</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Sans Serif</Label>
                          <Input
                            value={theme.fonts.sans}
                            onChange={(e) => handleFontsChange("sans", e.target.value)}
                            placeholder="Inter, system-ui, sans-serif"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Serif</Label>
                          <Input
                            value={theme.fonts.serif}
                            onChange={(e) => handleFontsChange("serif", e.target.value)}
                            placeholder="Georgia, serif"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Monospace</Label>
                          <Input
                            value={theme.fonts.mono}
                            onChange={(e) => handleFontsChange("mono", e.target.value)}
                            placeholder="Menlo, Monaco, Courier, monospace"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="font-sizes" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Font Sizes</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Body Size</Label>
                          <Input
                            value={theme.fonts.sizes.body}
                            onChange={(e) => handleFontSizeChange("body", e.target.value)}
                            placeholder="16px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">H1 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[0] || "48px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[0] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="48px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">H2 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[1] || "36px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[1] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="36px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">H3 Size</Label>
                          <Input
                            value={theme.fonts.sizes.heading[2] || "24px"}
                            onChange={(e) => {
                              const newHeadings = [...theme.fonts.sizes.heading]
                              newHeadings[2] = e.target.value
                              handleFontSizeChange("heading", newHeadings)
                            }}
                            placeholder="24px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Caption Size</Label>
                          <Input
                            value={theme.fonts.sizes.caption}
                            onChange={(e) => handleFontSizeChange("caption", e.target.value)}
                            placeholder="14px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>
                </TabsContent>

                {/* Other Tab */}
                <TabsContent value="other" className="mt-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="radius" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Border Radius</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Small Radius</Label>
                          <Input
                            value={theme.radius.small}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, small: e.target.value } })}
                            placeholder="4px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Medium Radius</Label>
                          <Input
                            value={theme.radius.medium}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, medium: e.target.value } })}
                            placeholder="8px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Large Radius</Label>
                          <Input
                            value={theme.radius.large}
                            onChange={(e) => updateTheme({ radius: { ...theme.radius, large: e.target.value } })}
                            placeholder="16px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="spacing" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Spacing</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Base Spacing</Label>
                          <Input
                            value={theme.spacing.base}
                            onChange={(e) => updateTheme({ spacing: { base: e.target.value } })}
                            placeholder="4px"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                          <p className="text-xs text-gray-500">
                            Base unit for spacing (e.g., 4px, 8px)
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shadow" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Shadows</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Base Shadow</Label>
                          <Input
                            value={theme.shadows.base}
                            onChange={(e) => updateTheme({ shadows: { ...theme.shadows, base: e.target.value } })}
                            placeholder="0 1px 3px 0 rgb(0 0 0 / 0.1)"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                          <p className="text-xs text-gray-500">
                            Small shadow for subtle elevation
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Large Shadow</Label>
                          <Input
                            value={theme.shadows.large}
                            onChange={(e) => updateTheme({ shadows: { ...theme.shadows, large: e.target.value } })}
                            placeholder="0 10px 15px -3px rgb(0 0 0 / 0.1)"
                            className="bg-[#1E1E1E] border-[#444] text-white"
                          />
                          <p className="text-xs text-gray-500">
                            Large shadow for high elevation elements
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
              </TabsContent>

              <TabsContent value="typography" className="mt-0 space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.fonts.sans }}>Heading 1</h1>
                  <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: theme.fonts.sans }}>Heading 2</h2>
                  <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: theme.fonts.sans }}>Heading 3</h3>
                  <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: theme.fonts.sans }}>Heading 4</h4>
                </div>
                <div>
                  <p className="text-base mb-4" style={{ fontFamily: theme.fonts.sans }}>
                    This is body text using your selected font. It demonstrates how regular paragraph text will appear with your theme.
                  </p>
                  <p className="text-sm mb-4 opacity-70" style={{ fontFamily: theme.fonts.sans }}>
                    This is smaller body text with reduced opacity, perfect for descriptions and secondary information.
                  </p>
                </div>
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

              <TabsContent value="dashboard" className="mt-0">
                <div className="flex h-[600px] rounded-lg overflow-hidden border" style={{ backgroundColor: theme.colors.background, borderColor: theme.colors.border }}>
                  {/* Left Sidebar */}
                  <aside className="w-64 flex flex-col border-r" style={{ backgroundColor: theme.colors.muted, borderColor: theme.colors.border }}>
                    <div className="p-4 flex items-center justify-between">
                      <span className="font-semibold" style={{ fontFamily: theme.fonts.sans }}>Acme Inc.</span>
                      <ChevronUp className="h-4 w-4 opacity-70" />
                    </div>
                    <div className="p-4">
                      <Button className="w-full mb-4 gap-2">
                        <Plus className="h-4 w-4" /> Quick Create
                      </Button>
                      <nav className="space-y-1">
                        {[
                          { icon: LayoutDashboard, label: "Dashboard", active: true },
                          { icon: TrendingUp, label: "Lifecycle" },
                          { icon: BarChart3, label: "Analytics" },
                          { icon: FolderKanban, label: "Projects" },
                          { icon: Users, label: "Team" },
                        ].map((item) => (
                          <Button key={item.label} variant={item.active ? "default" : "ghost"} className="w-full justify-start gap-3">
                            <item.icon className="h-4 w-4" /> {item.label}
                          </Button>
                        ))}
                      </nav>
                    </div>
                  </aside>
                  {/* Main Content */}
                  <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
                    <header className="h-14 flex items-center justify-between px-6 border-b" style={{ borderColor: theme.colors.border }}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <h1 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.sans }}>Documents</h1>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm">Filter</Button>
                        <Button variant="secondary" size="sm">Sort</Button>
                      </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-70">Total Revenue</CardTitle></CardHeader>
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.fonts.sans }}>$1,250.00</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-70">New Customers</CardTitle></CardHeader>
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.fonts.sans }}>1,234</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-70">Active Accounts</CardTitle></CardHeader>
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.fonts.sans }}>45,678</div></CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader><CardTitle style={{ fontFamily: theme.fonts.sans }}>Total Visitors</CardTitle></CardHeader>
                        <CardContent>
                          <div className="h-64 flex items-end justify-between gap-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className="flex-1 flex items-end">
                                <div 
                                  className="w-full rounded-t" 
                                  style={{ 
                                    height: barHeights[i] ? `${barHeights[i]}%` : '20%', 
                                    backgroundColor: theme.colors.primary, 
                                    borderRadius: `${theme.radius}px ${theme.radius}px 0 0` 
                                  }} 
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <div className="grid grid-cols-3 gap-6">
                  {["Free", "Pro", "Enterprise"].map((tier, i) => (
                    <Card key={tier} className={i === 1 ? "border-2 border-primary" : ""}>
                      <CardHeader>
                        <CardTitle style={{ fontFamily: theme.fonts.sans }}>{tier}</CardTitle>
                        <CardDescription><span className="text-3xl font-bold text-foreground" style={{ fontFamily: theme.fonts.sans }}>${i * 10}</span>/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {["Feature 1", "Feature 2", "Feature 3"].map((feature) => (
                            <li key={feature} className="text-sm flex items-center" style={{ fontFamily: theme.fonts.sans }}><span className="mr-2">✓</span>{feature}</li>
                          ))}
                        </ul>
                        <Button className="w-full" variant={i === 1 ? "default" : "secondary"}>Get Started</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

