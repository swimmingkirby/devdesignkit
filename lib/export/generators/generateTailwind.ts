import { ThemeTokens } from "@/lib/types/theme"

export function generateTailwind(tokens: ThemeTokens): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
      },
      borderRadius: {
        sm: "var(--radius-small)",
        md: "var(--radius-medium)",
        lg: "var(--radius-large)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        ${tokens.fonts.heading ? 'heading: ["var(--font-heading)", "sans-serif"],' : ''}
        ${tokens.fonts.secondary ? 'secondary: ["var(--font-secondary)", "sans-serif"],' : ''}
      },
      fontSize: {
        body: "var(--font-size-body)",
        h1: "var(--font-size-h1)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        caption: "var(--font-size-caption)",
      },
      spacing: {
        base: "var(--space-base)",
      },
      boxShadow: {
        base: "var(--shadow-base)",
        large: "var(--shadow-large)",
      },
    },
  },
}
`
}
