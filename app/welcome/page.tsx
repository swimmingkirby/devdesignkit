"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Sparkles, Layers } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()

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

      {/* Main Content - Centered Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full space-y-12 text-center">
          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              DesignKit AI
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start your UI before writing any code.
            </p>
          </div>

          {/* Action Cards */}
          <div className="flex justify-center mt-12">
            <Card
              className="bg-[#1E1E1E] border-[#444] hover:border-[#555] transition-all cursor-pointer group max-w-md w-full"
              onClick={() => router.push("/wizard/product")}
            >
              <CardContent className="p-8 flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold">Start New Project</h2>
                <p className="text-gray-400 text-center">
                  Define your product, choose a style, and customize your design system.
                </p>
                <Button
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/wizard/product")
                  }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

