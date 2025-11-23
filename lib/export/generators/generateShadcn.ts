import { ThemeTokens } from "@/lib/types/theme"

export function generateShadcn(tokens: ThemeTokens): Record<string, string> {
    // Returns a map of filename -> content
    // e.g. "button.json" -> "{ ... }"

    return {
        "button.json": JSON.stringify({
            variants: {
                default: {
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                },
                destructive: {
                    backgroundColor: "var(--color-destructive)",
                    color: "var(--color-destructive-foreground)",
                },
                outline: {
                    border: "1px solid var(--color-input)",
                    backgroundColor: "var(--color-background)",
                },
                secondary: {
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-secondary-foreground)",
                },
                ghost: {
                    backgroundColor: "transparent",
                    color: "var(--color-foreground)",
                },
                link: {
                    backgroundColor: "transparent",
                    color: "var(--color-primary)",
                }
            },
            borderRadius: "var(--radius-small)"
        }, null, 2),

        "card.json": JSON.stringify({
            backgroundColor: "var(--color-card)",
            color: "var(--color-card-foreground)",
            borderRadius: "var(--radius-medium)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-base)"
        }, null, 2),

        "input.json": JSON.stringify({
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-small)",
            border: "1px solid var(--color-input)",
            padding: "8px 12px"
        }, null, 2),

        "badge.json": JSON.stringify({
            borderRadius: "var(--radius-large)", // Badges usually rounder
            padding: "4px 8px",
            variants: {
                default: {
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                },
                secondary: {
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-secondary-foreground)",
                },
                destructive: {
                    backgroundColor: "var(--color-destructive)",
                    color: "var(--color-destructive-foreground)",
                },
                outline: {
                    border: "1px solid var(--color-foreground)",
                }
            }
        }, null, 2)
    }
}
