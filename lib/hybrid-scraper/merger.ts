import { Tokens, Components, Layouts, LayoutSection } from "../scraper/types";

/**
 * Merge strategy type
 */
export type MergeStrategy = "dom-priority" | "vision-priority" | "best-of-both";

/**
 * Intelligently merge tokens from DOM and vision AI
 */
export function mergeTokens(
  domTokens: Tokens,
  visionTokens: Tokens,
  strategy: MergeStrategy
): Tokens {
  switch (strategy) {
    case "dom-priority":
      // DOM data is precise, use vision AI to fill gaps
      return {
        colors: { ...visionTokens.colors, ...domTokens.colors },
        fonts: { ...visionTokens.fonts, ...domTokens.fonts },
        radius: { ...visionTokens.radius, ...domTokens.radius },
        spacing: { ...visionTokens.spacing, ...domTokens.spacing },
        shadows: { ...visionTokens.shadows, ...domTokens.shadows },
      };
      
    case "vision-priority":
      // Vision AI might capture visual nuances better
      return {
        colors: { ...domTokens.colors, ...visionTokens.colors },
        fonts: { ...domTokens.fonts, ...visionTokens.fonts },
        radius: { ...domTokens.radius, ...visionTokens.radius },
        spacing: { ...domTokens.spacing, ...visionTokens.spacing },
        shadows: { ...domTokens.shadows, ...visionTokens.shadows },
      };
      
    case "best-of-both":
    default:
      // Intelligent merge - use DOM for precise values, vision for context
      return {
        // Colors: DOM is more accurate for exact hex values
        colors: {
          ...visionTokens.colors,
          ...domTokens.colors,
        },
        
        // Fonts: DOM gives exact font-family values
        fonts: {
          sans: domTokens.fonts.sans || visionTokens.fonts.sans,
          serif: domTokens.fonts.serif || visionTokens.fonts.serif,
          mono: domTokens.fonts.mono || visionTokens.fonts.mono,
          sizes: domTokens.fonts.sizes.body ? domTokens.fonts.sizes : visionTokens.fonts.sizes,
        },
        
        // Radius: DOM is more precise
        radius: {
          small: domTokens.radius.small || visionTokens.radius.small,
          medium: domTokens.radius.medium || visionTokens.radius.medium,
          large: domTokens.radius.large || visionTokens.radius.large,
        },
        
        // Spacing: DOM is more accurate
        spacing: {
          base: domTokens.spacing.base || visionTokens.spacing.base,
        },
        
        // Shadows: DOM is more precise
        shadows: {
          base: domTokens.shadows.base || visionTokens.shadows.base,
          large: domTokens.shadows.large || visionTokens.shadows.large,
        },
      };
  }
}

/**
 * Intelligently merge components from DOM and vision AI
 */
export function mergeComponents(
  domComponents: Components,
  visionComponents: Components,
  strategy: MergeStrategy
): Components {
  switch (strategy) {
    case "dom-priority":
      return {
        buttons: [...domComponents.buttons],
        cards: [...domComponents.cards],
        navItems: [...domComponents.navItems],
        // Add vision AI's additional component types if detected
        ...(visionComponents.forms && visionComponents.forms.length > 0 ? { forms: visionComponents.forms } : {}),
        ...(visionComponents.feedback && visionComponents.feedback.length > 0 ? { feedback: visionComponents.feedback } : {}),
        ...(visionComponents.dataDisplay && visionComponents.dataDisplay.length > 0 ? { dataDisplay: visionComponents.dataDisplay } : {}),
      };
      
    case "vision-priority":
      return {
        buttons: [...visionComponents.buttons],
        cards: [...visionComponents.cards],
        navItems: [...visionComponents.navItems],
        // Keep DOM's precise detection if vision missed something
        ...(visionComponents.forms || domComponents.forms ? { forms: visionComponents.forms || [] } : {}),
        ...(visionComponents.feedback || domComponents.feedback ? { feedback: visionComponents.feedback || [] } : {}),
        ...(visionComponents.dataDisplay || domComponents.dataDisplay ? { dataDisplay: visionComponents.dataDisplay || [] } : {}),
      };
      
    case "best-of-both":
    default:
      // Merge and deduplicate components
      return {
        // Use DOM for precise component detection
        buttons: mergeAndDeduplicateComponents(domComponents.buttons, visionComponents.buttons),
        cards: mergeAndDeduplicateComponents(domComponents.cards, visionComponents.cards),
        navItems: mergeAndDeduplicateComponents(domComponents.navItems, visionComponents.navItems),
        
        // Add vision AI's additional component categories
        ...(visionComponents.forms && visionComponents.forms.length > 0 ? { forms: visionComponents.forms } : {}),
        ...(visionComponents.feedback && visionComponents.feedback.length > 0 ? { feedback: visionComponents.feedback } : {}),
        ...(visionComponents.dataDisplay && visionComponents.dataDisplay.length > 0 ? { dataDisplay: visionComponents.dataDisplay } : {}),
      };
  }
}

/**
 * Merge and deduplicate component arrays
 */
function mergeAndDeduplicateComponents(domComps: any[], visionComps: any[]): any[] {
  // Prioritize DOM components (more accurate), but add vision components if they're unique
  const merged = [...domComps];
  
  // Add vision components that seem unique
  for (const visionComp of visionComps) {
    const isDuplicate = domComps.some(domComp => 
      areComponentsSimilar(domComp, visionComp)
    );
    
    if (!isDuplicate) {
      merged.push({ ...visionComp, source: "vision-ai" });
    }
  }
  
  return merged;
}

/**
 * Check if two components are similar (likely duplicates)
 */
function areComponentsSimilar(comp1: any, comp2: any): boolean {
  // Simple similarity check based on style properties
  if (!comp1.styles || !comp2.styles) return false;
  
  // Compare key style properties
  const color1 = comp1.styles.background || comp1.styles.color;
  const color2 = comp2.styles.background || comp2.styles.color;
  
  const radius1 = comp1.styles.borderRadius;
  const radius2 = comp2.styles.borderRadius;
  
  const padding1 = comp1.styles.padding;
  const padding2 = comp2.styles.padding;
  
  // If colors and radius are similar, consider them duplicates
  return color1 === color2 && radius1 === radius2 && padding1 === padding2;
}

/**
 * Intelligently merge layouts from DOM and vision AI
 */
export function mergeLayouts(
  domLayouts: Layouts,
  visionLayouts: Layouts,
  strategy: MergeStrategy
): Layouts {
  switch (strategy) {
    case "dom-priority":
      // Use DOM's precise section detection
      return {
        sections: [...domLayouts.sections],
      };
      
    case "vision-priority":
      // Use vision AI's semantic understanding
      return {
        sections: [...visionLayouts.sections],
      };
      
    case "best-of-both":
    default:
      // Merge sections intelligently
      const mergedSections: LayoutSection[] = [];
      
      // Start with DOM sections (more accurate positioning)
      const domSections = [...domLayouts.sections];
      const visionSections = [...visionLayouts.sections];
      
      // For each DOM section, check if vision AI has better semantic understanding
      for (const domSection of domSections) {
        // Find overlapping vision section
        const matchingVisionSection = visionSections.find(vSection =>
          areSectionsOverlapping(domSection, vSection)
        );
        
        if (matchingVisionSection) {
          // Merge: use DOM position, but prefer vision AI's semantic type if more specific
          mergedSections.push({
            type: matchingVisionSection.type !== "Section" ? matchingVisionSection.type : domSection.type,
            position: domSection.position, // DOM has accurate positioning
            metadata: {
              ...domSection.metadata,
              ...matchingVisionSection.metadata,
              source: "hybrid",
              domType: domSection.type,
              visionType: matchingVisionSection.type,
            },
          });
          
          // Remove from vision sections to avoid duplicates
          const index = visionSections.indexOf(matchingVisionSection);
          if (index > -1) {
            visionSections.splice(index, 1);
          }
        } else {
          // No matching vision section, keep DOM section
          mergedSections.push({
            ...domSection,
            metadata: {
              ...domSection.metadata,
              source: "dom",
            },
          });
        }
      }
      
      // Add remaining vision sections that weren't matched
      for (const visionSection of visionSections) {
        mergedSections.push({
          ...visionSection,
          metadata: {
            ...visionSection.metadata,
            source: "vision-ai",
          },
        });
      }
      
      // Sort by Y position
      mergedSections.sort((a, b) => a.position.y - b.position.y);
      
      return {
        sections: mergedSections,
      };
  }
}

/**
 * Check if two sections overlap spatially
 */
function areSectionsOverlapping(section1: LayoutSection, section2: LayoutSection): boolean {
  const pos1 = section1.position;
  const pos2 = section2.position;
  
  // Calculate overlap area
  const overlapX = Math.max(
    0,
    Math.min(pos1.x + pos1.width, pos2.x + pos2.width) - Math.max(pos1.x, pos2.x)
  );
  
  const overlapY = Math.max(
    0,
    Math.min(pos1.y + pos1.height, pos2.y + pos2.height) - Math.max(pos1.y, pos2.y)
  );
  
  const overlapArea = overlapX * overlapY;
  const area1 = pos1.width * pos1.height;
  const area2 = pos2.width * pos2.height;
  const minArea = Math.min(area1, area2);
  
  // If overlap is more than 50% of the smaller section, consider them overlapping
  return overlapArea / minArea > 0.5;
}

