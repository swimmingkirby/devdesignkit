# Edit in Customizer Feature

## Overview

After analyzing a website with the hybrid scraper, users can now directly open the extracted theme in the customizer for further refinement. This creates a seamless workflow from scraping to customization.

## User Flow

```
1. Scrape a website
   ↓
2. Review analysis results
   ↓
3. Click "Edit in Customizer"
   ↓
4. Customize the extracted theme
   ↓
5. Export or apply the theme
```

## How It Works

### 1. Information Scraper Page

After a successful scrape, the results section now shows two buttons:

```
┌─────────────────────────────────────────────┐
│ Analysis Results                            │
│                                             │
│  [🎨 Edit in Customizer]  [📥 Download JSON] │
└─────────────────────────────────────────────┘
```

- **Edit in Customizer** (primary button): Opens theme in customizer
- **Download JSON** (outline button): Downloads raw scraper data

### 2. Theme Conversion

When "Edit in Customizer" is clicked:

1. **Validates** the scraper output structure
2. **Converts** tokens to ThemeTokens format
3. **Stores** the theme in sessionStorage
4. **Navigates** to the customizer page

### 3. Customizer Auto-Import

When the customizer loads:

1. **Checks** sessionStorage for imported theme
2. **Applies** the theme if found
3. **Clears** sessionStorage
4. **Logs** success message to console

## Technical Implementation

### Information Scraper (`app/information-scraper/page.tsx`)

Added:

```typescript
import { useRouter } from "next/navigation";
import { convertScraperToTheme, validateScraperOutput } from "@/lib/utils/scraper-converter";

const handleEditInCustomizer = () => {
  if (!results) return;

  try {
    // Validate and convert
    if (!validateScraperOutput(results)) {
      alert("Invalid scraper output format.");
      return;
    }

    const theme = convertScraperToTheme(results);
    
    // Store in sessionStorage
    sessionStorage.setItem("importedTheme", JSON.stringify(theme));
    sessionStorage.setItem("importedThemeUrl", url || "imported-theme");
    
    // Navigate
    router.push("/customizer");
  } catch (error) {
    console.error("Failed to convert theme:", error);
    alert("Failed to convert theme. Check console.");
  }
};
```

### Style Customizer (`components/customizer/style-customizer.tsx`)

Added:

```typescript
React.useEffect(() => {
  const importedThemeJson = sessionStorage.getItem("importedTheme");
  const importedThemeUrl = sessionStorage.getItem("importedThemeUrl");
  
  if (importedThemeJson) {
    try {
      const importedTheme = JSON.parse(importedThemeJson) as ThemeTokens;
      updateTheme(importedTheme);
      
      // Clear after applying
      sessionStorage.removeItem("importedTheme");
      sessionStorage.removeItem("importedThemeUrl");
      
      console.log(`✓ Applied theme from: ${importedThemeUrl}`);
    } catch (error) {
      console.error("Failed to apply imported theme:", error);
    }
  }
}, [updateTheme]);
```

## Usage Example

### Scenario: Scraping and Customizing Stripe's Theme

1. **Navigate to Information Scraper** (`/information-scraper`)
2. **Enter URL**: `https://stripe.com`
3. **Click "Analyze URL"** (Hybrid mode recommended)
4. **Wait for analysis** (~10-15 seconds)
5. **Review results** in the tabs (Tokens, Components, Layouts)
6. **Click "Edit in Customizer"**
7. **Automatically redirected** to `/customizer` with theme applied
8. **Customize** using the controls:
   - Adjust colors
   - Fine-tune fonts
   - Modify radius, spacing, shadows
9. **Preview** changes in real-time
10. **Export** or save the theme

## Features

### ✅ Validation

- Checks scraper output structure before conversion
- Shows error message if data is invalid
- Prevents navigation if conversion fails

### ✅ Conversion

- Uses the same converter as "Import from URL"
- Handles missing fields with defaults
- Validates all CSS values

### ✅ Seamless Navigation

- No manual copying of data
- Automatic theme application
- Clean URL (no query params)

### ✅ Error Handling

- Validation errors show alerts
- Conversion errors log to console
- Failed imports don't break customizer

## Data Flow

```
Information Scraper
       │
       │ 1. User clicks "Edit in Customizer"
       │
       ▼
validateScraperOutput()
       │
       │ 2. Validates structure
       │
       ▼
convertScraperToTheme()
       │
       │ 3. Converts to ThemeTokens
       │
       ▼
sessionStorage.setItem()
       │
       │ 4. Stores theme + URL
       │
       ▼
router.push("/customizer")
       │
       │ 5. Navigates
       │
       ▼
StyleCustomizer.useEffect()
       │
       │ 6. Checks sessionStorage
       │
       ▼
updateTheme()
       │
       │ 7. Applies theme
       │
       ▼
sessionStorage.removeItem()
       │
       │ 8. Cleans up
       │
       ▼
    User customizes
```

## Button Styling

The "Edit in Customizer" button:
- **Primary style** (default Button variant)
- **Palette icon** (🎨) for visual recognition
- **Prominent placement** (first button, left side)
- **Larger than Download** button to emphasize the action

## Storage Strategy

### Why sessionStorage?

- **Temporary**: Data cleared after use
- **Tab-specific**: Doesn't persist across tabs
- **No URL pollution**: Keeps URLs clean
- **Large data**: Can handle full theme objects
- **Simple**: No API calls needed

### Alternatives Considered

| Method | Pros | Cons | Chosen? |
|--------|------|------|---------|
| **sessionStorage** | Simple, temporary, large data | Single tab only | ✅ **Yes** |
| URL params | Shareable, bookmarkable | Size limits, ugly URLs | ❌ No |
| localStorage | Persists, multi-tab | Clutters storage | ❌ No |
| Server-side | Scalable, secure | Requires API, complexity | ❌ No |
| Context/State | React-native | Lost on reload | ❌ No |

## Edge Cases Handled

### 1. Invalid Scraper Output
**Problem**: Scraper returns malformed data  
**Solution**: `validateScraperOutput()` checks structure, shows alert if invalid

### 2. Conversion Failure
**Problem**: Theme conversion throws error  
**Solution**: Try-catch block, console error, user alert

### 3. Missing sessionStorage
**Problem**: Browser doesn't support sessionStorage  
**Solution**: Try-catch in useEffect, fails silently

### 4. Corrupted Theme Data
**Problem**: JSON.parse fails on stored theme  
**Solution**: Try-catch in useEffect, logs error, customizer loads normally

### 5. User Refreshes Customizer
**Problem**: Theme in sessionStorage is applied again  
**Solution**: Data is removed after first application

## Browser Compatibility

| Browser | sessionStorage | Router | Status |
|---------|----------------|--------|--------|
| Chrome 90+ | ✅ | ✅ | ✅ Full support |
| Firefox 85+ | ✅ | ✅ | ✅ Full support |
| Safari 14+ | ✅ | ✅ | ✅ Full support |
| Edge 90+ | ✅ | ✅ | ✅ Full support |

## Future Enhancements

Potential improvements:

- [ ] **Comparison view**: Compare scraped vs. customized theme side-by-side
- [ ] **History tracking**: Track all themes opened in customizer
- [ ] **Direct save**: Save customized theme back to scraper results
- [ ] **Undo/Redo**: Revert to scraped theme after customization
- [ ] **Presets from scrapes**: Save scraped themes as new presets
- [ ] **URL sharing**: Generate shareable URLs with theme data
- [ ] **Export formats**: Export to Tailwind, CSS vars, etc.

## Testing

### Manual Test Steps

1. **Test valid scrape → customizer**:
   - Scrape https://stripe.com
   - Click "Edit in Customizer"
   - Verify theme applies
   - Verify console shows success message

2. **Test invalid data handling**:
   - Manually corrupt scraper output
   - Click "Edit in Customizer"
   - Verify error message appears

3. **Test navigation**:
   - Click "Edit in Customizer"
   - Verify redirected to `/customizer`
   - Verify URL is clean (no params)

4. **Test cleanup**:
   - Click "Edit in Customizer"
   - Refresh customizer page
   - Verify theme doesn't reapply (sessionStorage cleared)

5. **Test multiple scrapes**:
   - Scrape site A → Edit in Customizer
   - Go back, scrape site B → Edit in Customizer
   - Verify site B's theme applies, not site A's

## Related Documentation

- [Scraper-Customizer Integration](./SCRAPER_CUSTOMIZER_INTEGRATION.md) - Full integration details
- [Hybrid Scraper](./HYBRID_SCRAPER.md) - Scraper architecture
- [Theme Converter](../lib/utils/scraper-converter.ts) - Conversion logic

## Support

If the feature doesn't work:

1. **Check console** for error messages
2. **Verify browser supports** sessionStorage
3. **Try different URL** (some sites block scraping)
4. **Clear cache** and try again
5. **Check scraper output** is valid (Download JSON)

## Conclusion

The "Edit in Customizer" feature completes the scraper-to-customizer workflow, enabling users to:
- ✅ Scrape any website
- ✅ Review extracted design tokens
- ✅ Open directly in customizer
- ✅ Customize every detail
- ✅ Export final theme

This creates a powerful, seamless experience for design system extraction and customization.

