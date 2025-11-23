"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/theme-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { presetThemes, themeLabels, ThemeKey } from "@/lib/themes"

export default function PresetsPage() {
  const router = useRouter()
  const { updateTheme } = useTheme()

  const handlePresetSelect = (themeKey: ThemeKey) => {
    const themeTokens = presetThemes[themeKey]
    if (themeTokens) {
      updateTheme(themeTokens)
      router.push(`/customizer?theme=${themeKey}`)
    }
  }

  const presetKeys: ThemeKey[] = ["minimal", "rounded", "brutalist", "playful", "dark"]

  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#444] bg-[#2C2C2C] shrink-0">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Palette className="h-5 w-5" />
          <span>DevDesignKit</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
            Sign In
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Choose a Preset Theme</h1>
            <p className="text-gray-400">
              Select a starting point for your design system
            </p>
          </div>

          {/* Preset Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presetKeys.map((themeKey) => {
              const theme = presetThemes[themeKey]
              const label = themeLabels[themeKey]

              return (
                <Card
                  key={themeKey}
                  className="bg-[#1E1E1E] border-[#444] hover:border-[#555] transition-all cursor-pointer group"
                  onClick={() => handlePresetSelect(themeKey)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Color Swatches */}
                    <div className="flex gap-2 flex-wrap">
                      <div
                        className="w-8 h-8 rounded border border-[#444]"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded border border-[#444]"
                        style={{ backgroundColor: theme.colors.background }}
                      />
                      <div
                        className="w-8 h-8 rounded border border-[#444]"
                        style={{ backgroundColor: theme.colors.accent || theme.colors.primary }}
                      />
                      {theme.colors.secondary && (
                        <div
                          className="w-8 h-8 rounded border border-[#444]"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                      )}
                    </div>

                    {/* Micro Preview */}
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border || theme.colors.foreground,
                        borderRadius: `${theme.radius}px`,
                      }}
                    >
                      <div className="space-y-2">
                        <div
                          className="h-8 rounded flex items-center justify-center text-sm font-medium"
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.primaryForeground || theme.colors.foreground,
                            borderRadius: `${theme.radius}px`,
                          }}
                        >
                          Button
                        </div>
                        <div
                          className="h-8 rounded border px-3 flex items-center text-sm"
                          style={{
                            backgroundColor: theme.colors.input || theme.colors.background,
                            borderColor: theme.colors.border || theme.colors.foreground,
                            color: theme.colors.foreground,
                            borderRadius: `${theme.radius}px`,
                          }}
                        >
                          Input field
                        </div>
                      </div>
                    </div>

                    {/* Theme Details */}
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Font: {theme.typography.headingFont}</div>
                      <div>Radius: {theme.radius}px</div>
                      <div>Spacing: {theme.spacing}</div>
                    </div>

                    {/* Select Button */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePresetSelect(themeKey)
                      }}
                    >
                      Select Theme
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

