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

interface StyleCustomizerProps {
  initialTheme?: ThemeKey | null
}

export function StyleCustomizer({ initialTheme }: StyleCustomizerProps = {}) {
  const { theme, updateTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeKey>(initialTheme || "minimal")
  const [barHeights, setBarHeights] = React.useState<number[]>([])
  
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

  // Stub function for future backend extraction integration
  function applyExtractedTheme(tokens: ThemeTokens) {
    // TODO: this will be used by backend extraction later
    updateTheme(tokens)
  }

  // Handle theme selection from dropdown
  const handleThemeChange = React.useCallback((themeKey: ThemeKey) => {
    setSelectedTheme(themeKey)
    const selectedThemeTokens = presetThemes[themeKey]
    if (selectedThemeTokens) {
      updateTheme(selectedThemeTokens)
    }
  }, [updateTheme])

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [key]: value,
      },
    })
  }

  const handleTypographyChange = (
    key: keyof typeof theme.typography,
    value: string
  ) => {
    updateTheme({
      typography: {
        ...theme.typography,
        [key]: value,
      },
    })
  }

  // Initialize theme on mount or when initialTheme changes
  React.useEffect(() => {
    if (initialTheme && presetThemes[initialTheme]) {
      // Theme was passed via URL param - set it
      setSelectedTheme(initialTheme)
      const initialThemeTokens = presetThemes[initialTheme]
      updateTheme(initialThemeTokens)
    } else {
      // No theme param - try to detect which preset matches current theme
      const matchingPreset = Object.entries(presetThemes).find(
        ([key, presetTheme]) => {
          return (
            presetTheme.colors.primary === theme.colors.primary &&
            presetTheme.colors.background === theme.colors.background &&
            presetTheme.radius === theme.radius
          )
        }
      )
      
      if (matchingPreset) {
        // Found matching preset - sync the dropdown
        setSelectedTheme(matchingPreset[0] as ThemeKey)
      } else {
        // No match - initialize with default
        const defaultTheme = presetThemes[selectedTheme]
        if (defaultTheme) {
          updateTheme(defaultTheme)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTheme]) // Run when initialTheme changes

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
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Customization Panel */}
        <aside className="w-[480px] max-w-[480px] min-w-[480px] flex flex-col border-r border-[#444] bg-[#2C2C2C] shrink-0 overflow-hidden">
          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-w-0 max-w-full">
            <div className="p-4 w-full min-w-0 max-w-full box-border">
              <Tabs defaultValue="colors" className="w-full min-w-0 max-w-full">
                <TabsList className="flex w-full max-w-full bg-[#1E1E1E] text-gray-400 min-w-0">
                  <TabsTrigger value="colors" className="flex-1 min-w-0 data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white text-xs">Colors</TabsTrigger>
                  <TabsTrigger value="typography" className="flex-1 min-w-0 data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white text-xs">Type</TabsTrigger>
                  <TabsTrigger value="other" className="flex-1 min-w-0 data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white text-xs">Other</TabsTrigger>
                  <TabsTrigger value="ux-principles" className="flex-1 min-w-0 data-[state=active]:bg-[#3C3C3C] data-[state=active]:text-white text-xs">UX Principles</TabsTrigger>
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
                    {(theme.colors.border || theme.colors.input) && (
                      <AccordionItem value="border-input" className="border-[#444]">
                        <AccordionTrigger className="hover:no-underline hover:text-gray-300">Border & Input</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          {theme.colors.border && (
                            <ColorPicker
                              label="Border"
                              value={theme.colors.border}
                              onChange={(value) => handleColorChange("border", value)}
                            />
                          )}
                          {theme.colors.input && (
                            <ColorPicker
                              label="Input"
                              value={theme.colors.input}
                              onChange={(value) => handleColorChange("input", value)}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="mt-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="font-family" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Font Family</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Heading Font</Label>
                          <Select
                            value={theme.typography.headingFont}
                            onValueChange={(value: string) =>
                              handleTypographyChange("headingFont", value)
                            }
                          >
                            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Body Font</Label>
                          <Select
                            value={theme.typography.bodyFont}
                            onValueChange={(value: string) =>
                              handleTypographyChange("bodyFont", value)
                            }
                          >
                            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="font-settings" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Font Settings</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Scale: {theme.typography.scale}</Label>
                          <Select
                            value={theme.typography.scale}
                            onValueChange={(value: string) =>
                              handleTypographyChange("scale", value as "sm" | "md" | "lg")
                            }
                          >
                            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sm">Small</SelectItem>
                              <SelectItem value="md">Medium</SelectItem>
                              <SelectItem value="lg">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                {/* Other Tab */}
                <TabsContent value="other" className="mt-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="radius" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Radius</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-gray-300">Border Radius</Label>
                            <span className="text-sm text-muted-foreground">
                              {theme.radius}px
                            </span>
                          </div>
                          <Slider
                            value={[theme.radius]}
                            onValueChange={([value]: number[]) =>
                              updateTheme({ radius: value })
                            }
                            min={0}
                            max={16}
                            step={1}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="spacing" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Spacing</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Spacing Scale</Label>
                          <Select
                            value={theme.spacing}
                            onValueChange={(value: string) =>
                              updateTheme({ spacing: value as "compact" | "cozy" | "spacious" })
                            }
                          >
                            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="cozy">Cozy</SelectItem>
                              <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shadow" className="border-[#444]">
                      <AccordionTrigger className="hover:no-underline hover:text-gray-300">Shadow</AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Shadow Intensity</Label>
                          <Select
                            value={theme.shadows}
                            onValueChange={(value: string) =>
                              updateTheme({ shadows: value as "soft" | "normal" | "strong" })
                            }
                          >
                            <SelectTrigger className="bg-[#1E1E1E] border-[#444] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="soft">Soft</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="strong">Strong</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                {/* UX Principles Tab */}
                <TabsContent value="ux-principles" className="mt-4 space-y-6 w-full min-w-0 max-w-full box-border">
                  {/* Interaction & Touch Targets */}
                  <div className="space-y-4 w-full min-w-0">
                    <h3 className="text-base font-semibold text-white">Interaction & Touch Targets</h3>
                    <div className="space-y-4 w-full min-w-0">
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Enforce Minimum Touch Target (44px)</Label>
                          <p className="text-xs text-gray-500 break-words">Ensures all clickable elements meet accessibility size guidelines.</p>
                        </div>
                        <Switch
                          checked={uxSettings.touchTarget}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, touchTarget: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Increase Interactive Padding</Label>
                        <p className="text-xs text-gray-500 mb-2">Adds horizontal & vertical padding to interactive components.</p>
                        <RadioGroup
                          value={uxSettings.interactivePadding}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, interactivePadding: value as "small" | "medium" | "large" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="padding-small" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="padding-small" className="text-sm text-gray-300 cursor-pointer">Small</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="padding-medium" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="padding-medium" className="text-sm text-gray-300 cursor-pointer">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="padding-large" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="padding-large" className="text-sm text-gray-300 cursor-pointer">Large</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Accessibility */}
                  <div className="space-y-4 w-full min-w-0">
                    <h3 className="text-base font-semibold text-white">Accessibility</h3>
                    <div className="space-y-4 w-full min-w-0">
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Enforce WCAG AA Contrast</Label>
                          <p className="text-xs text-gray-500 break-words">Automatically adjusts color contrast to meet AA standards.</p>
                        </div>
                        <Switch
                          checked={uxSettings.enforceContrast}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, enforceContrast: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Enable Visible Focus Rings</Label>
                          <p className="text-xs text-gray-500 break-words">Improves keyboard navigation visibility.</p>
                        </div>
                        <Switch
                          checked={uxSettings.focusRings}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, focusRings: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Hide Motion / Reduce Animations</Label>
                          <p className="text-xs text-gray-500 break-words">Replaces motion-heavy transitions with subtle fades.</p>
                        </div>
                        <Switch
                          checked={uxSettings.reducedMotion}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, reducedMotion: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Density & Spacing */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-white">Density & Spacing</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Layout Density</Label>
                        <p className="text-xs text-gray-500 mb-2">Controls layout spacing for content-heavy or airy designs.</p>
                        <RadioGroup
                          value={uxSettings.density}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, density: value as "compact" | "cozy" | "spacious" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="density-compact" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="density-compact" className="text-sm text-gray-300 cursor-pointer">Compact</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cozy" id="density-cozy" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="density-cozy" className="text-sm text-gray-300 cursor-pointer">Cozy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spacious" id="density-spacious" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="density-spacious" className="text-sm text-gray-300 cursor-pointer">Spacious</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Form Field Spacing</Label>
                        <p className="text-xs text-gray-500 mb-2">Adjust vertical spacing between form inputs.</p>
                        <RadioGroup
                          value={uxSettings.formSpacing}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, formSpacing: value as "tight" | "default" | "wide" })}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tight" id="form-tight" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="form-tight" className="text-sm text-gray-300 cursor-pointer">Tight</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="form-default" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="form-default" className="text-sm text-gray-300 cursor-pointer">Default</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wide" id="form-wide" className="border-[#555] data-[state=checked]:border-blue-600" />
                            <Label htmlFor="form-wide" className="text-sm text-gray-300 cursor-pointer">Wide</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Feedback & States */}
                  <div className="space-y-4 w-full min-w-0">
                    <h3 className="text-base font-semibold text-white">Feedback & States</h3>
                    <div className="space-y-4 w-full min-w-0">
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">High-Visibility Error States</Label>
                          <p className="text-xs text-gray-500 break-words">Use stronger colors + icons for errors.</p>
                        </div>
                        <Switch
                          checked={uxSettings.strongErrors}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, strongErrors: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Strengthen Hover & Active States</Label>
                          <p className="text-xs text-gray-500 break-words">Makes interactive elements feel more alive and clear.</p>
                        </div>
                        <Switch
                          checked={uxSettings.strongHover}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, strongHover: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Show Validation Messages by Default</Label>
                          <p className="text-xs text-gray-500 break-words">Show form feedback without requiring blur or submit.</p>
                        </div>
                        <Switch
                          checked={uxSettings.autoValidationMessages}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, autoValidationMessages: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#444]" />

                  {/* Readability */}
                  <div className="space-y-4 w-full min-w-0">
                    <h3 className="text-base font-semibold text-white">Readability</h3>
                    <div className="space-y-4 w-full min-w-0">
                      <div className="space-y-2 w-full min-w-0">
                        <Label className="text-gray-300">Increase Line Height</Label>
                        <RadioGroup
                          value={uxSettings.lineHeight}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, lineHeight: value as "normal" | "relaxed" | "loose" })}
                          className="flex flex-col gap-2 w-full min-w-0"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="line-normal" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="line-normal" className="text-sm text-gray-300 cursor-pointer">Normal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="relaxed" id="line-relaxed" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="line-relaxed" className="text-sm text-gray-300 cursor-pointer">Relaxed</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="loose" id="line-loose" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="line-loose" className="text-sm text-gray-300 cursor-pointer">Loose</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2 w-full min-w-0">
                        <Label className="text-gray-300">Use Larger Body Font</Label>
                        <RadioGroup
                          value={uxSettings.bodyFontSize}
                          onValueChange={(value) => setUxSettings({ ...uxSettings, bodyFontSize: value as "small" | "medium" | "large" })}
                          className="flex flex-col gap-2 w-full min-w-0"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="font-small" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="font-small" className="text-sm text-gray-300 cursor-pointer">Small</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="font-medium" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="font-medium" className="text-sm text-gray-300 cursor-pointer">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="font-large" className="border-[#555] data-[state=checked]:border-blue-600 shrink-0" />
                            <Label htmlFor="font-large" className="text-sm text-gray-300 cursor-pointer">Large</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-start justify-between gap-4 w-full min-w-0">
                        <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                          <Label className="text-gray-300 text-sm break-words">Enable Consistent Section Headings</Label>
                          <p className="text-xs text-gray-500 break-words">Improves hierarchy for long pages.</p>
                        </div>
                        <Switch
                          checked={uxSettings.headingsEnabled}
                          onCheckedChange={(checked) => setUxSettings({ ...uxSettings, headingsEnabled: checked })}
                          className="shrink-0 flex-shrink-0 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-[#444]"
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
                "--ring": theme.colors.primary,
                "--radius": `${theme.radius}px`,
              } as React.CSSProperties}
            >
              <TabsContent value="components" className="mt-0 space-y-8">
                {/* Forms & Inputs Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Forms & Inputs</h3>

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
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Layout Components</h3>

                  {/* Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle style={{ fontFamily: theme.typography.headingFont }}>
                          Card Component
                        </CardTitle>
                        <CardDescription>
                          This is a card with your theme applied
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p style={{ fontFamily: theme.typography.bodyFont }}>
                          Your design system is taking shape!
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle style={{ fontFamily: theme.typography.headingFont }}>
                          Another Card
                        </CardTitle>
                        <CardDescription>
                          Consistent styling across components
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p style={{ fontFamily: theme.typography.bodyFont }}>
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
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Navigation</h3>

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
                  <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: theme.typography.headingFont }}>Heading 1</h1>
                  <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: theme.typography.headingFont }}>Heading 2</h2>
                  <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: theme.typography.headingFont }}>Heading 3</h3>
                  <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: theme.typography.headingFont }}>Heading 4</h4>
                </div>
                <div>
                  <p className="text-base mb-4" style={{ fontFamily: theme.typography.bodyFont }}>
                    This is body text using your selected font. It demonstrates how regular paragraph text will appear with your theme.
                  </p>
                  <p className="text-sm mb-4 opacity-70" style={{ fontFamily: theme.typography.bodyFont }}>
                    This is smaller body text with reduced opacity, perfect for descriptions and secondary information.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="mt-0 space-y-8">
                {/* Primary Theme Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Primary Theme Colors</h3>
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
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Secondary & Accent Colors</h3>
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
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>UI Component Colors</h3>
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
                  <h3 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Utility & Form Colors</h3>
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
                      <span className="font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Acme Inc.</span>
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
                        <h1 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont }}>Documents</h1>
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
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont }}>$1,250.00</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-70">New Customers</CardTitle></CardHeader>
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont }}>1,234</div></CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-70">Active Accounts</CardTitle></CardHeader>
                          <CardContent><div className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont }}>45,678</div></CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardHeader><CardTitle style={{ fontFamily: theme.typography.headingFont }}>Total Visitors</CardTitle></CardHeader>
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
                        <CardTitle style={{ fontFamily: theme.typography.headingFont }}>{tier}</CardTitle>
                        <CardDescription><span className="text-3xl font-bold text-foreground" style={{ fontFamily: theme.typography.headingFont }}>${i * 10}</span>/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {["Feature 1", "Feature 2", "Feature 3"].map((feature) => (
                            <li key={feature} className="text-sm flex items-center" style={{ fontFamily: theme.typography.bodyFont }}><span className="mr-2">✓</span>{feature}</li>
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

