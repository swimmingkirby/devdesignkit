# DevUX Scraper Design Spec

## 1. Goal

Given a URL, fetch and analyze its UI, then generate four machine readable artifacts:

- `devux.tokens.json`  
- `devux.components.json`  
- `devux.layouts.json`  
- `devux.debug.log.json`  

Token extraction focuses on:

- Colors  
- Fonts  
- Radius  
- Spacing  
- Shadows  

These are used by the web app and IDE agent for design enforcement.

---

## 2. Inputs and Outputs

### Input

- Single URL, for example `https://example.com`

### Output files

- **Tokens**  
  Colors, fonts, radius, spacing, shadows  

- **Components**  
  Repeated UI patterns such as buttons and cards  

- **Layouts**  
  High level section sequence such as header, hero, gallery, section, footer  

- **Debug log**  
  Full decision trail for debugging and analysis  

---

## 3. Scraping Pipeline

### 3.1 Fetch and Render

- Use a headless browser  
- Navigate to the provided URL  
- Wait for network idle or a fixed timeout  
- Extract:
  - Final rendered HTML body  
  - Computed styles for all visible elements  
  - Bounding boxes for visible elements  

### 3.2 Build Styled DOM

For each visible element create a `StyledNode` with:

- Tag name  
- Class list  
- ARIA role  
- Text length  
- Computed styles  
  - Background color  
  - Text color  
  - Font family  
  - Font size  
  - Font weight  
  - Border radius  
  - Padding (top, right, bottom, left)  
  - Margin (top, right, bottom, left)  
  - Box shadow  
  - Display type  
- Geometry  
  - x, y, width, height  

All nodes are stored as a tree that mirrors the DOM.

---

## 4. Token Extraction (Deterministic)

Token extraction is based on **histograms**, **medians**, **clustering**, and **normalisation**.  
Result is written to `devux.tokens.json`.

---

### 4.1 Normalisation and Clustering (Detailed)

Normalisation turns messy raw scraped values into clean design tokens.

This avoids ending up with dozens of tiny variations such as:  
`#3d3c4f`, `#3d3d4f`, `#3c3c4e`, etc.

Below are the exact methods used.

---

#### A. Color Normalisation

**Libraries**  
- **culori** (convert to LAB, compute color distances)  
- **ml-kmeans** (cluster colors)

**Steps**

1. **Convert all colors to LAB**  
   LAB gives a uniform color space where similar colors have small numeric distance.

   ```js
   import { converter } from 'culori'
   const toLab = converter('lab')
   const lab = toLab('#3d3c4f')
   ```

2. **Cluster LAB colors (k-means)**  
   Use ml-kmeans to group colors into around 6 clusters.

   Each cluster = one future token group.

3. **Pick a canonical color per cluster**
   - Compute the cluster centroid
   - Pick the actual raw hex color closest to that centroid
   - This becomes the token value (e.g. foreground)

4. **Merge colors within a threshold**  
   Colors with LAB distance < small threshold (like < 3) get merged automatically.

**Effect**  
All near identical colors collapse into one clean token.

#### B. Spacing Normalisation

Spacing is based on padding values across UI components.

**Method**
1. Collect all padding and margin values
2. Compute the most common increment
3. Define spacing.base as that increment
4. Snap all spacing values to multiples of spacing.base

**Example:** If base is 4px
- 8px → 2 * spacing.base
- 12px → 3 * spacing.base

This ensures a consistent spacing system.

#### C. Radius Normalisation

Radius values often vary slightly like:

```
5px, 6px, 8px, 16px
```

**Method**
1. Collect all radii
2. Sort them
3. Assign:
   - radius.small → smallest distinct value
   - radius.medium → median
   - radius.large → largest distinct value

This prevents messy uneven radii.

#### D. Shadow Normalisation

Shadows are parsed and grouped by blur, spread, and color.

**Library**  
css-box-shadow

**Method**
1. Parse all box shadow values
2. Group shadows by similar blur + spread radius
3. Define:
   - shadow.base → most common shadow
   - shadow.large → highest blur/spread shadow

### 4.2 Color Tokens

After normalisation and clustering, color roles are assigned using frequency rules:

- **colors.background**  
  Most frequent large-container background.

- **colors.foreground**  
  Dominant text color.

- **colors.primary / colors.primaryForeground**  
  Most frequent accent on interactive elements.

- **colors.secondary / colors.secondaryForeground**  
  Second most common accent.

- **colors.muted / colors.mutedForeground**  
  Low contrast backgrounds + text pairs.

- **colors.destructive / colors.destructiveForeground**  
  Red or alert patterns.

- **colors.border**  
  Common border color.

- **colors.input**  
  Background for inputs.

- **colors.ring**  
  Focus ring color.

**Sidebar colors (if sidebar detected):**
- Background
- Foreground
- Primary
- PrimaryForeground
- Accent
- AccentForeground
- Border
- Ring

### 4.3 Font Tokens

Extracted from histograms of font sizes and frequency of font families.

**New: Intelligent Font Extraction**  
The system now uses advanced font parsing and normalization:
- Parses complex font stacks to extract actual fonts
- Normalizes font names (handles quotes, system fonts, etc.)
- Categorizes fonts (sans-serif, serif, monospace, display)
- Tracks context (where fonts are used: headings, body, code, etc.)
- Detects multiple fonts with their specific usage

**Font tokens:**
- font.sans (primary font)
- font.serif (if used)
- font.mono (for code)
- font.heading (if distinct from primary)
- font.secondary (if significantly used)

**Font weights:**
- font.weights.normal → most common normal weight
- font.weights.medium → 500-599 range
- font.weights.semibold → 600-699 range  
- font.weights.bold → 700+ range

**Sizes:**
- font.bodySize → median
- font.headingSizes → largest three
- font.captionSize → smallest frequent

See [Font Scraping Improvements](./font-scraping-improvements.md) for detailed documentation.

### 4.4 Radius Tokens

- radius.small
- radius.medium
- radius.large

### 4.5 Spacing Tokens

- spacing.base (most common increment)

### 4.6 Shadow Tokens

- shadow.base
- shadow.large

---

## 5. Component Pattern Extraction

Result is written to `devux.components.json`.

### 5.1 Signature Grouping

**Component candidates:**
- Buttons
- Links styled as buttons
- Cards
- Nav items

**Signature built from:**
- Tag
- Sorted classes
- Role

Count occurrences and keep signatures with at least 3 matches.

### 5.2 Canonical Styles

For each signature:

Take median values for:
- Background
- Text
- Padding
- Radius
- Shadow

Map them to nearest token values.

### 5.3 Component Type Rules

- button
- card
- navItem

---

## 6. Layout Extraction

Result is written to `devux.layouts.json`.

### 6.1 Section Detection

Detect large blocks based on width and height thresholds.

### 6.2 Section Types

- Header
- Hero
- Gallery
- Section
- Footer
(any other popular sections)

### 6.3 Export

Layout structure stored in sequence.

---

## 7. Debug Logging

Result is in `devux.debug.log.json`.

**Includes:**
- URL, viewport, timestamp
- Step-by-step logs
- Raw histograms
- Clustering results
- Chosen medians
- Color distance calculations
- Component signature frequency
- Layout detection
- Errors, warnings


