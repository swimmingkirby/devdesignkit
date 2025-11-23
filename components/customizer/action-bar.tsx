"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Undo, Redo } from "lucide-react"
import { themesByAesthetic } from "@/lib/themes/aesthetic-groups"
import { presetThemes } from "@/lib/themes/preset-themes"
import { useTheme } from "@/lib/contexts/theme-context"


interface ActionBarProps {
    selectedTheme: string
    onThemeChange: (theme: string) => void
    onReset?: () => void
    importedThemeName?: string | null
    isImporting?: boolean
}

export function ActionBar({ selectedTheme, onThemeChange, onReset, importedThemeName, isImporting }: ActionBarProps) {
    const { undo, redo, canUndo, canRedo } = useTheme()

    // Get the display name for the selected theme
    const getSelectedThemeLabel = () => {
        if (selectedTheme === "custom" && importedThemeName) {
            return importedThemeName
        }
        const theme = presetThemes[selectedTheme]
        return theme ? theme.name : "Select a theme"
    }

    return (
        <div className="h-12 flex items-center border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
            {/* Left side - Theme Selector (aligned with sidebar width) */}
            <div className="w-[480px] max-w-[480px] min-w-[480px] flex items-center px-6 border-r border-[#444] shrink-0 h-full">
                <Select
                    value={selectedTheme}
                    onValueChange={(value) => {
                        if (isImporting) {
                            console.log("🚫 ActionBar: Ignoring theme change during import");
                            return;
                        }
                        onThemeChange(value);
                    }}
                >
                    <SelectTrigger className="h-8 w-full bg-[#1E1E1E] border-[#444] text-white hover:bg-[#2C2C2C]">
                        <SelectValue>
                            {getSelectedThemeLabel()}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#444] max-h-[400px]">
                        {/* Custom/Imported Theme Option */}
                        {importedThemeName && (
                            <>
                                <SelectItem
                                    value="custom"
                                    className="text-white hover:bg-[#3C3C3C] focus:bg-[#3C3C3C]"
                                >
                                    {importedThemeName}
                                </SelectItem>
                            </>
                        )}

                        {/* Grouped themes by aesthetic */}
                        {Object.entries(themesByAesthetic).map(([aesthetic, themes]) => (
                            <SelectGroup key={aesthetic}>
                                <SelectLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">
                                    {aesthetic}
                                </SelectLabel>
                                {themes.map((theme) => (
                                    <SelectItem
                                        key={theme.id}
                                        value={theme.id}
                                        className="text-white hover:bg-[#3C3C3C] focus:bg-[#3C3C3C] pl-6"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center -space-x-1">
                                                {theme.preview?.swatches.slice(0, 3).map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-3 w-3 rounded-full border border-[#444] ring-1 ring-[#2C2C2C]"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                            <span>{theme.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex-1 flex items-center justify-start gap-2 px-6">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-[#3C3C3C] disabled:opacity-30"
                        onClick={undo}
                        disabled={!canUndo}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-[#3C3C3C] disabled:opacity-30"
                        onClick={redo}
                        disabled={!canRedo}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-[#444] mx-2" />

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]"
                    onClick={onReset}
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            </div>
        </div>
    )
}
