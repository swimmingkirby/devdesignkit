/**
 * Hybrid Scraper Usage Examples
 * 
 * This file demonstrates various ways to use the hybrid scraper
 */

import { hybridScrape, HybridScraperOptions } from "../lib/hybrid-scraper/index";

/**
 * Example 1: Basic hybrid scraping with default settings
 */
async function basicExample() {
  console.log("=== Basic Hybrid Scraping ===\n");
  
  try {
    const result = await hybridScrape("https://shadcn.com");
    
    console.log("✓ Scraping completed successfully");
    console.log(`Colors extracted: ${Object.keys(result.tokens.colors).length}`);
    console.log(`Components found: ${result.components.buttons.length} buttons`);
    console.log(`Layout sections: ${result.layouts.sections.length}`);
    console.log(`Merge strategy: ${result.metadata.strategy}`);
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 2: DOM-only mode (no Vision AI)
 */
async function domOnlyExample() {
  console.log("\n=== DOM-Only Scraping ===\n");
  
  const options: HybridScraperOptions = {
    enableDOMScraping: true,
    enableVisionAI: false,  // Disable Vision AI
    mergeStrategy: "best-of-both",
  };
  
  try {
    const result = await hybridScrape("https://ui.shadcn.com", options);
    
    console.log("✓ DOM scraping completed");
    console.log(`Vision AI used: ${result.metadata.visionAIEnabled}`);
    console.log(`Individual DOM results available: ${!!result.individual.dom}`);
    console.log(`Individual Vision results available: ${!!result.individual.vision}`);
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 3: Custom merge strategy (DOM-priority)
 */
async function domPriorityExample() {
  console.log("\n=== DOM-Priority Merge Strategy ===\n");
  
  const options: HybridScraperOptions = {
    enableDOMScraping: true,
    enableVisionAI: true,
    mergeStrategy: "dom-priority",  // Prioritize DOM results
  };
  
  try {
    const result = await hybridScrape("https://vercel.com", options);
    
    console.log("✓ Scraping with DOM-priority completed");
    console.log(`Strategy used: ${result.metadata.strategy}`);
    
    // Compare individual results
    if (result.individual.dom && result.individual.vision) {
      console.log("\nComparison:");
      console.log(`DOM colors: ${Object.keys(result.individual.dom.tokens.colors).length}`);
      console.log(`Vision colors: ${Object.keys(result.individual.vision.tokens.colors).length}`);
      console.log(`Merged colors: ${Object.keys(result.tokens.colors).length}`);
    }
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 4: Vision-priority with custom viewport
 */
async function visionPriorityExample() {
  console.log("\n=== Vision-Priority with Custom Viewport ===\n");
  
  const options: HybridScraperOptions = {
    enableDOMScraping: true,
    enableVisionAI: true,
    mergeStrategy: "vision-priority",  // Prioritize Vision AI results
    screenshot: {
      fullPage: true,
      viewport: {
        width: 1440,  // Macbook Pro viewport
        height: 900,
      },
    },
  };
  
  try {
    const result = await hybridScrape("https://stripe.com", options);
    
    console.log("✓ Vision-priority scraping completed");
    console.log(`Screenshot captured: ${result.metadata.screenshotTaken}`);
    console.log(`Layout sections detected: ${result.layouts.sections.length}`);
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 5: Compare results from both methods
 */
async function comparisonExample() {
  console.log("\n=== Comparing DOM vs Vision AI Results ===\n");
  
  try {
    const result = await hybridScrape("https://linear.app");
    
    if (!result.individual.dom || !result.individual.vision) {
      console.log("⚠ Individual results not available");
      return;
    }
    
    console.log("✓ Both scrapers completed successfully\n");
    
    // Tokens comparison
    console.log("Tokens Comparison:");
    console.log(`  DOM colors: ${Object.keys(result.individual.dom.tokens.colors).length}`);
    console.log(`  Vision colors: ${Object.keys(result.individual.vision.tokens.colors).length}`);
    console.log(`  Merged colors: ${Object.keys(result.tokens.colors).length}\n`);
    
    // Components comparison
    console.log("Components Comparison:");
    console.log(`  DOM buttons: ${result.individual.dom.components.buttons.length}`);
    console.log(`  Vision buttons: ${result.individual.vision.components.buttons.length}`);
    console.log(`  Merged buttons: ${result.components.buttons.length}\n`);
    
    // Layouts comparison
    console.log("Layouts Comparison:");
    console.log(`  DOM sections: ${result.individual.dom.layouts.sections.length}`);
    console.log(`  Vision sections: ${result.individual.vision.layouts.sections.length}`);
    console.log(`  Merged sections: ${result.layouts.sections.length}\n`);
    
    // Show section types
    console.log("Merged Section Types:");
    result.layouts.sections.forEach((section, idx) => {
      const source = section.metadata?.source || "unknown";
      console.log(`  ${idx + 1}. ${section.type} (${source})`);
    });
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 6: Error handling and graceful degradation
 */
async function errorHandlingExample() {
  console.log("\n=== Error Handling Example ===\n");
  
  const options: HybridScraperOptions = {
    enableDOMScraping: true,
    enableVisionAI: true,
    mergeStrategy: "best-of-both",
  };
  
  try {
    // Try scraping a potentially problematic URL
    const result = await hybridScrape("https://example-that-might-fail.com", options);
    
    console.log("✓ Scraping completed");
    
    // Check which methods succeeded
    console.log(`DOM scraping: ${result.individual.dom ? "✓" : "✗"}`);
    console.log(`Vision AI: ${result.individual.vision ? "✓" : "✗"}`);
    
    // Check for errors in debug log
    if (result.debug.errors && result.debug.errors.length > 0) {
      console.log("\n⚠ Errors encountered:");
      result.debug.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
    
    return result;
  } catch (error: any) {
    console.error("✗ Both methods failed:", error.message);
  }
}

/**
 * Example 7: Extract specific design tokens
 */
async function tokenExtractionExample() {
  console.log("\n=== Specific Token Extraction ===\n");
  
  try {
    const result = await hybridScrape("https://tailwindcss.com");
    
    console.log("✓ Scraping completed\n");
    
    // Extract primary colors
    console.log("Primary Colors:");
    console.log(`  Background: ${result.tokens.colors.background}`);
    console.log(`  Foreground: ${result.tokens.colors.foreground}`);
    console.log(`  Primary: ${result.tokens.colors.primary}`);
    console.log(`  Secondary: ${result.tokens.colors.secondary}\n`);
    
    // Extract typography
    console.log("Typography:");
    console.log(`  Font Family: ${result.tokens.fonts.sans}`);
    console.log(`  Body Size: ${result.tokens.fonts.sizes.body}`);
    console.log(`  Heading Sizes: ${result.tokens.fonts.sizes.heading.join(", ")}\n`);
    
    // Extract spacing
    console.log("Spacing:");
    console.log(`  Base Unit: ${result.tokens.spacing.base}\n`);
    
    // Extract radius
    console.log("Border Radius:");
    console.log(`  Small: ${result.tokens.radius.small}`);
    console.log(`  Medium: ${result.tokens.radius.medium}`);
    console.log(`  Large: ${result.tokens.radius.large}\n`);
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Example 8: Save results to files
 */
async function saveResultsExample() {
  console.log("\n=== Save Results to Files ===\n");
  
  try {
    const result = await hybridScrape("https://github.com");
    
    console.log("✓ Scraping completed");
    
    // In a real application, you would save these to files
    const artifacts = {
      tokens: result.tokens,
      components: result.components,
      layouts: result.layouts,
      metadata: result.metadata,
    };
    
    console.log("\nArtifacts ready to save:");
    console.log(`  - devux.tokens.json (${JSON.stringify(result.tokens).length} bytes)`);
    console.log(`  - devux.components.json (${JSON.stringify(result.components).length} bytes)`);
    console.log(`  - devux.layouts.json (${JSON.stringify(result.layouts).length} bytes)`);
    console.log(`  - devux.debug.log.json (${JSON.stringify(result.debug).length} bytes)`);
    
    // Example: Save to file (uncomment to use)
    // import fs from 'fs';
    // fs.writeFileSync('devux.artifacts.json', JSON.stringify(artifacts, null, 2));
    
    return result;
  } catch (error: any) {
    console.error("✗ Scraping failed:", error.message);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  await basicExample();
  await domOnlyExample();
  await domPriorityExample();
  await visionPriorityExample();
  await comparisonExample();
  await errorHandlingExample();
  await tokenExtractionExample();
  await saveResultsExample();
}

// Export examples for use in other files
export {
  basicExample,
  domOnlyExample,
  domPriorityExample,
  visionPriorityExample,
  comparisonExample,
  errorHandlingExample,
  tokenExtractionExample,
  saveResultsExample,
  runAllExamples,
};

// Run examples if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

