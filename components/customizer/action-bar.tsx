"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Share2, Save, Code } from "lucide-react"
import { themeLabels, ThemeKey } from "@/lib/themes"

interface ActionBarProps {
    selectedTheme: ThemeKey
    onThemeChange: (theme: ThemeKey) => void
}

export function ActionBar({ selectedTheme, onThemeChange }: ActionBarProps) {
    return (
        <div className="h-12 flex items-center border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
            {/* Left side - Theme Selector (aligned with sidebar width) */}
            <div className="w-[300px] flex items-center px-6 border-r border-[#444] shrink-0 h-full">
                <Select value={selectedTheme} onValueChange={onThemeChange}>
                    <SelectTrigger className="h-8 w-full bg-[#1E1E1E] border-[#444] text-white hover:bg-[#2C2C2C]">
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#444]">
                        {Object.entries(themeLabels).map(([key, label]) => (
                            <SelectItem 
                                key={key} 
                                value={key}
                                className="text-white hover:bg-[#3C3C3C] focus:bg-[#3C3C3C]"
                            >
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex-1 flex items-center justify-end gap-2 px-6">
                <div className="flex items-center gap-1 mr-4 border-r border-[#444] pr-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#3C3C3C]">
                        <RotateCcw className="h-4 w-4 -scale-x-100" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#3C3C3C]">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Code className="h-4 w-4 mr-2" />
                    Code
                </Button>
            </div>
        </div>
    )
}
