import { converter } from "culori";

const toLab = converter("lab");

export interface ColorValidationResult {
  matched: boolean;
  labDistance: number;
  threshold: number;
  confidence: "high" | "medium" | "low";
}

export interface ColorMatchResult {
  color: string;
  distance: number;
  matched: boolean;
}

/**
 * Validate if two colors match within a threshold in LAB color space
 * LAB is perceptually uniform - distance represents how different colors appear to humans
 * 
 * @param visionColor - Color from Vision AI
 * @param domColor - Color from DOM scraping
 * @param thresholdPercent - Acceptable difference percentage (default 25%)
 * @returns Validation result with match status and distance
 */
export function validateColorMatch(
  visionColor: string,
  domColor: string,
  thresholdPercent: number = 25
): ColorValidationResult {
  if (!visionColor || !domColor) {
    return {
      matched: false,
      labDistance: 100,
      threshold: thresholdPercent,
      confidence: "low",
    };
  }

  const distance = calculateLABDistance(visionColor, domColor);
  const matched = distance <= thresholdPercent;

  // Confidence based on how close the colors are
  let confidence: "high" | "medium" | "low";
  if (distance <= 10) {
    confidence = "high"; // Very similar colors
  } else if (distance <= thresholdPercent) {
    confidence = "medium"; // Acceptable match
  } else {
    confidence = "low"; // Significant difference
  }

  return {
    matched,
    labDistance: distance,
    threshold: thresholdPercent,
    confidence,
  };
}

/**
 * Calculate perceptual distance between two colors in LAB space
 * Uses Euclidean distance in LAB color space
 * 
 * @param color1 - First color (any CSS format)
 * @param color2 - Second color (any CSS format)
 * @returns Distance value (0-100, where 0 is identical)
 */
export function calculateLABDistance(color1: string, color2: string): number {
  try {
    const lab1 = toLab(color1);
    const lab2 = toLab(color2);

    if (!lab1 || !lab2) {
      return 100; // Invalid colors are maximally different
    }

    // Calculate Euclidean distance in LAB space manually
    const dL = lab1.l - lab2.l;
    const dA = lab1.a - lab2.a;
    const dB = lab1.b - lab2.b;
    
    // Euclidean distance in LAB space
    const distance = Math.sqrt(dL * dL + dA * dA + dB * dB);
    
    // Normalize to percentage (LAB L ranges 0-100, a/b roughly -100 to 100)
    // Max theoretical distance is ~200, so normalize to 0-100 scale
    return Math.min(100, (distance / 200) * 100);
  } catch (error) {
    console.warn("Color comparison error:", error);
    return 100;
  }
}

/**
 * Find the best matching color from a set of candidates
 * 
 * @param targetColor - Color to match
 * @param candidates - Object of candidate colors { role: color }
 * @param thresholdPercent - Maximum acceptable distance
 * @returns Best match or null if no good match found
 */
export function findBestMatchingColor(
  targetColor: string,
  candidates: Record<string, string>,
  thresholdPercent: number = 25
): ColorMatchResult | null {
  if (!targetColor || !candidates) {
    return null;
  }

  let bestMatch: ColorMatchResult | null = null;
  let minDistance = Infinity;

  for (const [role, candidateColor] of Object.entries(candidates)) {
    if (!candidateColor) continue;

    const distance = calculateLABDistance(targetColor, candidateColor);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = {
        color: candidateColor,
        distance,
        matched: distance <= thresholdPercent,
      };
    }
  }

  return bestMatch;
}

/**
 * Enrich a Vision AI color with DOM precision
 * If colors match, use DOM's precise hex value
 * If they don't match, investigate other DOM colors for a better match
 * 
 * @param role - Color role (primary, secondary, etc.)
 * @param visionColor - Color from Vision AI
 * @param domColor - Corresponding DOM color for this role
 * @param allDomColors - All DOM colors for fallback matching
 * @param thresholdPercent - Match threshold
 * @returns Enriched color and decision metadata
 */
export function enrichColorWithPrecision(
  role: string,
  visionColor: string,
  domColor: string,
  allDomColors: Record<string, string>,
  thresholdPercent: number = 25
): {
  color: string;
  source: "vision" | "dom" | "dom-alternative";
  validation: ColorValidationResult;
  reason: string;
} {
  // First, check if the direct match works
  const directValidation = validateColorMatch(visionColor, domColor, thresholdPercent);

  if (directValidation.matched) {
    return {
      color: domColor, // Use DOM's precise value
      source: "dom",
      validation: directValidation,
      reason: `DOM ${role} matches Vision AI (${directValidation.labDistance.toFixed(1)}% difference)`,
    };
  }

  // If direct match failed, try to find a better match in other DOM colors
  const alternativeMatch = findBestMatchingColor(visionColor, allDomColors, thresholdPercent);

  if (alternativeMatch && alternativeMatch.matched) {
    return {
      color: alternativeMatch.color,
      source: "dom-alternative",
      validation: {
        matched: true,
        labDistance: alternativeMatch.distance,
        threshold: thresholdPercent,
        confidence: alternativeMatch.distance <= 10 ? "high" : "medium",
      },
      reason: `Found better DOM color match (${alternativeMatch.distance.toFixed(1)}% difference)`,
    };
  }

  // No good DOM match found, use Vision AI color
  return {
    color: visionColor,
    source: "vision",
    validation: directValidation,
    reason: `No matching DOM color found, using Vision AI (DOM was ${directValidation.labDistance.toFixed(1)}% different)`,
  };
}

/**
 * Batch validate all colors between Vision and DOM
 * 
 * @param visionColors - Colors from Vision AI
 * @param domColors - Colors from DOM
 * @param thresholdPercent - Match threshold
 * @returns Array of validation results for each color role
 */
export function validateAllColors(
  visionColors: Record<string, string>,
  domColors: Record<string, string>,
  thresholdPercent: number = 25
): Array<{
  role: string;
  visionColor: string;
  domColor: string;
  validation: ColorValidationResult;
}> {
  const results: Array<{
    role: string;
    visionColor: string;
    domColor: string;
    validation: ColorValidationResult;
  }> = [];

  for (const [role, visionColor] of Object.entries(visionColors)) {
    const domColor = domColors[role];
    const validation = validateColorMatch(visionColor, domColor, thresholdPercent);

    results.push({
      role,
      visionColor,
      domColor: domColor || "N/A",
      validation,
    });
  }

  return results;
}

