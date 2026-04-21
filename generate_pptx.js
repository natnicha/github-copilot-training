const pptxgen = require("pptxgenjs");

const pres = new pptxgen();

// Title Slide
let slide1 = pres.addSlide();
slide1.addText("KIDS_PAC! Implementation Results", {
  x: 0.5,
  y: 1.0,
  w: "90%",
  h: 1.5,
  fontSize: 44,
  bold: true,
  color: "FF6B6B",
  align: "center",
  fontFace: "Arial Black"
});
slide1.addText("Senior Full Stack & Performance Specialist Report", {
  x: 0.5,
  y: 2.5,
  w: "90%",
  h: 0.5,
  fontSize: 20,
  color: "4ECDC4",
  align: "center"
});

// Technical Stack
let slide2 = pres.addSlide();
slide2.addText("Technical Stack & Architecture", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "FF6B6B" });
slide2.addTable([
  [{ text: "Component", options: { bold: true } }, { text: "Technology/Strategy", options: { bold: true } }],
  ["Frontend", "Next.js 15 (App Router), React 19"],
  ["Styling", "Tailwind CSS (Utility-first)"],
  ["State Management", "React Hooks (useState, useEffect, useMemo, useCallback)"],
  ["Data Fetching", "Fetch API with async/await"],
  ["Performance", "Memoized rendering for grid dots, O(1) dot lookups via Map"]
], { x: 0.5, y: 1.2, w: 9, border: { type: "solid", color: "E2E8F0" } });

// Performance Optimizations
let slide3 = pres.addSlide();
slide3.addText("Performance Optimizations (O-Standards)", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "FF6B6B" });
slide3.addText([
  { text: "• Optimization Strategy: ", options: { bold: true } },
  { text: "Used Map for dot storage to achieve O(1) lookups during Pacman movement.\n" },
  { text: "• Render Efficiency: ", options: { bold: true } },
  { text: "Memoized the dot rendering using useMemo to prevent O(N*M) heavy re-renders during sprite movement.\n" },
  { text: "• Collision Detection: ", options: { bold: true } },
  { text: "Efficient O(k) collision check where k is the number of ghosts.\n" },
  { text: "• Event Handling: ", options: { bold: true } },
  { text: "Cleaned up keydown listeners to prevent memory leaks." }
], { x: 0.5, y: 1.2, w: 9, fontSize: 18 });

// UI/UX Highlights
let slide4 = pres.addSlide();
slide4.addText("UI/UX & Design System", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "FF6B6B" });
slide4.addText([
  { text: "• Visual Theme: ", options: { bold: true } },
  { text: "Vibrant 'Super Fun Mode' for kids with rose and teal accents.\n" },
  { text: "• Responsive Design: ", options: { bold: true } },
  { text: "Flexbox-based layout for center alignment and mobile-first approach.\n" },
  { text: "• Animations: ", options: { bold: true } },
  { text: "Linear CSS transitions for smooth spirit movement.\n" },
  { text: "• Gamification: ", options: { bold: true } },
  { text: "Difficulty-based score multipliers (Easy: 1x, Med: 2x, Hard: 3x) and Leaderboard." }
], { x: 0.5, y: 1.2, w: 9, fontSize: 18 });

// Future Improvements
let slide5 = pres.addSlide();
slide5.addText("Future Roadmap", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "FF6B6B" });
slide5.addText([
  { text: "• Global State: ", options: { bold: true } },
  { text: "Migrate to Zustand for complex game state management.\n" },
  { text: "• Backend: ", options: { bold: true } },
  { text: "Implement Redis caching for leaderboard to reduce database load.\n" },
  { text: "• Asset Optimization: ", options: { bold: true } },
  { text: "Use SVG sprites or Canvas API for even higher frame rates on low-end devices." }
], { x: 0.5, y: 1.2, w: 9, fontSize: 18 });

pres.writeFile({ fileName: "KIDS_PAC_Implementation_Results.pptx" })
  .then(fileName => {
    console.log(`File created: ${fileName}`);
  })
  .catch(err => {
    console.error(err);
  });

