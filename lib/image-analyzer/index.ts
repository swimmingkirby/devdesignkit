import { ScrapeResult } from "../scraper/types";
import { parseTokensFromLLM } from "./token-parser";
import { parseComponentsFromLLM } from "./component-parser";
import { parseLayoutsFromLLM } from "./layout-parser";
import { getDefaultTokens, getDefaultComponents, getDefaultLayouts } from "./parsers/normalizer";

/**
 * Main orchestrator for analyzing website screenshots with LLM
 */
export async function analyzeImageWithLLM(
  base64Image: string,
  mimeType: string
): Promise<ScrapeResult> {
  const timestamp = new Date().toISOString();
  const debugLogs: string[] = [];
  const debugErrors: string[] = [];
  
  debugLogs.push("=== Image Analysis Started ===");
  debugLogs.push(`Image type: ${mimeType}`);
  debugLogs.push(`Image size: ${(base64Image.length * 0.75 / 1024).toFixed(2)} KB`);
  
  // Initialize with defaults (will be updated by each phase)
  let tokens = getDefaultTokens();
  let components = getDefaultComponents();
  let layouts = getDefaultLayouts();
  
  try {
    // Phase 1: Extract design tokens
    debugLogs.push("");
    debugLogs.push("=== Phase 1: Token Extraction ===");
    try {
      const tokenResult = await parseTokensFromLLM(base64Image, mimeType);
      tokens = tokenResult.tokens;
      debugLogs.push("✓ Successfully extracted design tokens");
      debugLogs.push(`  - Colors: ${Object.keys(tokens.colors).length} variants`);
      debugLogs.push(`  - Fonts: ${tokens.fonts.sans}`);
      debugLogs.push(`  - Radius: ${tokens.radius.small}, ${tokens.radius.medium}, ${tokens.radius.large}`);
      debugLogs.push("");
      debugLogs.push("Raw Model Response (Tokens):");
      debugLogs.push(String(tokenResult.rawResponse));
    } catch (error: any) {
      debugErrors.push(`Token extraction failed: ${error.message}`);
      debugLogs.push("✗ Token extraction failed, using defaults");
    }
    
    // Phase 2: Identify UI components
    debugLogs.push("");
    debugLogs.push("=== Phase 2: Component Identification ===");
    try {
      const componentResult = await parseComponentsFromLLM(base64Image, mimeType);
      components = componentResult.components;
      debugLogs.push("✓ Successfully identified UI components");
      debugLogs.push(`  - Buttons: ${components.buttons.length} styles`);
      debugLogs.push(`  - Cards: ${components.cards.length} styles`);
      debugLogs.push(`  - Nav Items: ${components.navItems.length} styles`);
      if (components.forms && components.forms.length > 0) {
        debugLogs.push(`  - Forms: ${components.forms.length} styles`);
      }
      if (components.feedback && components.feedback.length > 0) {
        debugLogs.push(`  - Feedback: ${components.feedback.length} styles`);
      }
      if (components.dataDisplay && components.dataDisplay.length > 0) {
        debugLogs.push(`  - Data Display: ${components.dataDisplay.length} styles`);
      }
      debugLogs.push("");
      debugLogs.push("Raw Model Response (Components):");
      debugLogs.push(String(componentResult.rawResponse));
    } catch (error: any) {
      debugErrors.push(`Component identification failed: ${error.message}`);
      debugLogs.push("✗ Component identification failed, using defaults");
    }
    
    // Phase 3: Analyze layout structure
    debugLogs.push("");
    debugLogs.push("=== Phase 3: Layout Analysis ===");
    try {
      const layoutResult = await parseLayoutsFromLLM(base64Image, mimeType);
      layouts = layoutResult.layouts;
      debugLogs.push("✓ Successfully analyzed layout structure");
      debugLogs.push(`  - Sections detected: ${layouts.sections.length}`);
      layouts.sections.forEach((section, idx) => {
        debugLogs.push(`  ${idx + 1}. ${section.type} (confidence: ${section.metadata?.confidence || "unknown"})`);
      });
      debugLogs.push("");
      debugLogs.push("Raw Model Response (Layouts):");
      debugLogs.push(String(layoutResult.rawResponse));
    } catch (error: any) {
      debugErrors.push(`Layout analysis failed: ${error.message}`);
      debugLogs.push("✗ Layout analysis failed, using defaults");
    }
    
    debugLogs.push("");
    debugLogs.push("=== Image Analysis Complete ===");
    if (debugErrors.length === 0) {
      debugLogs.push("✓ All phases completed successfully");
    } else {
      debugLogs.push(`⚠ Completed with ${debugErrors.length} error(s)`);
    }
    
    return {
      tokens,
      components,
      layouts,
      debug: {
        url: "image-upload",
        timestamp,
        logs: debugLogs,
        errors: debugErrors
      }
    };
    
  } catch (error: any) {
    debugErrors.push(`Critical error: ${error.message}`);
    debugLogs.push("");
    debugLogs.push("=== CRITICAL ERROR ===");
    debugLogs.push(error.message);
    
    // Return partial results with error information
    return {
      tokens,
      components,
      layouts,
      debug: {
        url: "image-upload",
        timestamp,
        logs: debugLogs,
        errors: debugErrors
      }
    };
  }
}

