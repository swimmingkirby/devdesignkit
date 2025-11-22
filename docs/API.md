# DevUX Scraper API Documentation

## Overview

The DevUX Scraper provides a REST API for analyzing websites and extracting design system artifacts.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### POST /api/scrape

Analyze a website and extract design tokens, components, and layouts.

#### Request

**URL:** `/api/scrape`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Body:**
```json
{
  "url": "https://example.com"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | Yes | The full URL of the website to analyze (must include protocol) |

#### Response

**Status Code:** `200 OK`  
**Content-Type:** `application/json`

**Success Response:**
```json
{
  "tokens": {
    "colors": {
      "background": "#ffffff",
      "foreground": "#000000",
      "primary": "#0070f3",
      "primaryForeground": "#ffffff",
      "secondary": "#f1f5f9",
      "secondaryForeground": "#0f172a",
      "muted": "#f1f5f9",
      "mutedForeground": "#64748b",
      "destructive": "#ef4444",
      "destructiveForeground": "#ffffff",
      "border": "#e2e8f0",
      "input": "#e2e8f0",
      "ring": "#0070f3"
    },
    "fonts": {
      "sans": "Inter, system-ui, sans-serif",
      "serif": "Georgia, serif",
      "mono": "Menlo, Monaco, monospace",
      "sizes": {
        "body": "16px",
        "heading": ["32px", "24px", "20px"],
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
      "base": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "large": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }
  },
  "components": {
    "buttons": [
      {
        "background": "rgb(0, 112, 243)",
        "color": "rgb(255, 255, 255)",
        "padding": "12px 24px",
        "radius": "8px",
        "shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "frequency": 15
      }
    ],
    "cards": [
      {
        "background": "rgb(255, 255, 255)",
        "color": "rgb(0, 0, 0)",
        "padding": "24px",
        "radius": "16px",
        "shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        "frequency": 8
      }
    ],
    "navItems": [
      {
        "background": "transparent",
        "color": "rgb(100, 116, 139)",
        "padding": "8px 16px",
        "radius": "4px",
        "shadow": "none",
        "frequency": 12
      }
    ]
  },
  "layouts": {
    "sections": [
      "Header",
      "Hero",
      "Features",
      "Pricing",
      "Footer"
    ]
  },
  "debug": {
    "url": "https://example.com",
    "timestamp": "2025-11-22T15:30:00.000Z",
    "logs": [
      "Starting scrape of https://example.com",
      "Timestamp: 2025-11-22T15:30:00.000Z",
      "=== Phase 1: Fetch and Render ===",
      "Launching browser...",
      "Navigating to https://example.com...",
      "Extracting styles...",
      "Extracted 1234 nodes.",
      "=== Phase 2: Token Extraction ===",
      "Collecting raw style values...",
      "Collected 1234 background colors",
      "Normalizing colors using k-means clustering...",
      "Created 8 color clusters",
      "=== Phase 3: Component Pattern Extraction ===",
      "Found 3 button patterns",
      "=== Phase 4: Layout Extraction ===",
      "Detected sections: Header, Hero, Features, Footer",
      "=== Scraping Complete ==="
    ],
    "errors": []
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid input

```json
{
  "error": "URL is required"
}
```

```json
{
  "error": "Invalid URL provided"
}
```

**500 Internal Server Error** - Scraping failed

```json
{
  "error": "Scraping failed",
  "details": [
    "Navigation timeout of 30000 ms exceeded",
    "Make sure the URL is accessible"
  ]
}
```

```json
{
  "error": "Internal server error",
  "details": "Error message here"
}
```

## Data Types

### Tokens

Design tokens extracted from the website.

**Structure:**
```typescript
interface Tokens {
  colors: ColorTokens;
  fonts: FontTokens;
  radius: RadiusTokens;
  spacing: SpacingTokens;
  shadows: ShadowTokens;
}
```

### Components

Detected UI component patterns.

**Structure:**
```typescript
interface Components {
  buttons: ComponentStyle[];
  cards: ComponentStyle[];
  navItems: ComponentStyle[];
}

interface ComponentStyle {
  background: string;
  color: string;
  padding: string;
  radius: string;
  shadow: string;
  frequency: number; // How many times this pattern appears
}
```

### Layouts

High-level page structure.

**Structure:**
```typescript
interface Layouts {
  sections: string[]; // Ordered list of section types
}
```

Common section types:
- Header
- Navigation
- Hero
- Features
- Gallery
- Pricing
- Testimonials
- CTA (Call to Action)
- Footer

### Debug Log

Detailed execution logs for debugging.

**Structure:**
```typescript
interface DebugLog {
  url: string;
  timestamp: string; // ISO 8601 format
  logs: string[];    // Step-by-step execution logs
  errors: string[];  // Any errors encountered
}
```

## Rate Limits

Currently, there are no rate limits on the API. However:
- Each request takes 10-30 seconds to complete
- Maximum timeout is 60 seconds
- Concurrent requests may increase memory usage

## Best Practices

### 1. Validate URLs

Always validate URLs before sending to the API:

```typescript
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}
```

### 2. Handle Timeouts

Set appropriate timeout on your client:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 65000);

try {
  const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    signal: controller.signal
  });
  
  // Process response
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timed out');
  }
} finally {
  clearTimeout(timeoutId);
}
```

### 3. Cache Results

Cache results for frequently analyzed URLs:

```typescript
const cache = new Map<string, ScrapeResult>();

async function scrapeWithCache(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const result = await scrape(url);
  cache.set(url, result);
  return result;
}
```

### 4. Check Debug Logs

Always check the debug logs for potential issues:

```typescript
const data = await response.json();

if (data.debug.errors.length > 0) {
  console.warn('Scraping completed with errors:', data.debug.errors);
}

// Check if extraction was successful
const hasValidTokens = data.tokens.colors.background !== '#ffffff';
```

## Examples

### cURL

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}'
```

### JavaScript/TypeScript

```typescript
async function analyzeWebsite(url: string) {
  const response = await fetch('/api/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Usage
try {
  const result = await analyzeWebsite('https://github.com');
  console.log('Primary color:', result.tokens.colors.primary);
  console.log('Button count:', result.components.buttons.length);
} catch (error) {
  console.error('Failed to analyze:', error.message);
}
```

### Python

```python
import requests
import json

def scrape_website(url):
    response = requests.post(
        'http://localhost:3000/api/scrape',
        headers={'Content-Type': 'application/json'},
        json={'url': url},
        timeout=65
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error {response.status_code}: {response.json()}")

# Usage
try:
    result = scrape_website('https://vercel.com')
    print(f"Primary color: {result['tokens']['colors']['primary']}")
    print(f"Sections: {', '.join(result['layouts']['sections'])}")
except Exception as e:
    print(f"Error: {e}")
```

## Limitations

1. **Timeout:** Maximum 60 seconds per request
2. **Client-side rendering:** Heavy JavaScript sites may not fully render
3. **Authentication:** Cannot scrape pages requiring login
4. **CSP:** Some sites block automation tools
5. **Lazy loading:** Content loaded on scroll may be missed
6. **Viewport:** Only desktop viewport is analyzed
7. **Interactive states:** Hover/focus states are not captured

## Support

For issues or feature requests, refer to:
- [Setup Guide](./SETUP.md)
- [Implementation Details](./scraper-implementation.md)
- [Specification](./webscrape.md)

