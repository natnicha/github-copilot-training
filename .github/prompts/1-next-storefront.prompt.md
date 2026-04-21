# Next.js Storefront Project Prompt

**Act as an expert Full Stack Next.js Developer.** I want to create a robust, full-stack e-commerce storefront called **"next-storefront"**. 

Please follow these exact specifications:

### 1. Project Setup & Environment
* **Initialization:** Run `mkdir next-storefront && cd next-storefront`. Ensure you are in this directory for all subsequent commands.
* **Scaffold:** Use `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes`.
* **Dependencies:** `npm install lowdb bootstrap` and `npm install -D babel-plugin-react-compiler`.
* **Framework:** Next.js (App Router, Version 16+).
* **Config:** Enable `reactCompiler: true` in `next.config.ts`. You must also add `babel-plugin-react-compiler` to `devDependencies`.
* **Fonts:** Use `Geist` and `Geist_Mono` loaded via `next/font/google`.

### 2. Database & Data Models (`src/app/api/db.ts`)
Set up `lowdb` (using `JSONFilePreset`) to act as a local database (`db.json`). Ensure the DB promise is stored globally to prevent reload issues during dev (`let dbPromise: Promise<any> | null = null;`). 
*   **Data Integrity & Performance:** Wrap the `getDb` function in React's `cache()` to ensure all Server Components share a single data snapshot per request. Always `await db.read()` inside `cache()` before returning the instance to guarantee data freshness on every page refresh.
* **Interfaces (Export these):**
  * `Product`: `id` (string), `name` (string), `priceCents` (number), `imageUrl` (string), `category` (string)
  * `OrderItem`: `productId` (string), `quantity` (number), `priceCents` (number)
  * `OrderStatus`: `"pending" | "confirmed" | "cancelled"`
  * `Order`: `id` (string), `createdAt` (ISO date string), `totalCents` (number), `items` (OrderItem[]), `status` (OrderStatus)
* **Initial Seed:** `products` (4 mock products across 'Electronics', 'Home', 'Apparel'), `categories` (string array), and `orders` (empty). Use `https://images.unsplash.com/photo-[id]?w=400` or `https://placehold.co/400x400` for images. Focus logic inside `getDb()` to initialize/migrate the JSON file explicitly checking: `if (!db.data.categories) { db.data.categories = defaultData.categories; await db.write(); }`.

### 3. API Routes & Server Logic
Build resilient REST APIs using Next.js Server Request/Response API. Validate all incoming parameters and bodies, returning appropriate HTTP status codes (400, 404). 
* **`GET /api/products`:** Return `{ products, categories }`. Support optional `search` and `category` query params.
* **`POST /api/products`:** Add a new product to `db.json` with an auto-generated id. 
* **`GET /api/orders`:** Return all order history.
* **`POST /api/orders`:** Payload: `{ items: [{ productId, quantity }] }`. Validate quantity (1-99) and ensure products exist. **Crucially, calculate `totalCents` on the server using hardware DB prices** so you do not trust client-side pricing. Save with an `ORD-XXX` ID (incremental, padded) and "pending" status. Return 201.
* **`PATCH /api/orders/[id]`:** Payload: `{ status: OrderStatus }`. Validate status and ID. Update DB.

### 4. Architecture & UI Structure
* **App Router Best Practices:** Leverage **Server Components** by default for page routing and initial data fetching. Only use `"use client"` for specific interactive UI trees (e.g., Cart state, search inputs, active order mutations, and SiteShell). 
* **Layout (`src/app/layout.tsx`):** Standard root HTML wrapper suppressing hydration warnings. Import `bootstrap/dist/css/bootstrap.min.css` and `globals.css`. 
* **Shell (`src/app/SiteShell.tsx`):** A Client Component wrapper containing a sticky `<header>` and dynamic navigation. Map over a config array `[{ label: "Storefront", href: "/" }, { label: "Orders", href: "/orders" }]`. Use `usePathname` to apply `.site-nav-link--active`.
* **App States:** Include `loading.tsx` and `error.tsx` for proper Suspense and Error boundaries.

### 5. Frontend Pages
**A. Storefront (`src/app/page.tsx`):**
* Render a 2-column layout (Left: `.storefront-section` with Search/Products, Right: `.cart-section` with Cart Summary).
* State: Manage `cart`, `search`, and `category`. 
* Cart Logic: Calculate subtotals and item counts. Allow quantity edits (0-99). Auto-remove if quantity hits 0. Include "Clear Cart" and "Place Order" (which resets state). Use a localized UI state for submitting feedback.
* Format all `priceCents` using `Intl.NumberFormat` (USD). 

**B. Orders History (`src/app/orders/page.tsx`):**
* Render as a Client Component tracking `isLoading`, `error`, and `updatingOrderId`.
* Display a list of orders (ID, formatted total, Date, and status badge e.g., `.orders-status--pending`).
* Optimistic UI: Provide buttons (`.cart-button--primary`, `.cart-button--secondary`) to toggle status to "confirmed" or "cancelled". Show "Processing..." while the `PATCH` is in flight. Disable actions if status is not "pending" or if syncing.

### 6. Design & Styling (Strict matches)
Use Bootstrap's grid system (`container-fluid`, `row`, `col-...`) combined with custom CSS in `globals.css`:
* **Theme:** Background `radial-gradient(circle at top left, #eff6ff 0, #f9fafb 40%, #e5e7eb 90%)`. Text `#0f172a`, Secondary `#6b7280`, Muted `#9ca3af`. Prices `#0369a1`.
* **Header (`.site-header`):** `position: fixed; backdrop-filter: blur(16px); background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7), transparent); border-bottom: 1px solid rgba(209,213,219,0.7); z-index: 20;`
* **Nav Active (`.site-nav-link--active`):** `background: #111827; color: #f9fafb; border-color: #111827;`
* **Layout (`.page-layout`):** `max-width: 1120px; display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);` (responsive to 1 column at `max-width: 768px`).
* **Containers:** 
  * `.search-panel` / `.product-card`: `border-radius: 0.9rem; background: #FFF; border: 1px solid rgba(209,213,219,0.9); box-shadow: 0 14px 30px rgba(148,163,184,0.4);`
  * `.cart`: Same as above but add `position: sticky; top: 2.5rem; box-shadow: 0 18px 40px rgba(148,163,184,0.4);`
* **Buttons:** 
  * `.add-to-cart-button` / `.cart-button--primary`: `background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: #f9fafb; box-shadow: 0 10px 18px rgba(37,99,235,0.35);` (Hover: `transform: translateY(-1px)` & deeper shadow `0 14px 28px rgba(37,99,235,0.45)`).
  * `.cart-button--secondary`: `background: #f9fafb; color: #0f172a; border-color: rgba(148,163,184,0.9);`
* **Pills (`.filter-pill`):** `border-radius: 999px; border: 1px solid rgba(148,163,184,0.7); background: #f9fafb;`
  * `.filter-pill--selected`: `border-color: rgba(56,189,248,0.9); background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.25));`

### 7. Final Verification
* Run `npm run build` as your final step to verify clean compilation without TS, linting, or Next.js build errors. Fix any errors automatically before concluding.