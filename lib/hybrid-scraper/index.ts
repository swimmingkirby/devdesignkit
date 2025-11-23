import { ScrapeResult, Tokens, Components, Layouts, DebugLog } from "../scraper/types";
import { scrape as domScrape } from "../scraper/index";
import { analyzeImageWithLLM } from "../image-analyzer/index";
import { fetchScreenshot } from "./screenshot";
import { mergeTokens, mergeComponents, mergeLayouts } from "./merger";
import { MergeLogger } from "./merge-logger";

/**
 * Hybrid scraper configuration
 */
export interface HybridScraperOptions {
  /**
   * Enable vision AI analysis (requires API key)
   */
  enableVisionAI?: boolean;
  
  /**
   * Enable DOM scraping (always recommended)
   */
  enableDOMScraping?: boolean;
  
  /**
   * Merge strategy:
   * - "dom-priority": Prefer DOM data, supplement with vision AI
   * - "vision-priority": Prefer vision AI, supplement with DOM
   * - "best-of-both": Intelligently merge both (default)
   */
  mergeStrategy?: "dom-priority" | "vision-priority" | "best-of-both";
  
  /**
   * Screenshot configuration
   */
  screenshot?: {
    fullPage?: boolean;
    viewport?: {
      width: number;
      height: number;
    };
  };
}

const DEFAULT_OPTIONS: Required<HybridScraperOptions> = {
  enableVisionAI: true,
  enableDOMScraping: true,
  mergeStrategy: "best-of-both",
  screenshot: {
    fullPage: true,
    viewport: {
      width: 1920,
      height: 1080,
    },
  },
};

/**
 * Hybrid scraper result with individual results and merged output
 */
export interface HybridScrapeResult extends ScrapeResult {
  /**
   * Individual results from each scraper
   */
  individual: {
    dom?: ScrapeResult;
    vision?: ScrapeResult;
  };
  
  /**
   * Metadata about the scraping process
   */
  metadata: {
    strategy: string;
    domScrapingEnabled: boolean;
    visionAIEnabled: boolean;
    screenshotTaken: boolean;
  };
}

/**
 * Main hybrid scraper function
 * 
 * Combines DOM-based scraping with vision AI analysis for comprehensive design extraction
 */
export async function hybridScrape(
  url: string,
  options: HybridScraperOptions = {}
): Promise<HybridScrapeResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const timestamp = new Date().toISOString();
  const debugLogs: string[] = [];
  const debugErrors: string[] = [];
  
  debugLogs.push("╔════════════════════════════════════════╗");
  debugLogs.push("║     HYBRID SCRAPER INITIATED           ║");
  debugLogs.push("╚════════════════════════════════════════╝");
  debugLogs.push("");
  debugLogs.push(`URL: ${url}`);
  debugLogs.push(`Timestamp: ${timestamp}`);
  debugLogs.push(`Strategy: ${config.mergeStrategy}`);
  debugLogs.push(`DOM Scraping: ${config.enableDOMScraping ? "✓" : "✗"}`);
  debugLogs.push(`Vision AI: ${config.enableVisionAI ? "✓" : "✗"}`);
  debugLogs.push("");
  
  // Validate configuration
  if (!config.enableDOMScraping && !config.enableVisionAI) {
    throw new Error("At least one scraping method must be enabled");
  }
  
  // Storage for individual results
  let domResult: ScrapeResult | undefined;
  let visionResult: ScrapeResult | undefined;
  let screenshotData: { base64: string; mimeType: string } | undefined;
  
  try {
    // ===================================================================
    // Phase 1: DOM Scraping
    // ===================================================================
    if (config.enableDOMScraping) {
      debugLogs.push("┌─────────────────────────────────────┐");
      debugLogs.push("│  PHASE 1: DOM-BASED SCRAPING        │");
      debugLogs.push("└─────────────────────────────────────┘");
      debugLogs.push("");
      
      try {
        const startTime = Date.now();
        domResult = await domScrape(url);
        const duration = Date.now() - startTime;
        
        debugLogs.push(`✓ DOM scraping completed in ${duration}ms`);
        debugLogs.push(`  - Tokens extracted: ${Object.keys(domResult.tokens.colors).length} colors`);
        debugLogs.push(`  - Components found: ${domResult.components.buttons.length} buttons, ${domResult.components.cards.length} cards`);
        debugLogs.push(`  - Layout sections: ${domResult.layouts.sections.length}`);
        debugLogs.push("");
        
        // Append DOM scraper debug logs
        if (domResult.debug?.logs) {
          debugLogs.push("--- DOM Scraper Debug Logs ---");
          debugLogs.push(...domResult.debug.logs);
          debugLogs.push("");
        }
        
        if (domResult.debug?.errors && domResult.debug.errors.length > 0) {
          debugErrors.push(...domResult.debug.errors.map(e => `[DOM] ${e}`));
        }
      } catch (error: any) {
        debugErrors.push(`DOM scraping failed: ${error.message}`);
        debugLogs.push(`✗ DOM scraping failed: ${error.message}`);
        debugLogs.push("");
        
        // If DOM scraping is the only method enabled, re-throw
        if (!config.enableVisionAI) {
          throw error;
        }
      }
    }
    
    // ===================================================================
    // Phase 2: Screenshot Capture (if vision AI is enabled)
    // ===================================================================
    if (config.enableVisionAI) {
      debugLogs.push("┌─────────────────────────────────────┐");
      debugLogs.push("│  PHASE 2: SCREENSHOT CAPTURE        │");
      debugLogs.push("└─────────────────────────────────────┘");
      debugLogs.push("");
      
      try {
        const startTime = Date.now();
        screenshotData = await fetchScreenshot(url, {
          fullPage: config.screenshot.fullPage,
          viewport: config.screenshot.viewport,
        });
        const duration = Date.now() - startTime;
        const sizeKB = (screenshotData.base64.length * 0.75 / 1024).toFixed(2);
        
        debugLogs.push(`✓ Screenshot captured in ${duration}ms`);
        debugLogs.push(`  - Format: ${screenshotData.mimeType}`);
        debugLogs.push(`  - Size: ${sizeKB} KB`);
        debugLogs.push(`  - Full page: ${config.screenshot.fullPage ? "Yes" : "No"}`);
        if (config.screenshot.viewport) {
          debugLogs.push(`  - Viewport: ${config.screenshot.viewport.width}x${config.screenshot.viewport.height}`);
        }
        debugLogs.push("");
      } catch (error: any) {
        debugErrors.push(`Screenshot capture failed: ${error.message}`);
        debugLogs.push(`✗ Screenshot capture failed: ${error.message}`);
        debugLogs.push(`  Vision AI analysis will be skipped`);
        debugLogs.push("");
        screenshotData = undefined;
      }
    }
    
    // ===================================================================
    // Phase 3: Vision AI Analysis
    // ===================================================================
    if (config.enableVisionAI && screenshotData) {
      debugLogs.push("┌─────────────────────────────────────┐");
      debugLogs.push("│  PHASE 3: VISION AI ANALYSIS        │");
      debugLogs.push("└─────────────────────────────────────┘");
      debugLogs.push("");
      
      try {
        const startTime = Date.now();
        visionResult = await analyzeImageWithLLM(
          screenshotData.base64,
          screenshotData.mimeType
        );
        const duration = Date.now() - startTime;
        
        debugLogs.push(`✓ Vision AI analysis completed in ${duration}ms`);
        debugLogs.push(`  - Tokens extracted: ${Object.keys(visionResult.tokens.colors).length} colors`);
        debugLogs.push(`  - Components found: ${visionResult.components.buttons.length} buttons, ${visionResult.components.cards.length} cards`);
        debugLogs.push(`  - Layout sections: ${visionResult.layouts.sections.length}`);
        debugLogs.push("");
        
        // Append vision AI debug logs
        if (visionResult.debug?.logs) {
          debugLogs.push("--- Vision AI Debug Logs ---");
          debugLogs.push(...visionResult.debug.logs);
          debugLogs.push("");
        }
        
        if (visionResult.debug?.errors && visionResult.debug.errors.length > 0) {
          debugErrors.push(...visionResult.debug.errors.map(e => `[Vision] ${e}`));
        }
      } catch (error: any) {
        debugErrors.push(`Vision AI analysis failed: ${error.message}`);
        debugLogs.push(`✗ Vision AI analysis failed: ${error.message}`);
        debugLogs.push("");
        
        // If vision AI is the only method enabled, re-throw
        if (!config.enableDOMScraping) {
          throw error;
        }
      }
    }
    
    // ===================================================================
    // Phase 4: Intelligent Merging
    // ===================================================================
    debugLogs.push("┌─────────────────────────────────────┐");
    debugLogs.push("│  PHASE 4: INTELLIGENT MERGING       │");
    debugLogs.push("└─────────────────────────────────────┘");
    debugLogs.push("");
    
    let mergedTokens: Tokens;
    let mergedComponents: Components;
    let mergedLayouts: Layouts;
    let mergeLogger: MergeLogger | undefined;
    let hoverDataMap: Map<string, any> | undefined;
    
    // Determine which results we have
    const hasDom = !!domResult;
    const hasVision = !!visionResult;
    
    if (hasDom && hasVision) {
      debugLogs.push(`Merging strategy: ${config.mergeStrategy}`);
      debugLogs.push("");
      
      // Create merge logger for detailed tracking
      mergeLogger = new MergeLogger();
      
      // Convert hover data to Map if available
      if (domResult!.hoverData) {
        hoverDataMap = new Map(Object.entries(domResult!.hoverData));
      }
      
      // Both results available - merge intelligently with logging
      mergedTokens = mergeTokens(domResult!.tokens, visionResult!.tokens, config.mergeStrategy, mergeLogger);
      mergedComponents = mergeComponents(
        domResult!.components, 
        visionResult!.components, 
        config.mergeStrategy, 
        mergeLogger,
        hoverDataMap
      );
      mergedLayouts = mergeLayouts(domResult!.layouts, visionResult!.layouts, config.mergeStrategy, mergeLogger);
      
      // Log summary to console
      mergeLogger.logSummary();
      
      debugLogs.push("✓ Successfully merged results from both scrapers");
      debugLogs.push(`  - Tokens: Combined ${Object.keys(mergedTokens.colors).length} color variants`);
      debugLogs.push(`  - Components: ${mergedComponents.buttons.length} buttons, ${mergedComponents.cards.length} cards`);
      debugLogs.push(`  - Layouts: ${mergedLayouts.sections.length} sections`);
      
    } else if (hasDom) {
      // Only DOM results available
      debugLogs.push("Using DOM scraping results only (vision AI unavailable)");
      mergedTokens = domResult!.tokens;
      mergedComponents = domResult!.components;
      mergedLayouts = domResult!.layouts;
      
    } else if (hasVision) {
      // Only vision results available
      debugLogs.push("Using vision AI results only (DOM scraping unavailable)");
      mergedTokens = visionResult!.tokens;
      mergedComponents = visionResult!.components;
      mergedLayouts = visionResult!.layouts;
      
    } else {
      throw new Error("No scraping results available - both methods failed");
    }
    
    debugLogs.push("");
    debugLogs.push("╔════════════════════════════════════════╗");
    debugLogs.push("║   HYBRID SCRAPING COMPLETED            ║");
    debugLogs.push("╚════════════════════════════════════════╝");
    
    if (debugErrors.length > 0) {
      debugLogs.push("");
      debugLogs.push(`⚠ Completed with ${debugErrors.length} non-fatal error(s)`);
    }
    
    // Build final result with merge decisions
    const finalDebug: any = {
      url,
      timestamp,
      logs: debugLogs,
      errors: debugErrors,
    };

    // Add merge decisions if logger was used
    if (mergeLogger) {
      const debugOutput = mergeLogger.getDebugOutput();
      finalDebug.mergeDecisions = debugOutput.mergeDecisions;
      finalDebug.validationWarnings = debugOutput.validationWarnings;
      finalDebug.mergeStatistics = debugOutput.statistics;
      finalDebug.mergeDuration = debugOutput.duration;
    }
    
    return {
      tokens: mergedTokens,
      components: mergedComponents,
      layouts: mergedLayouts,
      hoverData: domResult?.hoverData, // Include hover data
      debug: finalDebug,
      individual: {
        dom: domResult,
        vision: visionResult,
      },
      metadata: {
        strategy: config.mergeStrategy,
        domScrapingEnabled: config.enableDOMScraping,
        visionAIEnabled: config.enableVisionAI,
        screenshotTaken: !!screenshotData,
      },
    };
    
  } catch (error: any) {
    debugErrors.push(`Fatal error: ${error.message}`);
    debugLogs.push("");
    debugLogs.push("╔════════════════════════════════════════╗");
    debugLogs.push("║   HYBRID SCRAPING FAILED               ║");
    debugLogs.push("╚════════════════════════════════════════╝");
    debugLogs.push("");
    debugLogs.push(`Error: ${error.message}`);
    
    throw new Error(`Hybrid scraping failed: ${error.message}`);
  }
}

