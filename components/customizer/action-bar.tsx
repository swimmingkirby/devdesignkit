"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RotateCcw, Share2, Save, Code, Download, Loader2 } from "lucide-react"
import { themeLabels, ThemeKey } from "@/lib/themes"
import { useScraperImport } from "@/lib/hooks/use-scraper-import"
import { useTheme } from "@/lib/contexts/theme-context"

interface ActionBarProps {
    selectedTheme: ThemeKey
    onThemeChange: (theme: ThemeKey) => void
    importedThemeName?: string | null
    isImporting?: boolean
}

export function ActionBar({ selectedTheme, onThemeChange, importedThemeName, isImporting }: ActionBarProps) {
    const { updateTheme } = useTheme()
    const { loading, error, importFromUrl, reset } = useScraperImport()
    const [importUrl, setImportUrl] = React.useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [successMessage, setSuccessMessage] = React.useState("")

    const handleImport = async () => {
        setSuccessMessage("")
        const theme = await importFromUrl(importUrl)
        
        if (theme) {
            // Apply the imported theme
            updateTheme(theme)
            setSuccessMessage("Theme imported successfully!")
            
            // Close dialog after 1 second
            setTimeout(() => {
                setDialogOpen(false)
                setImportUrl("")
                setSuccessMessage("")
                reset()
            }, 1500)
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setImportUrl("")
            setSuccessMessage("")
            reset()
        }
    }

    return (
        <div className="h-12 flex items-center border-b border-[#444] bg-[#2C2C2C] text-white shrink-0">
            {/* Left side - Theme Selector (aligned with sidebar width) */}
            <div className="w-[300px] flex items-center px-6 border-r border-[#444] shrink-0 h-full">
                <Select 
                    value={selectedTheme} 
                    onValueChange={(value) => {
                        if (isImporting) {
                            console.log("🚫 ActionBar: Ignoring theme change during import");
                            return;
                        }
                        onThemeChange(value as ThemeKey);
                    }}
                >
                    <SelectTrigger className="h-8 w-full bg-[#1E1E1E] border-[#444] text-white hover:bg-[#2C2C2C]">
                        <SelectValue>
                            {selectedTheme === "custom" && importedThemeName 
                                ? importedThemeName
                                : themeLabels[selectedTheme] || "Select a theme"
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E1E] border-[#444]">
                        {Object.entries(themeLabels).map(([key, label]) => (
                            <SelectItem 
                                key={key} 
                                value={key}
                                className="text-white hover:bg-[#3C3C3C] focus:bg-[#3C3C3C]"
                            >
                                {key === "custom" && importedThemeName 
                                    ? importedThemeName
                                    : label
                                }
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex-1 flex items-center justify-end gap-2 px-6">
                <div className="flex items-center gap-1 mr-4 border-r border-[#444] pr-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#3C3C3C]">
                        <RotateCcw className="h-4 w-4 -scale-x-100" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#3C3C3C]">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                            <Download className="h-4 w-4 mr-2" />
                            Import from URL
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E1E1E] border-[#444] text-white">
                        <DialogHeader>
                            <DialogTitle>Import Theme from URL</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Enter a website URL to scrape and import its design system.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="import-url">Website URL</Label>
                                <Input
                                    id="import-url"
                                    placeholder="https://example.com"
                                    value={importUrl}
                                    onChange={(e) => setImportUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && importUrl && !loading) {
                                            handleImport()
                                        }
                                    }}
                                    disabled={loading}
                                    className="bg-[#2C2C2C] border-[#444] text-white"
                                />
                            </div>
                            
                            {error && (
                                <div className="text-sm text-red-400 bg-red-950/20 p-3 rounded-md border border-red-900/30">
                                    {error}
                                </div>
                            )}
                            
                            {successMessage && (
                                <div className="text-sm text-green-400 bg-green-950/20 p-3 rounded-md border border-green-900/30">
                                    {successMessage}
                                </div>
                            )}
                            
                            <Button 
                                onClick={handleImport}
                                disabled={!importUrl || loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Scraping...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Import Theme
                                    </>
                                )}
                            </Button>
                            
                            <p className="text-xs text-gray-500 mt-2">
                                This will scrape the website using the hybrid scraper (DOM + Vision AI) and import the extracted design tokens.
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
                    <Code className="h-4 w-4 mr-2" />
                    Code
                </Button>
            </div>
        </div>
    )
}
