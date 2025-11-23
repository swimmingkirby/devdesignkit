"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { usePathname } from "next/navigation"

const steps = [
    { id: "product", label: "Product", path: "/wizard/product" },
    { id: "source", label: "Look", path: "/wizard/source" },
    { id: "ux", label: "Experience", path: "/wizard/ux" },
    { id: "customizer", label: "Customize", path: "/customizer" },
]

export function WizardStepper() {
    const pathname = usePathname()

    const currentStepIndex = steps.findIndex((step) => pathname.startsWith(step.path))
    // If we are in customizer, we might not show this stepper, but logic holds.
    // If pathname is not found (e.g. root wizard), default to -1 or handle gracefully.

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 px-4">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{
                            width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex
                    const isCurrent = index === currentStepIndex

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors duration-300",
                                    isCompleted
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : isCurrent
                                            ? "border-primary ring-4 ring-primary/20"
                                            : "border-muted-foreground/30 text-muted-foreground"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-xs font-medium">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "absolute -bottom-6 whitespace-nowrap text-xs font-medium transition-colors duration-300",
                                    isCurrent ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
