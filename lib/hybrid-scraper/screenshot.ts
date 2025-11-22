import { chromium, Browser, Page } from "playwright";

/**
 * Screenshot options
 */
export interface ScreenshotOptions {
  fullPage?: boolean;
  viewport?: {
    width: number;
    height: number;
  };
  timeout?: number;
}

/**
 * Fetch a screenshot of the given URL using Playwright
 */
export async function fetchScreenshot(
  url: string,
  options: ScreenshotOptions = {}
): Promise<{ base64: string; mimeType: string }> {
  const {
    fullPage = true,
    viewport = { width: 1920, height: 1080 },
    timeout = 30000,
  } = options;
  
  let browser: Browser | null = null;
  let page: Page | null = null;
  
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
    });
    
    // Create page with viewport
    page = await browser.newPage({
      viewport,
    });
    
    // Set timeout
    page.setDefaultTimeout(timeout);
    
    // Navigate to URL
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout,
    });
    
    // Wait for content to be visible
    await page.waitForLoadState("domcontentloaded");
    
    // Small delay to ensure animations/transitions complete
    await page.waitForTimeout(1000);
    
    // Capture screenshot
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 90,
      fullPage,
    });
    
    // Convert to base64
    const base64 = screenshot.toString("base64");
    
    return {
      base64,
      mimeType: "image/jpeg",
    };
    
  } catch (error: any) {
    throw new Error(`Screenshot capture failed: ${error.message}`);
    
  } finally {
    // Cleanup
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

