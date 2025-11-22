# DevUX Scraper Implementation

## Overview

The DevUX Scraper is fully implemented according to the `webscrape.md` specification. It analyzes websites and extracts design tokens, component patterns, and layout structures.

## Architecture

### File Structure

```
lib/scraper/
├── index.ts                 # Main orchestrator
├── types.ts                 # TypeScript interfaces
├── browser.ts               # Playwright integration
├── tokens.ts                # Token extraction coordinator
├── color-normalizer.ts      # Color clustering with culori + k-means
├── spacing-normalizer.ts    # Spacing base detection
├── radius-normalizer.ts     # Border radius normalization
├── shadow-normalizer.ts     # Shadow parsing and normalization
├── component-extractor.ts   # Component signature grouping
└── layout-extractor.ts      # Layout section detection
```

## Implementation Details

### 1. Fetch and Render (`browser.ts`)

- Uses Playwright headless Chromium
- Waits for network idle
- Extracts computed styles for all visible elements
- Returns `StyledNode[]` with geometry and styles

### 2. Token Extraction

#### Color Normalization (`color-normalizer.ts`)
- ✅ Converts colors to LAB color space using `culori`
- ✅ Clusters colors using k-means from `ml-kmeans`
- ✅ Picks canonical color per cluster (closest to centroid)
- ✅ Merges similar clusters (LAB distance < 3)
- ✅ Assigns semantic roles based on frequency

#### Spacing Normalization (`spacing-normalizer.ts`)
- ✅ Collects padding/margin values
- ✅ Finds most common increment using GCD
- ✅ Snaps values to multiples of base

#### Radius Normalization (`radius-normalizer.ts`)
- ✅ Collects border-radius values
- ✅ Uses quartiles to determine small/medium/large
- ✅ Filters and deduplicates values

#### Shadow Normalization (`shadow-normalizer.ts`)
- ✅ Parses box-shadow strings
- ✅ Groups by blur + spread signature
- ✅ Identifies most common (base) and largest (large) shadows

### 3. Component Pattern Extraction (`component-extractor.ts`)

- ✅ Detects buttons, cards, and nav items
- ✅ Builds signatures from tag + classes + role
- ✅ Groups by signature
- ✅ Keeps signatures with ≥3 matches
- ✅ Extracts canonical styles using median/mode

### 4. Layout Extraction (`layout-extractor.ts`)

- ✅ Detects large blocks (>80% viewport width, >100px height)
- ✅ Deduplicates overlapping sections
- ✅ Classifies sections: Header, Hero, Gallery, Features, Footer, etc.
- ✅ Returns ordered sequence

### 5. Debug Logging

- ✅ Timestamps and URL
- ✅ Step-by-step logs for each phase
- ✅ Cluster counts and token values
- ✅ Error tracking

## API

### Endpoint: `POST /api/scrape`

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "tokens": { ... },
  "components": { ... },
  "layouts": { ... },
  "debug": { ... }
}
```

## Usage

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

### Running the Scraper

1. Start the development server:
```bash
npm run dev
```

2. Navigate to:
```
http://localhost:3000/information-scraper
```

3. Enter a URL and click "Analyze UI"

4. View results in tabs or download JSON

## Output Files Structure

### devux.tokens.json
```json
{
  "colors": {
    "background": "#ffffff",
    "foreground": "#000000",
    "primary": "#...",
    "...": "..."
  },
  "fonts": {
    "sans": "Inter, sans-serif",
    "sizes": { "body": "16px", ... }
  },
  "radius": { "small": "4px", ... },
  "spacing": { "base": "4px" },
  "shadows": { "base": "...", "large": "..." }
}
```

### devux.components.json
```json
{
  "buttons": [
    {
      "background": "#000",
      "color": "#fff",
      "padding": "12px 24px",
      "radius": "8px",
      "shadow": "...",
      "frequency": 15
    }
  ],
  "cards": [...],
  "navItems": [...]
}
```

### devux.layouts.json
```json
{
  "sections": ["Header", "Hero", "Features", "Pricing", "Footer"]
}
```

### devux.debug.log.json
```json
{
  "url": "https://example.com",
  "timestamp": "2025-11-22T...",
  "logs": ["Starting scrape...", "Collected 500 nodes", ...],
  "errors": []
}
```

## Known Limitations

As per the spec:
- Heavy client-side JS may not fully render
- Lazy-loaded content may be missed
- Single viewport analysis (desktop)
- No hover/interactive state capture
- CSP may block some requests

## Future Enhancements

- Multiple viewport sizes
- Hover state detection
- More sophisticated component detection
- Export to Figma/Sketch formats
- Real-time preview of extracted tokens

