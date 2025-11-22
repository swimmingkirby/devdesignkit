import { ScrapeResult, DebugLog, Components } from "./types";
import { fetchAndRender } from "./browser";
import { extractTokens } from "./tokens";
import { extractComponents } from "./component-extractor";
import { extractLayout } from "./layout-extractor";

/**
 * Default fallback tokens
 */
const DEFAULT_TOKENS = {
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
};

const DEFAULT_COMPONENTS: Components = {
  buttons: [],
  cards: [],
  navItems: [],
};

const DEFAULT_LAYOUTS = {
  sections: [] as any[],
};

export async function scrape(url: string): Promise<ScrapeResult> {
  const timestamp = new Date().toISOString();
  let debugLogs: string[] = [];
  let debugErrors: string[] = [];

  try {
    debugLogs.push(`Starting scrape of ${url}`);
    debugLogs.push(`Timestamp: ${timestamp}`);

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
      }
    } catch (urlError: any) {
      debugErrors.push(`Invalid URL: ${urlError.message}`);
      throw new Error(`Invalid URL format: ${urlError.message}`);
    }

    // 1. Fetch and Render
    debugLogs.push("=== Phase 1: Fetch and Render ===");
    let nodes;
    
    try {
      const { nodes: extractedNodes, debug: browserLogs } = await fetchAndRender(url);
      nodes = extractedNodes;
      debugLogs = [...debugLogs, ...browserLogs];

      if (nodes.length === 0) {
        debugErrors.push("No nodes extracted from page");
        throw new Error("No content could be extracted from the page. It may be empty or heavily client-side rendered.");
      }
    } catch (browserError: any) {
      debugErrors.push(`Browser phase failed: ${browserError.message}`);
      throw browserError; // Re-throw to be caught by outer try-catch
    }

    // 2. Token Extraction
    debugLogs.push("=== Phase 2: Token Extraction ===");
    let tokens = DEFAULT_TOKENS;
    
    try {
      const { tokens: extractedTokens, debug: tokenDebug } = extractTokens(nodes);
      tokens = extractedTokens;
      debugLogs = [...debugLogs, ...tokenDebug];
    } catch (tokenError: any) {
      debugErrors.push(`Token extraction failed: ${tokenError.message}`);
      debugLogs.push(`Warning: Using default tokens due to extraction failure`);
      // Continue with default tokens
    }

    // 3. Component Extraction
    debugLogs.push("=== Phase 3: Component Pattern Extraction ===");
    let components = DEFAULT_COMPONENTS;
    
    try {
      components = extractComponents(nodes);
      debugLogs.push(`Found ${components.buttons.length} button patterns`);
      debugLogs.push(`Found ${components.cards.length} card patterns`);
      debugLogs.push(`Found ${components.navItems.length} nav item patterns`);
    } catch (componentError: any) {
      debugErrors.push(`Component extraction failed: ${componentError.message}`);
      debugLogs.push(`Warning: Using empty components due to extraction failure`);
      // Continue with empty components
    }

    // 4. Layout Extraction
    debugLogs.push("=== Phase 4: Layout Extraction ===");
    let layouts = DEFAULT_LAYOUTS;
    
    try {
      layouts = extractLayout(nodes);
      if (layouts.sections.length > 0) {
        const sectionTypes = layouts.sections.map(s => s.type).join(", ");
        debugLogs.push(`Detected sections: ${sectionTypes}`);
        
        // Log high-confidence shadcn/ui detections
        const shadcnSections = layouts.sections.filter(s => 
          s.metadata?.framework === "shadcn/ui" && s.metadata?.confidence === "high"
        );
        if (shadcnSections.length > 0) {
          debugLogs.push(`Found ${shadcnSections.length} shadcn/ui components`);
        }
      } else {
        debugLogs.push("No distinct sections detected");
      }
    } catch (layoutError: any) {
      debugErrors.push(`Layout extraction failed: ${layoutError.message}`);
      debugLogs.push(`Warning: Using empty layout due to extraction failure`);
      // Continue with empty layout
    }

    debugLogs.push("=== Scraping Complete ===");
    
    if (debugErrors.length > 0) {
      debugLogs.push(`Completed with ${debugErrors.length} non-fatal errors`);
    }

    const debug: DebugLog = {
      url,
      timestamp,
      logs: debugLogs,
      errors: debugErrors,
    };

    return {
      tokens,
      components,
      layouts,
      debug,
    };

  } catch (error: any) {
    debugErrors.push(`Fatal error: ${error.message}`);
    debugLogs.push(`Scraping failed: ${error.message}`);
    
    // Return partial results with error info
    return {
      tokens: DEFAULT_TOKENS,
      components: DEFAULT_COMPONENTS,
      layouts: DEFAULT_LAYOUTS,
      debug: {
        url,
        timestamp,
        logs: debugLogs,
        errors: debugErrors,
      },
    };
  }
}
