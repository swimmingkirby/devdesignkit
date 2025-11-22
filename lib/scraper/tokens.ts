import { StyledNode, Tokens } from "./types";
import { normalizeColors, assignColorRoles } from "./color-normalizer";
import { normalizeSpacing, parseSpacing } from "./spacing-normalizer";
import { normalizeRadius, parseBorderRadius } from "./radius-normalizer";
import { normalizeShadows } from "./shadow-normalizer";

export function extractTokens(nodes: StyledNode[]): {
  tokens: Tokens;
  debug: string[];
} {
  const debug: string[] = [];

  try {
    // 1. Collect raw values
    debug.push("Collecting raw style values...");
    
    const bgColors: string[] = [];
    const textColors: string[] = [];
    const buttonColors: string[] = [];
    const fontFamilies: string[] = [];
    const fontSizes: string[] = [];
    const radii: number[] = [];
    const spacingValues: number[] = [];
    const shadows: string[] = [];

    nodes.forEach(node => {
      try {
        bgColors.push(node.styles.backgroundColor);
        textColors.push(node.styles.color);
        fontFamilies.push(node.styles.fontFamily);
        fontSizes.push(node.styles.fontSize);
        
        const radius = parseBorderRadius(node.styles.borderRadius);
        if (radius > 0) radii.push(radius);

        const spacing = parseSpacing(node.styles.padding);
        spacingValues.push(...spacing);

        if (node.styles.boxShadow && node.styles.boxShadow !== "none") {
          shadows.push(node.styles.boxShadow);
        }

        // Collect button colors
        if (
          node.tag === "button" ||
          node.role === "button" ||
          node.classes.some(c => c.includes("btn") || c.includes("button"))
        ) {
          buttonColors.push(node.styles.backgroundColor);
        }
      } catch (nodeError) {
        // Skip problematic nodes
        debug.push(`Warning: Failed to process node: ${nodeError}`);
      }
    });

    debug.push(`Collected ${bgColors.length} background colors`);
    debug.push(`Collected ${textColors.length} text colors`);
    debug.push(`Collected ${radii.length} border radii`);
    debug.push(`Collected ${spacingValues.length} spacing values`);
    debug.push(`Collected ${shadows.length} shadows`);

    // 2. Color Normalization
    debug.push("Normalizing colors using k-means clustering...");
    let colorClusters;
    let colorRoles;
    
    try {
      const allColors = [...bgColors, ...textColors, ...buttonColors];
      colorClusters = normalizeColors(allColors, 8);
      debug.push(`Created ${colorClusters.length} color clusters`);

      colorRoles = assignColorRoles(colorClusters, bgColors, textColors, buttonColors);
      debug.push("Assigned color roles");
    } catch (colorError) {
      debug.push(`Warning: Color normalization failed, using defaults: ${colorError}`);
      colorRoles = {
        background: "#ffffff",
        foreground: "#000000",
        primary: "#000000",
        primaryForeground: "#ffffff",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#000000",
      };
    }

    // 3. Font Extraction
    debug.push("Extracting font tokens...");
    let fonts;
    
    try {
      const getMostFrequent = (arr: string[]) => {
        const freq = new Map<string, number>();
        arr.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
        return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).map(x => x[0]);
      };

      const sortedFonts = getMostFrequent(fontFamilies);
      const sortedSizes = getMostFrequent(fontSizes);

      fonts = {
        sans: sortedFonts[0] || "system-ui, sans-serif",
        serif: sortedFonts.find(f => f.includes("serif")) || "Georgia, serif",
        mono: sortedFonts.find(f => f.includes("mono")) || "monospace",
        sizes: {
          body: sortedSizes[0] || "16px",
          heading: sortedSizes.slice(1, 4).length > 0 ? sortedSizes.slice(1, 4) : ["32px", "24px", "20px"],
          caption: sortedSizes[sortedSizes.length - 1] || "14px",
        },
      };

      debug.push(`Font sans: ${fonts.sans}`);
    } catch (fontError) {
      debug.push(`Warning: Font extraction failed, using defaults: ${fontError}`);
      fonts = {
        sans: "system-ui, sans-serif",
        serif: "Georgia, serif",
        mono: "monospace",
        sizes: {
          body: "16px",
          heading: ["32px", "24px", "20px"],
          caption: "14px",
        },
      };
    }

    // 4. Radius Normalization
    debug.push("Normalizing border radius...");
    let radiusTokens;
    
    try {
      radiusTokens = normalizeRadius(radii);
      debug.push(`Radius tokens: small=${radiusTokens.small}, medium=${radiusTokens.medium}, large=${radiusTokens.large}`);
    } catch (radiusError) {
      debug.push(`Warning: Radius normalization failed, using defaults: ${radiusError}`);
      radiusTokens = {
        small: "4px",
        medium: "8px",
        large: "16px",
      };
    }

    // 5. Spacing Normalization
    debug.push("Normalizing spacing...");
    let spacingResult;
    
    try {
      spacingResult = normalizeSpacing(spacingValues);
      debug.push(`Spacing base: ${spacingResult.base}`);
    } catch (spacingError) {
      debug.push(`Warning: Spacing normalization failed, using default: ${spacingError}`);
      spacingResult = { base: "4px", normalized: new Map() };
    }

    // 6. Shadow Normalization
    debug.push("Normalizing shadows...");
    let shadowTokens;
    
    try {
      shadowTokens = normalizeShadows(shadows);
      debug.push(`Shadow tokens extracted`);
    } catch (shadowError) {
      debug.push(`Warning: Shadow normalization failed, using defaults: ${shadowError}`);
      shadowTokens = {
        base: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      };
    }

    const tokens: Tokens = {
      colors: colorRoles,
      fonts,
      radius: radiusTokens,
      spacing: {
        base: spacingResult.base,
      },
      shadows: shadowTokens,
    };

    return { tokens, debug };
    
  } catch (error: any) {
    debug.push(`Fatal error in token extraction: ${error.message}`);
    
    // Return sensible defaults
    return {
      tokens: {
        colors: {
          background: "#ffffff",
          foreground: "#000000",
          primary: "#000000",
          primaryForeground: "#ffffff",
          secondary: "#f1f5f9",
          secondaryForeground: "#0f172a",
          muted: "#f1f5f9",
          mutedForeground: "#64748b",
          destructive: "#ef4444",
          destructiveForeground: "#ffffff",
          border: "#e2e8f0",
          input: "#e2e8f0",
          ring: "#000000",
        },
        fonts: {
          sans: "system-ui, sans-serif",
          serif: "Georgia, serif",
          mono: "monospace",
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
          base: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
      },
      debug
    };
  }
}
