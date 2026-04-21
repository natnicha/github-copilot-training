---
title: Technical Specifications
date: 2026-04-21
tags:
  - architecture
  - api
  - lowdb
---

# Technical Specifications

## Architecture
The project is a **Next.js 16** full-stack application using the App Router. It leverages **React 19** and **TypeScript** for the frontend and backend.

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Bootstrap 5
- **Database**: `lowdb` (JSON-based local database)
- **API**: Next.js Route Handlers (located in `src/app/api`)

## Data Flow
1. **Client**: Frontend components (e.g., `page.tsx`) fetch data from `/api/products` and submit orders to `/api/orders`.
2. **API**: Route handlers interact with a singleton `lowdb` instance defined in `src/app/api/db.ts`.
3. **Database**: `db.json` stores products, categories, and orders.

## Key APIs
- `GET /api/products`: Lists products with optional search and category filters.
- `POST /api/orders`: Creates a new order.
- `GET /api/orders`: Lists all orders.
- `DELETE /api/orders/[id]`: Cancels/removes an order.

