"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RotateCcw, Share2, Save, Code, Pencil } from "lucide-react"

interface ActionBarProps {
    themeName: string
    isEditingName: boolean
    onThemeNameChange: (name: string) => void
    onEditingChange: (editing: boolean) => void
}

export function ActionBar({ themeName, isEditingName, onThemeNameChange, onEditingChange }: ActionBarProps) {
    return (
        <div className="h-12 flex items-center border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
            {/* Left side - Theme Name (aligned with sidebar width) */}
            <div className="w-[300px] flex items-center px-6 border-r border-[#444] shrink-0 h-full">
                <div className="flex items-center gap-2 group">
                    {isEditingName ? (
                        <Input
                            value={themeName}
                            onChange={(e) => onThemeNameChange(e.target.value)}
                            onBlur={() => onEditingChange(false)}
                            onKeyDown={(e) => e.key === 'Enter' && onEditingChange(false)}
                            autoFocus
                            className="h-8 w-full bg-[#1E1E1E] border-[#444] text-white"
                        />
                    ) : (
                        <button
                            onClick={() => onEditingChange(true)}
                            className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors"
                        >
                            {themeName}
                            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </button>
                    )}
                </div>
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
