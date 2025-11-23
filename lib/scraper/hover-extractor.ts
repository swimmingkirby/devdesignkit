import { Page } from "playwright";

export interface HoverStyle {
  selector: string;
  properties: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    transform?: string;
    opacity?: string;
    boxShadow?: string;
    scale?: string;
    [key: string]: string | undefined;
  };
  specificity: number;
}

export interface ComponentHoverData {
  componentType: "button" | "link" | "card" | "input" | "nav-item";
  hoverStyles: HoverStyle[];
  count: number;
}

/**
 * Extract :hover CSS rules from all stylesheets on the page
 * 
 * @param page - Playwright page instance
 * @returns Map of hover styles by selector
 */
export async function extractHoverStyles(page: Page): Promise<Map<string, HoverStyle>> {
  const hoverStyles = new Map<string, HoverStyle>();

  try {
    // Execute in browser context to access CSSOM
    const extractedStyles = await page.evaluate(() => {
      const styles: Array<{
        selector: string;
        properties: Record<string, string>;
        specificity: number;
      }> = [];

      // Iterate through all stylesheets
      for (const stylesheet of Array.from(document.styleSheets)) {
        try {
          // Skip external stylesheets from different origins
          if (stylesheet.href && !stylesheet.href.startsWith(window.location.origin)) {
            continue;
          }

          const rules = Array.from(stylesheet.cssRules || []);

          for (const rule of rules) {
            // Check if it's a style rule
            if (rule instanceof CSSStyleRule) {
              const selectorText = rule.selectorText;

              // Check if selector contains :hover
              if (selectorText && selectorText.includes(":hover")) {
                const properties: Record<string, string> = {};

                // Extract relevant hover properties
                const style = rule.style;
                const relevantProps = [
                  "backgroundColor",
                  "background-color",
                  "color",
                  "borderColor",
                  "border-color",
                  "transform",
                  "opacity",
                  "boxShadow",
                  "box-shadow",
                  "scale",
                ];

                for (const prop of relevantProps) {
                  const value = style.getPropertyValue(prop) || (style as any)[prop];
                  if (value) {
                    // Normalize property names to camelCase
                    const normalizedProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    properties[normalizedProp] = value;
                  }
                }

                // Only include if we found relevant properties
                if (Object.keys(properties).length > 0) {
                  // Calculate specificity (rough estimation)
                  let specificity = 0;
                  specificity += (selectorText.match(/#/g) || []).length * 100; // IDs
                  specificity += (selectorText.match(/\./g) || []).length * 10;  // Classes
                  specificity += (selectorText.match(/\[/g) || []).length * 10;  // Attributes
                  specificity += (selectorText.match(/:/g) || []).length * 5;    // Pseudo-classes
                  specificity += selectorText.split(/\s+/).length;                // Elements

                  styles.push({
                    selector: selectorText,
                    properties,
                    specificity,
                  });
                }
              }
            }
          }
        } catch (e) {
          // Skip stylesheets that throw CORS errors
          console.warn("Could not access stylesheet:", e);
        }
      }

      return styles;
    });

    // Convert to Map
    for (const style of extractedStyles) {
      hoverStyles.set(style.selector, {
        selector: style.selector,
        properties: style.properties,
        specificity: style.specificity,
      });
    }
  } catch (error) {
    console.error("Error extracting hover styles:", error);
  }

  return hoverStyles;
}

/**
 * Associate hover styles with component types based on selectors
 * 
 * @param hoverStyles - Extracted hover styles
 * @returns Hover data organized by component type
 */
export function categorizeHoverStyles(
  hoverStyles: Map<string, HoverStyle>
): Map<string, ComponentHoverData> {
  const categorized = new Map<string, ComponentHoverData>();

  // Initialize categories
  const componentTypes: Array<ComponentHoverData["componentType"]> = [
    "button",
    "link",
    "card",
    "input",
    "nav-item",
  ];

  for (const type of componentTypes) {
    categorized.set(type, {
      componentType: type,
      hoverStyles: [],
      count: 0,
    });
  }

  // Categorize each hover style
  for (const [selector, style] of hoverStyles) {
    const lowerSelector = selector.toLowerCase();

    // Button patterns
    if (
      lowerSelector.includes("button") ||
      lowerSelector.includes("btn") ||
      lowerSelector.match(/\[role=["']button["']\]/)
    ) {
      const data = categorized.get("button")!;
      data.hoverStyles.push(style);
      data.count++;
    }

    // Link patterns
    else if (
      lowerSelector.includes("a:hover") ||
      lowerSelector.includes("link") ||
      lowerSelector.match(/a\s*:hover/)
    ) {
      const data = categorized.get("link")!;
      data.hoverStyles.push(style);
      data.count++;
    }

    // Card patterns
    else if (
      lowerSelector.includes("card") ||
      lowerSelector.includes("tile") ||
      lowerSelector.includes("panel")
    ) {
      const data = categorized.get("card")!;
      data.hoverStyles.push(style);
      data.count++;
    }

    // Input patterns
    else if (
      lowerSelector.includes("input") ||
      lowerSelector.includes("textarea") ||
      lowerSelector.includes("select")
    ) {
      const data = categorized.get("input")!;
      data.hoverStyles.push(style);
      data.count++;
    }

    // Navigation patterns
    else if (
      lowerSelector.includes("nav") ||
      lowerSelector.includes("menu") ||
      lowerSelector.includes("navbar")
    ) {
      const data = categorized.get("nav-item")!;
      data.hoverStyles.push(style);
      data.count++;
    }
  }

  // Remove empty categories
  for (const [key, data] of categorized) {
    if (data.count === 0) {
      categorized.delete(key);
    }
  }

  return categorized;
}

/**
 * Extract and organize all hover styles from the page
 * 
 * @param page - Playwright page instance
 * @returns Organized hover data by component type
 */
export async function extractComponentHoverData(
  page: Page
): Promise<Map<string, ComponentHoverData>> {
  const hoverStyles = await extractHoverStyles(page);
  return categorizeHoverStyles(hoverStyles);
}

/**
 * Get the most common hover effect for a component type
 * 
 * @param hoverData - Hover data for a component type
 * @returns Most representative hover properties
 */
export function getMostCommonHoverEffect(
  hoverData: ComponentHoverData
): HoverStyle["properties"] | null {
  if (hoverData.hoverStyles.length === 0) {
    return null;
  }

  // Sort by specificity and take the highest
  const sortedStyles = [...hoverData.hoverStyles].sort(
    (a, b) => b.specificity - a.specificity
  );

  // Return the most specific hover effect
  return sortedStyles[0].properties;
}

/**
 * Convert hover data to a simple format for scraper output
 * 
 * @param hoverDataMap - Map of hover data by component type
 * @returns Simplified hover data object
 */
export function serializeHoverData(
  hoverDataMap: Map<string, ComponentHoverData>
): Record<string, {
  count: number;
  commonEffect: HoverStyle["properties"] | null;
  allEffects: HoverStyle[];
}> {
  const serialized: Record<string, any> = {};

  for (const [type, data] of hoverDataMap) {
    serialized[type] = {
      count: data.count,
      commonEffect: getMostCommonHoverEffect(data),
      allEffects: data.hoverStyles,
    };
  }

  return serialized;
}

