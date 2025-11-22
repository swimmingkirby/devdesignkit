"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"

export function CustomizerHeader() {
    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
            {/* Left side - Logo */}
            <div className="flex items-center gap-2 font-semibold text-lg">
                <Palette className="h-5 w-5" />
                <span>DevDesignKit</span>
            </div>

            {/* Right side - Auth Buttons */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    Sign In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                    Sign Up
                </Button>
            </div>
        </header>
    )
}

