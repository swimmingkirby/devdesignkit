Product Requirements Document (PRD)
DesignKit AI — Frontend / Interaction Layer

(Your scope only — no backend logic)

Purpose

To build the user-facing interface for a tool that helps developers generate a customizable UI theme and design system before coding, based on:

Presets (default themes)

Tweaks (colors, fonts, radius, spacing, shadows)

Inspiration (screenshots → extracted style) (backend)

This PRD ensures your frontend can plug into the backend later without architecture changes.

High-Level Flow (Your Scope)

Welcome Screen

Start Options:

A) Upload inspiration (calls backend later)

B) Choose preset theme

Style Customizer

Colors

Typography

Radius

Spacing

Shadows

Live Component Preview (shadcn)

Export Screen (UI only, triggers backend later)

The frontend manages all UI state, updates preview instantly, and sends token payloads to backend endpoints once they exist.

1. Scope Overview
YOU own:

UI design

Component layout (shadcn)

Theme editor

Preset themes

Live preview page

Frontend state management (tokens)

Integration stubs (for teammate to hook into later)

All navigation

The overall user flow

Placeholder loaders and mock data

Teammate will later plug in:

AI inspo extraction → returns a theme token object

Export logic → receives the final theme tokens

Any future code generation

Your job is to make the frontend accept & output tokens, nothing more.

2. Data Model (MOST IMPORTANT PART)

This is the schema your UI will work with, and the backend will return + consume.
Define this once, and the team will be aligned.

ThemeTokens {
  colors: {
    primary: string,
    secondary?: string,
    background: string,
    foreground: string,
    muted: string,
    accent?: string,
    neutralScale?: string[] // optional array of grays
  },
  typography: {
    headingFont: string,
    bodyFont: string,
    scale: "sm" | "md" | "lg"
  },
  radius: number,        // in px
  spacing: "compact" | "cozy" | "spacious",
  shadows: "soft" | "normal" | "strong"
}


Your UI reads, modifies, and outputs this object.
Backend uses the same shape.

3. Key Screens & Requirements
A. Welcome Screen

Purpose: Let users choose how to start.

Elements:

Product name + short description

Two big CTAs:

“Start With Inspiration”

“Start With Presets”

No backend calls needed yet — you just route to correct screens.

B. Start From Inspiration (Frontend Stub)

Your job:

File upload UI

Preview thumbnails

“Analyze” button → triggers loader

After loader, call backend later

For now: return mock token object and pass into the customizer

Your UI accepts tokens like:

themeTokens = {
  colors: {...},
  typography: {...},
  radius: ...,
  spacing: ...,
  shadows: ...
}


Teammate will fill in the actual backend logic.

C. Start From Presets

Preset library you create:

Example presets:

Minimal

Soft / Rounded

Productivity (Linear-like)

Brutalist

Playful

Dark Mode Minimal

Each preset has a static token object.

Your UI → select preset → send preset tokens to Customizer.

D. Style Customizer

This is the core of your work.

Customizer Sidebar

Controls for:

✔ Colors

Primary color

Background color

Foreground/contrast

Accent color

Neutral scale intensity (slider)

✔ Typography

Heading font dropdown

Body font dropdown

Scale slider (sm/md/lg)

✔ Radius

Global border radius slider (0–16px)

✔ Spacing

Toggle or slider
(“compact | cozy | spacious”)

✔ Shadows

Toggle for shadow intensity

State is stored in the themeTokens object.

E. Component Preview (Live)

A panel showing shadcn components styled with current themeTokens.

Components include:

Button

Input

Card

Modal

Toggle

Dropdown

Navbar

You don’t need logic — just use CSS variables driven by tokens.

F. Screens Preview (Optional but nice)

Simple static screens using the theme:

Login

Dashboard

Settings

These update in real time with the tokens.

G. Export Screen (Frontend Stub)

UI elements:

“Export to GitHub” button

“Download ZIP” button

You don’t implement the backend logic — just prepare the final themeTokens object to send.

Backend endpoints later:

/exportProject

/exportGitHub

For now, just console.log the tokens.

4. Integration Points for Teammate (Stubbed)

You build placeholder functions:

1. importFromInspiration(files)

Currently:

returns mockThemeTokens;


Later:

teammate replaces mock with backend call.

2. exportProject(themeTokens)

Currently:

console.log(themeTokens)


Later:

send tokens → backend

backend generates folder

backend returns zip

3. exportGitHub(themeTokens)

Currently:

alert("Coming soon")


Later:

OAuth → push repo

5. Technical Requirements (Frontend)

Framework: Next.js (recommended)

UI Library: shadcn/ui

Styling: Tailwind (required for theme tokens)

State: Zustand or built-in React state

Token storage: React context

Routing: Next.js pages

No backend logic required

6. Non-Functional Requirements
Performance:

Preview should instantly reflect token changes

Use CSS variables for easy theme swapping

UX:

Clear, simple controls

Visual clarity for “before” and “after” theme states

Smooth transitions

Extensibility:

Token schema must not break

All screens must accept externally provided themeTokens

7. Out-of-Scope for You

AI extraction

Vision models

Export logic

GitHub API

Code generation

Theme validation

Project building

These belong to your teammate.