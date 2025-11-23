# Scraper-Customizer Integration

Complete integration between the hybrid scraper and theme customizer, enabling one-click theme imports from any website.

## Overview

The integration allows users to:
1. **Import themes from URLs**: Enter any website URL to scrape and extract its design system
2. **Automatic conversion**: Scraped design tokens are automatically converted to the customizer format
3. **Live preview**: Apply imported themes instantly to see how they look
4. **Full customization**: Fine-tune every aspect of the imported theme

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme Customizer UI                      │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ Action Bar   │  │ Style Controls │  │ Live Preview   │ │
│  │ (Import BTN) │  │ (Edit Tokens)  │  │ (Components)   │ │
│  └──────┬───────┘  └────────────────┘  └────────────────┘ │
└─────────┼──────────────────────────────────────────────────┘
          │
          │ 1. User clicks "Import from URL"
          ▼
┌─────────────────────────────────────────────────────────────┐
│              use-scraper-import Hook                        │
│  • Manages loading/error states                            │
│  • Calls hybrid scraper API                                 │
│  • Converts response to ThemeTokens                         │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ 2. Fetch from API
          ▼
┌─────────────────────────────────────────────────────────────┐
│           /api/hybrid-scrape Endpoint                       │
│  • Captures screenshot                                      │
│  • Runs DOM scraper (Playwright)                            │
│  • Runs Vision AI analysis (LLM)                            │
│  • Merges results intelligently                             │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ 3. Returns ScrapeResult
          ▼
┌─────────────────────────────────────────────────────────────┐
│           scraper-converter Utility                         │
│  • Validates scraper output                                 │
│  • Maps tokens to ThemeTokens format                        │
│  • Applies fallbacks for missing data                       │
│  • Generates theme name from URL                            │
└─────────┬───────────────────────────────────────────────────┘
          │
          │ 4. Returns ThemeTokens
          ▼
┌─────────────────────────────────────────────────────────────┐
│              ThemeContext                                   │
│  • Applies theme to customizer                              │
│  • Sets CSS custom properties                               │
│  • Updates all UI components                                │
└─────────────────────────────────────────────────────────────┘
```

## Features

### 1. Extended Theme Tokens

The `ThemeTokens` interface now supports all fields from the scraper:

```typescript
interface ThemeTokens {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;          // NEW: Focus ring color
    accent?: string;
    accentForeground?: string;
  };
  fonts: {                  // NEW: Replaces typography
    sans: string;           // e.g., "Inter, system-ui, sans-serif"
    serif: string;
    mono: string;
    sizes: {
      body: string;         // e.g., "16px"
      heading: string[];    // [h1, h2, h3] e.g., ["48px", "36px", "24px"]
      caption: string;
    };
  };
  radius: {                 // NEW: Replaces single number
    small: string;          // e.g., "4px"
    medium: string;
    large: string;
  };
  spacing: {                // NEW: Replaces dropdown
    base: string;           // e.g., "4px"
  };
  shadows: {                // NEW: Replaces dropdown
    base: string;           // e.g., "0 1px 3px 0 rgb(0 0 0 / 0.1)"
    large: string;
  };
}
```

### 2. Smart Conversion & Validation

The converter handles edge cases automatically:

- **Invalid colors**: Falls back to defaults
- **Transparent colors**: Uses sensible alternatives
- **Missing fields**: Provides complete defaults
- **Invalid CSS values**: Validates and replaces
- **Incomplete data**: Pads arrays, fills gaps

Example:
```typescript
// Input: Incomplete scraper data
{
  colors: {
    background: "rgba(0, 0, 0, 0)",  // transparent
    primary: "not-a-color",           // invalid
    // ... other required fields missing
  }
}

// Output: Valid ThemeTokens with defaults
{
  colors: {
    background: "#ffffff",  // ✓ fallback
    primary: "#18181b",     // ✓ fallback
    ring: "#18181b",        // ✓ added
    // ... all fields present
  }
}
```

### 3. UI Controls

All new token fields have dedicated UI controls:

#### Colors Tab
- ✅ All existing color pickers
- ✅ **NEW**: Ring color picker (focus ring)

#### Typography Tab
- ✅ **Font Families**: Sans, Serif, Mono (text inputs)
- ✅ **Font Sizes**: Body, H1, H2, H3, Caption (text inputs)
- ❌ Removed: Old heading/body font dropdowns

#### Other Tab
- ✅ **Border Radius**: Small, Medium, Large (text inputs)
- ✅ **Spacing**: Base spacing unit (text input)
- ✅ **Shadows**: Base and Large shadows (text inputs)
- ❌ Removed: Old sliders/dropdowns

### 4. Import Workflow

#### User Flow
1. Open theme customizer
2. Click **"Import from URL"** button in action bar
3. Enter website URL (e.g., `https://stripe.com`)
4. Wait for scraping (shows loading spinner)
5. Theme automatically applies
6. Dialog shows success message
7. Customize further if needed

#### Code Example
```typescript
import { useScraperImport } from "@/lib/hooks/use-scraper-import";
import { useTheme } from "@/lib/contexts/theme-context";

function MyComponent() {
  const { updateTheme } = useTheme();
  const { loading, error, importFromUrl } = useScraperImport();

  const handleImport = async (url: string) => {
    const theme = await importFromUrl(url);
    if (theme) {
      updateTheme(theme);
    }
  };

  return (
    <div>
      {loading && <p>Scraping website...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={() => handleImport("https://example.com")}>
        Import Theme
      </button>
    </div>
  );
}
```

## API Reference

### `useScraperImport()`

React hook for importing themes from URLs or data.

**Returns:**
```typescript
{
  loading: boolean;           // True while scraping
  error: string | null;       // Error message if failed
  theme: ThemeTokens | null;  // Converted theme if successful
  themeName: string | null;   // Generated theme name
  importFromUrl: (url: string) => Promise<ThemeTokens | null>;
  importFromData: (data: any) => Promise<ThemeTokens | null>;
  reset: () => void;
}
```

### `convertScraperToTheme()`

Converts scraper output to `ThemeTokens` format.

**Parameters:**
- `scraperOutput: ScraperOutput` - Output from hybrid scraper

**Returns:**
- `ThemeTokens` - Validated and complete theme tokens

**Example:**
```typescript
const scraperData = await fetch("/api/hybrid-scrape", {
  method: "POST",
  body: JSON.stringify({ url: "https://stripe.com" }),
}).then(res => res.json());

const theme = convertScraperToTheme(scraperData);
// theme is now ready to use in customizer
```

### `generateThemeName()`

Generates a human-readable theme name from a URL.

**Parameters:**
- `url: string` - Website URL

**Returns:**
- `string` - Theme name (e.g., "Stripe", "Shadcn", "Imported Theme")

**Example:**
```typescript
generateThemeName("https://stripe.com") // "Stripe"
generateThemeName("https://www.github.com") // "Github"
generateThemeName("invalid-url") // "Imported Theme"
```

### `validateScraperOutput()`

Type guard to validate scraper output structure.

**Parameters:**
- `data: any` - Data to validate

**Returns:**
- `boolean` - True if valid scraper output

**Example:**
```typescript
const data = await fetchSomewhere();
if (validateScraperOutput(data)) {
  // TypeScript now knows data is ScraperOutput
  const theme = convertScraperToTheme(data);
}
```

## CSS Custom Properties

The `ThemeContext` automatically applies all tokens as CSS variables:

### Colors
```css
--color-background
--color-foreground
--color-primary
--color-primary-foreground
--color-secondary
--color-secondary-foreground
--color-muted
--color-muted-foreground
--color-destructive
--color-destructive-foreground
--color-border
--color-input
--color-ring         /* NEW */
--color-accent
--color-accent-foreground
```

### Fonts
```css
--font-sans          /* NEW */
--font-serif         /* NEW */
--font-mono          /* NEW */
--font-size-body     /* NEW */
--font-size-heading-1 /* NEW */
--font-size-heading-2 /* NEW */
--font-size-heading-3 /* NEW */
--font-size-caption  /* NEW */
```

### Other
```css
--radius-sm          /* NEW: replaces --radius */
--radius-md          /* NEW */
--radius-lg          /* NEW */
--spacing-base       /* NEW */
--shadow-base        /* NEW */
--shadow-lg          /* NEW */
```

## Migration Guide

### From Old ThemeTokens (Pre-Integration)

If you have existing themes or code using the old format:

**Old Format:**
```typescript
{
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    scale: "md"
  },
  radius: 8,
  spacing: "cozy",
  shadows: "normal"
}
```

**New Format:**
```typescript
{
  fonts: {
    sans: "Inter, system-ui, sans-serif",
    serif: "Georgia, serif",
    mono: "Menlo, Monaco, Courier, monospace",
    sizes: {
      body: "16px",
      heading: ["48px", "36px", "24px"],
      caption: "14px"
    }
  },
  radius: {
    small: "6px",
    medium: "8px",
    large: "12px"
  },
  spacing: {
    base: "4px"
  },
  shadows: {
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    large: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  }
}
```

**Migration Steps:**
1. Convert `typography` → `fonts`
2. Convert `radius: number` → `radius: { small, medium, large }`
3. Convert `spacing: string` → `spacing: { base }`
4. Convert `shadows: string` → `shadows: { base, large }`
5. Add `ring` color if missing

See `lib/themes.ts` for examples of migrated preset themes.

## Testing

Run the integration test:

```bash
npm run test:integration
```

Or manually test:
1. Start dev server: `npm run dev`
2. Open customizer page
3. Click "Import from URL"
4. Enter `https://stripe.com` (or any site)
5. Verify theme applies correctly
6. Check all controls work with imported data

## Error Handling

The integration handles errors gracefully:

| Error Type | Behavior |
|------------|----------|
| Invalid URL | Shows error message in dialog |
| Scraping failed | Shows API error message |
| Network error | Shows connection error |
| Invalid data | Uses default values, shows warning |
| Missing fields | Fills with sensible defaults |
| Transparent colors | Falls back to white/black |

## Performance

- **Scraping time**: 5-15 seconds (depends on website)
- **Conversion time**: < 100ms
- **Theme application**: Instant (CSS variables)

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Supported (import may be slower)

## Future Enhancements

Potential improvements:
- [ ] Save imported themes as presets
- [ ] Compare multiple scraped themes
- [ ] Export themes as code/JSON
- [ ] Batch import from multiple URLs
- [ ] Theme history/undo
- [ ] AI-powered theme suggestions
- [ ] Dark mode auto-detection

## Related Documentation

- [Hybrid Scraper](./HYBRID_SCRAPER.md) - Core scraping system
- [Theme System](../lib/types/theme.ts) - Type definitions
- [Customizer UI](../components/customizer/) - UI components

## Support

For issues or questions:
1. Check error messages in the import dialog
2. Verify URL is accessible
3. Check browser console for details
4. Review scraper output in Network tab

