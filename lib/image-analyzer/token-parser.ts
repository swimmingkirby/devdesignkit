import { Tokens } from "@/lib/scraper/types";
import { callHuggingFaceVision } from "./huggingface-client";
import { extractJSON } from "./parsers/json-extractor";
import { normalizeTokens, getDefaultTokens } from "./parsers/normalizer";

/**
 * Extract design tokens from website screenshot using LLM
 */
export interface TokenParseResult {
  tokens: Tokens;
  rawResponse: string;
}

export async function parseTokensFromLLM(
  base64Image: string,
  mimeType: string
): Promise<TokenParseResult> {
  const prompt = `You are a design system expert. Analyze this website screenshot and extract the design tokens (the fundamental design variables).

**COLORS** - Identify these color roles:

1. "background" = Main page background (usually white, off-white, or light gray)
2. "foreground" = Main body text color (usually dark gray or black)
3. "primary" = Primary brand color (used for main buttons, links, accents)
4. "primaryForeground" = Text color on primary elements (usually white or very light)
5. "secondary" = Secondary accent color (lighter or different from primary)
6. "secondaryForeground" = Text on secondary elements
7. "muted" = Subdued background (for cards, sections - slightly darker than main bg)
8. "mutedForeground" = Subdued text (hints, labels - lighter than main text)
9. "destructive" = Error/danger color (usually red)
10. "destructiveForeground" = Text on destructive buttons (usually white)
11. "border" = Default border color (usually light gray)
12. "input" = Input field border color (may be same as border)
13. "ring" = Focus ring/outline color (often primary color)

Return hex codes (e.g., "#ffffff" not "white")

**FONTS** - Identify:

1. "sans" = Primary sans-serif font used (look at headings/body)
   Common: Inter, Roboto, Arial, Helvetica, "SF Pro", system-ui
   If unclear, use: "system-ui, -apple-system, sans-serif"

2. "serif" = Serif font if used (rare on modern sites)
   If not visible, default to: "Georgia, serif"

3. "mono" = Monospace font (for code blocks)
   Common: "Fira Code", "Source Code Pro", "Courier New"
   If not visible, default to: "Menlo, Monaco, monospace"

4. "sizes":
   - "body": Main text size (usually 14px-18px)
   - "heading": Array of heading sizes from largest to smallest
     Example: ["48px", "36px", "24px"] for h1, h2, h3
   - "caption": Small text size (usually 12px-14px)

**RADIUS** - Border radius values:

1. "small" = Small elements (inputs, tags) - usually 2px-4px
2. "medium" = Buttons, cards - usually 6px-12px
3. "large" = Large cards, modals - usually 12px-24px

If elements are sharp-cornered, use "0px". If very rounded, use actual values seen.

**SPACING** - Base spacing unit:

"base" = The fundamental spacing unit (often 4px or 8px)
Look at padding/margins and find the common increment

**SHADOWS** - Shadow styles:

1. "base" = Subtle shadow for cards/buttons (e.g., "0 1px 3px rgba(0,0,0,0.1)")
2. "large" = Prominent shadow for modals/dropdowns (e.g., "0 10px 25px rgba(0,0,0,0.15)")

If no visible shadows, use "none" for both.

EXAMPLE OUTPUT:
{
  "colors": {
    "background": "#ffffff",
    "foreground": "#0f172a",
    "primary": "#3b82f6",
    "primaryForeground": "#ffffff",
    "secondary": "#e2e8f0",
    "secondaryForeground": "#1e293b",
    "muted": "#f8fafc",
    "mutedForeground": "#64748b",
    "destructive": "#ef4444",
    "destructiveForeground": "#ffffff",
    "border": "#e2e8f0",
    "input": "#e2e8f0",
    "ring": "#3b82f6"
  },
  "fonts": {
    "sans": "Inter, system-ui, sans-serif",
    "serif": "Georgia, serif",
    "mono": "Fira Code, monospace",
    "sizes": {
      "body": "16px",
      "heading": ["48px", "32px", "24px"],
      "caption": "14px"
    }
  },
  "radius": {
    "small": "4px",
    "medium": "8px",
    "large": "16px"
  },
  "spacing": {
    "base": "4px"
  },
  "shadows": {
    "base": "0 1px 3px rgba(0,0,0,0.12)",
    "large": "0 10px 30px rgba(0,0,0,0.15)"
  }
}

IMPORTANT:
- Be as accurate as possible with colors (use hex format)
- Look at multiple elements to identify patterns
- Return ONLY valid JSON, no markdown code blocks, no explanations

Analyze this screenshot now:`;

  try {
    const response = await callHuggingFaceVision(base64Image, mimeType, prompt);
    const rawResponse =
      typeof response === "string"
        ? response
        : JSON.stringify(response, null, 2);
    
    // Try to extract JSON from response
    const parsed = extractJSON(response);
    
    if (!parsed) {
      console.warn("Failed to parse tokens from LLM, using defaults");
      return { tokens: getDefaultTokens(), rawResponse };
    }
    
    return { tokens: normalizeTokens(parsed), rawResponse };
  } catch (error: any) {
    console.error("Error parsing tokens from LLM:", error);
    return {
      tokens: getDefaultTokens(),
      rawResponse: error.message || "Unknown token parser error",
    };
  }
}

