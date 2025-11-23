"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CustomizerHeader } from "@/components/customizer/customizer-header"
import { ArrowRight, Check, Palette, Wand2, Layout, Download } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col font-sans selection:bg-purple-500/30">
      {/* Top Bar */}
      <CustomizerHeader />

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center container mx-auto px-4 py-12 lg:py-24 gap-12 lg:gap-24">

        {/* Left Column: Hero Content */}
        <div className="flex-1 space-y-8 max-w-2xl text-center lg:text-left">

          {/* Badge / Label */}
          <div className="inline-flex items-center border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400 mb-4">
            <Wand2 className="mr-2 h-3.5 w-3.5" />
            AI-Powered Design System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Start Your Design System <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              With AI Guidance
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
            From inspiration to polished UI themes — build your perfect shadcn/ui system in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/wizard/product">
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white h-12 px-8 text-base rounded-md">
                Start Wizard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-purple-500" />
              AI-powered theme generation
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-purple-500" />
              Guided design system wizard
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-purple-500" />
              Real-time component preview
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-purple-500" />
              Export-ready design tokens
            </div>
          </div>
        </div>

        {/* Right Column: Preview Panel */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-20 animate-pulse" />

          <Card className="relative bg-[#1E1E1E] border-[#444] shadow-2xl overflow-hidden rounded-none">
            {/* Mock Window Header */}
            <div className="h-10 bg-[#252525] border-b border-[#444] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="ml-4 text-xs text-gray-600 font-mono">theme-preview.tsx</div>
            </div>

            <div className="p-6 space-y-8">
              {/* Color Palette Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-2"><Palette className="h-4 w-4" /> Color Palette</span>
                  <Wand2 className="h-4 w-4 text-gray-600" />
                </div>
                <div className="h-24 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-inner border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-mono px-1">
                  <span>Primary</span>
                  <span>Secondary</span>
                  <span>Accent</span>
                  <span>Muted</span>
                </div>
              </div>

              {/* UI Preview Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-2"><Layout className="h-4 w-4" /> Interface Preview</span>
                </div>

                <div className="bg-[#111] border border-[#444] p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email Address</Label>
                    <Input
                      placeholder="Enter your email"
                      className="bg-[#1E1E1E] border-[#444] text-gray-300 focus-visible:ring-purple-500/50 rounded-none"
                      readOnly
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1 rounded-md">
                      Sign Up
                    </Button>
                    <Button variant="secondary" className="bg-[#333] hover:bg-[#444] text-white flex-1 rounded-md">
                      Log In
                    </Button>
                  </div>

                  <div className="pt-2">
                    <div className="h-2 w-full bg-[#222] overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                      <span>Storage</span>
                      <span>66% Used</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar Mock */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-9 flex-1 bg-[#252525] border border-[#444] flex items-center px-3 text-xs text-gray-500 font-mono">
                  <Download className="h-3 w-3 mr-2" />
                  Copy Code
                </div>
                <div className="h-9 px-3 border border-[#444] flex items-center text-xs text-gray-500">
                  CSS
                </div>
              </div>
            </div>
          </Card>
        </div>

      </main>
    </div>
  )
}
