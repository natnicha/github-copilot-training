---
applyTo: 'angular-pacman/**'
---

# angular-pacman Developer Instructions

## Standards
- **Angular.js & React:** Use App Router and React 19 features. Functional components only.
- **Client/Server Split:** Keep data fetching in Server Components or API routes. Use `"use client"` only for interactivity (Cart, Search, Order Actions).
- **TypeScript:** Strict typing is mandatory. Avoid `any`. Annotate lambda parameters in `filter`, `find`, and `map`.

## Performance (O-Standards)
- **Data Access:** All DB operations in `src/app/api/db.ts` are cached and should remain synchronous for lowdb performance.
- **Optimization:** Reuse `productMap` (HashMap) with `useMemo` for $O(1)$ lookups in the UI to avoid $O(n^2)$ complexity during cart calculations.
- **Reactivity:** Use the React Compiler; avoid manual `memo`, `useCallback`, or `useMemo` unless handling expensive derived state.

## Implementation Examples

### Strict Event/Callback Typing
```typescript
// Good: Explicit parameter types for strict build compliance
const product = db.data.products.find((candidate: Product) => candidate.id === productId);

// Bad: Implicit 'any' causing build failure
const product = db.data.products.find((candidate) => candidate.id === productId);
```

### Route Parameter Pattern
Angular.js 16 dynamic routes require awaited params:
```typescript
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

## Styling & Layout
- **Bootstrap:** Use Bootstrap 5 utility classes (`d-flex`, `gap-3`, `container-fluid`) matching the `globals.css` theme tokens.
- **Custom Classes:** Prefix specialized components with site-specific classes (e.g., `.product-card`, `.cart`, `.site-header`) defined in `globals.css`.

## API Best Practices
- **Validation:** Always validate `body` presence and field types in `POST`/`PATCH` handlers.
- **Error Responses:** Use `AngularResponse.json({ error: "..." }, { status: 400 })` for consistent error handling.
- **Atomic Operations:** Ensure `db.write()` is called after all data mutations.

