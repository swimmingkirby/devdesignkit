# Dev Design Kit

A Next.js project configured with shadcn/ui and Tailwind CSS.

## Features

- ⚡ **Next.js 15** - React framework for production
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 📘 **TypeScript** - Type-safe development
- 🎯 **ESLint** - Code quality and consistency

## Getting Started

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding shadcn/ui Components

To add shadcn/ui components to your project, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Project Structure

```
.
├── app/                # Next.js App Router directory
│   ├── globals.css     # Global styles with Tailwind and shadcn/ui CSS variables
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   └── ui/            # shadcn/ui components (created when you add components)
├── lib/               # Utility functions
│   └── utils.ts       # cn() utility for className merging
├── components.json    # shadcn/ui configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── postcss.config.mjs # PostCSS configuration
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

