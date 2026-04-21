---
title: Page and Component Descriptions
date: 2026-04-21
tags:
  - nextjs
  - react
  - components
---

# Page and Component Descriptions

## Core Pages
- `/`: The main storefront page (`src/app/page.tsx`). Includes product listing, filtering, and simple cart management.
- `/manage`: Management interface (`src/app/manage/page.tsx`) for admin or store operations.
- `/orders`: Displays a list of orders (`src/app/orders/page.tsx`).

## Core Components
- `RootLayout`: Main Next.js layout (`src/app/layout.tsx`) that embeds fonts and the `SiteShell`.
- `SiteShell`: Common navigation and footer shell (`src/app/SiteShell.tsx`) that wraps all pages.
- `error.tsx`, `loading.tsx`: Default Next.js UI for errors and async operations.

## UI Styling
- **Bootstrap 5**: Grid and common UI components (e.g., `container`, `btn`).
- **Tailwind CSS 4**: Modern styling and layout utilities.
- **`globals.css`**: Customizable CSS for the application’s design system and theme.

