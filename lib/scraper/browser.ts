import { chromium, Browser, Page } from "playwright";
import { StyledNode } from "./types";

export async function fetchAndRender(url: string): Promise<{ nodes: StyledNode[]; debug: string[] }> {
  const logs: string[] = [];
  let browser: Browser | null = null;

  try {
    logs.push("Launching browser...");
    browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Better compatibility
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();

    logs.push(`Navigating to ${url}...`);
    
    try {
      await page.goto(url, { 
        waitUntil: "networkidle", 
        timeout: 30000 
      });
    } catch (navigationError: any) {
      if (navigationError.message.includes('timeout')) {
        logs.push("Warning: Navigation timeout, but continuing with partial load...");
        await page.waitForTimeout(2000); // Give it 2 more seconds
      } else {
        throw new Error(`Navigation failed: ${navigationError.message}`);
      }
    }

    logs.push("Extracting styles...");
    
    // Evaluate script to traverse DOM and extract computed styles
    const nodes = await page.evaluate(() => {
      function getComputedStyles(element: Element) {
        try {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          
          // Extract data-* attributes
          const dataAttributes: Record<string, string> = {};
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (attr.name.startsWith('data-')) {
              dataAttributes[attr.name] = attr.value;
            }
          }
          
          return {
            tag: element.tagName.toLowerCase(),
            classes: Array.from(element.classList),
            role: element.getAttribute("role"),
            textLength: element.textContent?.trim().length || 0,
            dataAttributes,
            styles: {
              backgroundColor: style.backgroundColor || 'transparent',
              color: style.color || 'rgb(0, 0, 0)',
              fontFamily: style.fontFamily || 'system-ui',
              fontSize: style.fontSize || '16px',
              fontWeight: style.fontWeight || '400',
              borderRadius: style.borderRadius || '0px',
              padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
              margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`,
              boxShadow: style.boxShadow || 'none',
              display: style.display || 'block',
              position: style.position || 'static',
              zIndex: style.zIndex || 'auto',
              flexDirection: style.flexDirection || 'row',
              gridTemplateColumns: style.gridTemplateColumns || 'none',
              width: style.width || 'auto',
            },
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
          };
        } catch (error) {
          // Return a minimal node if style extraction fails
          return null;
        }
      }

      const allNodes: any[] = [];
      let processedCount = 0;
      const maxNodes = 5000; // Limit to prevent memory issues
      
      try {
        // Walk the tree - skipping invisible elements
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
          acceptNode: (node) => {
            const element = node as HTMLElement;
            
            // Skip if hidden
            if (element.offsetParent === null && element.tagName !== 'BODY') {
              return NodeFilter.FILTER_REJECT;
            }
            
            // Skip very small elements (likely decorative)
            const rect = element.getBoundingClientRect();
            if (rect.width < 10 && rect.height < 10) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        });

        while (walker.nextNode() && processedCount < maxNodes) {
          const node = getComputedStyles(walker.currentNode as Element);
          if (node) {
            allNodes.push(node);
            processedCount++;
          }
        }
      } catch (walkerError) {
        // If tree walker fails, try a simpler approach
        const elements = document.querySelectorAll('body *');
        for (let i = 0; i < Math.min(elements.length, maxNodes); i++) {
          const node = getComputedStyles(elements[i]);
          if (node) allNodes.push(node);
        }
      }
      
      return allNodes;
    });

    logs.push(`Extracted ${nodes.length} nodes.`);
    
    if (nodes.length === 0) {
      logs.push("Warning: No nodes extracted. Page may not have loaded correctly.");
    }
    
    await context.close();
    
    return { nodes, debug: logs };
    
  } catch (error: any) {
    logs.push(`Error: ${error.message}`);
    
    // Provide more specific error messages
    if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
      throw new Error('Could not resolve domain. Check the URL and your internet connection.');
    } else if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      throw new Error('Connection refused. The website may be down or blocking requests.');
    } else if (error.message.includes('net::ERR_CERT')) {
      throw new Error('SSL certificate error. The website may have security issues.');
    } else if (error.message.includes('CSP')) {
      throw new Error('Content Security Policy blocked the request.');
    } else {
      throw new Error(`Browser automation failed: ${error.message}`);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        logs.push("Warning: Failed to close browser gracefully");
      }
    }
  }
}
