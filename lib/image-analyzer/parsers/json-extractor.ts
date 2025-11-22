/**
 * Extracts JSON from LLM text responses that may contain additional text
 */
export function extractJSON(text: string): any | null {
  // Try to find JSON block markers
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1]);
    } catch {
      // Continue to other methods
    }
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Continue to other methods
    }
  }

  // Try to find JSON array
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // Failed all methods
    }
  }

  return null;
}

/**
 * Clean and normalize hex color values
 */
export function normalizeColor(color: string): string {
  if (!color) return "#000000";
  
  // Remove whitespace
  color = color.trim();
  
  // If already hex, ensure it has #
  if (/^[0-9A-Fa-f]{6}$/.test(color)) {
    return `#${color}`;
  }
  
  // If has #, ensure it's valid
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }
  
  // If short hex, expand it
  if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }
  
  // Default fallback
  return "#000000";
}

/**
 * Normalize size/spacing values
 */
export function normalizeSize(size: string | number): string {
  if (typeof size === "number") {
    return `${size}px`;
  }
  
  if (!size) return "0px";
  
  // Already has unit
  if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(size)) {
    return size;
  }
  
  // Just a number, add px
  if (/^\d+(\.\d+)?$/.test(size)) {
    return `${size}px`;
  }
  
  return size;
}

