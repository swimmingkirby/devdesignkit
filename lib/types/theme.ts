export interface ThemeTokens {
  colors: {
    // Core colors
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    // Optional colors
    accent?: string;
    accentForeground?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    neutralScale?: string[]; // optional array of grays
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
    sizes: {
      body: string;
      heading: string[]; // Array of heading sizes [h1, h2, h3]
      caption: string;
    };
  };
  radius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    base: string;
  };
  shadows: {
    base: string;
    large: string;
  };
}

// Legacy support - keep for backward compatibility
export interface LegacyThemeTokens {
  colors: {
    primary: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    border?: string;
    input?: string;
    neutralScale?: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "sm" | "md" | "lg";
  };
  radius: number;
  spacing: "compact" | "cozy" | "spacious";
  shadows: "soft" | "normal" | "strong";
}

