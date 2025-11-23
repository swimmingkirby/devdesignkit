import { Tokens, Components, Layouts, LayoutSection } from "../scraper/types";
import { enrichColorWithPrecision, validateColorMatch } from "./color-validator";
import { MergeLogger } from "./merge-logger";

/**
 * Merge strategy type
 */
export type MergeStrategy = "dom-priority" | "vision-priority" | "best-of-both";

/**
 * Intelligently merge tokens from DOM and vision AI with logging
 * NEW APPROACH: Vision AI first, DOM provides precision, cross-check everything
 */
export function mergeTokens(
  domTokens: Tokens,
  visionTokens: Tokens,
  strategy: MergeStrategy,
  logger: MergeLogger
): Tokens {
  console.log("\n🎨 Merging Tokens...\n");

  switch (strategy) {
    case "dom-priority":
      // Legacy: DOM data is precise, use vision AI to fill gaps
      return {
        colors: { ...visionTokens.colors, ...domTokens.colors },
        fonts: { ...visionTokens.fonts, ...domTokens.fonts },
        radius: { ...visionTokens.radius, ...domTokens.radius },
        spacing: { ...visionTokens.spacing, ...domTokens.spacing },
        shadows: { ...visionTokens.shadows, ...domTokens.shadows },
      };
      
    case "vision-priority":
      // Legacy: Vision AI might capture visual nuances better
      return {
        colors: { ...domTokens.colors, ...visionTokens.colors },
        fonts: { ...domTokens.fonts, ...visionTokens.fonts },
        radius: { ...domTokens.radius, ...visionTokens.radius },
        spacing: { ...domTokens.spacing, ...visionTokens.spacing },
        shadows: { ...domTokens.shadows, ...visionTokens.shadows },
      };
      
    case "best-of-both":
    default:
      // NEW: Vision AI base + DOM precision with validation
      const enrichedColors: Record<string, string> = {};

      // Process each color role
      for (const [role, visionColor] of Object.entries(visionTokens.colors)) {
        if (!visionColor) continue;

        const domColor = (domTokens.colors as any)[role];
        
        // Enrich with DOM precision
        const enrichment = enrichColorWithPrecision(
          role,
          visionColor,
          domColor,
          domTokens.colors as Record<string, string>,
          25 // 25% threshold
        );

        enrichedColors[role] = enrichment.color;

        // Log the decision
        if (enrichment.validation.matched) {
          logger.logColorMatch(
            role,
            visionColor,
            domColor,
            enrichment.color,
            enrichment.validation,
            enrichment.reason,
            enrichment.source
          );
        } else {
          logger.logColorMismatch(
            role,
            visionColor,
            domColor,
            enrichment.color,
            enrichment.validation,
            enrichment.reason,
            enrichment.source
          );
        }
      }

      // Fonts: Use DOM for precise values (Vision AI often gets font names wrong)
      const enrichedFonts = {
        sans: domTokens.fonts.sans || visionTokens.fonts.sans,
        serif: domTokens.fonts.serif || visionTokens.fonts.serif,
        mono: domTokens.fonts.mono || visionTokens.fonts.mono,
        sizes: domTokens.fonts.sizes.body ? domTokens.fonts.sizes : visionTokens.fonts.sizes,
      };

      console.log("📝 Fonts: Using DOM values for precision");
      console.log(`   Sans:  ${enrichedFonts.sans}`);
      console.log(`   Serif: ${enrichedFonts.serif}`);
      console.log(`   Mono:  ${enrichedFonts.mono}\n`);

      // Radius: Use DOM for precise CSS values
      const enrichedRadius = {
        small: domTokens.radius.small || visionTokens.radius.small,
        medium: domTokens.radius.medium || visionTokens.radius.medium,
        large: domTokens.radius.large || visionTokens.radius.large,
      };

      console.log("⭕ Radius: Using DOM values for precision");
      console.log(`   Small:  ${enrichedRadius.small}`);
      console.log(`   Medium: ${enrichedRadius.medium}`);
      console.log(`   Large:  ${enrichedRadius.large}\n`);

      // Spacing: Use DOM for precise CSS values
      const enrichedSpacing = {
        base: domTokens.spacing.base || visionTokens.spacing.base,
      };

      console.log("📏 Spacing: Using DOM values");
      console.log(`   Base: ${enrichedSpacing.base}\n`);

      // Shadows: Use DOM for precise CSS values
      const enrichedShadows = {
        base: domTokens.shadows.base || visionTokens.shadows.base,
        large: domTokens.shadows.large || visionTokens.shadows.large,
      };

      console.log("🌑 Shadows: Using DOM values");
      console.log(`   Base:  ${enrichedShadows.base}`);
      console.log(`   Large: ${enrichedShadows.large}\n`);

      return {
        colors: enrichedColors as any,
        fonts: enrichedFonts,
        radius: enrichedRadius,
        spacing: enrichedSpacing,
        shadows: enrichedShadows,
      };
  }
}

/**
 * Intelligently merge components from DOM and vision AI with logging
 * NEW APPROACH: Vision AI identifies components, DOM provides precise CSS + hover states
 */
export function mergeComponents(
  domComponents: Components,
  visionComponents: Components,
  strategy: MergeStrategy,
  logger: MergeLogger,
  domHoverData?: Map<string, any>
): Components {
  console.log("\n📦 Merging Components...\n");

  switch (strategy) {
    case "dom-priority":
      return {
        buttons: [...domComponents.buttons],
        cards: [...domComponents.cards],
        navItems: [...domComponents.navItems],
        ...(visionComponents.forms && visionComponents.forms.length > 0 ? { forms: visionComponents.forms } : {}),
        ...(visionComponents.feedback && visionComponents.feedback.length > 0 ? { feedback: visionComponents.feedback } : {}),
        ...(visionComponents.dataDisplay && visionComponents.dataDisplay.length > 0 ? { dataDisplay: visionComponents.dataDisplay } : {}),
      };
      
    case "vision-priority":
      return {
        buttons: [...visionComponents.buttons],
        cards: [...visionComponents.cards],
        navItems: [...visionComponents.navItems],
        ...(visionComponents.forms || domComponents.forms ? { forms: visionComponents.forms || [] } : {}),
        ...(visionComponents.feedback || domComponents.feedback ? { feedback: visionComponents.feedback || [] } : {}),
        ...(visionComponents.dataDisplay || domComponents.dataDisplay ? { dataDisplay: visionComponents.dataDisplay || [] } : {}),
      };
      
    case "best-of-both":
    default:
      // NEW: Vision AI for identification, DOM for precision + hover
      const mergedButtons = enrichComponentsWithDOM(
        visionComponents.buttons,
        domComponents.buttons,
        "button",
        domHoverData
      );

      const mergedCards = enrichComponentsWithDOM(
        visionComponents.cards,
        domComponents.cards,
        "card",
        domHoverData
      );

      const mergedNavItems = enrichComponentsWithDOM(
        visionComponents.navItems,
        domComponents.navItems,
        "nav-item",
        domHoverData
      );

      // Log component merge decisions
      logger.logComponentMerge({
        componentType: "buttons",
        visionCount: visionComponents.buttons.length,
        domCount: domComponents.buttons.length,
        mergedCount: mergedButtons.length,
        source: mergedButtons.length > 0 ? "merged" : "vision",
        enrichedWithHover: domHoverData?.has("button") || false,
        warnings: generateComponentWarnings("buttons", visionComponents.buttons.length, domComponents.buttons.length),
      });

      logger.logComponentMerge({
        componentType: "cards",
        visionCount: visionComponents.cards.length,
        domCount: domComponents.cards.length,
        mergedCount: mergedCards.length,
        source: mergedCards.length > 0 ? "merged" : "vision",
        enrichedWithHover: domHoverData?.has("card") || false,
        warnings: generateComponentWarnings("cards", visionComponents.cards.length, domComponents.cards.length),
      });

      logger.logComponentMerge({
        componentType: "navItems",
        visionCount: visionComponents.navItems.length,
        domCount: domComponents.navItems.length,
        mergedCount: mergedNavItems.length,
        source: mergedNavItems.length > 0 ? "merged" : "vision",
        enrichedWithHover: domHoverData?.has("nav-item") || false,
        warnings: generateComponentWarnings("navItems", visionComponents.navItems.length, domComponents.navItems.length),
      });

      return {
        buttons: mergedButtons,
        cards: mergedCards,
        navItems: mergedNavItems,
        ...(visionComponents.forms && visionComponents.forms.length > 0 ? { forms: visionComponents.forms } : {}),
        ...(visionComponents.feedback && visionComponents.feedback.length > 0 ? { feedback: visionComponents.feedback } : {}),
        ...(visionComponents.dataDisplay && visionComponents.dataDisplay.length > 0 ? { dataDisplay: visionComponents.dataDisplay } : {}),
      };
  }
}

/**
 * Enrich Vision AI components with DOM precision and hover states
 */
function enrichComponentsWithDOM(
  visionComps: any[],
  domComps: any[],
  componentType: string,
  hoverData?: Map<string, any>
): any[] {
  if (visionComps.length === 0 && domComps.length === 0) {
    return [];
  }

  // Start with Vision AI components (they identified what exists)
  const enriched = visionComps.map((visionComp, index) => {
    // Try to find matching DOM component for precise CSS values
    const matchingDomComp = findMatchingDOMComponent(visionComp, domComps);

    if (matchingDomComp) {
      // Merge: Vision AI structure + DOM precision
      return {
        ...visionComp,
        styles: {
          ...visionComp.styles,
          ...matchingDomComp.styles, // DOM has precise CSS values
        },
        hover: hoverData?.get(componentType)?.commonEffect || visionComp.hover,
        source: "hybrid",
      };
    }

    // No matching DOM component, keep Vision AI version
    return {
      ...visionComp,
      hover: hoverData?.get(componentType)?.commonEffect,
      source: "vision",
    };
  });

  // Add DOM components that Vision AI missed
  for (const domComp of domComps) {
    const alreadyIncluded = enriched.some(comp => 
      areComponentsSimilar(comp, domComp)
    );

    if (!alreadyIncluded) {
      enriched.push({
        ...domComp,
        hover: hoverData?.get(componentType)?.commonEffect,
        source: "dom",
      });
    }
  }

  return enriched;
}

/**
 * Find matching DOM component for a Vision AI component
 */
function findMatchingDOMComponent(visionComp: any, domComps: any[]): any | null {
  for (const domComp of domComps) {
    if (areComponentsSimilar(visionComp, domComp)) {
      return domComp;
    }
  }
  return null;
}

/**
 * Generate warnings for component count discrepancies
 */
function generateComponentWarnings(
  componentType: string,
  visionCount: number,
  domCount: number
): string[] {
  const warnings: string[] = [];

  const diff = Math.abs(visionCount - domCount);
  const threshold = Math.max(visionCount, domCount) * 0.3; // 30% difference

  if (diff > threshold) {
    warnings.push(
      `Large discrepancy: Vision AI found ${visionCount} ${componentType}, DOM found ${domCount}`
    );
  }

  return warnings;
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
 * Intelligently merge layouts from DOM and vision AI with logging
 * NEW APPROACH: Vision AI for semantics, DOM for precise positioning
 */
export function mergeLayouts(
  domLayouts: Layouts,
  visionLayouts: Layouts,
  strategy: MergeStrategy,
  logger: MergeLogger
): Layouts {
  console.log("\n📐 Merging Layouts...\n");

  switch (strategy) {
    case "dom-priority":
      return {
        sections: [...domLayouts.sections],
      };
      
    case "vision-priority":
      return {
        sections: [...visionLayouts.sections],
      };
      
    case "best-of-both":
    default:
      // NEW: Vision AI for semantic understanding, DOM for precise positioning
      const mergedSections: LayoutSection[] = [];
      
      // Start with Vision AI sections (better semantic understanding)
      const domSections = [...domLayouts.sections];
      const visionSections = [...visionLayouts.sections];
      
      // For each Vision section, enrich with DOM positioning
      for (const visionSection of visionSections) {
        // Find overlapping DOM section for precise positioning
        const matchingDOMSection = domSections.find(dSection =>
          areSectionsOverlapping(visionSection, dSection)
        );
        
        if (matchingDOMSection) {
          // Merge: Vision AI semantic type + DOM precise positioning
          const mergedSection = {
            type: visionSection.type, // Vision AI has better semantic understanding
            position: matchingDOMSection.position, // DOM has accurate positioning
            metadata: {
              ...visionSection.metadata,
              ...matchingDOMSection.metadata,
              source: "hybrid" as const,
              visionType: visionSection.type,
              domType: matchingDOMSection.type,
            },
          };

          mergedSections.push(mergedSection);

          // Log the merge
          logger.logLayoutMerge({
            sectionType: visionSection.type,
            visionDetected: true,
            domDetected: true,
            source: "hybrid",
            positionSource: "dom",
            semanticSource: "vision",
          });
          
          // Remove from DOM sections to avoid duplicates
          const index = domSections.indexOf(matchingDOMSection);
          if (index > -1) {
            domSections.splice(index, 1);
          }
        } else {
          // No matching DOM section, keep Vision AI section
          mergedSections.push({
            ...visionSection,
            metadata: {
              ...visionSection.metadata,
              source: "vision-ai",
            },
          });

          logger.logLayoutMerge({
            sectionType: visionSection.type,
            visionDetected: true,
            domDetected: false,
            source: "vision",
            positionSource: "vision",
            semanticSource: "vision",
          });
        }
      }
      
      // Add remaining DOM sections that Vision AI missed
      for (const domSection of domSections) {
        mergedSections.push({
          ...domSection,
          metadata: {
            ...domSection.metadata,
            source: "dom",
          },
        });

        logger.logLayoutMerge({
          sectionType: domSection.type,
          visionDetected: false,
          domDetected: true,
          source: "dom",
          positionSource: "dom",
          semanticSource: "dom",
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

