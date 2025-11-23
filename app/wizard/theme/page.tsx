"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useWizard } from "../wizard-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Palette, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { themesByAesthetic } from "@/lib/themes/aesthetic-groups"
import { Theme } from "@/lib/themes/theme-types"

// Aesthetic options
const aesthetics = [
    {
        id: "minimal",
        name: "Minimal",
        description: "Clean lines, generous whitespace, and focus on content.",
        previewColor: "#f4f4f5",
    },
    {
        id: "rounded",
        name: "Soft & Rounded",
        description: "Friendly curves, soft shadows, and approachable feel.",
        previewColor: "#e0e7ff",
    },
    {
        id: "playful",
        name: "Playful",
        description: "Vibrant colors, bouncy animations, and fun typography.",
        previewColor: "#fce7f3",
    },
    {
        id: "brutalist",
        name: "Brutalist",
        description: "Bold borders, high contrast, and raw aesthetic.",
        previewColor: "#e5e5e5",
    },
    {
        id: "tech",
        name: "Tech / Cyber",
        description: "Dark modes, neon accents, and futuristic vibes.",
        previewColor: "#1e293b",
    },
    {
        id: "warm",
        name: "Warm & Cozy",
        description: "Earth tones, serif fonts, and comfortable spacing.",
        previewColor: "#fff7ed",
    },
    {
        id: "dark",
        name: "Dark Mode",
        description: "Sleek dark interfaces with high contrast accents.",
        previewColor: "#18181b",
    },
]

export default function ThemePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { theme, setTheme } = useWizard()

    // Initialize from URL or Context
    const initialAesthetic = searchParams.get("aesthetic") || theme.aesthetic || "minimal"

    const [selectedAesthetic, setSelectedAesthetic] = React.useState(initialAesthetic)
    const [selectedThemeId, setSelectedThemeId] = React.useState<string>("")

    // Get available themes for the selected aesthetic
    const availableThemes = themesByAesthetic[selectedAesthetic] || []

    // Select the first theme by default when aesthetic changes
    React.useEffect(() => {
        if (availableThemes.length > 0 && !availableThemes.find(t => t.id === selectedThemeId)) {
            setSelectedThemeId(availableThemes[0].id)
        }
    }, [selectedAesthetic, availableThemes, selectedThemeId])

    const handleContinue = () => {
        // Find the full theme object
        const selectedTheme = availableThemes.find(t => t.id === selectedThemeId)

        if (selectedTheme) {
            setTheme({
                aesthetic: selectedAesthetic,
                themeId: selectedTheme.id,
            })

            // Pass the theme ID to the next step via URL for immediate loading
            router.push(`/wizard/ux?theme=${selectedTheme.id}`)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/wizard/source")}
                className="gap-2 -ml-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-md"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Wizard
            </Button>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Choose your Aesthetic</h1>
                <p className="text-gray-400 text-lg">
                    Select a visual style that matches your brand personality.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                {/* Left Column: Aesthetic Selection */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-200">Visual Style</Label>
                        <RadioGroup
                            value={selectedAesthetic}
                            onValueChange={setSelectedAesthetic}
                            className="grid gap-3"
                        >
                            {aesthetics.map((aesthetic) => (
                                <div key={aesthetic.id}>
                                    <RadioGroupItem
                                        value={aesthetic.id}
                                        id={aesthetic.id}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={aesthetic.id}
                                        className="flex items-center justify-between rounded-none border border-[#444] bg-[#1E1E1E] p-4 hover:bg-[#252525] peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-[#252525] cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-8 w-8 rounded-full border border-[#444] shadow-sm"
                                                style={{ backgroundColor: aesthetic.previewColor }}
                                            />
                                            <span className="font-medium text-gray-200">{aesthetic.name}</span>
                                        </div>
                                        {selectedAesthetic === aesthetic.id && (
                                            <Check className="h-4 w-4 text-blue-500" />
                                        )}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                {/* Right Column: Theme Variations */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-gray-200">Theme Variations</Label>
                        <p className="text-sm text-gray-400">
                            Select a specific color palette and typography combination.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availableThemes.map((theme) => (
                            <Card
                                key={theme.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:border-blue-500/50 overflow-hidden relative group rounded-none bg-[#1E1E1E]",
                                    selectedThemeId === theme.id ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-[#444]"
                                )}
                                onClick={() => setSelectedThemeId(theme.id)}
                            >
                                <CardContent className="p-0">
                                    {/* Preview Header */}
                                    <div className="h-24 w-full relative" style={{ background: theme.tokens.colors.background }}>
                                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                                            {theme.preview?.swatches.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="h-8 w-8 rounded-full shadow-sm ring-1 ring-black/5"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Theme Info */}
                                    <div className="p-4 space-y-3 bg-[#1E1E1E]">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-200">{theme.name}</span>
                                            {selectedThemeId === theme.id && (
                                                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Mini UI Preview */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-6 px-3 rounded text-[10px] font-medium flex items-center"
                                                    style={{
                                                        backgroundColor: theme.tokens.colors.primary,
                                                        color: theme.tokens.colors.primaryForeground,
                                                        borderRadius: `${theme.tokens.radius}px`
                                                    }}
                                                >
                                                    Button
                                                </div>
                                                <div
                                                    className="h-6 px-2 rounded border text-[10px] flex items-center"
                                                    style={{
                                                        borderColor: theme.tokens.colors.border,
                                                        color: theme.tokens.colors.foreground,
                                                        borderRadius: `${theme.tokens.radius}px`
                                                    }}
                                                >
                                                    Input
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-gray-400 flex gap-2">
                                                <span>{theme.tokens.typography.headingFont}</span>
                                                <span>•</span>
                                                <span>{theme.tokens.radius}px Radius</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end pt-8 border-t border-[#444]">

                <Button
                    size="lg"
                    onClick={handleContinue}
                    className="gap-2 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    disabled={!selectedThemeId}
                >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
