export interface ThemeTokens {
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
    neutralScale?: string[]; // optional array of grays
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "sm" | "md" | "lg";
  };
  radius: number; // in px
  spacing: "compact" | "cozy" | "spacious";
  shadows: "soft" | "normal" | "strong";
}

