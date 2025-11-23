"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pen, Download, Loader2, CheckCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/contexts/theme-context"
import { buildThemeZip } from "@/lib/export/buildThemeZip"
import { saveAs } from "file-saver"
import { presetThemes } from "@/lib/themes/preset-themes"

export function CustomizerHeader() {
    const pathname = usePathname()
    const isCustomizer = pathname === "/customizer"
    const { theme, activeThemeId } = useTheme()
    const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false)
    const [isExporting, setIsExporting] = React.useState(false)
    const [exportSuccess, setExportSuccess] = React.useState(false)

    const handleExport = async () => {
        try {
            setIsExporting(true)
            setExportSuccess(false)

            // Determine theme name
            const themeName = (presetThemes[activeThemeId]?.name || "my-theme")
                .toLowerCase()
                .replace(/\s+/g, '-')

            // Get UX settings from localStorage (wizard state)
            let uxSettings = undefined
            try {
                const wizardState = localStorage.getItem("wizard-state")
                if (wizardState) {
                    const parsed = JSON.parse(wizardState)
                    uxSettings = parsed.ux
                }
            } catch (e) {
                console.warn("Could not load UX settings:", e)
            }

            const blob = await buildThemeZip(theme, themeName, uxSettings)
            saveAs(blob, `${themeName}.zip`)

            setExportSuccess(true)
            setTimeout(() => {
                setIsExportDialogOpen(false)
                setExportSuccess(false)
            }, 2000)
        } catch (error) {
            console.error("Failed to export theme:", error)
            alert("Failed to export theme. Check console for details.")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <>
            <header className="h-14 flex items-center justify-between px-6 border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
                {/* Left side - Logo */}
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <div className="flex items-center text-purple-500">
                        <span className="text-xl font-bold">[</span>
                        <Pen className="h-5 w-5 mx-1" />
                        <span className="text-xl font-bold">]</span>
                    </div>
                    <span>DevDesignKit</span>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {isCustomizer && (
                        <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white border-none gap-2"
                            onClick={() => setIsExportDialogOpen(true)}
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    )}
                </div>
            </header>

            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogContent className="bg-[#1E1E1E] border-[#444] text-white">
                    <DialogHeader>
                        <DialogTitle>Export Design System</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Download your theme as a portable package ready to use in any project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="text-sm text-gray-300">
                            <p className="mb-3">Your export will include:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                <li>Full design-system.json</li>
                                <li>CSS variables (tokens.css + fonts.css)</li>
                                <li>Tailwind configuration extension</li>
                                <li>Shadcn component overrides</li>
                                <li>Preview HTML file</li>
                                <li>UX Guidelines</li>
                            </ul>
                            <p className="mt-3 text-xs text-gray-500">
                                The UX Guidelines file summarizes your selected UX enhancements and provides lightweight recommendations for maintaining consistent interaction patterns.
                            </p>
                        </div>

                        {exportSuccess ? (
                            <div className="flex items-center gap-2 text-green-400 bg-green-950/30 p-3 rounded-md border border-green-900/50">
                                <CheckCircle2 className="h-5 w-5" />
                                <span>Theme exported successfully!</span>
                            </div>
                        ) : (
                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Theme Package
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

