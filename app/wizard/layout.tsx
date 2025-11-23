"use client"

import { WizardProvider } from "./wizard-context"
import { WizardStepper } from "@/components/ui/wizard-stepper"
import { CustomizerHeader } from "@/components/customizer/customizer-header"

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WizardProvider>
            <div className="min-h-screen bg-background flex flex-col">
                <CustomizerHeader />
                <header className="border-b bg-card py-6">
                    <div className="container mx-auto">
                        <WizardStepper />
                    </div>
                </header>
                <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl">
                    {children}
                </main>
            </div>
        </WizardProvider>
    )
}
