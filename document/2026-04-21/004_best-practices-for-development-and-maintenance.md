---
title: Best Practices for Development and Maintenance
date: 2026-04-21
tags:
  - best-practices
  - maintenance
  - code-quality
---

# Best Practices for Development and Maintenance

## General Code Standards
- **Strong Typing**: Use TypeScript for all components and API handlers. Avoid `any`.
- **Component Patterns**: Follow the existing Next.js App Router patterns for layouts, pages, and components.
- **Project Structure**: Keep routes in `src/app`. Place reusable UI components and logic in their appropriate folders.

## Performance and Quality
- **Performance Expert Instruction**: Follow the instruction to prefer $O(n)$ over $O(n^2)$, use streaming over buffering, and minimize memory allocations.
- **Styling**: Always align with the project's existing UI patterns (Tailwind CSS 4 + Bootstrap 5). Check `globals.css` before introducing new styles.
- **Client vs Server Components**: Use server components by default. Add `"use client"` only for components requiring interactivity or browser APIs.

## Maintenance
- **API Versions**: When adding new API functionality, maintain backward compatibility or version appropriately.
- **Dependencies**: Periodically check for dependency updates. Pin versions in `package.json`.
- **Error Handling**: Use `error.tsx` for route-level error boundaries and standard HTTP error codes in API responses.

