import { Tokens, Components, Layouts, ComponentStyle, LayoutSection } from "@/lib/scraper/types";
import { normalizeColor, normalizeSize } from "./json-extractor";

/**
 * Get default tokens as fallback
 */
export function getDefaultTokens(): Tokens {
  return {
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      primary: "#0070f3",
      primaryForeground: "#ffffff",
      secondary: "#f5f5f5",
      secondaryForeground: "#000000",
      muted: "#f5f5f5",
      mutedForeground: "#666666",
      destructive: "#ff0000",
      destructiveForeground: "#ffffff",
      border: "#e5e5e5",
      input: "#e5e5e5",
      ring: "#0070f3",
    },
    fonts: {
      sans: "system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "Menlo, monospace",
      sizes: {
        body: "16px",
        heading: ["32px", "24px", "20px"],
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
      base: "0 1px 3px rgba(0,0,0,0.1)",
      large: "0 10px 40px rgba(0,0,0,0.1)",
    },
  };
}

/**
 * Normalize tokens from LLM output
 */
export function normalizeTokens(parsed: any): Tokens {
  const defaults = getDefaultTokens();
  
  return {
    colors: {
      background: normalizeColor(parsed.colors?.background || defaults.colors.background),
      foreground: normalizeColor(parsed.colors?.foreground || defaults.colors.foreground),
      primary: normalizeColor(parsed.colors?.primary || defaults.colors.primary),
      primaryForeground: normalizeColor(parsed.colors?.primaryForeground || defaults.colors.primaryForeground),
      secondary: normalizeColor(parsed.colors?.secondary || defaults.colors.secondary),
      secondaryForeground: normalizeColor(parsed.colors?.secondaryForeground || defaults.colors.secondaryForeground),
      muted: normalizeColor(parsed.colors?.muted || defaults.colors.muted),
      mutedForeground: normalizeColor(parsed.colors?.mutedForeground || defaults.colors.mutedForeground),
      destructive: normalizeColor(parsed.colors?.destructive || defaults.colors.destructive),
      destructiveForeground: normalizeColor(parsed.colors?.destructiveForeground || defaults.colors.destructiveForeground),
      border: normalizeColor(parsed.colors?.border || defaults.colors.border),
      input: normalizeColor(parsed.colors?.input || defaults.colors.input),
      ring: normalizeColor(parsed.colors?.ring || defaults.colors.ring),
    },
    fonts: {
      sans: parsed.fonts?.sans || defaults.fonts.sans,
      serif: parsed.fonts?.serif || defaults.fonts.serif,
      mono: parsed.fonts?.mono || defaults.fonts.mono,
      sizes: {
        body: normalizeSize(parsed.fonts?.sizes?.body || defaults.fonts.sizes.body),
        heading: Array.isArray(parsed.fonts?.sizes?.heading)
          ? parsed.fonts.sizes.heading.map(normalizeSize)
          : defaults.fonts.sizes.heading,
        caption: normalizeSize(parsed.fonts?.sizes?.caption || defaults.fonts.sizes.caption),
      },
    },
    radius: {
      small: normalizeSize(parsed.radius?.small || defaults.radius.small),
      medium: normalizeSize(parsed.radius?.medium || defaults.radius.medium),
      large: normalizeSize(parsed.radius?.large || defaults.radius.large),
    },
    spacing: {
      base: normalizeSize(parsed.spacing?.base || defaults.spacing.base),
    },
    shadows: {
      base: parsed.shadows?.base || defaults.shadows.base,
      large: parsed.shadows?.large || defaults.shadows.large,
    },
  };
}

/**
 * Get default components as fallback
 */
export function getDefaultComponents(): Components {
  return {
    buttons: [],
    cards: [],
    navItems: [],
    forms: [],
    feedback: [],
    dataDisplay: [],
  };
}

/**
 * Normalize a single component style
 */
function normalizeComponentStyle(comp: any): ComponentStyle {
  const normalized: ComponentStyle = {
    // Core required properties
    background: normalizeColor(comp.background || comp.backgroundColor || "#ffffff"),
    color: normalizeColor(comp.color || comp.textColor || "#000000"),
    padding: normalizeSize(comp.padding || "12px"),
    radius: normalizeSize(comp.radius || comp.borderRadius || "8px"),
    shadow: comp.shadow || comp.boxShadow || "none",
    frequency: typeof comp.frequency === "number" ? comp.frequency : (comp.count || 1),
  };

  // Add optional properties if they exist
  if (comp.component) normalized.component = comp.component;
  if (comp.shadcnVariant) normalized.shadcnVariant = comp.shadcnVariant;
  if (comp.shadcnStructure) normalized.shadcnStructure = comp.shadcnStructure;
  if (comp.border) normalized.border = comp.border;
  if (comp.fontSize) normalized.fontSize = normalizeSize(comp.fontSize);
  if (comp.fontWeight) normalized.fontWeight = String(comp.fontWeight);
  if (comp.hasHeader !== undefined) normalized.hasHeader = Boolean(comp.hasHeader);
  if (comp.hasFooter !== undefined) normalized.hasFooter = Boolean(comp.hasFooter);
  if (comp.contentLayout) normalized.contentLayout = comp.contentLayout;
  if (comp.usesIcons !== undefined) normalized.usesIcons = Boolean(comp.usesIcons);
  if (comp.iconStyle) normalized.iconStyle = comp.iconStyle;
  if (comp.hasIcon !== undefined) normalized.hasIcon = Boolean(comp.hasIcon);
  if (comp.iconPosition) normalized.iconPosition = comp.iconPosition;
  if (comp.description) normalized.description = comp.description;

  // Copy any other properties that might be useful
  Object.keys(comp).forEach(key => {
    if (!(key in normalized) && comp[key] !== undefined && comp[key] !== null) {
      normalized[key] = comp[key];
    }
  });

  return normalized;
}

/**
 * Normalize components from LLM output
 */
export function normalizeComponents(parsed: any): Components {
  const defaults = getDefaultComponents();
  
  return {
    buttons: Array.isArray(parsed.buttons)
      ? parsed.buttons.map(normalizeComponentStyle)
      : defaults.buttons,
    cards: Array.isArray(parsed.cards)
      ? parsed.cards.map(normalizeComponentStyle)
      : defaults.cards,
    navItems: Array.isArray(parsed.navItems)
      ? parsed.navItems.map(normalizeComponentStyle)
      : defaults.navItems,
    forms: Array.isArray(parsed.forms)
      ? parsed.forms.map(normalizeComponentStyle)
      : defaults.forms,
    feedback: Array.isArray(parsed.feedback)
      ? parsed.feedback.map(normalizeComponentStyle)
      : defaults.feedback,
    dataDisplay: Array.isArray(parsed.dataDisplay)
      ? parsed.dataDisplay.map(normalizeComponentStyle)
      : defaults.dataDisplay,
  };
}

/**
 * Get default layouts as fallback
 */
export function getDefaultLayouts(): Layouts {
  return {
    sections: [],
  };
}

/**
 * Normalize a single layout section
 */
function normalizeLayoutSection(section: any): LayoutSection {
  return {
    type: section.type || "unknown",
    position: {
      x: typeof section.position?.x === "number" ? section.position.x : (section.x || 0),
      y: typeof section.position?.y === "number" ? section.position.y : (section.y || 0),
      width: typeof section.position?.width === "number" ? section.position.width : (section.width || 100),
      height: typeof section.position?.height === "number" ? section.position.height : (section.height || 10),
    },
    metadata: {
      confidence: section.confidence || section.metadata?.confidence || "medium",
      framework: "generic",
      ...(section.metadata || {}),
    },
  };
}

/**
 * Normalize layouts from LLM output
 */
export function normalizeLayouts(parsed: any): Layouts {
  const defaults = getDefaultLayouts();
  
  // Handle if sections are in array directly or nested
  const sectionsArray = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.sections)
    ? parsed.sections
    : defaults.sections;
  
  return {
    sections: sectionsArray.map(normalizeLayoutSection),
  };
}

