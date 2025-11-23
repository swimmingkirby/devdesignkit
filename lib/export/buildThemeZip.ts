import JSZip from "jszip"
import { normalizeTheme } from "./normalizeTheme"
import { generateJson } from "./generators/generateJson"
import { generateCss } from "./generators/generateCss"
import { generateFonts } from "./generators/generateFonts"
import { generateTailwind } from "./generators/generateTailwind"
import { generateReadme } from "./generators/generateReadme"
import { generatePreview } from "./generators/generatePreview"
import { generateShadcn } from "./generators/generateShadcn"

export async function buildThemeZip(themeInput: any, themeName: string = "my-theme"): Promise<Blob> {
    const zip = new JSZip()
    const folder = zip.folder(themeName) || zip

    // 1. Normalize Theme
    const tokens = normalizeTheme(themeInput)

    // 2. Generate Files
    folder.file("design-system.json", generateJson(tokens))
    folder.file("tokens.css", generateCss(tokens))
    folder.file("fonts.css", generateFonts(tokens))
    folder.file("tailwind-theme-extension.js", generateTailwind(tokens))
    folder.file("README.md", generateReadme(themeName))
    folder.file("preview.html", generatePreview(tokens, themeName))

    // 3. Shadcn Overrides
    const shadcnFolder = folder.folder("shadcn-overrides")
    if (shadcnFolder) {
        const shadcnFiles = generateShadcn(tokens)
        Object.entries(shadcnFiles).forEach(([filename, content]) => {
            shadcnFolder.file(filename, content)
        })
    }

    // 4. Generate Blob
    return await zip.generateAsync({ type: "blob" })
}
