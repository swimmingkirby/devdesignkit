# Hybrid Scraper

The **Hybrid Scraper** combines DOM-based scraping with AI vision analysis to provide the most comprehensive design system extraction.

## Overview

The hybrid approach leverages the strengths of both scraping methods:

- **DOM Scraping**: Provides precise CSS values, exact measurements, and accurate structure
- **Vision AI**: Offers semantic understanding, visual pattern recognition, and layout comprehension
- **Intelligent Merging**: Combines both results to produce the most complete and accurate output

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Hybrid Scraper                         │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
  ┌─────────────────┐           ┌──────────────────┐
  │  DOM Scraper    │           │  Vision AI       │
  │  (Playwright)   │           │  (OpenAI GPT-4o) │
  └─────────────────┘           └──────────────────┘
            │                               │
            │    1. Precise CSS values      │    1. Visual understanding
            │    2. Exact measurements      │    2. Semantic patterns
            │    3. DOM structure           │    3. Layout comprehension
            │                               │
            └───────────────┬───────────────┘
                            ▼
                  ┌─────────────────┐
                  │ Intelligent     │
                  │ Merger          │
                  └─────────────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │ Merged Results  │
                  └─────────────────┘
```

## Features

### ✓ Dual Analysis Pipeline
- Runs both DOM scraping and vision AI analysis in parallel
- Captures a screenshot for vision analysis while extracting DOM data
- Handles failures gracefully - if one method fails, the other still works

### ✓ Intelligent Merging Strategies

Three merge strategies are available:

1. **`best-of-both`** (Default & Recommended)
   - Uses DOM for precise CSS values
   - Uses Vision AI for semantic understanding
   - Intelligently combines overlapping sections
   - Adds unique insights from each method

2. **`dom-priority`**
   - Prioritizes DOM scraping results
   - Uses Vision AI to fill gaps
   - Best when you trust the DOM structure

3. **`vision-priority`**
   - Prioritizes Vision AI analysis
   - Uses DOM to supplement with precise values
   - Best for visually complex layouts

### ✓ Individual Results Tracking
- Returns merged results AND individual results from each scraper
- Allows comparison between DOM and Vision AI outputs
- Provides metadata about the scraping process

### ✓ Configurable Options
```typescript
{
  enableDOMScraping: true,     // Enable DOM-based scraping
  enableVisionAI: true,         // Enable vision AI analysis
  mergeStrategy: "best-of-both", // Merge strategy
  screenshot: {
    fullPage: true,             // Capture full page
    viewport: {
      width: 1920,
      height: 1080
    }
  }
}
```

## Usage

### API Endpoint

**POST** `/api/hybrid-scrape`

**Request:**
```json
{
  "url": "https://example.com",
  "options": {
    "enableDOMScraping": true,
    "enableVisionAI": true,
    "mergeStrategy": "best-of-both"
  }
}
```

**Response:**
```json
{
  "tokens": { ... },
  "components": { ... },
  "layouts": { ... },
  "debug": { ... },
  "individual": {
    "dom": { ... },    // Individual DOM scraper results
    "vision": { ... }  // Individual Vision AI results
  },
  "metadata": {
    "strategy": "best-of-both",
    "domScrapingEnabled": true,
    "visionAIEnabled": true,
    "screenshotTaken": true
  }
}
```

### Web UI

Navigate to `/information-scraper` and select the **"Hybrid (Best)"** tab:

1. Enter a website URL
2. Click "Analyze URL"
3. View merged results and individual outputs from each scraper
4. Download complete JSON artifacts

### Programmatic Usage

```typescript
import { hybridScrape } from "@/lib/hybrid-scraper/index";

const result = await hybridScrape("https://example.com", {
  enableDOMScraping: true,
  enableVisionAI: true,
  mergeStrategy: "best-of-both",
  screenshot: {
    fullPage: true,
    viewport: { width: 1920, height: 1080 }
  }
});

console.log("Merged tokens:", result.tokens);
console.log("DOM-only tokens:", result.individual.dom?.tokens);
console.log("Vision-only tokens:", result.individual.vision?.tokens);
```

## Merge Logic Details

### Token Merging
- **Colors**: DOM values preferred (more precise hex values)
- **Fonts**: DOM font-family values used
- **Radius**: DOM measurements preferred
- **Spacing**: DOM spacing base used
- **Shadows**: DOM shadow values preferred
- Vision AI supplements with semantic color understanding

### Component Merging
- DOM components prioritized (signature-based detection is precise)
- Vision AI components added if unique
- Deduplication based on style similarity
- Vision AI adds categories like forms, feedback, data display

### Layout Merging
- DOM provides accurate positioning and measurements
- Vision AI provides semantic section types
- Overlapping sections merged with DOM position + Vision AI semantics
- Non-overlapping sections from both included
- Final sections sorted by Y position (top to bottom)

## Performance

| Metric | DOM Only | Vision AI Only | Hybrid |
|--------|----------|----------------|--------|
| **Accuracy** | High (CSS) | Medium (Visual) | **Highest** |
| **Completeness** | Medium | Medium | **High** |
| **Speed** | ~3-5s | ~20-30s | ~20-30s |
| **Cost** | Free | $0.003/page | $0.003/page |
| **Offline** | ✓ Yes | ✗ No | Partial* |

*Hybrid works offline with DOM-only mode if Vision AI is unavailable.

## Error Handling

The hybrid scraper is resilient:

1. **DOM Scraping Fails**: Falls back to Vision AI only
2. **Vision AI Fails**: Falls back to DOM only
3. **Screenshot Fails**: Skips Vision AI, uses DOM only
4. **Both Fail**: Returns error with debug information

## Requirements

### DOM Scraping (Always Available)
- Playwright
- Chromium browser

### Vision AI (Optional)
- OpenAI API key (`OPENAI_API_KEY` environment variable)
- Internet connection
- ~$0.003 per page analyzed

## When to Use Each Mode

### Use Hybrid Mode When:
- ✓ You want the most comprehensive results
- ✓ You have an OpenAI API key
- ✓ Accuracy is critical
- ✓ You're analyzing production websites

### Use DOM-Only When:
- ✓ You need fast results
- ✓ You don't have an API key
- ✓ You need offline capability
- ✓ You trust the DOM structure

### Use Vision-Only When:
- ✓ You have screenshots but not URLs
- ✓ The site is behind authentication
- ✓ The site blocks automated scraping
- ✓ You want visual pattern recognition

## Limitations

1. **Vision AI Depends on Screenshot Quality**: Blurry or low-resolution screenshots reduce accuracy
2. **API Costs**: Vision AI analysis incurs OpenAI API costs
3. **Speed**: Vision AI adds 15-25 seconds to analysis time
4. **Rate Limits**: OpenAI API has rate limits (default: 500 requests/day)

## Future Improvements

- [ ] Support for other vision models (Anthropic Claude, Google Gemini)
- [ ] Caching of screenshot analysis
- [ ] Parallel processing of DOM and Vision AI
- [ ] Confidence scoring for merged results
- [ ] Visual diff between DOM and Vision AI results
- [ ] User-adjustable merge preferences
- [ ] Batch processing support

## See Also

- [DOM Scraper Documentation](./scraper-implementation.md)
- [Image Analysis Documentation](./IMAGE_ANALYSIS.md)
- [API Documentation](./API.md)

