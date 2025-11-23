export interface UxSettings {
    smoothTransitions?: boolean
    buttonMicroAnimations?: boolean
    cardHoverLift?: boolean
    focusGlow?: boolean
    activeTabMotion?: boolean
    scrollBoundaryFades?: boolean
    depthShadows?: boolean
    headingHierarchy?: boolean
    relaxedLineHeight?: boolean
    sectionSpacingRhythm?: boolean
}

const UX_GUIDELINES_MAP = {
    smoothTransitions: {
        title: "Smooth Transitions",
        description: "Your UI uses soft 150–200ms ease transitions for interactive elements like dialogs and sheets.",
        guidance: "Apply `transition-all duration-200 ease-in-out` to modals, dropdowns, and overlays for consistent motion."
    },
    buttonMicroAnimations: {
        title: "Button Press Micro-Animation",
        description: "Buttons provide tactile feedback with a subtle scale or press effect on interaction.",
        guidance: "Use `active:scale-95` or similar transform on button press to create a responsive feel."
    },
    cardHoverLift: {
        title: "Card Hover Lift",
        description: "Cards gently lift on hover to increase visual hierarchy and indicate interactivity.",
        guidance: "Apply `hover:shadow-lg hover:-translate-y-1 transition-all` to card components."
    },
    focusGlow: {
        title: "Focus Glow for Keyboard Users",
        description: "Interactive elements show a visible focus ring for keyboard navigation accessibility.",
        guidance: "Ensure all focusable elements have `focus-visible:ring-2 focus-visible:ring-primary` for keyboard users."
    },
    activeTabMotion: {
        title: "Animated Active-Tab Indicator",
        description: "Tab navigation includes a smooth animated indicator that follows the active tab.",
        guidance: "Use a sliding underline or background with CSS transitions to highlight the active tab state."
    },
    scrollBoundaryFades: {
        title: "Scroll Boundary Fades",
        description: "Scrollable containers show subtle fade effects at the top/bottom to indicate more content.",
        guidance: "Add gradient overlays (`linear-gradient`) at scroll boundaries to hint at hidden content."
    },
    depthShadows: {
        title: "Layered Depth Shadows",
        description: "UI elements use layered shadows to create a sense of depth and elevation.",
        guidance: "Apply multiple shadow layers (e.g., `shadow-sm` + `shadow-md`) to elevated components like modals and popovers."
    },
    headingHierarchy: {
        title: "Clean Heading Hierarchy",
        description: "Typography follows a clear visual hierarchy with consistent heading sizes and weights.",
        guidance: "Use semantic HTML (`h1`-`h6`) with defined font sizes and weights for each level."
    },
    relaxedLineHeight: {
        title: "Relaxed Reading Line-Height",
        description: "Body text uses comfortable line-height (1.6–1.8) for improved readability.",
        guidance: "Set `line-height: 1.7` or `leading-relaxed` on paragraphs and long-form content."
    },
    sectionSpacingRhythm: {
        title: "Consistent Section Spacing Rhythm",
        description: "Sections maintain consistent vertical spacing for visual rhythm and hierarchy.",
        guidance: "Use a spacing scale (e.g., 4px, 8px, 16px, 32px, 64px) and apply consistently across sections."
    }
}

export function generateUxGuidelines(uxSettings?: UxSettings): string {
    if (!uxSettings) {
        return `# UX Guidelines

No UX enhancements were selected during the wizard.

You can still apply these principles manually by referring to common UX best practices.
`
    }

    const enabledOptions = Object.entries(uxSettings)
        .filter(([_, enabled]) => enabled === true)
        .map(([key]) => key as keyof typeof UX_GUIDELINES_MAP)

    if (enabledOptions.length === 0) {
        return `# UX Guidelines

No UX enhancements were selected during the wizard.

You can still apply these principles manually by referring to common UX best practices.
`
    }

    let markdown = `# UX Guidelines

This document summarizes the UX enhancements you selected during theme creation. These guidelines help maintain consistent interaction patterns across your product.

---

`

    enabledOptions.forEach((key) => {
        const guideline = UX_GUIDELINES_MAP[key]
        if (guideline) {
            markdown += `## ${guideline.title}
**Status:** Enabled ✓

${guideline.description}

**Implementation:**  
${guideline.guidance}

---

`
        }
    })

    markdown += `
## Additional Notes

These UX enhancements are recommendations based on your selections. You can adjust the implementation details to fit your specific use case and design system requirements.

For more information on implementing these patterns, refer to your design system documentation or consult with your development team.
`

    return markdown
}
