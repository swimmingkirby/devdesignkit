import { StyledNode, ComponentStyle, Components } from "./types";

interface ComponentSignature {
  type: "button" | "card" | "navItem";
  signature: string;
  nodes: StyledNode[];
}

/**
 * Build a signature for a node based on tag, classes, and role
 */
function buildSignature(node: StyledNode): string {
  try {
    const sortedClasses = [...node.classes].sort().join(",");
    return `${node.tag}:${sortedClasses}:${node.role || ""}`;
  } catch (error) {
    return `${node.tag}::`;
  }
}

/**
 * Determine if a node is a button candidate
 */
function isButtonCandidate(node: StyledNode): boolean {
  try {
    return (
      node.tag === "button" ||
      node.role === "button" ||
      (node.tag === "a" && node.classes.some(c => 
        c.includes("btn") || c.includes("button")
      ))
    );
  } catch {
    return false;
  }
}

/**
 * Determine if a node is a card candidate
 */
function isCardCandidate(node: StyledNode): boolean {
  try {
    return (
      node.role === "article" ||
      node.classes.some(c => c.includes("card")) ||
      (node.tag === "div" && 
       node.rect.width > 200 && 
       node.rect.height > 100 &&
       parseFloat(node.styles.borderRadius) > 0)
    );
  } catch {
    return false;
  }
}

/**
 * Determine if a node is a nav item candidate
 */
function isNavItemCandidate(node: StyledNode): boolean {
  try {
    return (
      node.role === "navigation" ||
      node.role === "menuitem" ||
      node.classes.some(c => c.includes("nav")) ||
      (node.tag === "a" && node.classes.some(c => 
        c.includes("menu") || c.includes("link")
      ))
    );
  } catch {
    return false;
  }
}

/**
 * Extract component patterns from styled nodes
 */
export function extractComponents(nodes: StyledNode[]): Components {
  try {
    const buttonSigs = new Map<string, StyledNode[]>();
    const cardSigs = new Map<string, StyledNode[]>();
    const navSigs = new Map<string, StyledNode[]>();

    nodes.forEach(node => {
      try {
        const sig = buildSignature(node);

        if (isButtonCandidate(node)) {
          if (!buttonSigs.has(sig)) buttonSigs.set(sig, []);
          buttonSigs.get(sig)!.push(node);
        }

        if (isCardCandidate(node)) {
          if (!cardSigs.has(sig)) cardSigs.set(sig, []);
          cardSigs.get(sig)!.push(node);
        }

        if (isNavItemCandidate(node)) {
          if (!navSigs.has(sig)) navSigs.set(sig, []);
          navSigs.get(sig)!.push(node);
        }
      } catch (nodeError) {
        // Skip problematic nodes
      }
    });

    // Keep only signatures with at least 3 matches
    const filterByFrequency = (sigs: Map<string, StyledNode[]>, minFreq: number = 3) => {
      return Array.from(sigs.entries())
        .filter(([_, nodes]) => nodes.length >= minFreq)
        .map(([sig, nodes]) => ({ sig, nodes }));
    };

    const buttons = filterByFrequency(buttonSigs);
    const cards = filterByFrequency(cardSigs);
    const navItems = filterByFrequency(navSigs);

    // Extract canonical styles for each signature
    const extractCanonicalStyle = (nodes: StyledNode[]): ComponentStyle => {
      try {
        // Calculate median values
        const getMedian = (values: number[]) => {
          if (values.length === 0) return 0;
          const sorted = [...values].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };

        const getMostCommon = (values: string[]) => {
          if (values.length === 0) return "";
          const freq = new Map<string, number>();
          values.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
          return Array.from(freq.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
        };

        return {
          background: getMostCommon(nodes.map(n => n.styles.backgroundColor)),
          color: getMostCommon(nodes.map(n => n.styles.color)),
          padding: getMostCommon(nodes.map(n => n.styles.padding)),
          radius: getMostCommon(nodes.map(n => n.styles.borderRadius)),
          shadow: getMostCommon(nodes.map(n => n.styles.boxShadow)),
          frequency: nodes.length,
        };
      } catch (error) {
        // Return minimal style if extraction fails
        return {
          background: "transparent",
          color: "inherit",
          padding: "0px",
          radius: "0px",
          shadow: "none",
          frequency: nodes.length,
        };
      }
    };

    return {
      buttons: buttons.map(b => extractCanonicalStyle(b.nodes)),
      cards: cards.map(c => extractCanonicalStyle(c.nodes)),
      navItems: navItems.map(n => extractCanonicalStyle(n.nodes)),
    };
  } catch (error) {
    console.error("Component extraction failed:", error);
    // Return empty components on error
    return {
      buttons: [],
      cards: [],
      navItems: [],
    };
  }
}
