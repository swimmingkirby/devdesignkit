import { Layouts } from "@/lib/scraper/types";
import { callHuggingFaceVision } from "./huggingface-client";
import { extractJSON } from "./parsers/json-extractor";
import { normalizeLayouts, getDefaultLayouts } from "./parsers/normalizer";

/**
 * Extract layout structure from website screenshot using LLM
 */
export interface LayoutParseResult {
  layouts: Layouts;
  rawResponse: string;
}

export async function parseLayoutsFromLLM(
  base64Image: string,
  mimeType: string
): Promise<LayoutParseResult> {
  const prompt = `You are a UI/UX expert analyzing a website screenshot. Your task is to identify ALL major layout sections from top to bottom.

STEP 1: Scan the image carefully and identify distinct visual sections.

STEP 2: For each section, determine its type:

**Navigation/Header Sections:**
- "navbar" = Top navigation bar with links/logo (usually 50-80px tall, spans full width)
- "header" = Header area that may include logo and menu (wider than navbar)
- "topbar" = Small utility bar above main nav (announcements, contact info)

**Hero/Banner Sections:**
- "hero" = Large prominent section at top with headline + CTA (typically 400-600px tall)
- "banner" = Wide promotional banner section

**Content Sections:**
- "features" = Section showcasing product features (usually 3-6 items in grid/row)
- "cards" = Grid or list of card-style content blocks
- "content" = Main text/article content area
- "stats" = Statistics or metrics display (numbers with labels)
- "logos" = Logo showcase/partner section
- "gallery" = Image grid or photo gallery
- "video" = Video player or embedded media section

**Social Proof:**
- "testimonials" = Customer reviews/quotes (usually with avatars)
- "reviews" = Product/service reviews section
- "casestudy" = Case study or success story section

**Commercial:**
- "pricing" = Pricing tables or plans (usually 2-4 columns)
- "cta" = Call-to-action section (prominent button/form to convert users)
- "signup" = Email signup or registration section

**Information:**
- "faq" = Frequently asked questions accordion/list
- "team" = Team member profiles with photos
- "about" = About us section
- "contact" = Contact information or form

**Footer:**
- "footer" = Bottom section with links, copyright, social icons

**Layout:**
- "sidebar" = Side navigation or content (left or right aligned, ~20-30% width)
- "section" = Generic content section (use this if no specific type fits)

STEP 3: Estimate position as PERCENTAGES of the visible screenshot:
- x: horizontal position (0 = left edge, 100 = right edge)
- y: vertical position (0 = top edge, 100 = bottom edge)
- width: section width as % (full-width sections = 100)
- height: section height as % (calculate based on visible area)

STEP 4: Assign confidence:
- "high" = Clearly identifiable with obvious visual markers
- "medium" = Somewhat clear but could be interpreted differently
- "low" = Uncertain or ambiguous section

STEP 5: Add metadata:
- cardCount: number of cards/items visible (for features, pricing, testimonials)
- layoutType: "grid", "flex", "block", or "column"
- isSticky: true if appears to be fixed/sticky position
- hasBackground: true if has distinct background color/image

EXAMPLE OUTPUT for a landing page:

[
  {
    "type": "navbar",
    "position": { "x": 0, "y": 0, "width": 100, "height": 6 },
    "confidence": "high",
    "metadata": {
      "isSticky": true,
      "framework": "generic",
      "hasBackground": true
    }
  },
  {
    "type": "hero",
    "position": { "x": 0, "y": 6, "width": 100, "height": 45 },
    "confidence": "high",
    "metadata": {
      "framework": "generic",
      "layoutType": "flex",
      "hasBackground": true
    }
  },
  {
    "type": "logos",
    "position": { "x": 0, "y": 51, "width": 100, "height": 8 },
    "confidence": "high",
    "metadata": {
      "cardCount": 6,
      "layoutType": "grid",
      "framework": "generic"
    }
  },
  {
    "type": "features",
    "position": { "x": 0, "y": 59, "width": 100, "height": 30 },
    "confidence": "high",
    "metadata": {
      "cardCount": 3,
      "layoutType": "grid",
      "framework": "generic"
    }
  },
  {
    "type": "testimonials",
    "position": { "x": 0, "y": 89, "width": 100, "height": 20 },
    "confidence": "medium",
    "metadata": {
      "cardCount": 2,
      "layoutType": "flex",
      "framework": "generic"
    }
  }
]

IMPORTANT RULES:
1. Include ALL visible sections - don't skip any major content blocks
2. Sections should be in top-to-bottom order based on y position
3. Heights should roughly add up to 100% (allow some overlap)
4. Be specific with section types - avoid using "section" unless necessary
5. Return ONLY the JSON array, no markdown code blocks, no explanatory text
6. If you see multiple distinct areas, create separate entries for each

Now analyze this website screenshot and return the layout sections:`;

  try {
    const response = await callHuggingFaceVision(base64Image, mimeType, prompt);
    const rawResponse =
      typeof response === "string"
        ? response
        : JSON.stringify(response, null, 2);
    
    // Try to extract JSON from response
    const parsed = extractJSON(response);
    
    if (!parsed) {
      console.warn("Failed to parse layouts from LLM, using defaults");
      return { layouts: getDefaultLayouts(), rawResponse };
    }
    
    return { layouts: normalizeLayouts(parsed), rawResponse };
  } catch (error: any) {
    console.error("Error parsing layouts from LLM:", error);
    return {
      layouts: getDefaultLayouts(),
      rawResponse: error.message || "Unknown layout parser error",
    };
  }
}

