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
        router.push("/wizard/source")
    }

    const isValid = product.type && product.audience && product.personality

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Define Your Product</h1>
                <p className="text-gray-400 text-lg">
                    Tell us what you're building so we can tailor the design system.
                </p>
            </div>

            {/* 1. Product Type */}
            <section className="space-y-4">
                <Label className="text-lg font-semibold text-gray-200">1. What type of product are you building?</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRODUCT_TYPES.map((type) => {
                        const Icon = type.icon
                        const isSelected = product.type === type.id
                        return (
                            <Card
                                key={type.id}
                                className={cn(
                                    "cursor-pointer p-6 flex flex-col items-center gap-4 transition-all hover:bg-[#252525] border-[#444] bg-[#1E1E1E] rounded-none",
                                    isSelected && "border-blue-500 bg-[#252525] ring-1 ring-blue-500"
                                )}
                                onClick={() => setProduct({ type: type.id })}
                            >
                                <Icon className={cn("h-10 w-10", isSelected ? "text-blue-500" : "text-gray-400")} />
                                <span className={cn("font-medium text-lg", isSelected ? "text-blue-500" : "text-gray-200")}>{type.label}</span>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 2. Audience */}
            <section className="space-y-4">
                <Label className="text-lg font-semibold text-gray-200">2. Who is the main audience?</Label>
                <div className="flex flex-wrap gap-3">
                    {AUDIENCES.map((audience) => {
                        const isSelected = product.audience === audience
                        return (
                            <div
                                key={audience}
                                onClick={() => setProduct({ audience })}
                                className={cn(
                                    "cursor-pointer px-4 py-2 border transition-all hover:bg-[#252525] text-sm font-medium rounded-none",
                                    isSelected
                                        ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-[#1E1E1E] border-[#444] text-gray-400 hover:text-gray-200"
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
                <Label className="text-lg font-semibold text-gray-200">3. Brand personality</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {PERSONALITIES.map((personality) => {
                        const isSelected = product.personality === personality
                        return (
                            <div
                                key={personality}
                                onClick={() => setProduct({ personality })}
                                className={cn(
                                    "cursor-pointer px-4 py-3 border text-center transition-all hover:bg-[#252525] text-sm font-medium rounded-none",
                                    isSelected
                                        ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-[#1E1E1E] border-[#444] text-gray-400 hover:text-gray-200"
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
                    className="text-gray-400 hover:text-white hover:bg-[#333] rounded-md"
                >
                    Back
                </Button>
                <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!isValid}
                    className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}
