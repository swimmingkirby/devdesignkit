"use client"

import { WizardProvider } from "./wizard-context"
import { WizardStepper } from "@/components/ui/wizard-stepper"
import { CustomizerHeader } from "@/components/customizer/customizer-header"

import { usePathname } from "next/navigation"

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const showStepper = pathname !== "/wizard/theme"

    return (
        <WizardProvider>
            <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col">
                <CustomizerHeader />
                {showStepper && (
                    <header className="py-6">
                        <div className="container mx-auto">
                            <WizardStepper />
                        </div>
                    </header>
                )}
                <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl">
                    {children}
                </main>
            </div>
        </WizardProvider>
    )
}
