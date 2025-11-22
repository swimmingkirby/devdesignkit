# Hybrid Scraper

Combines DOM-based scraping with AI vision analysis for comprehensive design extraction.

## Quick Start

```typescript
import { hybridScrape } from "@/lib/hybrid-scraper/index";

// Basic usage
const result = await hybridScrape("https://example.com");

// With options
const result = await hybridScrape("https://example.com", {
  enableDOMScraping: true,
  enableVisionAI: true,
  mergeStrategy: "best-of-both",
  screenshot: {
    fullPage: true,
    viewport: { width: 1920, height: 1080 }
  }
});
```

## Files

- **`index.ts`** - Main orchestrator, coordinates both scrapers and merging
- **`screenshot.ts`** - Screenshot capture using Playwright
- **`merger.ts`** - Intelligent merging logic for tokens, components, and layouts

## How It Works

1. **DOM Scraping Phase**
   - Uses Playwright to extract DOM structure
   - Computes styles for all visible elements
   - Extracts precise CSS values and measurements

2. **Screenshot Phase**
   - Captures full-page screenshot
   - Converts to base64 for Vision AI

3. **Vision AI Phase**
   - Sends screenshot to OpenAI GPT-4o
   - Extracts design tokens, components, and layouts
   - Provides semantic understanding

4. **Merging Phase**
   - Intelligently combines both results
   - Uses configurable merge strategy
   - Removes duplicates and overlaps

## Merge Strategies

### `best-of-both` (Default)
- DOM for precise CSS values
- Vision AI for semantic understanding
- Overlapping sections merged intelligently

### `dom-priority`
- Prioritize DOM results
- Use Vision AI to fill gaps
- Best when DOM structure is reliable

### `vision-priority`
- Prioritize Vision AI results
- Use DOM to supplement
- Best for visually complex layouts

## API

### `hybridScrape(url, options)`

**Parameters:**
- `url` - Website URL to scrape
- `options` - Configuration options (optional)
  - `enableDOMScraping` - Enable DOM scraping (default: true)
  - `enableVisionAI` - Enable Vision AI (default: true)
  - `mergeStrategy` - Merge strategy (default: "best-of-both")
  - `screenshot` - Screenshot options

**Returns:**
```typescript
{
  tokens: Tokens;
  components: Components;
  layouts: Layouts;
  debug: DebugLog;
  individual: {
    dom?: ScrapeResult;
    vision?: ScrapeResult;
  };
  metadata: {
    strategy: string;
    domScrapingEnabled: boolean;
    visionAIEnabled: boolean;
    screenshotTaken: boolean;
  };
}
```

## Error Handling

The hybrid scraper handles errors gracefully:

- If DOM scraping fails → Falls back to Vision AI only
- If Vision AI fails → Falls back to DOM only
- If both fail → Throws error with debug information

## Requirements

- **DOM Scraping**: Playwright (always available)
- **Vision AI**: OpenAI API key (optional)

## See Also

- [Full Documentation](../../docs/HYBRID_SCRAPER.md)
- [DOM Scraper](../scraper/README.md)
- [Vision AI Analyzer](../image-analyzer/README.md)

