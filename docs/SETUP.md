# DevUX Scraper - Setup Guide

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Playwright (for browser automation)
- culori (for color manipulation)
- ml-kmeans (for clustering)
- shadcn/ui components
- Tailwind CSS

### 2. Install Playwright Browsers

Playwright requires browser binaries to run:

```bash
npx playwright install chromium
```

**Note:** This downloads ~200MB of browser binaries. Only Chromium is required for the scraper.

If you want to install all browsers (optional):
```bash
npx playwright install
```

### 3. Verify Installation

Check that everything is installed correctly:

```bash
# Check Node version
node --version  # Should be 18.17 or higher

# Check if Playwright is installed
npx playwright --version

# Verify dependencies
npm list playwright culori ml-kmeans
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:
- Main page: [http://localhost:3000](http://localhost:3000)
- Scraper page: [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper)

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Using the DevUX Scraper

1. Navigate to [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper)

2. Enter a URL in the input field (e.g., `https://stripe.com`, `https://github.com`)

3. Click **"Analyze UI"**

4. Wait for the analysis to complete (typically 10-30 seconds)

5. View results in the tabs:
   - **Tokens** - Colors, fonts, spacing, radius, shadows
   - **Components** - Detected buttons, cards, nav items
   - **Layouts** - Section structure
   - **Debug Log** - Detailed analysis logs

6. Click **"Download JSON"** to save all artifacts

## Testing with Different URLs

### Recommended Test URLs

Good websites to test with:
- `https://stripe.com` - Modern design system
- `https://github.com` - Clean, consistent UI
- `https://vercel.com` - Excellent typography
- `https://linear.app` - Minimalist design
- `https://tailwindcss.com` - Utility-first CSS

### URLs to Avoid (Known Limitations)

- Heavy single-page apps with lazy loading
- Sites with aggressive CSP (Content Security Policy)
- Sites requiring authentication
- Sites with anti-bot protection

## Troubleshooting

### "Module not found" errors

If you see errors about missing modules:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Playwright browser not found

```bash
npx playwright install chromium --force
```

### Timeout errors when scraping

Some websites take longer to load. The scraper waits up to 30 seconds. If you need more time, edit `lib/scraper/browser.ts`:

```typescript
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }); // 60 seconds
```

### Memory issues

Large websites may cause memory issues. Close other applications or increase Node's memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### CSP (Content Security Policy) Blocks

Some websites block browser automation. This is expected and cannot be easily bypassed.

## Development

### Project Structure

```
lib/scraper/
├── index.ts                 # Main orchestrator
├── browser.ts               # Playwright integration
├── tokens.ts                # Token extraction
├── color-normalizer.ts      # Color clustering
├── spacing-normalizer.ts    # Spacing detection
├── radius-normalizer.ts     # Radius normalization
├── shadow-normalizer.ts     # Shadow parsing
├── component-extractor.ts   # Component detection
└── layout-extractor.ts      # Layout analysis
```

### Adding New Features

1. Create a new file in `lib/scraper/`
2. Export functions following the existing pattern
3. Update `lib/scraper/index.ts` to use the new feature
4. Add types to `lib/scraper/types.ts`

### Running Tests

Currently, the project doesn't have automated tests. To test:

1. Use the UI at `/information-scraper`
2. Compare output with manual inspection of target site
3. Check the debug logs for errors

## API Usage

### Direct API Calls

You can call the scraper API directly:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Response format:
```json
{
  "tokens": { ... },
  "components": { ... },
  "layouts": { ... },
  "debug": { ... }
}
```

### Using in Code

```typescript
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data.tokens);
```

## Performance

- Average scrape time: 10-30 seconds
- Memory usage: ~200-500MB during scrape
- Network: Downloads full page + assets
- CPU: High during clustering phase

## Deployment

### Vercel

The project is ready for Vercel deployment. Note:
- Playwright requires Vercel Pro plan (for extended execution time)
- Set `maxDuration: 60` in API route

### Other Platforms

For platforms that support long-running functions:
- Increase timeout limits
- Ensure Playwright can install browsers
- Check memory limits (recommend 1GB+)

## Support

For issues or questions:
1. Check `docs/scraper-implementation.md` for implementation details
2. Review `docs/webscrape.md` for the specification
3. Check the debug logs in the UI for specific errors

## License

MIT

