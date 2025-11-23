import { ThemeTokens } from "@/lib/types/theme"

export function generateJson(tokens: ThemeTokens): string {
    return JSON.stringify(tokens, null, 2)
}
