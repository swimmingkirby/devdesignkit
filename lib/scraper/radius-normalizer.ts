/**
 * Normalize border radius values into small/medium/large tokens
 */
export function normalizeRadius(radiiValues: number[]): {
  small: string;
  medium: string;
  large: string;
} {
  // Filter valid values and remove duplicates
  const validValues = radiiValues
    .filter(v => v > 0)
    .sort((a, b) => a - b);

  if (validValues.length === 0) {
    return { small: "4px", medium: "8px", large: "16px" };
  }

  // Get unique values
  const uniqueValues = Array.from(new Set(validValues));

  if (uniqueValues.length === 1) {
    return {
      small: `${uniqueValues[0]}px`,
      medium: `${uniqueValues[0]}px`,
      large: `${uniqueValues[0]}px`,
    };
  }

  if (uniqueValues.length === 2) {
    return {
      small: `${uniqueValues[0]}px`,
      medium: `${uniqueValues[0]}px`,
      large: `${uniqueValues[1]}px`,
    };
  }

  // Find quartiles for small/medium/large
  const quartile = (arr: number[], q: number) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  const small = Math.round(quartile(uniqueValues, 0.25));
  const medium = Math.round(quartile(uniqueValues, 0.5));
  const large = Math.round(quartile(uniqueValues, 0.75));

  return {
    small: `${small}px`,
    medium: `${medium}px`,
    large: `${large}px`,
  };
}

/**
 * Parse border-radius string to extract numeric value
 */
export function parseBorderRadius(radiusString: string): number {
  // Handle various formats: "8px", "8px 8px 8px 8px", etc.
  const values = radiusString
    .split(" ")
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v));
  
  // Return the first value (top-left) or 0
  return values.length > 0 ? values[0] : 0;
}

