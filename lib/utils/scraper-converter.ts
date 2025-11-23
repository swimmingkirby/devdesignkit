import { ThemeTokens } from "@/lib/types/theme";

/**
 * Scraper output format from hybrid scraper
 */
interface ScraperTokens {
  colors: {
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
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
    sizes: {
      body: string;
      heading: string[];
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

interface ScraperOutput {
  tokens: ScraperTokens;
  components: any;
  layouts: any;
  debug: any;
}

/**
 * Validates and fixes a color value
 * Handles transparent colors and invalid formats
 */
function validateColor(color: string, fallback: string): string {
  if (!color || color === "rgba(0, 0, 0, 0)" || color === "transparent") {
    return fallback;
  }
  
  // Check if it's a valid CSS color format
  if (
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl") ||
    /^[a-z]+$/i.test(color) // named colors like "white", "black"
  ) {
    return color;
  }
  
  return fallback;
}

/**
 * Validates a CSS size value (e.g., "16px", "1rem")
 */
function validateSize(size: string, fallback: string): string {
  if (!size) return fallback;
  
  // Check if it's a valid CSS size
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(size)) {
    return size;
  }
  
  return fallback;
}

/**
 * Validates a CSS shadow value
 */
function validateShadow(shadow: string, fallback: string): string {
  if (!shadow || shadow === "none" || shadow.length < 5) {
    return fallback;
  }
  
  // Basic check for shadow format
  if (shadow.includes("px") || shadow.includes("rgba") || shadow.includes("rgb")) {
    return shadow;
  }
  
  return fallback;
}

/**
 * Default theme values to use as fallbacks
 */
const DEFAULT_THEME: ThemeTokens = {
  colors: {
    background: "#ffffff",
    foreground: "#09090b",
    primary: "#18181b",
    primaryForeground: "#fafafa",
    secondary: "#f4f4f5",
    secondaryForeground: "#18181b",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    destructive: "#ef4444",
    destructiveForeground: "#fafafa",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#18181b",
  },
  fonts: {
    sans: "Inter, system-ui, sans-serif",
    serif: "Georgia, serif",
    mono: "Menlo, Monaco, Courier, monospace",
    sizes: {
      body: "16px",
      heading: ["48px", "36px", "24px"],
      caption: "14px",
    },
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "16px",
  },
  spacing: {
    base: "4px",
  },
  shadows: {
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
};

/**
 * Converts scraper output to ThemeTokens format
 * Handles missing fields, validates values, and provides defaults
 */
export function convertScraperToTheme(scraperOutput: ScraperOutput): ThemeTokens {
  const tokens = scraperOutput.tokens;
  
  return {
    colors: {
      background: validateColor(tokens.colors.background, DEFAULT_THEME.colors.background),
      foreground: validateColor(tokens.colors.foreground, DEFAULT_THEME.colors.foreground),
      primary: validateColor(tokens.colors.primary, DEFAULT_THEME.colors.primary),
      primaryForeground: validateColor(tokens.colors.primaryForeground, DEFAULT_THEME.colors.primaryForeground),
      secondary: validateColor(tokens.colors.secondary, DEFAULT_THEME.colors.secondary),
      secondaryForeground: validateColor(tokens.colors.secondaryForeground, DEFAULT_THEME.colors.secondaryForeground),
      muted: validateColor(tokens.colors.muted, DEFAULT_THEME.colors.muted),
      mutedForeground: validateColor(tokens.colors.mutedForeground, DEFAULT_THEME.colors.mutedForeground),
      destructive: validateColor(tokens.colors.destructive, DEFAULT_THEME.colors.destructive),
      destructiveForeground: validateColor(tokens.colors.destructiveForeground, DEFAULT_THEME.colors.destructiveForeground),
      border: validateColor(tokens.colors.border, DEFAULT_THEME.colors.border),
      input: validateColor(tokens.colors.input, DEFAULT_THEME.colors.input),
      ring: validateColor(tokens.colors.ring, DEFAULT_THEME.colors.ring),
      // Add accent colors - use primary as fallback if scraper doesn't provide them
      accent: validateColor((tokens.colors as any).accent || tokens.colors.primary, tokens.colors.primary),
      accentForeground: validateColor((tokens.colors as any).accentForeground || tokens.colors.primaryForeground, tokens.colors.primaryForeground),
    },
    fonts: {
      sans: tokens.fonts?.sans || DEFAULT_THEME.fonts.sans,
      serif: tokens.fonts?.serif || DEFAULT_THEME.fonts.serif,
      mono: tokens.fonts?.mono || DEFAULT_THEME.fonts.mono,
      sizes: {
        body: validateSize(tokens.fonts?.sizes?.body, DEFAULT_THEME.fonts.sizes.body),
        heading: tokens.fonts?.sizes?.heading?.length >= 3
          ? tokens.fonts.sizes.heading.slice(0, 3).map((size) => validateSize(size, "24px"))
          : DEFAULT_THEME.fonts.sizes.heading,
        caption: validateSize(tokens.fonts?.sizes?.caption, DEFAULT_THEME.fonts.sizes.caption),
      },
    },
    radius: {
      small: validateSize(tokens.radius?.small, DEFAULT_THEME.radius.small),
      medium: validateSize(tokens.radius?.medium, DEFAULT_THEME.radius.medium),
      large: validateSize(tokens.radius?.large, DEFAULT_THEME.radius.large),
    },
    spacing: {
      base: validateSize(tokens.spacing?.base, DEFAULT_THEME.spacing.base),
    },
    shadows: {
      base: validateShadow(tokens.shadows?.base, DEFAULT_THEME.shadows.base),
      large: validateShadow(tokens.shadows?.large, DEFAULT_THEME.shadows.large),
    },
  };
}

/**
 * Generates a theme name from a URL
 * e.g., "https://stripe.com" -> "Stripe"
 */
export function generateThemeName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    const parts = hostname.split(".");
    const name = parts[0];
    
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return "Imported Theme";
  }
}

/**
 * Validates a complete scraper output
 */
export function validateScraperOutput(data: any): data is ScraperOutput {
  return (
    data &&
    typeof data === "object" &&
    data.tokens &&
    typeof data.tokens === "object" &&
    data.tokens.colors &&
    typeof data.tokens.colors === "object"
  );
}

