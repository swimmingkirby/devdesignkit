"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/contexts/theme-context"
import { Palette } from "lucide-react"
import { presetThemes } from "@/lib/themes"

export default function LoadingPage() {
  const router = useRouter()
  const { updateTheme } = useTheme()
  const [currentMessage, setCurrentMessage] = React.useState(0)

  const messages = [
    "Analyzing your design…",
    "Extracting colors, fonts, spacing…",
    "Preparing your theme…",
  ]

  React.useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 800)

    // After 1.5 seconds, navigate to customizer with placeholder theme
    const navigateTimer = setTimeout(() => {
      // Use custom theme tokens as placeholder
      const customTheme = presetThemes.custom
      updateTheme(customTheme)
      router.push("/customizer")
    }, 1500)

    return () => {
      clearInterval(messageInterval)
      clearTimeout(navigateTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#444] bg-[#2C2C2C] shrink-0">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Palette className="h-5 w-5" />
          <span>DevDesignKit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content - Centered Loading */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="flex flex-col items-center space-y-8">
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#444] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>

          {/* Loading Messages */}
          <div className="text-center space-y-2 min-h-[60px]">
            <p className="text-xl font-medium transition-opacity duration-300">
              {messages[currentMessage]}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
