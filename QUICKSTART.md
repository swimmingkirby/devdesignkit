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

### Option 1: URL Scraping (Recommended)

1. Open [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper)
2. Stay on the **"URL Scraper"** tab
3. Enter a URL (e.g., `https://stripe.com`)
4. Click **"Analyze URL"**
5. Wait ~15 seconds
6. View results in tabs or download JSON

### Option 2: Image Analysis (Experimental)

1. Get a free Hugging Face API token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create `.env.local` file: `HUGGINGFACE_API_TOKEN=hf_xxx...`
3. Restart dev server
4. Switch to **"Image Analyzer"** tab
5. Upload a website screenshot (JPEG/PNG)
6. Click **"Analyze Image"**
7. Wait ~30-60 seconds

**Note:** URL scraping is more accurate and doesn't require an API token.

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
- **Image Analysis Guide:** See [docs/IMAGE_ANALYSIS.md](docs/IMAGE_ANALYSIS.md)
- **API Documentation:** See [docs/API.md](docs/API.md)
- **Implementation Details:** See [docs/scraper-implementation.md](docs/scraper-implementation.md)

---

**Built with:** Next.js 15 • React 19 • Playwright • TypeScript • Tailwind CSS • shadcn/ui

