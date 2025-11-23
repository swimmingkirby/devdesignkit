import { ThemeTokens } from "@/lib/types/theme"

export function generateCss(tokens: ThemeTokens): string {
    return `:root {
  /* Colors */
  --color-background: ${tokens.colors.background};
  --color-foreground: ${tokens.colors.foreground};
  --color-primary: ${tokens.colors.primary};
  --color-primary-foreground: ${tokens.colors.primaryForeground};
  --color-secondary: ${tokens.colors.secondary};
  --color-secondary-foreground: ${tokens.colors.secondaryForeground};
  --color-muted: ${tokens.colors.muted};
  --color-muted-foreground: ${tokens.colors.mutedForeground};
  --color-accent: ${tokens.colors.accent || tokens.colors.primary};
  --color-accent-foreground: ${tokens.colors.accentForeground || tokens.colors.primaryForeground};
  --color-destructive: ${tokens.colors.destructive};
  --color-destructive-foreground: ${tokens.colors.destructiveForeground};
  --color-border: ${tokens.colors.border};
  --color-input: ${tokens.colors.input};
  --color-ring: ${tokens.colors.ring};
  --color-card: ${tokens.colors.card || tokens.colors.background};
  --color-card-foreground: ${tokens.colors.cardForeground || tokens.colors.foreground};
  --color-popover: ${tokens.colors.popover || tokens.colors.background};
  --color-popover-foreground: ${tokens.colors.popoverForeground || tokens.colors.foreground};

  /* Typography */
  --font-sans: ${tokens.fonts.sans};
  --font-serif: ${tokens.fonts.serif};
  --font-mono: ${tokens.fonts.mono};
  
  --font-size-body: ${tokens.fonts.sizes.body};
  --font-size-h1: ${tokens.fonts.sizes.heading[0]};
  --font-size-h2: ${tokens.fonts.sizes.heading[1]};
  --font-size-h3: ${tokens.fonts.sizes.heading[2]};
  --font-size-caption: ${tokens.fonts.sizes.caption};

  /* Radius */
  --radius-small: ${tokens.radius.small};
  --radius-medium: ${tokens.radius.medium};
  --radius-large: ${tokens.radius.large};

  /* Spacing */
  --space-base: ${tokens.spacing.base};

  /* Shadows */
  --shadow-base: ${tokens.shadows.base};
  --shadow-large: ${tokens.shadows.large};
}
`
}
