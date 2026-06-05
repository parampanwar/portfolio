---
title: "React Performance: Stop Guessing, Start Measuring"
excerpt: "Profiling tools, common pitfalls, and practical fixes that actually move the needle on React app performance."
date: "2024-09-05"
tags: ["React", "Performance", "JavaScript"]
coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
featured: false
author: "Param Panwar"
---

## The Performance Trap

Most React performance advice online is cargo-cult. People blindly wrap everything in `useMemo` and `useCallback` without measuring whether it helps.

Here's the truth: **premature optimization is worse than no optimization.**

## How to Actually Profile

1. Open Chrome DevTools → Performance tab
2. Record while interacting with the slow part
3. Look for **long tasks** (>50ms) in the flame chart
4. Identify *which component* is causing the issue

## The Real Culprits

### 1. Unnecessary Re-renders

```tsx
// ❌ Bad — new object reference every render
function Parent() {
  return <Child config={{ theme: 'dark' }} />;
}

// ✅ Good — stable reference
const CONFIG = { theme: 'dark' };
function Parent() {
  return <Child config={CONFIG} />;
}
```

### 2. Expensive Computations in Render

```tsx
// ❌ Bad — runs on every render
function List({ items }) {
  const sorted = items.sort((a, b) => b.score - a.score); // expensive!
  return <>{sorted.map(...)}</>;
}

// ✅ Good — only runs when items changes
function List({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.score - a.score),
    [items]
  );
  return <>{sorted.map(...)}</>;
}
```

## Measure First, Optimize Second

Use the React DevTools Profiler to see exactly which components are re-rendering and why. Fix only what the profiler tells you is slow.
