"use client"

import { useWizard } from "../wizard-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Smartphone,
    Globe,
} from "lucide-react"

const PRODUCT_TYPES = [
    { id: "saas", label: "Dashboard / Web App", icon: LayoutDashboard },
    { id: "mobile", label: "Mobile App", icon: Smartphone },
    { id: "landing", label: "Marketing / Landing Page", icon: Globe },
]

const AUDIENCES = [
    "Developers",
    "Designers",
    "General Public",
    "Business Users",
    "Marketers",
    "Teams",
    "Students",
]

const PERSONALITIES = [
    "Minimal",
    "Friendly",
    "Professional",
    "Technical",
    "Elegant",
    "Playful",
]

export default function ProductPage() {
    const { product, setProduct } = useWizard()
    const router = useRouter()

    const handleContinue = () => {
        router.push("/wizard/theme")
    }

    const isValid = product.type && product.audience && product.personality

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Define Your Product</h1>
                <p className="text-muted-foreground text-lg">
                    Tell us what you're building so we can tailor the design system.
                </p>
            </div>

            {/* 1. Product Type */}
            <section className="space-y-4">
                <Label className="text-lg font-semibold">1. What type of product are you building?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRODUCT_TYPES.map((type) => {
                        const Icon = type.icon
                        const isSelected = product.type === type.id
                        return (
                            <Card
                                key={type.id}
                                className={cn(
                                    "cursor-pointer p-6 flex flex-col items-center gap-4 transition-all hover:border-primary/50 hover:bg-accent/50 rounded-xl",
                                    isSelected && "border-primary bg-primary/5 ring-1 ring-primary"
                                )}
                                onClick={() => setProduct({ type: type.id })}
                            >
                                <Icon className={cn("h-10 w-10", isSelected ? "text-primary" : "text-muted-foreground")} />
                                <span className={cn("font-medium text-lg", isSelected && "text-primary")}>{type.label}</span>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 2. Audience */}
            <section className="space-y-4">
                <Label className="text-lg font-semibold">2. Who is the main audience?</Label>
                <div className="flex flex-wrap gap-3">
                    {AUDIENCES.map((audience) => {
                        const isSelected = product.audience === audience
                        return (
                            <div
                                key={audience}
                                onClick={() => setProduct({ audience })}
                                className={cn(
                                    "cursor-pointer px-4 py-2 rounded-xl border transition-all hover:border-primary/50 hover:bg-accent/50 text-sm font-medium",
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-background text-muted-foreground"
                                )}
                            >
                                {audience}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 3. Personality */}
            <section className="space-y-4">
                <Label className="text-lg font-semibold">3. Brand personality</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {PERSONALITIES.map((personality) => {
                        const isSelected = product.personality === personality
                        return (
                            <div
                                key={personality}
                                onClick={() => setProduct({ personality })}
                                className={cn(
                                    "cursor-pointer px-4 py-3 rounded-xl border text-center transition-all hover:border-primary/50 hover:bg-accent/50 text-sm font-medium",
                                    isSelected
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                        : "bg-background text-muted-foreground"
                                )}
                            >
                                {personality}
                            </div>
                        )
                    })}
                </div>
            </section>

            <div className="flex justify-between pt-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/welcome")}
                >
                    Back
                </Button>
                <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full md:w-auto min-w-[200px]"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
