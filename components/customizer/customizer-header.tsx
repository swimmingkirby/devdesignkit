"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Download, Share2, Save, Code } from "lucide-react"

export function CustomizerHeader() {
  return (
    <header className="h-12 bg-background flex">
      {/* Left side - Theme Selector (matches sidebar width) */}
      <div className="w-96 flex items-center px-4">
        <Select defaultValue="default">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Action Buttons */}
      <div className="flex-1 flex items-center justify-end gap-1.5 px-4">
        <Button variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
          Import
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="ghost" size="sm">
          <Code className="h-4 w-4" />
          Code
        </Button>
      </div>
    </header>
  )
}

