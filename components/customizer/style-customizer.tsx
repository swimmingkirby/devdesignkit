"use client"

import * as React from "react"
import { useTheme } from "@/lib/contexts/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ColorPicker } from "@/components/ui/color-picker"
import { CustomizerHeader } from "./customizer-header"
import { LayoutDashboard, TrendingUp, BarChart3, FolderKanban, Users, Database, FileText, HelpCircle, Settings, Search, ChevronUp, Plus } from "lucide-react"

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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Header Bar */}
      <CustomizerHeader />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customizer Sidebar */}
        <aside className="w-96 bg-background overflow-y-auto">
        <div className="p-4">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" style={{ marginTop: "16px" }}>
              <Accordion type="multiple" className="w-full">
                {/* Primary Colors */}
                <AccordionItem value="primary">
                  <AccordionTrigger>Primary Colors</AccordionTrigger>
                  <AccordionContent className="flex flex-col" style={{ gap: "16px" }}>
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
                  <AccordionItem value="secondary">
                    <AccordionTrigger>Secondary Colors</AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
                  <AccordionItem value="accent">
                    <AccordionTrigger>Accent Colors</AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
                <AccordionItem value="base">
                  <AccordionTrigger>Base Colors</AccordionTrigger>
                  <AccordionContent className="space-y-4">
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
                  <AccordionItem value="destructive">
                    <AccordionTrigger>Destructive Colors</AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
                  <AccordionItem value="border-input">
                    <AccordionTrigger>Border and Input Colors</AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
            <TabsContent value="typography" style={{ marginTop: "16px" }}>
              <Accordion type="multiple" className="w-full">
                {/* Font Family */}
                <AccordionItem value="font-family">
                  <AccordionTrigger>Font Family</AccordionTrigger>
                  <AccordionContent className="flex flex-col" style={{ gap: "16px" }}>
                    <div className="space-y-2">
                      <Label>Heading Font</Label>
                      <Select
                        value={theme.typography.headingFont}
                        onValueChange={(value) =>
                          handleTypographyChange("headingFont", value)
                        }
                      >
                        <SelectTrigger>
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
                      <Label>Body Font</Label>
                      <Select
                        value={theme.typography.bodyFont}
                        onValueChange={(value) =>
                          handleTypographyChange("bodyFont", value)
                        }
                      >
                        <SelectTrigger>
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

                {/* Font Settings */}
                <AccordionItem value="font-settings">
                  <AccordionTrigger>Font Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Scale: {theme.typography.scale}</Label>
                      <Select
                        value={theme.typography.scale}
                        onValueChange={(value) =>
                          handleTypographyChange("scale", value as "sm" | "md" | "lg")
                        }
                      >
                        <SelectTrigger>
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
            <TabsContent value="other" style={{ marginTop: "16px" }}>
              <Accordion type="multiple" className="w-full">
                {/* Radius */}
                <AccordionItem value="radius">
                  <AccordionTrigger>Radius</AccordionTrigger>
                  <AccordionContent className="flex flex-col" style={{ gap: "16px" }}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Border Radius</Label>
                        <span className="text-sm text-muted-foreground">
                          {theme.radius}px
                        </span>
                      </div>
                      <Slider
                        value={[theme.radius]}
                        onValueChange={([value]) =>
                          updateTheme({ radius: value })
                        }
                        min={0}
                        max={16}
                        step={1}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Spacing */}
                <AccordionItem value="spacing">
                  <AccordionTrigger>Spacing</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Spacing Scale</Label>
                      <Select
                        value={theme.spacing}
                        onValueChange={(value) =>
                          updateTheme({ spacing: value as "compact" | "cozy" | "spacious" })
                        }
                      >
                        <SelectTrigger>
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

                {/* Shadow */}
                <AccordionItem value="shadow">
                  <AccordionTrigger>Shadow</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Shadow Intensity</Label>
                      <Select
                        value={theme.shadows}
                        onValueChange={(value) =>
                          updateTheme({ shadows: value as "soft" | "normal" | "strong" })
                        }
                      >
                        <SelectTrigger>
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
          </Tabs>
        </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 overflow-y-auto" style={{ padding: "16px" }}>
          <div className="h-full w-full">
            <div className="bg-white rounded-2xl h-full w-full" style={{ borderRadius: `${theme.radius * 2}px`, padding: "16px" }}>
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              {/* Components Tab */}
              <TabsContent value="components" style={{ marginTop: "16px" }} className="flex flex-col">
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{
                      borderRadius: `${theme.radius}px`,
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground || theme.colors.background,
                    }}
                  >
                    Button
                  </button>
                  <button
                    className="px-4 py-2 border rounded-md text-sm font-medium transition-colors"
                    style={{
                      borderRadius: `${theme.radius}px`,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.foreground,
                      borderColor: theme.colors.border || theme.colors.muted,
                    }}
                  >
                    Outline
                  </button>
                  {theme.colors.secondary && (
                    <button
                      className="px-4 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{
                        borderRadius: `${theme.radius}px`,
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.secondaryForeground || theme.colors.foreground,
                      }}
                    >
                      Secondary
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Input field"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1"
                    style={{
                      borderRadius: `${theme.radius}px`,
                      backgroundColor: theme.colors.background,
                      color: theme.colors.foreground,
                      borderColor: theme.colors.input || theme.colors.border || theme.colors.muted,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-6 border rounded-lg"
                    style={{
                      borderRadius: `${theme.radius}px`,
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border || theme.colors.muted,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Card Component
                    </h3>
                    <p
                      className="text-sm mb-4 opacity-70"
                      style={{
                        color: theme.colors.foreground,
                      }}
                    >
                      This is a card with your theme applied
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: theme.typography.bodyFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Your design system is taking shape!
                    </p>
                  </div>
                  <div
                    className="p-6 border rounded-lg"
                    style={{
                      borderRadius: `${theme.radius}px`,
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border || theme.colors.muted,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Another Card
                    </h3>
                    <p
                      className="text-sm mb-4 opacity-70"
                      style={{
                        color: theme.colors.foreground,
                      }}
                    >
                      Consistent styling across components
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: theme.typography.bodyFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      All components respect your theme tokens.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="space-y-8">
                  <div>
                    <h1
                      className="text-4xl font-bold mb-4"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Heading 1
                    </h1>
                    <h2
                      className="text-3xl font-semibold mb-4"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Heading 2
                    </h2>
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Heading 3
                    </h3>
                    <h4
                      className="text-xl font-semibold mb-4"
                      style={{
                        fontFamily: theme.typography.headingFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      Heading 4
                    </h4>
                  </div>
                  <div>
                    <p
                      className="text-base mb-4"
                      style={{
                        fontFamily: theme.typography.bodyFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      This is body text using your selected font. It demonstrates how regular paragraph text will appear with your theme. The font family, size, and color all reflect your customizations.
                    </p>
                    <p
                      className="text-sm mb-4 opacity-70"
                      style={{
                        fontFamily: theme.typography.bodyFont,
                        color: theme.colors.foreground,
                      }}
                    >
                      This is smaller body text with reduced opacity, perfect for descriptions and secondary information.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Primary</h3>
                    <div
                      className="h-20 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.border || theme.colors.muted,
                      }}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">{theme.colors.primary}</p>
                  </div>
                  {theme.colors.secondary && (
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Secondary</h3>
                      <div
                        className="h-20 rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.secondary,
                          borderColor: theme.colors.border || theme.colors.muted,
                        }}
                      />
                      <p className="text-xs mt-1 text-muted-foreground">{theme.colors.secondary}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Background</h3>
                    <div
                      className="h-20 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border || theme.colors.muted,
                      }}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">{theme.colors.background}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Foreground</h3>
                    <div
                      className="h-20 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.foreground,
                        borderColor: theme.colors.border || theme.colors.muted,
                      }}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">{theme.colors.foreground}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Muted</h3>
                    <div
                      className="h-20 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.muted,
                        borderColor: theme.colors.border || theme.colors.muted,
                      }}
                    />
                    <p className="text-xs mt-1 text-muted-foreground">{theme.colors.muted}</p>
                  </div>
                  {theme.colors.accent && (
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Accent</h3>
                      <div
                        className="h-20 rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.accent,
                          borderColor: theme.colors.border || theme.colors.muted,
                        }}
                      />
                      <p className="text-xs mt-1 text-muted-foreground">{theme.colors.accent}</p>
                    </div>
                  )}
                  {theme.colors.destructive && (
                    <div>
                      <h3 className="text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>Destructive</h3>
                      <div
                        className="h-20 rounded-lg border"
                        style={{
                          backgroundColor: theme.colors.destructive,
                          borderColor: theme.colors.border || theme.colors.muted,
                        }}
                      />
                      <p className="text-xs mt-1 text-muted-foreground">{theme.colors.destructive}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-4">
                <div className="flex h-[600px] rounded-lg overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
                  {/* Left Sidebar */}
                  <aside className="w-64 flex flex-col" style={{ backgroundColor: theme.colors.muted }}>
                    <div className="p-4 flex items-center justify-between">
                      <span className="font-semibold" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>Acme Inc.</span>
                      <ChevronUp className="h-4 w-4" style={{ color: theme.colors.foreground, opacity: 0.7 }} />
                    </div>
                    
                    <div className="p-4">
                      <button
                        className="w-full px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 mb-4"
                        style={{
                          borderRadius: `${theme.radius}px`,
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.primaryForeground || theme.colors.background,
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Quick Create
                      </button>
                      
                      <nav className="space-y-1">
                        {[
                          { icon: LayoutDashboard, label: "Dashboard", active: true },
                          { icon: TrendingUp, label: "Lifecycle" },
                          { icon: BarChart3, label: "Analytics" },
                          { icon: FolderKanban, label: "Projects" },
                          { icon: Users, label: "Team" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            className="w-full px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors"
                            style={{
                              borderRadius: `${theme.radius}px`,
                              backgroundColor: item.active ? theme.colors.primary : "transparent",
                              color: item.active ? (theme.colors.primaryForeground || theme.colors.background) : theme.colors.foreground,
                            }}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </button>
                        ))}
                      </nav>
                      
                      <div className="mt-6">
                        <h3 className="text-xs font-semibold uppercase mb-2 px-3" style={{ color: theme.colors.foreground, opacity: 0.6 }}>Documents</h3>
                        <nav className="space-y-1">
                          {[
                            { icon: Database, label: "Data Library" },
                            { icon: FileText, label: "Reports" },
                            { icon: FileText, label: "Word Assistant" },
                            { icon: FileText, label: "More" },
                          ].map((item) => (
                            <button
                              key={item.label}
                              className="w-full px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors"
                              style={{
                                borderRadius: `${theme.radius}px`,
                                color: theme.colors.foreground,
                              }}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </button>
                          ))}
                        </nav>
                      </div>
                      
                      <div className="mt-auto pt-4 space-y-1">
                        {[
                          { icon: Settings, label: "Settings" },
                          { icon: HelpCircle, label: "Get Help" },
                          { icon: Search, label: "Search" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            className="w-full px-3 py-2 rounded-md text-sm flex items-center gap-3 transition-colors"
                            style={{
                              borderRadius: `${theme.radius}px`,
                              color: theme.colors.foreground,
                            }}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </aside>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
                    {/* Top Navigation */}
                    <header className="h-14 flex items-center justify-between px-6">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" style={{ color: theme.colors.foreground }} />
                        <h1 className="text-lg font-semibold" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>Documents</h1>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm rounded-md" style={{ color: theme.colors.foreground, backgroundColor: theme.colors.muted, borderRadius: `${theme.radius}px` }}>Filter</button>
                        <button className="px-3 py-1.5 text-sm rounded-md" style={{ color: theme.colors.foreground, backgroundColor: theme.colors.muted, borderRadius: `${theme.radius}px` }}>Sort</button>
                      </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {/* KPI Cards */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div
                          className="p-6 rounded-lg border relative"
                          style={{
                            borderRadius: `${theme.radius}px`,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border || theme.colors.muted,
                          }}
                        >
                          <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium flex items-center gap-1" style={{ backgroundColor: theme.colors.muted, color: theme.colors.foreground }}>
                            <TrendingUp className="h-3 w-3" />
                            +12.5%
                          </div>
                          <h3 className="text-sm font-medium mb-1 opacity-70" style={{ color: theme.colors.foreground }}>Total Revenue</h3>
                          <p className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>$1,250.00</p>
                          <p className="text-xs opacity-70" style={{ color: theme.colors.foreground }}>Trending up this month</p>
                          <p className="text-xs mt-1 opacity-50" style={{ color: theme.colors.foreground }}>Visitors for the last 6 months</p>
                        </div>
                        
                        <div
                          className="p-6 rounded-lg border relative"
                          style={{
                            borderRadius: `${theme.radius}px`,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border || theme.colors.muted,
                          }}
                        >
                          <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium flex items-center gap-1" style={{ backgroundColor: theme.colors.muted, color: theme.colors.destructive || theme.colors.foreground }}>
                            <TrendingUp className="h-3 w-3 rotate-180" />
                            -20%
                          </div>
                          <h3 className="text-sm font-medium mb-1 opacity-70" style={{ color: theme.colors.foreground }}>New Customers</h3>
                          <p className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>1,234</p>
                          <p className="text-xs opacity-70" style={{ color: theme.colors.foreground }}>Down 20% this period</p>
                          <p className="text-xs mt-1 opacity-50" style={{ color: theme.colors.foreground }}>Acquisition needs attention</p>
                        </div>
                        
                        <div
                          className="p-6 rounded-lg border relative"
                          style={{
                            borderRadius: `${theme.radius}px`,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border || theme.colors.muted,
                          }}
                        >
                          <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium flex items-center gap-1" style={{ backgroundColor: theme.colors.muted, color: theme.colors.foreground }}>
                            <TrendingUp className="h-3 w-3" />
                            +5.2%
                          </div>
                          <h3 className="text-sm font-medium mb-1 opacity-70" style={{ color: theme.colors.foreground }}>Active Accounts</h3>
                          <p className="text-3xl font-bold mb-2" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>45,678</p>
                          <p className="text-xs opacity-70" style={{ color: theme.colors.foreground }}>Strong user retention</p>
                          <p className="text-xs mt-1 opacity-50" style={{ color: theme.colors.foreground }}>Engagement excellent</p>
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div
                        className="p-6 rounded-lg border"
                        style={{
                          borderRadius: `${theme.radius}px`,
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border || theme.colors.muted,
                        }}
                      >
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: theme.typography.headingFont, color: theme.colors.foreground }}>Total Visitors</h2>
                          <p className="text-sm opacity-70" style={{ color: theme.colors.foreground }}>Total for the last 3 months</p>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                          {Array.from({ length: 12 }).map((_, i) => {
                            const height = Math.random() * 60 + 20
                            return (
                              <div key={i} className="flex-1 flex items-end">
                                <div
                                  className="w-full rounded-t"
                                  style={{
                                    height: `${height}%`,
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: `${theme.radius}px ${theme.radius}px 0 0`,
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-4">
                <div className="grid grid-cols-3 gap-6">
                  {["Free", "Pro", "Enterprise"].map((tier, i) => (
                    <div
                      key={tier}
                      className="p-6 border rounded-lg"
                      style={{
                        borderRadius: `${theme.radius}px`,
                        backgroundColor: theme.colors.background,
                        borderColor: i === 1 ? theme.colors.primary : (theme.colors.border || theme.colors.muted),
                        borderWidth: i === 1 ? "2px" : "1px",
                      }}
                    >
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{
                          fontFamily: theme.typography.headingFont,
                          color: theme.colors.foreground,
                        }}
                      >
                        {tier}
                      </h3>
                      <div className="mb-4">
                        <span
                          className="text-3xl font-bold"
                          style={{
                            fontFamily: theme.typography.headingFont,
                            color: theme.colors.foreground,
                          }}
                        >
                          ${i * 10}
                        </span>
                        <span
                          className="text-sm opacity-70 ml-1"
                          style={{ color: theme.colors.foreground }}
                        >
                          /month
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {["Feature 1", "Feature 2", "Feature 3"].map((feature) => (
                          <li
                            key={feature}
                            className="text-sm flex items-center"
                            style={{
                              fontFamily: theme.typography.bodyFont,
                              color: theme.colors.foreground,
                            }}
                          >
                            <span className="mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="w-full px-4 py-2 rounded-md text-sm font-medium transition-opacity"
                        style={{
                          borderRadius: `${theme.radius}px`,
                          backgroundColor: i === 1 ? theme.colors.primary : theme.colors.muted,
                          color: i === 1 ? (theme.colors.primaryForeground || theme.colors.background) : theme.colors.foreground,
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

