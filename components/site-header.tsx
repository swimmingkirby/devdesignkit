import { Palette } from "lucide-react"

export function SiteHeader() {
    return (
        <header className="h-14 flex items-center px-4 shrink-0">
            <div className="flex items-center gap-2 font-semibold text-lg text-white">
                <Palette className="h-5 w-5" />
                <span>DevDesignKit</span>
            </div>
        </header>
    )
}
