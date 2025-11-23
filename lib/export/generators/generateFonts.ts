import { ThemeTokens } from "@/lib/types/theme"

export function generateFonts(tokens: ThemeTokens): string {
    const fonts = [
        tokens.fonts.sans,
        tokens.fonts.serif,
        tokens.fonts.mono,
        tokens.fonts.heading,
        tokens.fonts.secondary
    ].filter(Boolean) as string[]

    // Simple heuristic to find Google Fonts
    // In a real app, we might want a more robust font loader or registry
    const googleFonts = new Set<string>()

    fonts.forEach(fontString => {
        const firstFamily = fontString.split(',')[0].trim().replace(/['"]/g, '')
        // List of common system fonts to ignore
        const systemFonts = ['system-ui', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue']

        if (!systemFonts.includes(firstFamily)) {
            googleFonts.add(firstFamily)
        }
    })

    let css = "/* Font Imports */\n"

    if (googleFonts.size > 0) {
        const families = Array.from(googleFonts).map(f => `${f.replace(/ /g, '+')}:wght@400;500;600;700`).join('&family=')
        css += `@import url('https://fonts.googleapis.com/css2?family=${families}&display=swap');\n\n`
    }

    css += `:root {
  --font-sans: ${tokens.fonts.sans};
  --font-serif: ${tokens.fonts.serif};
  --font-mono: ${tokens.fonts.mono};
  ${tokens.fonts.heading ? `--font-heading: ${tokens.fonts.heading};` : ''}
  ${tokens.fonts.secondary ? `--font-secondary: ${tokens.fonts.secondary};` : ''}
}
`
    return css
}
