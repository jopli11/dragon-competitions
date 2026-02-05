# React Best Practices

You are an expert React developer. Follow these best practices for all React components and hooks.

## Abstract
Comprehensive performance optimization guide for React and Next.js applications, designed for AI agents and LLMs. Contains 40+ rules across 8 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns).

## Core Principles
1. **Eliminate Waterfalls**: Sequential awaits add full network latency. Parallelize independent operations.
2. **Reduce Bundle Size**: Direct imports, dynamic loading, and deferring non-critical libraries.
3. **Optimize Server-Side**: Authenticate server actions, minimize serialization, and use parallel fetching.
4. **Efficient Re-renders**: Derive state during render, use functional setState, and lazy state initialization.

## Key Rules (Prioritized)

### 1. Eliminating Waterfalls (CRITICAL)
- **Defer Await**: Move `await` into branches where they are used.
- **Parallelize**: Use `Promise.all()` for independent operations.
- **API Routes**: Start independent promises immediately in Route Handlers.

### 2. Bundle Size (CRITICAL)
- **Avoid Barrel Imports**: Import directly from source files (e.g., `import Check from 'lucide-react/dist/esm/icons/check'`).
- **Dynamic Imports**: Use `next/dynamic` for heavy components (e.g., editors, charts).

### 3. Server-Side (HIGH)
- **Authenticate Actions**: Always check auth *inside* `"use server"` functions.
- **Minimize Serialization**: Only pass needed fields from RSC to Client Components.
- **Composition**: Use component composition to parallelize data fetching in RSC trees.

### 4. Re-rendering (MEDIUM)
- **Derived State**: Compute values from props/state during render; don't use `useEffect` to sync state.
- **Functional Updates**: Use `setCount(c => c + 1)` to avoid stale closures and unnecessary dependencies.
- **Lazy Init**: Use `useState(() => compute())` for expensive initial values.

### 5. JavaScript & Rendering (MEDIUM)
- **Index Maps**: Use `Map` for repeated lookups instead of `.find()`.
- **Layout Thrashing**: Batch DOM reads and writes; avoid interleaving them.
- **SVG Optimization**: Animate SVG wrappers instead of elements for hardware acceleration.

## Styling (Emotion CSS)
- Prefer `styled` components for reusable UI elements.
- Use the `css` prop for one-off styles or conditional styling.
- Keep styles close to the components that use them.

---
*For full detailed rules and examples, refer to the internal skill documentation at `c:\Users\joelj\.agents\skills\vercel-react-best-practices\AGENTS.md`.*
