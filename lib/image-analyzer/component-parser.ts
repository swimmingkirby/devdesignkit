import { Components } from "@/lib/scraper/types";
import { callHuggingFaceVision } from "./huggingface-client";
import { extractJSON } from "./parsers/json-extractor";
import { normalizeComponents, getDefaultComponents } from "./parsers/normalizer";

/**
 * Identify UI components from website screenshot using LLM
 */
export interface ComponentParseResult {
  components: Components;
  rawResponse: string;
}

export async function parseComponentsFromLLM(
  base64Image: string,
  mimeType: string
): Promise<ComponentParseResult> {
  const prompt = `You are a senior UI/UX designer and shadcn/ui expert performing a comprehensive component audit of this website screenshot.

YOUR MISSION: Identify which shadcn/ui components are used, extract their variants and properties with maximum detail.

════════════════════════════════════════════════════════════════
SHADCN/UI COMPONENT LIBRARY REFERENCE
════════════════════════════════════════════════════════════════

Look for these shadcn/ui components (check which ones are present):

**BUTTONS & ACTIONS:**
• Button (default, destructive, outline, secondary, ghost, link variants)
• Toggle, ToggleGroup
• Dropdown Menu
• Context Menu
• Menubar

**FORMS & INPUTS:**
• Input
• Textarea
• Select
• Checkbox
• Radio Group
• Switch
• Slider
• Label
• Form (with validation)
• Combobox
• Command Palette

**LAYOUT & NAVIGATION:**
• Card (with Header, Content, Footer)
• Tabs
• Accordion
• Collapsible
• Navigation Menu
• Breadcrumb
• Pagination
• Separator
• Sidebar
• Resizable panels

**FEEDBACK & OVERLAYS:**
• Dialog / Modal
• Alert Dialog
• Sheet (slide-out panel)
• Popover
• Tooltip
• Toast / Sonner
• Alert
• Badge
• Progress
• Skeleton
• Spinner

**DATA DISPLAY:**
• Table
• Data Table (with sorting, filtering)
• Avatar
• Calendar
• Date Picker
• Chart
• Carousel
• Aspect Ratio
• Scroll Area

**TYPOGRAPHY & MEDIA:**
• Typography styles
• Hover Card
• Drawer

════════════════════════════════════════════════════════════════
YOUR ANALYSIS TASK
════════════════════════════════════════════════════════════════

1. **IDENTIFY**: Which shadcn/ui components from the list above are visible in this screenshot?

2. **EXTRACT**: For each identified component, provide detailed properties.

3. **CATEGORIZE**: Group by component type (buttons, cards, navigation, forms, feedback, data display).

4. **VARIANTS**: Note which shadcn variant is used (e.g., Button variant="outline").

════════════════════════════════════════════════════════════════
SECTION 1: BUTTONS
════════════════════════════════════════════════════════════════

Identify shadcn/ui Button components and their variants:
• default (solid primary button)
• destructive (red/error button)
• outline (bordered, transparent background)
• secondary (subtle, gray background)
• ghost (transparent, minimal)
• link (styled like a link)

Also note:
• Size: sm, default, lg, icon
• Icon buttons (with Lucide React icons)
• Loading states (with spinner)
• Disabled states

For EACH button, provide:
{
  "component": "Button",
  "shadcnVariant": "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
  "size": "sm" | "default" | "lg" | "icon",
  "background": "hex (#0070f3) or 'transparent'",
  "color": "text hex (#ffffff)",
  "border": "border style like '1px solid #e5e7eb' or 'none'",
  "padding": "like '12px 24px' (h-10 px-4 py-2 in Tailwind terms)",
  "fontSize": "text size like '14px' (text-sm) or '16px' (text-base)",
  "fontWeight": "medium (500) or semibold (600)",
  "radius": "border radius like 'calc(var(--radius) - 2px)' ~6-8px",
  "shadow": "CSS shadow or 'none'",
  "hasIcon": true | false,
  "iconPosition": "left" | "right" | "only" | null,
  "iconLibrary": "lucide-react" | "other" | null,
  "isLoading": true | false,
  "isDisabled": true | false,
  "hoverEffect": "description of hover state like 'darkens background'",
  "description": "Like 'Default shadcn Button with primary styling'",
  "frequency": <count>
}

════════════════════════════════════════════════════════════════
SECTION 2: CARDS & LAYOUT COMPONENTS
════════════════════════════════════════════════════════════════

Identify shadcn/ui Card components and other layout components:

**Card Component** (look for Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter structure):
• Standard card with subtle border and shadow
• May contain header with title/description
• Content area in the middle
• Optional footer with actions

**Other Layout Components:**
• Tabs (TabsList, TabsTrigger, TabsContent)
• Accordion (AccordionItem with trigger and content)
• Separator (horizontal or vertical divider)
• Badge (small label/tag)
• Avatar (circular profile image with fallback)

For EACH card/layout component:
{
  "component": "Card" | "Tabs" | "Accordion" | "Badge" | "Avatar" | "Separator",
  "shadcnStructure": "for Card: includes 'CardHeader, CardTitle, CardContent' or similar",
  "background": "bg hex like #ffffff or hsl(var(--card))",
  "color": "text hex or hsl(var(--card-foreground))",
  "border": "border style like '1px solid hsl(var(--border))' or 'none'",
  "padding": "like '24px' (p-6 in Tailwind)",
  "radius": "like 'var(--radius)' ~8-12px",
  "shadow": "subtle shadow like '0 1px 3px 0 rgb(0 0 0 / 0.1)'",
  "hasHeader": true | false,
  "headerContent": "title and/or description" | null,
  "hasFooter": true | false,
  "footerContent": "buttons or actions" | null,
  "contentLayout": "description of card content structure",
  "usesIcons": true | false,
  "iconStyle": "lucide-react icons" | "other" | null,
  "variant": "for Badge: default, secondary, destructive, outline",
  "description": "Like 'shadcn Card with header, content, and footer sections'",
  "frequency": <count>
}

════════════════════════════════════════════════════════════════
SECTION 3: NAVIGATION & MENU COMPONENTS
════════════════════════════════════════════════════════════════

Identify shadcn/ui navigation components:

**Navigation Components:**
• NavigationMenu (horizontal nav with dropdowns)
• Tabs (tab-based navigation)
• Breadcrumb (hierarchical navigation trail)
• Pagination (page navigation)
• Sidebar (app sidebar with navigation)

**Menu Components:**
• DropdownMenu (triggered dropdown)
• Select (dropdown selection)
• Combobox (searchable dropdown)
• Command (command palette / ⌘K menu)

For EACH navigation component:
{
  "component": "NavigationMenu" | "Tabs" | "Breadcrumb" | "Pagination" | "DropdownMenu" | "Select" | "Sidebar",
  "shadcnSubComponents": "like 'NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent'",
  "background": "bg hex or hsl(var(--background))",
  "color": "text hex or hsl(var(--foreground))",
  "colorActive": "active state color or hsl(var(--primary))",
  "colorHover": "hover state color or hsl(var(--accent))",
  "border": "border style or 'none'",
  "activeIndicator": "underline, background, or other active state indicator",
  "padding": "like '8px 12px' (px-3 py-2)",
  "fontSize": "like '14px' (text-sm)",
  "fontWeight": "400 (normal) to 500 (medium)",
  "radius": "like 'var(--radius)' ~6px",
  "shadow": "shadow if dropdown or 'none'",
  "hasIcons": true | false,
  "iconStyle": "lucide-react or other",
  "hasDropdown": true | false,
  "dropdownStyle": "popover style, menu style, etc.",
  "spacing": "gap between items",
  "orientation": "horizontal" | "vertical",
  "description": "Like 'shadcn NavigationMenu with horizontal items and dropdown submenus'",
  "frequency": <count>
}

════════════════════════════════════════════════════════════════
ANALYSIS REQUIREMENTS
════════════════════════════════════════════════════════════════

1. **IDENTIFY SHADCN COMPONENTS FIRST**: Match components to the shadcn/ui library. If it looks like a shadcn component, label it as such.

2. **NOTE SHADCN VARIANTS**: Use the exact shadcn variant names (default, outline, ghost, destructive, etc.)

3. **DETECT CSS VARIABLES**: shadcn uses HSL CSS variables like hsl(var(--primary)). Note if you see this pattern.

4. **CHECK FOR LUCIDE ICONS**: shadcn commonly uses lucide-react icons. Note if icons are present.

5. **IDENTIFY COMPONENT STRUCTURE**: For Cards, note if it uses CardHeader, CardTitle, CardContent, CardFooter structure.

6. **BE THOROUGH**: List all variants and sizes of each shadcn component.

7. **COUNT ACCURATELY**: Frequency = exact number visible of that specific component variant.

8. **EMPTY ARRAYS OK**: If no components in a category (forms, feedback, etc.), return [].

9. **FALLBACK TO GENERIC**: If a component doesn't match shadcn patterns, describe it generically but still provide full details.

════════════════════════════════════════════════════════════════
SECTION 4: FORM & INPUT COMPONENTS
════════════════════════════════════════════════════════════════

Identify shadcn/ui form components if present:
• Input (text field)
• Textarea (multi-line text)
• Select (dropdown)
• Checkbox
• Radio Group
• Switch (toggle)
• Slider
• Label
• Form (with validation)

For EACH form component:
{
  "component": "Input" | "Textarea" | "Select" | "Checkbox" | "RadioGroup" | "Switch" | "Slider" | "Label",
  "variant": "default" | "error" | "disabled",
  "background": "bg hex",
  "color": "text hex",
  "border": "border style",
  "borderFocus": "focus ring style like '2px solid hsl(var(--ring))'",
  "padding": "internal padding",
  "fontSize": "text size",
  "radius": "border radius",
  "placeholder": "placeholder text if visible",
  "hasLabel": true | false,
  "hasError": true | false,
  "hasHelperText": true | false,
  "description": "Like 'shadcn Input with focus ring'",
  "frequency": <count>
}

════════════════════════════════════════════════════════════════
SECTION 5: FEEDBACK & OVERLAY COMPONENTS
════════════════════════════════════════════════════════════════

Identify shadcn/ui feedback components if visible:
• Alert (info, warning, error, success)
• Toast / Sonner (notification)
• Dialog (modal)
• Sheet (slide-out panel)
• Popover
• Tooltip
• Progress bar
• Skeleton loader

For EACH feedback component:
{
  "component": "Alert" | "Toast" | "Dialog" | "Sheet" | "Popover" | "Tooltip" | "Progress" | "Skeleton",
  "variant": "default" | "destructive" | "success" | "warning",
  "background": "bg hex",
  "color": "text hex",
  "border": "border style",
  "padding": "internal padding",
  "radius": "border radius",
  "shadow": "shadow style",
  "hasIcon": true | false,
  "iconPosition": "left" | "right" | null,
  "hasCloseButton": true | false,
  "animation": "slide, fade, none",
  "description": "Like 'shadcn Alert with destructive variant and icon'",
  "frequency": <count>
}

════════════════════════════════════════════════════════════════
OUTPUT JSON STRUCTURE
════════════════════════════════════════════════════════════════

Return a JSON object with these exact keys:
{
  "buttons": [...],      // Array of Button components
  "cards": [...],        // Array of Card and layout components
  "navItems": [...],     // Array of Navigation/Menu components
  "forms": [...],        // Array of Form/Input components
  "feedback": [...],     // Array of Alert/Toast/Dialog components
  "dataDisplay": [...]   // Array of Table/Chart/Avatar/Badge components
}

════════════════════════════════════════════════════════════════
EXAMPLE OUTPUT (shadcn/ui Focused)
════════════════════════════════════════════════════════════════

{
  "buttons": [
    {
      "component": "Button",
      "shadcnVariant": "default",
      "size": "default",
      "background": "hsl(222.2 47.4% 11.2%)",
      "color": "hsl(210 40% 98%)",
      "border": "none",
      "padding": "h-10 px-4 py-2",
      "fontSize": "14px",
      "fontWeight": "500",
      "radius": "calc(var(--radius) - 2px)",
      "shadow": "none",
      "hasIcon": false,
      "iconPosition": null,
      "iconLibrary": null,
      "isLoading": false,
      "isDisabled": false,
      "hoverEffect": "opacity 90% on hover",
      "description": "shadcn Button with default variant, primary action button",
      "frequency": 2
    },
    {
      "component": "Button",
      "shadcnVariant": "outline",
      "size": "default",
      "background": "transparent",
      "color": "hsl(222.2 47.4% 11.2%)",
      "border": "1px solid hsl(214.3 31.8% 91.4%)",
      "padding": "h-10 px-4 py-2",
      "fontSize": "14px",
      "fontWeight": "500",
      "radius": "calc(var(--radius) - 2px)",
      "shadow": "none",
      "hasIcon": false,
      "iconPosition": null,
      "iconLibrary": null,
      "isLoading": false,
      "isDisabled": false,
      "hoverEffect": "background accent color on hover",
      "description": "shadcn Button with outline variant",
      "frequency": 3
    }
  ],
  "cards": [
    {
      "component": "Card",
      "shadcnStructure": "CardHeader with CardTitle, CardDescription, CardContent, CardFooter",
      "background": "hsl(0 0% 100%)",
      "color": "hsl(222.2 84% 4.9%)",
      "border": "1px solid hsl(214.3 31.8% 91.4%)",
      "padding": "24px",
      "radius": "var(--radius)",
      "shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      "hasHeader": true,
      "headerContent": "title and description",
      "hasFooter": true,
      "footerContent": "action buttons",
      "contentLayout": "vertical stack with spacing",
      "usesIcons": true,
      "iconStyle": "lucide-react",
      "variant": null,
      "description": "shadcn Card component with full structure including header and footer",
      "frequency": 3
    }
  ],
  "navItems": [
    {
      "component": "Tabs",
      "shadcnSubComponents": "TabsList, TabsTrigger, TabsContent",
      "background": "hsl(210 40% 96.1%)",
      "color": "hsl(222.2 47.4% 11.2%)",
      "colorActive": "hsl(0 0% 100%)",
      "colorHover": "hsl(210 40% 96.1%)",
      "border": "none",
      "activeIndicator": "background color change",
      "padding": "px-3 py-1.5",
      "fontSize": "14px",
      "fontWeight": "500",
      "radius": "calc(var(--radius) - 2px)",
      "shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1) for active",
      "hasIcons": false,
      "iconStyle": null,
      "hasDropdown": false,
      "dropdownStyle": null,
      "spacing": "gap-2",
      "orientation": "horizontal",
      "description": "shadcn Tabs with TabsList and multiple TabsTrigger items",
      "frequency": 1
    }
  ],
  "forms": [],
  "feedback": [],
  "dataDisplay": [
    {
      "component": "Avatar",
      "shadcnStructure": "Avatar with AvatarImage and AvatarFallback",
      "background": "hsl(210 40% 96.1%)",
      "color": "hsl(222.2 47.4% 11.2%)",
      "border": "none",
      "padding": "0",
      "radius": "9999px",
      "shadow": "none",
      "description": "Circular avatar with image or fallback initials",
      "frequency": 5
    }
  ]
}

════════════════════════════════════════════════════════════════
NOW ANALYZE THIS SCREENSHOT
════════════════════════════════════════════════════════════════

Return ONLY valid JSON with the structure above. No markdown, no explanations, no code blocks.
Be thorough. Extract every component variant you see.`;

  try {
    const response = await callHuggingFaceVision(base64Image, mimeType, prompt);
    const rawResponse =
      typeof response === "string"
        ? response
        : JSON.stringify(response, null, 2);
    
    // Try to extract JSON from response
    const parsed = extractJSON(response);
    
    if (!parsed) {
      console.warn("Failed to parse components from LLM, using defaults");
      return { components: getDefaultComponents(), rawResponse };
    }
    
    return { components: normalizeComponents(parsed), rawResponse };
  } catch (error: any) {
    console.error("Error parsing components from LLM:", error);
    return {
      components: getDefaultComponents(),
      rawResponse: error.message || "Unknown component parser error",
    };
  }
}

