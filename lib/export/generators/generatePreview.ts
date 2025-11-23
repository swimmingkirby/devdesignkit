import { ThemeTokens } from "@/lib/types/theme"

export function generatePreview(tokens: ThemeTokens, themeName: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${themeName} - Preview</title>
    <link rel="stylesheet" href="fonts.css">
    <link rel="stylesheet" href="tokens.css">
    <style>
        body {
            background-color: var(--color-background);
            color: var(--color-foreground);
            font-family: var(--font-sans);
            margin: 0;
            padding: 40px;
            line-height: 1.5;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        h1, h2, h3 {
            font-family: var(--font-heading, var(--font-sans));
            margin-bottom: 1rem;
        }

        h1 { font-size: var(--font-size-h1); }
        h2 { font-size: var(--font-size-h2); }
        h3 { font-size: var(--font-size-h3); }

        .card {
            background-color: var(--color-card);
            color: var(--color-card-foreground);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-medium);
            padding: 24px;
            box-shadow: var(--shadow-base);
            margin-bottom: 24px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 16px;
            border-radius: var(--radius-small);
            font-weight: 500;
            cursor: pointer;
            border: none;
            font-size: var(--font-size-body);
            transition: opacity 0.2s;
        }

        .btn:hover { opacity: 0.9; }

        .btn-primary {
            background-color: var(--color-primary);
            color: var(--color-primary-foreground);
        }

        .btn-secondary {
            background-color: var(--color-secondary);
            color: var(--color-secondary-foreground);
        }

        .btn-destructive {
            background-color: var(--color-destructive);
            color: var(--color-destructive-foreground);
        }

        .input {
            display: block;
            width: 100%;
            padding: 8px 12px;
            border-radius: var(--radius-small);
            border: 1px solid var(--color-input);
            background-color: var(--color-background);
            color: var(--color-foreground);
            font-size: var(--font-size-body);
            margin-bottom: 16px;
            box-sizing: border-box;
        }

        .swatch-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }

        .swatch {
            border-radius: var(--radius-medium);
            overflow: hidden;
            border: 1px solid var(--color-border);
        }

        .swatch-color {
            height: 80px;
            width: 100%;
        }

        .swatch-label {
            padding: 8px;
            font-size: var(--font-size-caption);
            background-color: var(--color-card);
            color: var(--color-card-foreground);
            border-top: 1px solid var(--color-border);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${themeName}</h1>
        <p style="font-size: var(--font-size-body); color: var(--color-muted-foreground);">
            This is a static preview of your exported design system.
        </p>

        <hr style="border: 0; border-top: 1px solid var(--color-border); margin: 32px 0;">

        <h2>Colors</h2>
        <div class="swatch-grid">
            <div class="swatch">
                <div class="swatch-color" style="background-color: var(--color-primary);"></div>
                <div class="swatch-label">Primary</div>
            </div>
            <div class="swatch">
                <div class="swatch-color" style="background-color: var(--color-secondary);"></div>
                <div class="swatch-label">Secondary</div>
            </div>
            <div class="swatch">
                <div class="swatch-color" style="background-color: var(--color-accent);"></div>
                <div class="swatch-label">Accent</div>
            </div>
            <div class="swatch">
                <div class="swatch-color" style="background-color: var(--color-muted);"></div>
                <div class="swatch-label">Muted</div>
            </div>
            <div class="swatch">
                <div class="swatch-color" style="background-color: var(--color-destructive);"></div>
                <div class="swatch-label">Destructive</div>
            </div>
        </div>

        <h2>Components</h2>
        <div class="card">
            <h3>Card Component</h3>
            <p style="margin-bottom: 16px;">This is a card component using the theme's border radius, shadow, and colors.</p>
            
            <label style="display: block; margin-bottom: 8px; font-size: var(--font-size-caption); font-weight: 500;">Input Field</label>
            <input type="text" class="input" placeholder="Type something...">

            <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary">Primary Action</button>
                <button class="btn btn-secondary">Secondary</button>
                <button class="btn btn-destructive">Delete</button>
            </div>
        </div>

        <h2>Typography</h2>
        <div class="card">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p style="font-family: var(--font-serif);">Serif text. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p style="font-family: var(--font-mono); background: var(--color-muted); padding: 4px; border-radius: 4px; display: inline-block;">Monospace text</p>
            <p style="font-size: var(--font-size-caption); color: var(--color-muted-foreground);">Caption text</p>
        </div>
    </div>
</body>
</html>
`
}
