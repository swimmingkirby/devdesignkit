# Dev Design Kit

A Next.js project configured with shadcn/ui and Tailwind CSS, featuring a powerful DevUX Scraper for extracting design systems from any website.

## Features

- ⚡ **Next.js 15** - React framework for production
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 📘 **TypeScript** - Type-safe development
- 🎯 **ESLint** - Code quality and consistency
- 🔍 **DevUX Scraper** - Extract design tokens, components, and layouts from any website

## DevUX Scraper

The DevUX Scraper analyzes websites and generates machine-readable design artifacts:

- **Tokens** (`devux.tokens.json`) - Colors, fonts, radius, spacing, shadows
- **Components** (`devux.components.json`) - Repeated UI patterns (buttons, cards, nav items)
- **Layouts** (`devux.layouts.json`) - Section sequence (header, hero, features, footer)
- **Debug Log** (`devux.debug.log.json`) - Full analysis trail

### Scraper Features

✅ **URL Scraping** - DOM-based analysis via Playwright (most accurate)  
✅ **Image Analysis** - AI vision-based analysis via Hugging Face LLM (experimental)  
✅ **Color Normalization** - LAB color space clustering with k-means  
✅ **Spacing Detection** - Automatic base unit detection  
✅ **Radius Extraction** - Small/medium/large classification  
✅ **Shadow Parsing** - Base and large shadow tokens  
✅ **Component Detection** - Signature-based pattern matching  
✅ **Layout Analysis** - Semantic section detection with shadcn/ui optimization

See [docs/scraper-implementation.md](docs/scraper-implementation.md) for detailed implementation docs.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

The URL scraper requires Playwright browsers:

```bash
npx playwright install chromium
```

### Environment Setup (Optional - For Image Analysis)

To use the image-based layout analysis feature, you'll need an OpenAI API key:

1. Sign up at [OpenAI Platform](https://platform.openai.com/signup)
2. Get your API key at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Create a `.env.local` file in the project root:

```bash
# .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx

# Optional: Choose your model (defaults to gpt-4o-mini)
# OPENAI_MODEL=gpt-4o        # Most capable (~$0.005/image)
# OPENAI_MODEL=gpt-4o-mini   # Budget friendly (~$0.0003/image)
```

**Note:** The image analysis feature uses GPT-4o-mini by default (~$0.0003 per image). URL scraping works without any API key.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Use the Scraper

Navigate to [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper) to analyze any website's design system.

**Two Analysis Modes:**
- **URL Scraper** - Enter a website URL for DOM-based analysis (most accurate, no API key needed)
- **Image Analyzer** - Upload a screenshot for AI vision-based analysis (requires Hugging Face API token)

Need help?
- Setup: [docs/SETUP.md](docs/SETUP.md)
- Hugging Face integration: [docs/HF_INTEGRATION.md](docs/HF_INTEGRATION.md)
- Image workflow: [docs/IMAGE_ANALYSIS.md](docs/IMAGE_ANALYSIS.md)

## Adding shadcn/ui Components

To add shadcn/ui components to your project, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── information-scraper/     # Scraper page
│   └── api/
│       └── scrape/              # Scraper API endpoint
├── components/                   # React components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities
│   ├── utils.ts                 # cn() utility
│   ├── scraper/                 # URL scraper implementation
│   │   ├── index.ts             # Main orchestrator
│   │   ├── browser.ts           # Playwright integration
│   │   ├── tokens.ts            # Token extraction
│   │   ├── color-normalizer.ts  # Color clustering
│   │   ├── spacing-normalizer.ts
│   │   ├── radius-normalizer.ts
│   │   ├── shadow-normalizer.ts
│   │   ├── component-extractor.ts
│   │   └── layout-extractor.ts
│   └── image-analyzer/          # Image analysis via LLM
│       ├── index.ts             # Main orchestrator
│       ├── huggingface-client.ts # HF API integration
│       ├── token-parser.ts      # Token extraction from LLM
│       ├── component-parser.ts  # Component identification
│       ├── layout-parser.ts     # Layout structure parsing
│       └── parsers/             # JSON extraction & normalization
├── docs/                        # Documentation
│   ├── webscrape.md            # Scraper specification
│   └── scraper-implementation.md
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── postcss.config.mjs           # PostCSS configuration
```

## Scraper API

### POST `/api/scrape` - URL Analysis

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "tokens": { "colors": {...}, "fonts": {...}, ... },
  "components": { "buttons": [...], "cards": [...], ... },
  "layouts": { "sections": [...] },
  "debug": { "url": "...", "logs": [...], "errors": [...] }
}
```

### POST `/api/analyze-image` - Image Analysis

**Request:**
```
Content-Type: multipart/form-data
Body: FormData with "image" field (JPEG, PNG, WebP, GIF - max 10MB)
```

**Response:**
```json
{
  "tokens": { "colors": {...}, "fonts": {...}, ... },
  "components": { "buttons": [...], "cards": [...], ... },
  "layouts": { "sections": [...] },
  "debug": { "url": "image-upload", "logs": [...], "errors": [...] }
}
```

## Technologies

- **Next.js 15** - App Router, Server Components, API Routes
- **React 19** - Latest React features
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first styling
- **shadcn/ui** - Component library
- **Playwright** - Browser automation for URL scraping
- **culori** - Color manipulation and LAB conversion
- **lucide-react** - Icon library
- **OpenAI Vision Models** - GPT-4o-mini/GPT-4o for image analysis

## Branch: inspo-scraper

Current active development branch for the DevUX Scraper feature.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Playwright Documentation](https://playwright.dev)

## License

MIT
