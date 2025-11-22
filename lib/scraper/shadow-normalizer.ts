interface ParsedShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

/**
 * Parse box-shadow string into components
 */
export function parseBoxShadow(shadowString: string): ParsedShadow | null {
  if (!shadowString || shadowString === "none") return null;

  // Simple parser for box-shadow
  // Format: [inset] offsetX offsetY [blur] [spread] color
  const parts = shadowString.trim().split(/\s+/);
  
  let inset = false;
  let values: number[] = [];
  let color = "";

  parts.forEach(part => {
    if (part === "inset") {
      inset = true;
    } else if (part.includes("px") || part.includes("rem") || part.includes("em")) {
      values.push(parseFloat(part));
    } else if (part.includes("rgb") || part.includes("#") || part.match(/^[a-z]+$/i)) {
      color = part;
    }
  });

  // Default values
  const offsetX = values[0] || 0;
  const offsetY = values[1] || 0;
  const blur = values[2] || 0;
  const spread = values[3] || 0;

  return {
    offsetX,
    offsetY,
    blur,
    spread,
    color: color || "rgba(0, 0, 0, 0.1)",
    inset
  };
}

/**
 * Normalize shadows into base and large tokens
 */
export function normalizeShadows(shadowStrings: string[]): {
  base: string;
  large: string;
} {
  const parsed = shadowStrings
    .map(parseBoxShadow)
    .filter((s): s is ParsedShadow => s !== null && !s.inset);

  if (parsed.length === 0) {
    return {
      base: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    };
  }

  // Group by blur + spread (signature of shadow size)
  const signatures = new Map<string, ParsedShadow[]>();
  
  parsed.forEach(shadow => {
    const key = `${shadow.blur}-${shadow.spread}`;
    if (!signatures.has(key)) {
      signatures.set(key, []);
    }
    signatures.get(key)!.push(shadow);
  });

  // Find most common shadow (base)
  const sortedSignatures = Array.from(signatures.entries())
    .sort((a, b) => b[1].length - a[1].length);

  const baseShadow = sortedSignatures[0]?.[1][0];
  
  // Find largest shadow (highest blur + spread)
  const largestShadow = parsed.reduce((max, current) => {
    const maxSize = max.blur + max.spread;
    const currentSize = current.blur + current.spread;
    return currentSize > maxSize ? current : max;
  }, parsed[0]);

  const formatShadow = (s: ParsedShadow) => {
    return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
  };

  return {
    base: baseShadow ? formatShadow(baseShadow) : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    large: largestShadow ? formatShadow(largestShadow) : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  };
}

