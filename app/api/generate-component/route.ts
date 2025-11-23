import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

/**
 * POST /api/generate-component
 * 
 * Generates React/JSX component code from scraped component data using GPT-4
 */
export async function POST(request: NextRequest) {
  try {
    const { component, theme, componentType } = await request.json();
    
    if (!component || !theme || !componentType) {
      return NextResponse.json(
        { error: "component, theme, and componentType are required" },
        { status: 400 }
      );
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Build component-specific prompt
    const componentPrompts = {
      button: `Generate a beautiful, interactive Button using shadcn/ui`,
      card: `Generate a modern Card using shadcn/ui components with CardHeader, CardTitle, and CardContent`,
      navItem: `Generate a navigation link/button using shadcn/ui Button component`,
    };
    
    const prompt = `Generate a beautiful ${componentType} that looks exactly like shadcn/ui styling.

**Component Data:**
${JSON.stringify(component, null, 2)}

**Theme:**
- Primary: ${theme.colors.primary}
- Primary Text: ${theme.colors.primaryForeground}
- Background: ${theme.colors.background}
- Foreground: ${theme.colors.foreground}
- Border: ${theme.colors.border}
- Font: ${theme.fonts.sans}
- Radius: ${theme.radius.medium}

**Requirements:**
1. Generate ONLY HTML (no JSX, no React components)
2. Use Tailwind CSS classes for layout and spacing
3. Apply theme colors via inline style attribute
4. Text content: "${component.text || `${componentType}`}"
${componentType === 'button' ? `
5. Create a <button> element with:
   - Tailwind: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
   - style="background-color: ${component.background || theme.colors.primary}; color: ${component.color || theme.colors.primaryForeground}; border-radius: ${component.radius || theme.radius.medium}; padding: ${component.padding || "0.5rem 1rem"}; font-family: ${theme.fonts.sans};"
   - Add hover:opacity-90
` : componentType === 'card' ? `
5. Create a card with nested divs:
   - Outer div with Tailwind: "rounded-lg border shadow-sm"
   - style="background-color: ${component.background || theme.colors.card || theme.colors.background}; border-color: ${theme.colors.border}; border-radius: ${component.radius || theme.radius.medium};"
   - Header div with Tailwind: "flex flex-col space-y-1.5 p-6"
   - Title h3 with Tailwind: "text-2xl font-semibold leading-none tracking-tight"
   - Content div with Tailwind: "p-6 pt-0"
` : `
5. Create a navigation <a> element with:
   - Tailwind: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
   - style="color: ${component.color || theme.colors.foreground}; font-family: ${theme.fonts.sans};"
`}
6. Make it production-ready and interactive
7. NO script tags, NO JSX syntax
8. Start directly with the HTML element

Generate clean HTML:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer. Generate clean, beautiful HTML using Tailwind CSS that mimics shadcn/ui component styling. Output ONLY the HTML, no markdown, no explanation, no script tags. Use semantic HTML with Tailwind classes and inline styles for theme colors."
        },
        {
          role: "user",
          content: prompt.replace(/JSX/g, "HTML").replace(/Button component/g, "button element styled like shadcn Button").replace(/Card component/g, "div elements styled like shadcn Card")
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    let generatedCode = completion.choices[0]?.message?.content || "";
    
    // Clean up the code
    generatedCode = generatedCode
      .replace(/```jsx?\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    return NextResponse.json({
      code: generatedCode,
      componentType,
    });
    
  } catch (error: any) {
    console.error("Component generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate component" },
      { status: 500 }
    );
  }
}

