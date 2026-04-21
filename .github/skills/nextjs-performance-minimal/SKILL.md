---
name: nextjs-performance-minimal
description: 'Create and edit Next.js App Router features with minimal styling and strong performance. Use when working on this repo''s storefront UI, server/client component split, Bootstrap-based layouts, API routes, lowdb-backed data access, TypeScript strictness, or when a user asks for Next.js templates, frontend patterns, backend route handlers, or performance optimization.'
---

# Next.js Performance Minimal

Use this skill for the `next-storefront` app when adding or changing App Router pages, route handlers, or shared UI patterns.

## Goals
- Keep styling minimal and consistent with the repo''s Bootstrap-first approach.
- Prefer server components for data loading and client components only for interactivity.
- Keep runtime allocations low and derived data O(1) where possible.
- Preserve strict TypeScript and avoid implicit `any`.

## Style Rules
- Use Bootstrap utilities first: `container-fluid`, `d-flex`, `gap-3`, `row`, `col-*`, `btn`, `form-control`.
- Add custom classes only when a pattern repeats or needs a shared visual token.
- Keep CSS small and centralized in `src/app/globals.css`.
- Avoid decorative UI libraries unless the repo already uses them.
- Use semantic HTML and accessible labels.

## Performance Rules
- Fetch on the server when data is needed for first paint.
- Use client components only for search, cart, filters, and other interactive state.
- Use `useMemo` only for expensive derived collections like maps or grouped lookups.
- Prefer `Map` / `Set` for repeated lookups instead of nested loops.
- Validate and compute totals on the server; never trust client totals.
- Keep lowdb mutations in route handlers and write once after all updates.

## Frontend Template

Use this template for a minimal App Router page with a server-first shell and a small interactive island.

```tsx
// src/app/page.tsx
import type { Product } from "@/app/api/db";
import { getDb } from "@/app/api/db";
import InteractiveCatalog from "./InteractiveCatalog";

export default async function Page() {
  const db = await getDb();
  const products: Product[] = db.data.products;

  return (
    <main className="container-fluid py-4">
      <section className="page-layout mx-auto px-3 px-md-4">
        <div className="search-panel p-4">
          <h1 className="h3 mb-2">Storefront</h1>
          <p className="text-secondary-custom mb-0">Fast, minimal, server-rendered first paint.</p>
        </div>

        <InteractiveCatalog products={products} categories={db.data.categories} />
      </section>
    </main>
  );
}
```

```tsx
// src/app/InteractiveCatalog.tsx
"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/app/api/db";

export default function InteractiveCatalog({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || product.name.toLowerCase().includes(query);
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="d-grid gap-3">
      <div className="search-panel p-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Search</label>
            <input className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visible.map((product) => (
        <article key={product.id} className="product-card p-3 p-md-4">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>
              <h2 className="h5 mb-1">{product.name}</h2>
              <div className="small text-secondary-custom">{product.category}</div>
            </div>
            <div className="price-text fw-semibold">${(product.priceCents / 100).toFixed(2)}</div>
          </div>
        </article>
      ))}

      <div className="small text-secondary-custom">{productMap.size} products loaded</div>
    </div>
  );
}
```

## Backend Template

Use this template for a minimal, strict API route with low allocation and server-side validation.

```ts
// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { getDb, type Product } from "../db";

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ products: db.data.products, categories: db.data.categories });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || typeof body.priceCents !== "number") {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  const product: Product = {
    id: `prd-${String(db.data.products.length + 1).padStart(3, "0")}`,
    name: body.name.trim(),
    priceCents: body.priceCents,
    imageUrl: typeof body.imageUrl === "string" ? body.imageUrl.trim() : "",
    category: typeof body.category === "string" ? body.category.trim() : "",
  };

  if (!product.name || !product.imageUrl || !product.category || product.priceCents <= 0) {
    return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
  }

  db.data.products.push(product);
  if (!db.data.categories.includes(product.category)) {
    db.data.categories.push(product.category);
  }
  await db.write();

  return NextResponse.json({ product }, { status: 201 });
}
```

```ts
// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { getDb, type OrderStatus } from "../../db";

const statuses: OrderStatus[] = ["pending", "confirmed", "cancelled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as OrderStatus | undefined;

  if (!status || !statuses.includes(status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  const db = await getDb();
  const order = db.data.orders.find((entry) => entry.id === id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  order.status = status;
  await db.write();

  return NextResponse.json({ order });
}
```

## Do / Don’t

### Do
- Keep shared types in `src/app/api/db.ts`.
- Reuse existing CSS classes like `.site-header`, `.cart`, `.product-card`, `.search-panel`.
- Compute totals on the server.
- Keep API route responses small and typed.
- Use `Map` for lookup-heavy UI state.

### Don’t
- Don’t add heavy styling systems or component libraries.
- Don’t compute order totals on the client.
- Don’t use implicit `any` in callbacks.
- Don’t split tiny UI pieces into client components unless they need state.
- Don’t duplicate data fetching logic across pages.

## Repo-Specific References
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/orders/page.tsx`
- `src/app/api/db.ts`
- `src/app/api/products/route.ts`
- `src/app/api/orders/route.ts`
- `src/app/api/orders/[id]/route.ts`
- `src/app/globals.css`

