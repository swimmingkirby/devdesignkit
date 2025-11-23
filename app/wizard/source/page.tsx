"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useWizard } from "../wizard-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Sparkles, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const SOURCE_OPTIONS = [
    {
        id: "inspiration",
        title: "Use Inspiration Website",
        description: "Import design tokens from an existing website you love",
        icon: Sparkles,
        recommended: true,
        features: [
            "AI-powered design extraction",
            "Automatic color palette detection",
            "Typography and spacing analysis",
            "Quick setup with real-world designs"
        ]
    },
    {
        id: "manual",
        title: "Choose Manually",
        description: "Select from our curated theme presets and customize",
        icon: Palette,
        recommended: false,
        features: [
            "Browse aesthetic categories",
            "Professional preset themes",
            "Full customization control",
            "Perfect for starting from scratch"
        ]
    }
]

export default function SourcePage() {
    const router = useRouter()
    const { setTheme } = useWizard()
    const [selectedSource, setSelectedSource] = React.useState<string>("inspiration")

    const handleContinue = () => {
        if (selectedSource === "inspiration") {
            // Save the source choice and redirect to information scraper
            sessionStorage.setItem("wizardSource", "inspiration")
            router.push("/information-scraper?from=wizard")
        } else {
            // Save the source choice and go to manual theme selection
            sessionStorage.setItem("wizardSource", "manual")
            router.push("/wizard/theme")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">How would you like to start?</h1>
                <p className="text-muted-foreground text-lg">
                    Choose your starting point for creating your design system.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {SOURCE_OPTIONS.map((option) => {
                    const Icon = option.icon
                    const isSelected = selectedSource === option.id

                    return (
                        <Card
                            key={option.id}
                            className={cn(
                                "cursor-pointer transition-all hover:border-primary/50 relative group",
                                isSelected ? "border-primary ring-2 ring-primary shadow-lg" : "border-border"
                            )}
                            onClick={() => setSelectedSource(option.id)}
                        >
                            {option.recommended && (
                                <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                    Recommended
                                </div>
                            )}
                            
                            <CardHeader className="pb-4">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "p-3 rounded-lg transition-colors",
                                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                                        <CardDescription className="text-base">
                                            {option.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    {option.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <div className={cn(
                                                "mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0",
                                                isSelected ? "bg-primary/10" : "bg-muted"
                                            )}>
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    isSelected ? "bg-primary" : "bg-muted-foreground"
                                                )} />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/wizard/product")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button
                    size="lg"
                    onClick={handleContinue}
                    className="gap-2 min-w-[140px]"
                >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

