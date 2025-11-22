# 🚀 DevUX Scraper - Quick Start

Get the scraper running in 3 steps!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Install Playwright Browsers

```bash
npx playwright install chromium
```

## Step 3: Start the Dev Server

```bash
npm run dev
```

## Use the Scraper

1. Open [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper)
2. Enter a URL (e.g., `https://stripe.com`)
3. Click **"Analyze UI"**
4. Wait ~15 seconds
5. View results in tabs or download JSON

## Test URLs

Try these for best results:
- `https://stripe.com`
- `https://github.com`
- `https://vercel.com`
- `https://linear.app`
- `https://tailwindcss.com`

## What You Get

The scraper extracts:

✅ **Design Tokens**
- Colors (background, foreground, primary, etc.)
- Fonts (sans, serif, mono + sizes)
- Radius (small, medium, large)
- Spacing (base unit)
- Shadows (base, large)

✅ **Components**
- Button patterns
- Card patterns  
- Navigation items

✅ **Layouts**
- Section sequence (Header, Hero, Features, Footer, etc.)

✅ **Debug Log**
- Complete analysis trail
- Clustering details
- Error tracking

## Need Help?

- **Setup Issues:** See [docs/SETUP.md](docs/SETUP.md)
- **API Documentation:** See [docs/API.md](docs/API.md)
- **Implementation Details:** See [docs/scraper-implementation.md](docs/scraper-implementation.md)

---

**Built with:** Next.js 15 • React 19 • Playwright • TypeScript • Tailwind CSS • shadcn/ui

