---
title: Usage Guidelines
date: 2026-04-21
tags:
  - guide
  - onboarding
  - dev-ops
---

# Usage Guidelines

## Local Development
1. **Clone the repository**: `git clone <repo-url>`.
2. **Install dependencies**: `npm install`.
3. **Run the development server**: `npm run dev`.
4. **Access the app**: [http://localhost:3000](http://localhost:3000).

## Build and Deploy
1. **Production build**: `npm run build`.
2. **Start the production server**: `npm run start`.

## Project Structure
- `src/app`: Routes, layouts, and pages.
- `src/app/api`: Server-side route handlers.
- `public`: Static assets.

## Database
- Database is local and file-based (`db.json` in the root). It is initialized on first start.

