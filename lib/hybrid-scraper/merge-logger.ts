import { ColorValidationResult } from "./color-validator";

export interface ColorMergeDecision {
  role: string;
  visionValue: string;
  domValue: string;
  resolvedValue: string;
  source: "vision" | "dom" | "dom-alternative";
  labDistance: number;
  threshold: number;
  matched: boolean;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface ComponentMergeDecision {
  componentType: string;
  visionCount: number;
  domCount: number;
  mergedCount: number;
  source: "vision" | "dom" | "merged";
  enrichedWithHover: boolean;
  warnings: string[];
}

export interface LayoutMergeDecision {
  sectionType: string;
  visionDetected: boolean;
  domDetected: boolean;
  source: "vision" | "dom" | "hybrid";
  positionSource: "vision" | "dom";
  semanticSource: "vision" | "dom";
}

export interface MergeStatistics {
  totalColorComparisons: number;
  colorMatches: number;
  colorMismatches: number;
  colorMatchRate: string;
  componentsFromVision: number;
  componentsFromDOM: number;
  componentsMerged: number;
  layoutsFromVision: number;
  layoutsFromDOM: number;
  layoutsMerged: number;
  warnings: number;
}

export class MergeLogger {
  private colorDecisions: ColorMergeDecision[] = [];
  private componentDecisions: ComponentMergeDecision[] = [];
  private layoutDecisions: LayoutMergeDecision[] = [];
  private warnings: string[] = [];
  private startTime: number = Date.now();

  constructor() {
    console.log("\n🔄 ===== HYBRID SCRAPER MERGE PROCESS STARTED =====\n");
  }

  /**
   * Log a color merge decision with visual formatting
   */
  logColorMatch(
    role: string,
    visionColor: string,
    domColor: string,
    resolvedColor: string,
    validation: ColorValidationResult,
    reason: string,
    source: "vision" | "dom" | "dom-alternative"
  ): void {
    const decision: ColorMergeDecision = {
      role,
      visionValue: visionColor,
      domValue: domColor,
      resolvedValue: resolvedColor,
      source,
      labDistance: validation.labDistance,
      threshold: validation.threshold,
      matched: validation.matched,
      confidence: validation.confidence,
      reason,
    };

    this.colorDecisions.push(decision);

    // Console logging with color-coded emojis
    const matchEmoji = validation.matched ? "✅" : "⚠️";
    const confidenceEmoji = 
      validation.confidence === "high" ? "🟢" :
      validation.confidence === "medium" ? "🟡" : "🔴";

    console.log(`${matchEmoji} ${confidenceEmoji} Color: ${role}`);
    console.log(`   Vision AI: ${visionColor}`);
    console.log(`   DOM:       ${domColor}`);
    console.log(`   Resolved:  ${resolvedColor} (${source})`);
    console.log(`   Distance:  ${validation.labDistance.toFixed(1)}% (threshold: ${validation.threshold}%)`);
    console.log(`   Reason:    ${reason}`);
    console.log("");
  }

  /**
   * Log a color mismatch with detailed analysis
   */
  logColorMismatch(
    role: string,
    visionColor: string,
    domColor: string,
    resolvedColor: string,
    validation: ColorValidationResult,
    reason: string,
    source: "vision" | "dom" | "dom-alternative"
  ): void {
    const warning = `Color mismatch for ${role}: Vision=${visionColor}, DOM=${domColor}, Distance=${validation.labDistance.toFixed(1)}%`;
    this.warnings.push(warning);

    // Log as a match but with warning flag
    this.logColorMatch(role, visionColor, domColor, resolvedColor, validation, reason, source);

    // Additional warning log
    console.warn(`⚠️  MISMATCH DETECTED: ${warning}`);
    console.log("");
  }

  /**
   * Log component merge decision
   */
  logComponentMerge(decision: ComponentMergeDecision): void {
    this.componentDecisions.push(decision);

    console.log(`📦 Component: ${decision.componentType}`);
    console.log(`   Vision AI: ${decision.visionCount} detected`);
    console.log(`   DOM:       ${decision.domCount} detected`);
    console.log(`   Merged:    ${decision.mergedCount} (source: ${decision.source})`);
    console.log(`   Hover:     ${decision.enrichedWithHover ? "✅ Extracted" : "❌ Not available"}`);

    if (decision.warnings.length > 0) {
      console.log(`   Warnings:  ${decision.warnings.join(", ")}`);
      this.warnings.push(...decision.warnings);
    }

    console.log("");
  }

  /**
   * Log layout merge decision
   */
  logLayoutMerge(decision: LayoutMergeDecision): void {
    this.layoutDecisions.push(decision);

    const sourceEmoji = 
      decision.source === "vision" ? "👁️" :
      decision.source === "dom" ? "🌐" : "🔀";

    console.log(`${sourceEmoji} Layout Section: ${decision.sectionType}`);
    console.log(`   Vision AI:  ${decision.visionDetected ? "✅ Detected" : "❌ Not detected"}`);
    console.log(`   DOM:        ${decision.domDetected ? "✅ Detected" : "❌ Not detected"}`);
    console.log(`   Position:   from ${decision.positionSource}`);
    console.log(`   Semantic:   from ${decision.semanticSource}`);
    console.log("");
  }

  /**
   * Log a general warning
   */
  logWarning(message: string): void {
    this.warnings.push(message);
    console.warn(`⚠️  WARNING: ${message}`);
  }

  /**
   * Log merge statistics summary
   */
  logSummary(): void {
    const duration = Date.now() - this.startTime;
    const stats = this.getStatistics();

    console.log("\n📊 ===== MERGE SUMMARY =====\n");
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log("");
    console.log(`🎨 Colors:`);
    console.log(`   Total comparisons: ${stats.totalColorComparisons}`);
    console.log(`   Matches:           ${stats.colorMatches} (${stats.colorMatchRate})`);
    console.log(`   Mismatches:        ${stats.colorMismatches}`);
    console.log("");
    console.log(`📦 Components:`);
    console.log(`   From Vision AI:    ${stats.componentsFromVision}`);
    console.log(`   From DOM:          ${stats.componentsFromDOM}`);
    console.log(`   Merged:            ${stats.componentsMerged}`);
    console.log("");
    console.log(`📐 Layouts:`);
    console.log(`   From Vision AI:    ${stats.layoutsFromVision}`);
    console.log(`   From DOM:          ${stats.layoutsFromDOM}`);
    console.log(`   Merged:            ${stats.layoutsMerged}`);
    console.log("");
    console.log(`⚠️  Total Warnings:   ${stats.warnings}`);
    console.log("\n===== MERGE PROCESS COMPLETED =====\n");
  }

  /**
   * Get all merge decisions for debug output
   */
  getDecisions(): {
    colors: ColorMergeDecision[];
    components: ComponentMergeDecision[];
    layouts: LayoutMergeDecision[];
  } {
    return {
      colors: this.colorDecisions,
      components: this.componentDecisions,
      layouts: this.layoutDecisions,
    };
  }

  /**
   * Get all warnings
   */
  getWarnings(): string[] {
    return this.warnings;
  }

  /**
   * Get merge statistics
   */
  getStatistics(): MergeStatistics {
    const colorMatches = this.colorDecisions.filter(d => d.matched).length;
    const colorMismatches = this.colorDecisions.filter(d => !d.matched).length;
    const totalColorComparisons = this.colorDecisions.length;

    const componentsFromVision = this.componentDecisions
      .filter((d) => d.source === "vision")
      .reduce((sum: number, d) => sum + d.visionCount, 0);

    const componentsFromDOM = this.componentDecisions
      .filter((d) => d.source === "dom")
      .reduce((sum: number, d) => sum + d.domCount, 0);

    const componentsMerged = this.componentDecisions
      .filter((d) => d.source === "merged")
      .reduce((sum: number, d) => sum + d.mergedCount, 0);

    const layoutsFromVision = this.layoutDecisions.filter(d => d.source === "vision").length;
    const layoutsFromDOM = this.layoutDecisions.filter(d => d.source === "dom").length;
    const layoutsMerged = this.layoutDecisions.filter(d => d.source === "hybrid").length;

    const colorMatchRate = totalColorComparisons > 0
      ? `${((colorMatches / totalColorComparisons) * 100).toFixed(1)}%`
      : "N/A";

    return {
      totalColorComparisons,
      colorMatches,
      colorMismatches,
      colorMatchRate,
      componentsFromVision,
      componentsFromDOM,
      componentsMerged,
      layoutsFromVision,
      layoutsFromDOM,
      layoutsMerged,
      warnings: this.warnings.length,
    };
  }

  /**
   * Get complete debug output
   */
  getDebugOutput(): {
    mergeDecisions: {
      colors: ColorMergeDecision[];
      components: ComponentMergeDecision[];
      layouts: LayoutMergeDecision[];
    };
    validationWarnings: string[];
    statistics: MergeStatistics;
    duration: number;
  } {
    return {
      mergeDecisions: this.getDecisions(),
      validationWarnings: this.getWarnings(),
      statistics: this.getStatistics(),
      duration: Date.now() - this.startTime,
    };
  }
}

