---
title: "Designing for Developers: My UI Process"
excerpt: "How I approach UI design as a developer — from wireframes to polished interfaces without a design background."
date: "2024-10-20"
tags: ["UI Design", "CSS", "Frontend"]
coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
featured: true
author: "Param Panwar"
---

## The Developer-Designer Gap

Most developers I know either avoid design entirely, or they mimic existing UIs. Neither is a great approach. Here's my actual process for building UIs that look intentional.

## Step 1: Start with a Design Token System

Before any component, define your tokens. In practice, this means a `globals.css` or `tokens.ts` that captures:

- **Colors** — not just hex values, but semantic names (`--surface`, `--signal`, `--text-primary`)
- **Typography** — font stacks, size scales, line heights
- **Spacing** — a consistent scale (4, 8, 12, 16, 24, 32, 48, 64...)
- **Shadows** — 3–4 levels of elevation

```css
:root {
  --ink: #0a0a0f;
  --signal: #e8ff47;
  --surface: #111118;
  --text-primary: #f0f0fc;
  --text-muted: #5a5a7a;
}
```

## Step 2: Choose a Single Strong Accent

Avoid multi-color palettes until you know what you're doing. Pick one accent color that does all the heavy lifting — hover states, focus rings, highlights, CTAs.

## Step 3: Typography Does Most of the Work

80% of good-looking UIs come from good typography. Use Syne for headings (it has great weight and character), pair with DM Sans for body text.

## Wrapping Up

Design is learnable. Start with constraints, not possibilities.
