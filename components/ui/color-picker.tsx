"use client"

import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ label, value, onChange, className }: ColorPickerProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-col", className)} style={{ gap: "12px" }}>
      {label && <Label className="text-sm">{label}</Label>}
      <div className="flex items-center gap-2">
        <div
          className="h-9 w-9 rounded-md border border-input cursor-pointer shrink-0"
          style={{ backgroundColor: value }}
          onClick={() => colorInputRef.current?.click()}
        />
        <Input
          ref={colorInputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-24 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 flex-1 font-mono text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

