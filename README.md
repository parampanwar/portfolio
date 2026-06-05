# Param Panwar — Portfolio v2

A completely redesigned, production-grade portfolio built with Next.js (Pages Router), TypeScript, Tailwind CSS, and MDX-powered blog.

## 🏗 Architecture

```
portfolio/
├── content/
│   └── blog/             ← MDX/Markdown blog posts (file-based CMS)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   └── Projects.tsx
│   └── ContactForm.tsx
├── data/
│   └── portfolio.ts      ← All site data (projects, skills, experience)
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── blog.ts           ← File-based blog engine
│   └── utils.ts
├── pages/
│   ├── api/
│   │   └── contact.ts    ← Nodemailer API route
│   ├── blog/
│   │   ├── index.tsx     ← Blog listing
│   │   └── [slug].tsx    ← Blog post detail
│   ├── _app.tsx
│   ├── index.tsx         ← Home page
│   ├── contact.tsx
│   ├── admin.tsx         ← Protected admin dashboard
│   └── 404.tsx
└── styles/
    └── globals.css
```

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local  # fill in MAIL_* vars
npm run dev
```

## ✍️ Writing Blog Posts

1. Create a file in `content/blog/my-post-title.md` (or `.mdx`)
2. Add frontmatter:

```yaml
---
title: "My First Post"
excerpt: "A short description (1–2 sentences)"
date: "2024-12-01"
tags: ["React", "Next.js"]
coverImage: "https://images.unsplash.com/photo-xxx?w=800"
featured: true
author: "Param Panwar"
---
```

3. Write your content in Markdown below the frontmatter
4. Deploy (or wait for ISR to pick up changes — max 1 hour)

## 🔑 Environment Variables

```env
# Email (Nodemailer / SMTP)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=contact@parampanwar.com
MAIL_PASS=your_password
MAIL_TO=your@email.com

# External API (for admin/resume features)
NEXT_PUBLIC_API_URL=https://api.parampanwar.com
```

## 🎨 Design System

- **Colors:** Signal yellow `#e8ff47` accent on deep ink `#0a0a0f` base
- **Typography:** Syne (display) + DM Sans (body) + JetBrains Mono
- **Design tokens:** CSS custom properties in `globals.css`
- **Components:** Utility classes (`btn-primary`, `card`, `pill`, `input-field`) in `globals.css`

## 📝 Updating Portfolio Data

Edit `data/portfolio.ts` to update:
- **Projects** — add/edit the `projects` array
- **Skills** — update `skills` array (level 1–5)
- **Experience** — edit `experience` array
- **Social links** — update `social` object

## 🔒 Admin Dashboard

- Route: `/admin`
- Auth: JWT-based (talks to your FastAPI backend)
- Features: Blog post overview, Resume upload/manage

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion |
| Blog | MDX + gray-matter + next-mdx-remote |
| Forms | react-hook-form + zod |
| Email | Nodemailer (Next.js API route) |
| Deployment | Vercel |
