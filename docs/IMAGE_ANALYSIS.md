# Image-Based Layout Analysis

This document explains how to use the AI-powered image analysis feature to extract design tokens, components, and layouts from website screenshots.

## Overview

The DevUX Scraper now supports two analysis modes:

1. **URL Scraping** (DOM-based) - Most accurate, uses Playwright to analyze live websites
2. **Image Analysis** (AI-powered) - Experimental, uses Hugging Face vision models to analyze screenshots

## Why Image Analysis?

Image analysis is useful when:
- You don't have access to the live website (screenshots from mockups, PDFs, etc.)
- The website requires authentication
- You want to analyze mobile screenshots or specific viewports
- The website uses technologies that are hard to scrape (Canvas, WebGL, etc.)

## Setup

### 1. Get an OpenAI API Key

1. Sign up at [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy your key (starts with `sk-`)

### 2. Add Key to Environment

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Important:** The `.env.local` file is git-ignored and should never be committed.

### 3. Restart Development Server

After adding the token, restart your dev server:

```bash
npm run dev
```

## Usage

### Via Web UI

1. Navigate to [http://localhost:3000/information-scraper](http://localhost:3000/information-scraper)
2. Click on the "Image Analyzer" tab
3. Upload a website screenshot (JPEG, PNG, WebP, or GIF - max 10MB)
4. **Preview your image** - Click "View Full Size" to see the complete screenshot in a modal
5. Click "Analyze Image"
6. Wait 20-60 seconds for analysis to complete
7. View results in the same format as URL scraping

### Via API

**Endpoint:** `POST /api/analyze-image`

**Request:**
```bash
curl -X POST http://localhost:3000/api/analyze-image \
  -F "image=@screenshot.png"
```

**Response:**
```json
{
  "tokens": {
    "colors": { "background": "#ffffff", "primary": "#0070f3", ... },
    "fonts": { "sans": "Inter", "sizes": { "body": "16px", ... } },
    "radius": { "small": "4px", "medium": "8px", "large": "16px" },
    "spacing": { "base": "4px" },
    "shadows": { "base": "...", "large": "..." }
  },
  "components": {
    "buttons": [...],
    "cards": [...],
    "navItems": [...]
  },
  "layouts": {
    "sections": [
      {
        "type": "navbar",
        "position": { "x": 0, "y": 0, "width": 100, "height": 8 },
        "metadata": { "confidence": "high", "framework": "generic" }
      },
      ...
    ]
  },
  "debug": {
    "url": "image-upload",
    "timestamp": "2024-11-22T...",
    "logs": [...],
    "errors": [...]
  }
}
```

## Models Used

### Default Model: Llama 3.2 11B Vision Instruct

- **Provider:** Meta / Hugging Face router
- **Size:** 11B parameters (vision+language)
- **Specialty:** Detailed UI analysis with high compliance to structured prompts
- **Endpoint:** `https://router.huggingface.co/v1/chat/completions`
- **Speed:** 25-45 seconds per image
- **Cost:** Free (rate-limited ~1000 req/day)

You can override the model via `.env.local`:

```bash
# Optional: use a different router-compatible model
HUGGINGFACE_MODEL_ID=meta-llama/Llama-3.2-11B-Vision-Instruct
```

Any chat-completions compatible vision model on Hugging Face router should work (e.g. `llava-hf/llava-1.5-7b-hf`, `google/gemma-2-9b-it` etc.).

### API Integration (Chat Completions)

We now use the Hugging Face Router Chat Completions API (OpenAI-compatible schema):

```json
POST https://router.huggingface.co/v1/chat/completions
{
  "model": "meta-llama/Llama-3.2-11B-Vision-Instruct",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Analyze layout..." },
        { "type": "image_url", "image_url": { "url": "data:image/png;base64,..." } }
      ]
    }
  ],
  "max_tokens": 1200,
  "temperature": 0.2,
  "top_p": 0.9
}
```

This matches Hugging Face's recommended integration moving forward and avoids legacy inference endpoints that are being deprecated.

## Accuracy Comparison

| Method | Accuracy | Speed | Cost | Best For |
|--------|----------|-------|------|----------|
| URL Scraping | 90-95% | 5-15s | Free | Live websites |
| Image Analysis | 70-85% | 30-60s | Free | Screenshots, mockups |

**Note:** Using LLaVA 1.6 Vicuna 13B (larger 13B parameter model) for improved accuracy over previous 7B models.

### What Image Analysis Does Well

✅ Overall color schemes and primary colors  
✅ Layout structure and section types  
✅ General component identification (buttons, cards, etc.)  
✅ Font families (when recognizable)  
✅ Approximate spacing and radius values

### Limitations

⚠️ **Less Accurate For:**
- Exact hex color values (approximations)
- Precise spacing/padding measurements
- Shadow values (may hallucinate)
- Font sizes (estimates)
- Small UI details
- Overlapping elements

⚠️ **May Struggle With:**
- Low contrast screenshots
- Very dense UIs
- Non-standard layouts
- Mobile screenshots (works better with desktop)
- Partial screenshots (needs full page context)

## Best Practices

### Taking Good Screenshots

1. **Above-the-fold focus:** For best results, capture the top ~1200px of the page (hero + main section)
2. **High Resolution:** Use at least 1920x1080 resolution
3. **Desktop View:** Desktop layouts are easier to analyze than mobile
4. **Good Contrast:** Ensure good contrast and visibility
5. **No Scrollbars:** Hide scrollbars if possible for cleaner analysis

**Pro Tip:** Keep screenshots under 3MB and focus on key sections rather than entire long pages. The model performs best on focused, clear images.

### Interpreting Results

- **Check Confidence Levels:** Focus on "high" confidence sections
- **Verify Colors:** LLM may approximate colors, verify hex values
- **Cross-Reference:** Compare with URL scraping if possible
- **Use Debug Logs:** Check debug output for LLM reasoning

### Rate Limits

The free Hugging Face API has rate limits:
- ~1000 requests/day
- If you hit "Model is loading" error, wait 20-30 seconds and retry
- For production use, consider:
  - Hugging Face Pro ($9/month for higher limits)
  - Self-hosting the model (requires GPU)
  - Using OpenAI GPT-4 Vision (paid API)

## Troubleshooting

### "HUGGINGFACE_API_TOKEN is not set"

**Solution:** Add your token to `.env.local` and restart the dev server.

### "Model is currently loading"

**Solution:** This is normal for free tier. Wait 20-30 seconds and try again. The model goes to sleep when unused.

### "Failed to parse tokens/components/layouts"

**Solution:** The LLM's response wasn't in expected JSON format. The system will fall back to defaults. Try:
- Using a higher quality screenshot
- Ensuring the screenshot shows a full web page
- Checking debug logs for more details

### Poor Results

**Try:**
1. Taking a better quality screenshot
2. Using URL scraping instead (if website is accessible)
3. Uploading a desktop viewport screenshot (not mobile)
4. Ensuring the screenshot shows clear, recognizable UI elements

## Technical Implementation

### Architecture

```
User uploads image
    ↓
/api/analyze-image (validation, base64 encoding)
    ↓
lib/image-analyzer/index.ts (orchestrator)
    ↓
├─→ token-parser.ts → Hugging Face API → Design tokens
├─→ component-parser.ts → Hugging Face API → Component styles
└─→ layout-parser.ts → Hugging Face API → Layout sections
    ↓
Normalized ScrapeResult (same format as URL scraping)
```

### Prompt Engineering

The system uses **highly detailed, expert-level prompts** to guide the LLM:

1. **Token Extraction:** 
   - Defines each color role with examples (background, foreground, primary, etc.)
   - Font identification with common options and fallbacks
   - Specific guidance on radius, spacing, and shadow values
   - Instructions to analyze multiple elements for pattern recognition

2. **Component Identification:** 
   - Detailed descriptions of what qualifies as each component type
   - Visual cues to look for (solid vs outline buttons, card shadows, etc.)
   - Grouping instructions to avoid over-fragmenting similar styles
   - Accurate frequency counting guidance

3. **Layout Analysis:** 
   - **30+ section types** with clear definitions (navbar, hero, features, testimonials, etc.)
   - Step-by-step analysis approach
   - Position estimation as percentages with calculation guidance
   - Confidence scoring criteria (high/medium/low)
   - Metadata fields for layout type, card count, sticky positioning

Each prompt includes:
- Role-based framing ("You are a UI/UX expert...")
- Comprehensive examples with realistic values
- Strict JSON-only output requirements
- Visual analysis instructions
- Edge case handling

### Error Handling

The implementation includes comprehensive error handling:
- **Fallback to defaults** if LLM fails to return valid JSON
- **Automatic retry** with backup model if primary fails
- **Progressive degradation** - partial results returned on failure
- **Debug logging** - full analysis trail for troubleshooting

## Future Improvements

Planned enhancements:

1. **Multi-model fallback chain** (Qwen → LLaVA → GPT-4V)
2. **Fine-tuned model** specifically for UI/UX analysis
3. **OCR integration** for text extraction
4. **Hybrid mode** combining URL scraping + image analysis
5. **Batch processing** for multiple screenshots
6. **Mobile screenshot support** with specialized prompts

## API Reference

See main README.md for API endpoint documentation.

## Related Documentation

- [Scraper Implementation](./scraper-implementation.md) - URL scraping details
- [Layout Detection](./LAYOUT_DETECTION.md) - Layout detection algorithms
- [Error Handling](./ERROR_HANDLING.md) - Error handling strategies

## Cost Analysis

| Scenario | Free Tier | Pro Tier ($9/mo) | Self-Hosted |
|----------|-----------|------------------|-------------|
| Daily requests | ~1000 | ~10,000 | Unlimited* |
| Speed | 20-60s | 10-30s | 5-60s** |
| Accuracy | 70-80% | 70-80% | 70-85%*** |
| Setup | 5 min | 5 min | 2-4 hours |

*Limited by hardware  
**Depends on GPU  
***Depends on model choice

## Support

If you encounter issues:

1. Check the debug logs in the UI
2. Review this documentation
3. Check Hugging Face status: [https://status.huggingface.co/](https://status.huggingface.co/)
4. Open an issue with screenshot examples and debug logs

