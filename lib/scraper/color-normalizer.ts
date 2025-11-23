import { converter, formatHex } from "culori";
import { StyledNode } from "./types";

const toLab = converter("lab");
const toRgb = converter("rgb");

export interface ColorCluster {
  canonical: string; // hex color
  members: string[]; // all hex colors in this cluster
  centroid: number[]; // LAB values
}

export interface WeightedColor {
  color: string;
  weight: number; // Importance score
  elementArea: number;
  isMainContent: boolean;
  role: "background" | "text" | "button" | "border";
}

/**
 * Simple k-means implementation as fallback
 */
function simpleKMeans(data: number[][], k: number, maxIterations: number = 100): {
  clusters: number[];
  centroids: number[][];
} {
  const n = data.length;
  const dim = data[0].length;
  
  // Initialize centroids using k-means++
  const centroids: number[][] = [];
  const usedIndices = new Set<number>();
  
  // First centroid is random
  const firstIdx = Math.floor(Math.random() * n);
  centroids.push([...data[firstIdx]]);
  usedIndices.add(firstIdx);
  
  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances: number[] = [];
    let sumDistances = 0;
    
    for (let j = 0; j < n; j++) {
      if (usedIndices.has(j)) {
        distances.push(0);
        continue;
      }
      
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = Math.sqrt(
          data[j].reduce((sum, val, idx) => sum + Math.pow(val - centroid[idx], 2), 0)
        );
        minDist = Math.min(minDist, dist);
      }
      distances.push(minDist * minDist);
      sumDistances += minDist * minDist;
    }
    
    // Choose next centroid with probability proportional to distance
    let rand = Math.random() * sumDistances;
    for (let j = 0; j < n; j++) {
      rand -= distances[j];
      if (rand <= 0) {
        centroids.push([...data[j]]);
        usedIndices.add(j);
        break;
      }
    }
  }
  
  // Run k-means iterations
  let clusters = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;
    
    // Assign points to nearest centroid
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let bestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const dist = Math.sqrt(
          data[i].reduce((sum, val, idx) => sum + Math.pow(val - centroids[j][idx], 2), 0)
        );
        
        if (dist < minDist) {
          minDist = dist;
          bestCluster = j;
        }
      }
      
      if (clusters[i] !== bestCluster) {
        clusters[i] = bestCluster;
        changed = true;
      }
    }
    
    if (!changed) break;
    
    // Update centroids
    const counts = new Array(k).fill(0);
    const sums: number[][] = Array(k).fill(0).map(() => Array(dim).fill(0));
    
    for (let i = 0; i < n; i++) {
      const cluster = clusters[i];
      counts[cluster]++;
      for (let d = 0; d < dim; d++) {
        sums[cluster][d] += data[i][d];
      }
    }
    
    for (let j = 0; j < k; j++) {
      if (counts[j] > 0) {
        for (let d = 0; d < dim; d++) {
          centroids[j][d] = sums[j][d] / counts[j];
        }
      }
    }
  }
  
  return { clusters, centroids };
}

/**
 * Fallback clustering when k-means fails or for small datasets
 */
function createSimpleClusters(
  labColors: Array<{ original: string; lab: number[] }>,
  numClusters: number
): ColorCluster[] {
  // Sort by frequency
  const colorFreq = new Map<string, number>();
  labColors.forEach(c => {
    colorFreq.set(c.original, (colorFreq.get(c.original) || 0) + 1);
  });
  
  const uniqueColors = Array.from(new Set(labColors.map(c => c.original)));
  const sorted = uniqueColors.sort((a, b) => 
    (colorFreq.get(b) || 0) - (colorFreq.get(a) || 0)
  );
  
  const clusters: ColorCluster[] = [];
  const clusterSize = Math.max(1, Math.floor(sorted.length / numClusters));
  
  for (let i = 0; i < numClusters && i * clusterSize < sorted.length; i++) {
    const start = i * clusterSize;
    const end = Math.min(start + clusterSize, sorted.length);
    const members = sorted.slice(start, end);
    
    if (members.length === 0) continue;
    
    const canonical = members[0]; // Most frequent in group
    const labColor = labColors.find(c => c.original === canonical);
    
    clusters.push({
      canonical,
      members,
      centroid: labColor?.lab || [50, 0, 0]
    });
  }
  
  return clusters;
}

/**
 * Convert colors to LAB space, cluster them using k-means,
 * and return canonical colors per cluster
 */
/**
 * Calculate importance weight for a color based on element properties
 * Weights favor large, visible, main-content elements
 */
export function getColorImportance(
  node: StyledNode,
  colorRole: "background" | "text" | "button" | "border"
): number {
  let weight = 1;

  // Element area (width * height) - larger elements are more important
  const area = node.rect.width * node.rect.height;
  const areaWeight = Math.log10(area + 1); // Logarithmic scale
  weight *= areaWeight;

  // Visibility - elements higher on page and not in footer/header are more important
  const viewportHeight = 1000; // Assume standard viewport
  const isInMainContent = node.rect.y > 200 && node.rect.y < viewportHeight - 200;
  if (isInMainContent) {
    weight *= 2; // Double weight for main content
  }

  // Z-index priority
  if (node.styles.zIndex) {
    const zIndex = parseInt(node.styles.zIndex);
    if (zIndex > 0) {
      weight *= (1 + zIndex / 100); // Small boost for elevated elements
    }
  }

  // Button/interactive elements are very important for primary color
  if (colorRole === "button") {
    weight *= 3; // Triple weight for button colors
  }

  // Borders on small elements should be deprioritized
  if (colorRole === "border" && area < 10000) {
    weight *= 0.1; // Heavily reduce weight for small borders
  }

  return weight;
}

/**
 * Check if a color is a utility color (structural, not thematic)
 */
export function isUtilityColor(
  color: string,
  role: "background" | "text" | "button" | "border"
): boolean {
  if (!color) return true;

  const lab = toLab(color);
  if (!lab) return true;

  // Pure black (#000000) or near-black used for borders
  if (role === "border" && lab.l < 20) {
    return true; // Likely a structural border
  }

  // Pure white (#ffffff) backgrounds on small elements
  if (role === "background" && lab.l > 95) {
    return true; // Likely a default background
  }

  // Very low saturation (grayscale) on borders/backgrounds
  const chroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  if (chroma < 10 && (role === "border" || role === "background")) {
    return true; // Gray structural elements
  }

  return false;
}

/**
 * Extract weighted colors from styled nodes
 */
export function extractWeightedColors(nodes: StyledNode[]): WeightedColor[] {
  const weightedColors: WeightedColor[] = [];

  for (const node of nodes) {
    const area = node.rect.width * node.rect.height;
    const isMainContent = node.rect.y > 200 && node.rect.y < 800;

    // Background colors
    if (node.styles.backgroundColor && node.styles.backgroundColor !== "transparent") {
      const weight = getColorImportance(node, "background");
      if (!isUtilityColor(node.styles.backgroundColor, "background")) {
        weightedColors.push({
          color: node.styles.backgroundColor,
          weight,
          elementArea: area,
          isMainContent,
          role: "background",
        });
      }
    }

    // Text colors
    if (node.styles.color) {
      const weight = getColorImportance(node, "text");
      if (!isUtilityColor(node.styles.color, "text")) {
        weightedColors.push({
          color: node.styles.color,
          weight,
          elementArea: area,
          isMainContent,
          role: "text",
        });
      }
    }

    // Button colors (high priority)
    if (
      node.tag === "button" ||
      node.role === "button" ||
      node.classes.some(c => c.includes("btn") || c.includes("button"))
    ) {
      if (node.styles.backgroundColor) {
        const weight = getColorImportance(node, "button");
        weightedColors.push({
          color: node.styles.backgroundColor,
          weight,
          elementArea: area,
          isMainContent,
          role: "button",
        });
      }
    }
  }

  return weightedColors;
}

/**
 * Normalize colors with weighted importance (NEW: improved accuracy)
 */
export function normalizeWeightedColors(
  weightedColors: WeightedColor[],
  numClusters: number = 6
): ColorCluster[] {
  if (weightedColors.length === 0) {
    return [];
  }

  // Create a weighted list where colors appear multiple times based on importance
  const expandedColors: string[] = [];
  
  for (const wc of weightedColors) {
    // Repeat color based on weight (min 1, max 10 times)
    const repetitions = Math.min(10, Math.max(1, Math.floor(wc.weight)));
    for (let i = 0; i < repetitions; i++) {
      expandedColors.push(wc.color);
    }
  }

  // Now use the standard normalization with weighted data
  return normalizeColors(expandedColors, numClusters);
}

/**
 * Original normalize colors function (kept for backward compatibility)
 */
export function normalizeColors(colors: string[], numClusters: number = 6): ColorCluster[] {
  try {
    // Filter out invalid/transparent colors
    const validColors = colors.filter(color => {
      if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return false;
      try {
        const lab = toLab(color);
        return lab !== undefined;
      } catch {
        return false;
      }
    });

    if (validColors.length === 0) {
      return [];
    }

    // If too few colors, return them directly
    if (validColors.length < numClusters) {
      return validColors.slice(0, numClusters).map(color => {
        const lab = toLab(color);
        return {
          canonical: color,
          members: [color],
          centroid: [lab?.l || 50, lab?.a || 0, lab?.b || 0]
        };
      });
    }

    // Convert all colors to LAB
    const labColors = validColors.map(color => {
      const lab = toLab(color);
      return {
        original: color,
        lab: [lab?.l || 0, lab?.a || 0, lab?.b || 0]
      };
    });

    // Prepare data for k-means (2D array of LAB values)
    const labData = labColors.map(c => c.lab);

    // Run k-means clustering with our implementation
    const actualClusters = Math.min(numClusters, labColors.length);
    let result: { clusters: number[]; centroids: number[][] };
    
    try {
      result = simpleKMeans(labData, actualClusters, 100);
    } catch (kmeansError) {
      console.warn("K-means clustering failed, using fallback:", kmeansError);
      return createSimpleClusters(labColors, numClusters);
    }

    // Build clusters
    const clusters: ColorCluster[] = [];
    
    for (let i = 0; i < actualClusters; i++) {
      const clusterMembers = labColors
        .map((c, idx) => ({ color: c, cluster: result.clusters[idx] }))
        .filter(item => item.cluster === i)
        .map(item => item.color.original);

      if (clusterMembers.length === 0) continue;

      // Centroid from k-means result
      const centroid = result.centroids[i];

      // Find the actual color closest to the centroid
      let closestColor = clusterMembers[0];
      let minDistance = Infinity;

      clusterMembers.forEach(color => {
        const lab = toLab(color);
        if (!lab) return;
        
        const distance = Math.sqrt(
          Math.pow((lab.l || 0) - centroid[0], 2) +
          Math.pow((lab.a || 0) - centroid[1], 2) +
          Math.pow((lab.b || 0) - centroid[2], 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestColor = color;
        }
      });

      // Convert to hex
      try {
        const rgb = toRgb(closestColor);
        const canonical = rgb ? formatHex(rgb) : closestColor;

        clusters.push({
          canonical,
          members: clusterMembers,
          centroid
        });
      } catch (colorError) {
        console.warn("Error converting color to hex:", colorError);
        clusters.push({
          canonical: closestColor,
          members: clusterMembers,
          centroid
        });
      }
    }

    // Merge clusters that are very similar (LAB distance < 3)
    const mergedClusters: ColorCluster[] = [];
    const merged = new Set<number>();

    for (let i = 0; i < clusters.length; i++) {
      if (merged.has(i)) continue;

      const cluster = clusters[i];
      const similarClusters = [cluster];

      for (let j = i + 1; j < clusters.length; j++) {
        if (merged.has(j)) continue;

        const distance = Math.sqrt(
          Math.pow(cluster.centroid[0] - clusters[j].centroid[0], 2) +
          Math.pow(cluster.centroid[1] - clusters[j].centroid[1], 2) +
          Math.pow(cluster.centroid[2] - clusters[j].centroid[2], 2)
        );

        if (distance < 3) {
          similarClusters.push(clusters[j]);
          merged.add(j);
        }
      }

      // Merge all similar clusters
      const allMembers = similarClusters.flatMap(c => c.members);
      mergedClusters.push({
        canonical: cluster.canonical,
        members: allMembers,
        centroid: cluster.centroid
      });
    }

    return mergedClusters;
    
  } catch (error) {
    console.error("Color normalization failed:", error);
    // Return basic fallback colors
    return [
      { canonical: "#ffffff", members: ["#ffffff"], centroid: [100, 0, 0] },
      { canonical: "#000000", members: ["#000000"], centroid: [0, 0, 0] },
    ];
  }
}

/**
 * Assign semantic roles to color clusters based on frequency and usage
 */
export function assignColorRoles(
  clusters: ColorCluster[],
  backgroundColors: string[],
  textColors: string[],
  buttonColors: string[]
) {
  try {
    const getClusterForColor = (color: string) => {
      return clusters.find(c => c.members.includes(color));
    };

    // Frequency maps
    const bgFreq = new Map<string, number>();
    const textFreq = new Map<string, number>();
    const btnFreq = new Map<string, number>();

    backgroundColors.forEach(c => bgFreq.set(c, (bgFreq.get(c) || 0) + 1));
    textColors.forEach(c => textFreq.set(c, (textFreq.get(c) || 0) + 1));
    buttonColors.forEach(c => btnFreq.set(c, (btnFreq.get(c) || 0) + 1));

    // Find most frequent background
    const sortedBg = Array.from(bgFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => getClusterForColor(color)?.canonical || color);

    const sortedText = Array.from(textFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => getClusterForColor(color)?.canonical || color);

    const sortedBtn = Array.from(btnFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => getClusterForColor(color)?.canonical || color);

    return {
      background: sortedBg[0] || "#ffffff",
      foreground: sortedText[0] || "#000000",
      primary: sortedBtn[0] || sortedBg[1] || "#000000",
      primaryForeground: sortedText[1] || "#ffffff",
      secondary: sortedBg[2] || "#f1f5f9",
      secondaryForeground: sortedText[2] || "#0f172a",
      muted: sortedBg[3] || "#f1f5f9",
      mutedForeground: sortedText[3] || "#64748b",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: sortedBg[4] || "#e2e8f0",
      input: sortedBg[5] || "#e2e8f0",
      ring: sortedBtn[0] || sortedText[0] || "#000000",
    };
  } catch (error) {
    console.error("Error assigning color roles:", error);
    // Return sensible defaults
    return {
      background: "#ffffff",
      foreground: "#000000",
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#000000",
    };
  }
}
