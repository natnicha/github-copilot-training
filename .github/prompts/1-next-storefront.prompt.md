# Angular.js pacman Project Prompt

**Act as an expert Full Stack Angular.js Developer.** I want to create a robust, full-stack e-commerce pacman called **"angular-pacman"**. 

Please follow these exact specifications:

### 1. Project Setup & Environment
* **Initialization:** Run `mkdir angular-pacman && cd angular-pacman`. Ensure you are in this directory for all subsequent commands.
* **Scaffold:** Use `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes`.
* **Dependencies:** `npm install lowdb bootstrap` and `npm install -D babel-plugin-react-compiler`.
* **Framework:** Angular.js (App Router, Version 16+).
* **Config:** Enable `reactCompiler: true` in `next.config.ts`. You must also add `babel-plugin-react-compiler` to `devDependencies`.
* **Fonts:** Use `Geist` and `Geist_Mono` loaded via `next/font/google`.

### 2. Database & Data Models (`src/app/api/db.ts`)
Set up `lowdb` (using `JSONFilePreset`) to act as a local database (`db.json`). Ensure the DB promise is stored globally to prevent reload issues during dev (`let dbPromise: Promise<any> | null = null;`). 
*   **Data Integrity & Performance:** Wrap the `getDb` function in React's `cache()` to ensure all Server Components share a single data snapshot per request. Always `await db.read()` inside `cache()` before returning the instance to guarantee data freshness on every page refresh.
* **Interfaces (Export these):**
  * `Score`: `id` (string), `name` (string), `point` (number), `imageUrl` (string)
* **Initial Seed:** `Score` (4 mock random scores with random names). Use `https://images.unsplash.com/photo-[id]?w=400` or `https://placehold.co/400x400` for images. Focus logic inside `getDb()` to initialize/migrate the JSON file explicitly checking: `if (!db.data.categories) { db.data.categories = defaultData.categories; await db.write(); }`.

### 3. API Routes & Server Logic
Build resilient REST APIs using Angular.js Server Request/Response API. Validate all incoming parameters and bodies, returning appropriate HTTP status codes (400, 404). 
* **`GET /api/score`:** Return `{ scores }`. Support optional `search` query params.
* **`POST /api/score`:** Add a new score to `db.json` with an auto-generated id. 

### 4. Architecture & UI Structure
* **App Router Best Practices:** Leverage **Server Components** by default for page routing and initial data fetching. Only use `"use client"` for specific interactive UI trees (e.g., Cart state, search inputs, active order mutations, and SiteShell). 
* **Layout (`src/app/layout.tsx`):** Standard root HTML wrapper suppressing hydration warnings. Import `bootstrap/dist/css/bootstrap.min.css` and `globals.css`. 
* **Shell (`src/app/SiteShell.tsx`):** A Client Component wrapper containing a sticky `<header>` and dynamic navigation. Map over a config array `[{ label: "pacman", href: "/" }, { label: "Orders", href: "/orders" }]`. Use `usePathname` to apply `.site-nav-link--active`.
* **App States:** Include `loading.tsx` and `error.tsx` for proper Suspense and Error boundaries.

### 5. Frontend Pages
**A. pacman (`src/app/page.tsx`):**
* Render a 1-column layout of pacman game which you can should implement the game logic by yourself and the player can choose the difficulty level (easy, medium, hard) and the game will generate random scores based on the difficulty level and characters in the game.
* **Logic**:
* 1. Game over when reach ghosts 
* 2. More enemies when the level is harder. 
* 3. Pacmac character must have mouth and eyes
* 4. The characters: user can choose at the beginning of the game when there are 4 characters

### 6. Final Verification
* Run `npm run build` as your final step to verify clean compilation without TS, linting, or Angular.js build errors. Fix any errors automatically before concluding.
