import { ThemeTokens } from "@/lib/types/theme"

export function generateReadme(themeName: string): string {
    return `# ${themeName} Design System

This is a portable design system exported from DevDesignKit. It contains all the design tokens, CSS variables, and configuration files needed to use this theme in your project.

## 📦 Contents

- \`design-system.json\`: Raw design tokens in JSON format.
- \`tokens.css\`: CSS variables for colors, typography, radius, etc.
- \`fonts.css\`: Font imports and definitions.
- \`tailwind-theme-extension.js\`: Tailwind CSS configuration extension.
- \`preview.html\`: A standalone HTML file to preview the theme.
- \`shadcn-overrides/\`: JSON configuration for Shadcn UI components.

## 🚀 How to Use

### 1. Add CSS Variables
Import \`tokens.css\` and \`fonts.css\` in your global CSS file (e.g., \`globals.css\` or \`index.css\`).

\`\`\`css
@import './my-theme/fonts.css';
@import './my-theme/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

### 2. Configure Tailwind
Merge the contents of \`tailwind-theme-extension.js\` into your \`tailwind.config.js\`.

\`\`\`javascript
const themeExtension = require('./my-theme/tailwind-theme-extension.js');

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      ...themeExtension.theme.extend,
    },
  },
  plugins: [],
}
\`\`\`

### 3. Use in Components
You can now use the standard Tailwind utility classes, and they will automatically use your theme's values.

\`\`\`jsx
<div className="bg-primary text-primary-foreground rounded-md p-4 shadow-base">
  <h1 className="font-heading text-h1">Hello World</h1>
  <p className="font-sans text-body">This is using the exported theme.</p>
</div>
\`\`\`

## 🎨 Shadcn UI
If you are using Shadcn UI, you can use the files in \`shadcn-overrides/\` to customize your components. The CSS variables map 1:1 to the standard Shadcn variable names, so most components should work out of the box!
`
}
