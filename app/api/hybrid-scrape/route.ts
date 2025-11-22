import { NextRequest, NextResponse } from "next/server";
import { hybridScrape, HybridScraperOptions } from "@/lib/hybrid-scraper/index";

/**
 * POST /api/hybrid-scrape
 * 
 * Hybrid scraper API endpoint
 * Combines DOM-based scraping with vision AI analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, options = {} } = body as { url: string; options?: HybridScraperOptions };
    
    // Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }
    
    // Check if OpenAI API key is available (for vision AI)
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    
    // Auto-configure options based on available resources
    const scraperOptions: HybridScraperOptions = {
      enableDOMScraping: true, // Always enable DOM scraping (most reliable)
      enableVisionAI: options.enableVisionAI !== false && hasOpenAIKey, // Enable if API key exists
      mergeStrategy: options.mergeStrategy || "best-of-both",
      screenshot: options.screenshot || {
        fullPage: true,
        viewport: { width: 1920, height: 1080 },
      },
    };
    
    // Log configuration
    console.log("Hybrid scraper configuration:", {
      url,
      domScraping: scraperOptions.enableDOMScraping,
      visionAI: scraperOptions.enableVisionAI,
      strategy: scraperOptions.mergeStrategy,
    });
    
    // If vision AI is requested but no API key, warn user
    if (options.enableVisionAI && !hasOpenAIKey) {
      console.warn(
        "Vision AI requested but OPENAI_API_KEY not found. Falling back to DOM-only scraping."
      );
    }
    
    // Run hybrid scraper
    const result = await hybridScrape(url, scraperOptions);
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error: any) {
    console.error("Hybrid scrape API error:", error);
    
    return NextResponse.json(
      {
        error: error.message || "Hybrid scraping failed",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/hybrid-scrape
 * 
 * Return API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: "Hybrid Scraper API",
    version: "1.0.0",
    description: "Combines DOM-based scraping with vision AI analysis for comprehensive design extraction",
    endpoints: {
      POST: {
        description: "Scrape a website using hybrid approach",
        body: {
          url: "string (required) - The URL to scrape",
          options: {
            enableDOMScraping: "boolean (optional, default: true) - Enable DOM-based scraping",
            enableVisionAI: "boolean (optional, default: auto-detect) - Enable vision AI analysis",
            mergeStrategy: "string (optional, default: 'best-of-both') - Merge strategy: 'dom-priority', 'vision-priority', or 'best-of-both'",
            screenshot: {
              fullPage: "boolean (optional, default: true) - Capture full page screenshot",
              viewport: {
                width: "number (optional, default: 1920)",
                height: "number (optional, default: 1080)",
              },
            },
          },
        },
        response: {
          tokens: "Design tokens (colors, fonts, radius, spacing, shadows)",
          components: "UI components (buttons, cards, nav items)",
          layouts: "Layout structure (sections)",
          debug: "Debug information and logs",
          individual: {
            dom: "Individual results from DOM scraper",
            vision: "Individual results from vision AI",
          },
          metadata: {
            strategy: "Merge strategy used",
            domScrapingEnabled: "Whether DOM scraping was enabled",
            visionAIEnabled: "Whether vision AI was enabled",
            screenshotTaken: "Whether screenshot was captured",
          },
        },
      },
    },
    features: [
      "✓ DOM-based scraping for precise CSS values",
      "✓ Vision AI analysis for visual understanding",
      "✓ Intelligent merging of results",
      "✓ Configurable merge strategies",
      "✓ Graceful fallback when one method fails",
      "✓ Individual results from each scraper",
      "✓ Comprehensive debug logs",
    ],
    requirements: {
      dom: "Playwright (always available)",
      visionAI: "OPENAI_API_KEY environment variable (optional)",
    },
  });
}

