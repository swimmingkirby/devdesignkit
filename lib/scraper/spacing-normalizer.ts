/**
 * Extract spacing base from padding/margin values
 * Find the most common increment (GCD-like approach)
 */
export function normalizeSpacing(spacingValues: number[]): {
  base: string;
  normalized: Map<number, string>;
} {
  // Filter out 0 and negative values
  const validValues = spacingValues.filter(v => v > 0);
  
  if (validValues.length === 0) {
    return { base: "4px", normalized: new Map() };
  }

  // Find GCD of all spacing values to determine base unit
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Round values to nearest integer for GCD calculation
  const roundedValues = validValues.map(v => Math.round(v));
  
  // Find common divisor
  let commonDivisor = roundedValues[0];
  for (let i = 1; i < roundedValues.length; i++) {
    commonDivisor = gcd(commonDivisor, roundedValues[i]);
    if (commonDivisor === 1) break; // Can't get smaller
  }

  // If GCD is too small or large, use frequency analysis instead
  if (commonDivisor < 2 || commonDivisor > 16) {
    // Find most common small spacing value (likely the base)
    const smallValues = roundedValues.filter(v => v <= 32);
    const freq = new Map<number, number>();
    
    smallValues.forEach(v => {
      freq.set(v, (freq.get(v) || 0) + 1);
    });

    const mostCommon = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])[0];

    commonDivisor = mostCommon ? mostCommon[0] : 4;
  }

  // Ensure reasonable base (typically 4px or 8px)
  const base = commonDivisor >= 4 && commonDivisor <= 8 ? commonDivisor : 4;

  // Create normalized mapping
  const normalized = new Map<number, string>();
  roundedValues.forEach(value => {
    const multiplier = Math.round(value / base);
    normalized.set(value, `${multiplier} × base`);
  });

  return {
    base: `${base}px`,
    normalized
  };
}

/**
 * Parse padding/margin strings to extract numeric values
 */
export function parseSpacing(spacingString: string): number[] {
  const values = spacingString
    .split(" ")
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v));
  
  return values;
}

