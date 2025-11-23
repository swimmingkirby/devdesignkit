import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60; // Allow up to 60 seconds for generation

/**
 * POST /api/generate-layout
 * 
 * Generates React/JSX layout code from scraped layout data using GPT-4
 */
export async function POST(request: NextRequest) {
  try {
    const { layoutSection, theme } = await request.json();
    
    if (!layoutSection || !theme) {
      return NextResponse.json(
        { error: "layoutSection and theme are required" },
        { status: 400 }
      );
    }
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Build the prompt for GPT-4
    const prompt = `Generate a beautiful, modern ${layoutSection.type} section that looks exactly like shadcn/ui styling.

**Section Type:** ${layoutSection.type}
**Confidence:** ${layoutSection.confidence || "medium"}
**Framework:** ${layoutSection.framework || "generic"}

**Theme:**
- Background: ${theme.colors.background}
- Foreground: ${theme.colors.foreground}
- Primary: ${theme.colors.primary}
- Primary Text: ${theme.colors.primaryForeground}
- Secondary: ${theme.colors.secondary}
- Border: ${theme.colors.border}
- Muted: ${theme.colors.muted}
- Font: ${theme.fonts.sans}
- Heading Font: ${theme.fonts.heading || theme.fonts.sans}
- Radius: ${theme.radius.medium}

**shadcn/ui Component Styles to Mimic:**

Button (use <button>):
- Tailwind: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2"
- Primary button style="background-color: ${theme.colors.primary}; color: ${theme.colors.primaryForeground};"
- Secondary button add Tailwind: "bg-secondary text-secondary-foreground hover:bg-secondary/80"

Card (use <div>):
- Outer: Tailwind "rounded-lg border shadow-sm" + style="background-color: ${theme.colors.card || theme.colors.background}; border-color: ${theme.colors.border};"
- Header: Tailwind "flex flex-col space-y-1.5 p-6"
- Title: Tailwind "text-2xl font-semibold leading-none" + style="font-family: ${theme.fonts.heading || theme.fonts.sans};"
- Content: Tailwind "p-6 pt-0"

Badge (use <span>):
- Tailwind: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"

Input (use <input>):
- Tailwind: "flex h-10 w-full rounded-md border px-3 py-2 text-sm"
- style="background-color: ${theme.colors.background}; border-color: ${theme.colors.input}; color: ${theme.colors.foreground};"

**Requirements:**
1. Generate ONLY HTML (no JSX, no imports, no React)
2. Use semantic HTML: <section>, <div>, <h1>, <p>, <button>, <input>, etc.
3. Apply Tailwind classes for layout, spacing, and base styles
4. Apply theme colors via inline style attributes
5. Create a realistic, production-quality ${layoutSection.type}
6. Include appropriate placeholder content for ${layoutSection.type}
7. Make it responsive: use flex, grid, responsive classes (sm:, md:, lg:)
8. Use proper spacing: p-6, gap-4, space-y-4, etc.
9. NO script tags, NO JSX syntax
10. Start directly with <section> or <div>

Generate clean, beautiful HTML:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer. Generate clean, beautiful HTML using Tailwind CSS that mimics shadcn/ui styling. Output ONLY the HTML, no markdown, no explanation, no script tags, no imports. Use semantic HTML (section, div, h1, p, button, etc.) with Tailwind classes. Apply theme colors via inline styles."
        },
        {
          role: "user",
          content: prompt.replace(/JSX/g, "HTML").replace(/shadcn\/ui components/g, "HTML elements styled like shadcn/ui").replace(/Button/g, "button").replace(/Card/g, "div styled as card")
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    let generatedCode = completion.choices[0]?.message?.content || "";
    
    // Clean up the code - remove markdown code blocks if present
    generatedCode = generatedCode
      .replace(/```jsx?\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    return NextResponse.json({
      code: generatedCode,
      layoutType: layoutSection.type,
      confidence: layoutSection.confidence,
    });
    
  } catch (error: any) {
    console.error("Layout generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate layout" },
      { status: 500 }
    );
  }
}

