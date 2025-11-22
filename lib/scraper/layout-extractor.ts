import { StyledNode, Layouts, LayoutSection } from "./types";

interface Section {
  type: string;
  y: number;
  height: number;
  x: number;
  width: number;
  node: StyledNode;
  confidence?: "high" | "medium" | "low";
  framework?: "shadcn/ui" | "generic";
  metadata?: Record<string, any>;
}

// ============================================================================
// shadcn/ui Detection Helpers
// ============================================================================

/**
 * Detect shadcn/ui Sidebar component
 */
function isShadcnSidebar(node: StyledNode, viewportHeight: number): boolean {
  try {
    // Check for shadcn sidebar data attributes
    if (node.dataAttributes['data-sidebar'] !== undefined) {
      return true;
    }
    
    // Check for sidebar class patterns
    if (node.classes.some(c => 
      c.includes('sidebar') || 
      c === 'group/sidebar' ||
      c.startsWith('sidebar')
    )) {
      return true;
    }
    
    // Structural detection: narrow, tall element on the side
    const isNarrow = node.rect.width >= 200 && node.rect.width <= 320;
    const isTall = node.rect.height > viewportHeight * 0.5;
    const isOnSide = node.rect.x < 50 || node.rect.x > viewportHeight * 0.7;
    
    if (isNarrow && isTall && isOnSide) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Detect shadcn/ui NavigationMenu component
 */
function isShadcnNavigationMenu(node: StyledNode): boolean {
  try {
    // Check for Radix NavigationMenu data attributes
    if (node.dataAttributes['data-radix-navigation-menu'] !== undefined) {
      return true;
    }
    
    // Check for navigation-menu classes
    if (node.classes.some(c => c.includes('navigation-menu'))) {
      return true;
    }
    
    // Check for navigation role with flex display
    if (node.role === 'navigation' && node.styles.display.includes('flex')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Check if node has Tailwind container classes
 */
function hasTailwindContainer(node: StyledNode): boolean {
  return node.classes.some(c => 
    c === 'container' || 
    c.startsWith('max-w-') ||
    c === 'mx-auto'
  );
}

/**
 * Get child nodes that match a parent
 */
function getChildNodes(parent: StyledNode, allNodes: StyledNode[]): StyledNode[] {
  return allNodes.filter(node => {
    return (
      node.rect.x >= parent.rect.x &&
      node.rect.y >= parent.rect.y &&
      node.rect.x + node.rect.width <= parent.rect.x + parent.rect.width &&
      node.rect.y + node.rect.height <= parent.rect.y + parent.rect.height &&
      node !== parent
    );
  });
}

/**
 * Detect shadcn/ui Card grid pattern
 */
function isShadcnCardGrid(node: StyledNode, allNodes: StyledNode[]): boolean {
  try {
    // Check for grid layout
    const hasGridLayout = (
      node.classes.some(c => c.includes('grid')) ||
      node.styles.display === 'grid' ||
      node.styles.gridTemplateColumns !== 'none'
    );
    
    if (!hasGridLayout) {
      return false;
    }
    
    // Check for card children
    const children = getChildNodes(node, allNodes);
    const cardChildren = children.filter(child =>
      child.classes.some(c => 
        c.includes('card') || 
        (c.includes('rounded') && c.includes('border')) ||
        c.includes('rounded-lg') ||
        c.includes('rounded-xl')
      )
    );
    
    return cardChildren.length >= 2;
  } catch {
    return false;
  }
}

/**
 * Determine the specific type of shadcn card grid
 */
function determineShadcnCardGridType(node: StyledNode): string {
  const classes = node.classes.join(" ").toLowerCase();
  
  if (classes.includes("feature") || classes.includes("benefit")) {
    return "Features";
  }
  if (classes.includes("pricing") || classes.includes("plan")) {
    return "Pricing";
  }
  if (classes.includes("testimonial") || classes.includes("review")) {
    return "Testimonials";
  }
  if (classes.includes("team") || classes.includes("member")) {
    return "Team";
  }
  if (classes.includes("service")) {
    return "Services";
  }
  
  return "Card Section";
}

// ============================================================================
// Generic Detection Helpers
// ============================================================================

/**
 * Detect fixed/sticky navbar
 */
function isFixedNavbar(node: StyledNode): boolean {
  try {
    const isFixedOrSticky = node.styles.position === 'fixed' || node.styles.position === 'sticky';
    const isAtTop = node.rect.y < 150;
    const isWideEnough = node.rect.width > window.innerWidth * 0.7;
    const hasHighZIndex = node.styles.zIndex !== 'auto' && parseInt(node.styles.zIndex) > 10;
    
    return (isFixedOrSticky && isAtTop) || (isAtTop && isWideEnough && hasHighZIndex);
  } catch {
    return false;
  }
}

/**
 * Detect sidebar (generic)
 */
function isSidebar(node: StyledNode, viewportWidth: number, viewportHeight: number): boolean {
  try {
    const isNarrow = node.rect.width >= 200 && node.rect.width <= 400;
    const isTall = node.rect.height > viewportHeight * 0.5;
    const widthRatio = node.rect.width / viewportWidth;
    const isOnSide = widthRatio >= 0.15 && widthRatio <= 0.3;
    
    return isNarrow && isTall && isOnSide;
  } catch {
    return false;
  }
}

/**
 * Detect footer
 */
function isFooter(node: StyledNode, viewportHeight: number): boolean {
  try {
    const tag = node.tag.toLowerCase();
    const classes = node.classes.join(" ").toLowerCase();
    
    // Check tag and classes - primary indicator
    if (tag === "footer" || classes.includes("footer")) {
      return true;
    }
    
    // Check position (bottom of page) - more lenient
    const isNearBottom = node.rect.y > viewportHeight * 0.6; // Reduced from 0.7
    const isWide = node.rect.width > window.innerWidth * 0.7; // Reduced from 0.8
    const hasTallHeight = node.rect.height > 100; // Must be substantial
    
    // Look for footer-like patterns
    const hasFooterPatterns = classes.includes('bottom') || 
                              classes.includes('copyright') ||
                              classes.includes('contact');
    
    return (isNearBottom && isWide && hasTallHeight) || hasFooterPatterns;
  } catch {
    return false;
  }
}

/**
 * Detect hero section
 */
function isHeroSection(node: StyledNode): boolean {
  try {
    const classes = node.classes.join(" ").toLowerCase();
    
    // Check for hero class
    if (classes.includes("hero")) {
      return true;
    }
    
    // Check for full-screen classes
    const hasFullHeight = classes.includes('min-h-screen') || 
                          classes.includes('h-screen') ||
                          classes.includes('h-full');
    
    if (hasFullHeight) {
      return true;
    }
    
    // Structural detection: large section near top - more lenient
    const isNearTop = node.rect.y < 500; // Increased from 300 to account for navbar
    const isTall = node.rect.height > 300; // Reduced from 400 to be more lenient
    const isWide = node.rect.width > window.innerWidth * 0.6; // Reduced from 0.7
    
    // Also check if it's the first major section after header/nav
    const hasLargeContent = node.rect.height > 250 && node.rect.width > window.innerWidth * 0.5;
    const isTopSection = node.rect.y >= 50 && node.rect.y < 400;
    
    return (isNearTop && isTall && isWide) || (hasLargeContent && isTopSection);
  } catch {
    return false;
  }
}

/**
 * Detect gallery section
 */
function isGallery(node: StyledNode, allNodes: StyledNode[]): boolean {
  try {
    const classes = node.classes.join(" ").toLowerCase();
    
    // Check for gallery classes
    if (classes.includes("gallery") || classes.includes("image-grid")) {
      return true;
    }
    
    // Check for grid with image children
    const hasGridLayout = node.classes.some(c => c.includes('grid')) || node.styles.display === 'grid';
    if (!hasGridLayout) {
      return false;
    }
    
    const children = getChildNodes(node, allNodes);
    const imageChildren = children.filter(child => 
      child.tag === 'img' || 
      child.classes.some(c => c.includes('image'))
    );
    
    return imageChildren.length >= 4;
  } catch {
    return false;
  }
}

/**
 * Detect card section (generic)
 */
function isCardSection(node: StyledNode, allNodes: StyledNode[]): boolean {
  try {
    const children = getChildNodes(node, allNodes);
    
    // Need at least 3 children
    if (children.length < 3) {
      return false;
    }
    
    // Check if children have similar sizes (card pattern)
    const childWidths = children.map(c => c.rect.width).filter(w => w > 100);
    const childHeights = children.map(c => c.rect.height).filter(h => h > 100);
    
    if (childWidths.length < 3 || childHeights.length < 3) {
      return false;
    }
    
    // Check for similar sizes (within 20% variation)
    const avgWidth = childWidths.reduce((a, b) => a + b) / childWidths.length;
    const avgHeight = childHeights.reduce((a, b) => a + b) / childHeights.length;
    
    const similarWidths = childWidths.filter(w => 
      Math.abs(w - avgWidth) / avgWidth < 0.2
    ).length >= childWidths.length * 0.7;
    
    const similarHeights = childHeights.filter(h => 
      Math.abs(h - avgHeight) / avgHeight < 0.3
    ).length >= childHeights.length * 0.7;
    
    return similarWidths && similarHeights;
  } catch {
    return false;
  }
}

/**
 * Detect text-heavy section
 */
function isTextSection(node: StyledNode): boolean {
  try {
    const hasHighTextContent = node.textLength > 500;
    const hasTextClasses = node.classes.some(c => 
      c.includes('prose') || 
      c.includes('content') ||
      c.includes('article')
    );
    
    return hasHighTextContent || hasTextClasses;
  } catch {
    return false;
  }
}

/**
 * Detect form section
 */
function isFormSection(node: StyledNode, allNodes: StyledNode[]): boolean {
  try {
    if (node.tag === 'form') {
      return true;
    }
    
    const children = getChildNodes(node, allNodes);
    const formElements = children.filter(child => 
      ['input', 'textarea', 'select', 'button'].includes(child.tag) ||
      child.role === 'textbox' ||
      child.classes.some(c => c.includes('input') || c.includes('form'))
    );
    
    return formElements.length >= 2;
  } catch {
    return false;
  }
}

/**
 * Match class patterns
 */
function matchesClassPatterns(node: StyledNode, patterns: string[]): boolean {
  const classes = node.classes.join(" ").toLowerCase();
  return patterns.some(pattern => classes.includes(pattern));
}

// ============================================================================
// Main Detection Logic
// ============================================================================

/**
 * Determine section type with priority-based detection
 */
function determineSectionType(
  node: StyledNode,
  allNodes: StyledNode[],
  viewportWidth: number,
  viewportHeight: number
): { type: string; confidence: "high" | "medium" | "low"; framework?: "shadcn/ui" | "generic"; metadata?: Record<string, any> } {
  
  // PRIORITY 1: shadcn/ui-specific patterns (highest confidence)
  if (isShadcnSidebar(node, viewportHeight)) {
    return { type: "Sidebar", confidence: "high", framework: "shadcn/ui" };
  }
  
  if (isShadcnNavigationMenu(node)) {
    return { type: "Navigation Menu", confidence: "high", framework: "shadcn/ui" };
  }
  
  if (isShadcnCardGrid(node, allNodes)) {
    const cardType = determineShadcnCardGridType(node);
    const children = getChildNodes(node, allNodes);
    const cardCount = children.filter(c => 
      c.classes.some(cls => cls.includes('card'))
    ).length;
    
    return { 
      type: cardType, 
      confidence: "high", 
      framework: "shadcn/ui",
      metadata: { cardCount, layoutType: "grid" }
    };
  }
  
  // PRIORITY 2: Position-based detection
  if (isFixedNavbar(node)) {
    const isSticky = node.styles.position === 'sticky';
    return { type: "Navbar", confidence: "high", metadata: { isSticky } };
  }
  
  if (isFooter(node, viewportHeight)) {
    return { type: "Footer", confidence: "high" };
  }
  
  if (isSidebar(node, viewportWidth, viewportHeight)) {
    return { type: "Sidebar", confidence: "medium" };
  }
  
  // PRIORITY 3: Structural analysis
  if (isHeroSection(node)) {
    return { type: "Hero", confidence: "high" };
  }
  
  if (isGallery(node, allNodes)) {
    return { type: "Gallery", confidence: "medium", metadata: { layoutType: "grid" } };
  }
  
  if (isCardSection(node, allNodes)) {
    return { type: "Card Section", confidence: "medium", metadata: { layoutType: "grid" } };
  }
  
  // PRIORITY 4: Content-based
  if (isTextSection(node)) {
    return { type: "Text Section", confidence: "low" };
  }
  
  if (isFormSection(node, allNodes)) {
    return { type: "Form", confidence: "medium" };
  }
  
  // PRIORITY 5: Class/tag fallback
  if (matchesClassPatterns(node, ["features", "benefit"])) {
    return { type: "Features", confidence: "low" };
  }
  if (matchesClassPatterns(node, ["pricing", "plan"])) {
    return { type: "Pricing", confidence: "low" };
  }
  if (matchesClassPatterns(node, ["testimonial", "review"])) {
    return { type: "Testimonials", confidence: "low" };
  }
  if (matchesClassPatterns(node, ["cta", "call-to-action"])) {
    return { type: "CTA", confidence: "low" };
  }
  
  const tag = node.tag.toLowerCase();
  const classes = node.classes.join(" ").toLowerCase();
  
  if (tag === "header" || classes.includes("header")) {
    return { type: "Header", confidence: "medium" };
  }
  if (tag === "nav" || classes.includes("nav")) {
    return { type: "Navigation", confidence: "medium" };
  }
  
  return { type: "Section", confidence: "low" };
}

/**
 * Detect sections with multiple strategies
 */
function detectSections(nodes: StyledNode[], viewportWidth: number, viewportHeight: number): Section[] {
  const sections: Section[] = [];
  const processed = new Set<StyledNode>();
  
  try {
    // Pass 1: shadcn/ui component detection (highest priority)
    nodes.forEach(node => {
      if (processed.has(node)) return;
      
      try {
        if (isShadcnSidebar(node, viewportHeight)) {
          sections.push({
            type: "Sidebar",
            x: node.rect.x,
            y: node.rect.y,
            width: node.rect.width,
            height: node.rect.height,
            node,
            confidence: "high",
            framework: "shadcn/ui"
          });
          processed.add(node);
        } else if (isShadcnNavigationMenu(node)) {
          sections.push({
            type: "Navigation Menu",
            x: node.rect.x,
            y: node.rect.y,
            width: node.rect.width,
            height: node.rect.height,
            node,
            confidence: "high",
            framework: "shadcn/ui"
          });
          processed.add(node);
        } else if (isShadcnCardGrid(node, nodes)) {
          const cardType = determineShadcnCardGridType(node);
          sections.push({
            type: cardType,
            x: node.rect.x,
            y: node.rect.y,
            width: node.rect.width,
            height: node.rect.height,
            node,
            confidence: "high",
            framework: "shadcn/ui",
            metadata: { layoutType: "grid" }
          });
          processed.add(node);
        }
      } catch (error) {
        // Skip problematic nodes
      }
    });
    
    // Pass 2: Special sections (navbar, footer) - these may not meet size requirements
    nodes.forEach(node => {
      if (processed.has(node)) return;
      
      try {
        const tag = node.tag.toLowerCase();
        const classes = node.classes.join(" ").toLowerCase();
        
        // Navbar detection - prioritize even if small
        if (tag === 'nav' || 
            tag === 'header' || 
            classes.includes('nav') || 
            classes.includes('header') ||
            node.role === 'navigation' ||
            isFixedNavbar(node)) {
          
          const isAtTop = node.rect.y < 150;
          const isWideEnough = node.rect.width >= viewportWidth * 0.6;
          
          if (isAtTop && isWideEnough) {
            const isSticky = node.styles.position === 'sticky' || node.styles.position === 'fixed';
            sections.push({
              type: tag === 'nav' || node.role === 'navigation' ? "Navbar" : "Header",
              x: node.rect.x,
              y: node.rect.y,
              width: node.rect.width,
              height: node.rect.height,
              node,
              confidence: "high",
              metadata: { isSticky }
            });
            processed.add(node);
            return;
          }
        }
        
        // Footer detection - prioritize even if at various positions
        if (tag === 'footer' || classes.includes('footer')) {
          const isWideEnough = node.rect.width >= viewportWidth * 0.6;
          if (isWideEnough) {
            sections.push({
              type: "Footer",
              x: node.rect.x,
              y: node.rect.y,
              width: node.rect.width,
              height: node.rect.height,
              node,
              confidence: "high"
            });
            processed.add(node);
            return;
          }
        }
      } catch (error) {
        // Skip problematic nodes
      }
    });
    
    // Pass 3: Hero and main sections
    nodes.forEach(node => {
      if (processed.has(node)) return;
      
      try {
        // Hero section detection - more lenient
        if (isHeroSection(node)) {
          sections.push({
            type: "Hero",
            x: node.rect.x,
            y: node.rect.y,
            width: node.rect.width,
            height: node.rect.height,
            node,
            confidence: "high"
          });
          processed.add(node);
          return;
        }
      } catch (error) {
        // Skip problematic nodes
      }
    });
    
    // Pass 4: Large containers and main sections
    nodes.forEach(node => {
      if (processed.has(node)) return;
      
      try {
        // Filter for significant sections - lower threshold
        const isSignificantSize = (
          node.rect.width >= viewportWidth * 0.4 && 
          node.rect.height >= 80
        );
        
        const isStructuralElement = [
          "div", "section", "header", "footer", "main", "nav", "article", "aside"
        ].includes(node.tag);
        
        if (isSignificantSize && isStructuralElement) {
          const detection = determineSectionType(node, nodes, viewportWidth, viewportHeight);
          
          // Only add if medium or high confidence
          if (detection.confidence !== "low" || sections.length < 5) {
            sections.push({
              type: detection.type,
              x: node.rect.x,
              y: node.rect.y,
              width: node.rect.width,
              height: node.rect.height,
              node,
              confidence: detection.confidence,
              framework: detection.framework,
              metadata: detection.metadata
            });
            processed.add(node);
          }
        }
      } catch (error) {
        // Skip problematic nodes
      }
    });
    
    // Sort by Y position (top to bottom)
    sections.sort((a, b) => a.y - b.y);
    
    // Deduplicate overlapping sections
    const deduplicated: Section[] = [];
    sections.forEach(section => {
      const overlaps = deduplicated.some(existing => {
        const overlapX = Math.max(0, Math.min(
          section.x + section.width,
          existing.x + existing.width
        ) - Math.max(section.x, existing.x));
        
        const overlapY = Math.max(0, Math.min(
          section.y + section.height,
          existing.y + existing.height
        ) - Math.max(section.y, existing.y));
        
        const overlapArea = overlapX * overlapY;
        const sectionArea = section.width * section.height;
        const existingArea = existing.width * existing.height;
        
        const overlapRatio = overlapArea / Math.min(sectionArea, existingArea);
        
        // If significant overlap, keep the one with higher confidence
        if (overlapRatio > 0.5) {
          const confidenceOrder = { high: 3, medium: 2, low: 1 };
          const sectionConf = confidenceOrder[section.confidence || "low"];
          const existingConf = confidenceOrder[existing.confidence || "low"];
          
          return existingConf >= sectionConf;
        }
        
        return false;
      });
      
      if (!overlaps) {
        deduplicated.push(section);
      }
    });
    
    return deduplicated;
  } catch (error) {
    console.error("Section detection failed:", error);
    return [];
  }
}

/**
 * Extract layout structure from nodes
 */
export function extractLayout(nodes: StyledNode[]): Layouts {
  try {
    // Calculate viewport dimensions
    const viewportWidth = nodes.reduce((max, node) => {
      try {
        return Math.max(max, node.rect.x + node.rect.width);
      } catch {
        return max;
      }
    }, 1920);
    
    const viewportHeight = nodes.reduce((max, node) => {
      try {
        return Math.max(max, node.rect.y + node.rect.height);
      } catch {
        return max;
      }
    }, 1080);

    const sections = detectSections(nodes, viewportWidth, viewportHeight);
    
    // Convert to LayoutSection format
    const layoutSections: LayoutSection[] = sections.map(section => ({
      type: section.type,
      position: {
        x: section.x,
        y: section.y,
        width: section.width,
        height: section.height
      },
      metadata: {
        confidence: section.confidence,
        framework: section.framework,
        ...section.metadata
      }
    }));
    
    return {
      sections: layoutSections
    };
  } catch (error) {
    console.error("Layout extraction failed:", error);
    return {
      sections: []
    };
  }
}
