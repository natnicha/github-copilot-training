<!--
generate me a concise prompt in natural language for create a skill `next-storefront-responsive-ui` focusing on creating a highly responsive UI that is optimized for both Desktop and Mobile users based on this project. 

# the result must be a prompt for create a new skill
# show me the result in markdown code block.
-->

Create a new Agent Skill named `next-storefront-responsive-ui` for the `next-storefront` project. 

The skill should focus on:
1. **Responsive Layouts for Desktop and Mobile**: Standards for using the `page-layout` grid (1120px max-width) for optimal desktop (PC) experience and adapting to a single-column view below 768px for mobile users.
2. **Hybrid Styling System**: Guidelines for combining Bootstrap 5.3 utilities/grid with Tailwind CSS 4 for micro-adjustments and performance.
3. **Adaptive Components**: Patterns for components like `site-header` (fixed/blurred), `product-card`, and sticky `cart` panels that adapt correctly across both large monitors and small devices.
4. **Performance & Accessibility**: Ensuring responsive images use `loading="lazy"`, layouts prevent Content Layout Shift (CLS), and semantic HTML is used for screen readers across all platforms.
5. **UI Consistency**: Inheriting theme variables from `globals.css` (e.g., radial-gradient backgrounds, `#0f172a` foreground, and `#0369a1` price highlights).

Include a "Standard Templates" section in the SKILL.md demonstrating a responsive CSS Grid container and desktop/mobile-ready navigation patterns consistent with the existing `SiteShell.tsx` and `globals.css`.