// ─── Types ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  links: {
    live?: string;
    github?: string;
  };
  image?: string;
  featured: boolean;
  category: "web" | "mobile" | "ai" | "fullstack";
  year: number;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "languages";
  level: number; // 1–5
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
  tech: string[];
  current?: boolean;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "botinx",
    title: "Botinx",
    description:
      "WhatsApp Business API solution provider with AI-based chatbots, automations, and broadcasting workflows.",
    tech: ["MongoDB", "FastAPI", "Next.js", "TypeScript", "OpenAI", "Gemini"],
    links: {
      live: "https://www.botinx.com",
    },
    featured: true,
    category: "ai",
    year: 2024,
  },
  {
    id: "skillix",
    title: "Skillix",
    description:
      "AI-driven skill assessment and recruiter matching platform that verifies engineering skills.",
    longDescription:
      "A comprehensive talent evaluation platform. Features automated coding challenges, AI-powered portfolio profiling, and match filters for recruiters. Built with Next.js, FastAPI, PostgreSQL, and OpenAI API.",
    tech: ["Postgres", "FastAPI", "Next.js", "OpenAI", "Gemini", "Google MediaPipe"],
    links: {
      live: "https://skillix.ezypayroll.in",
    },
    featured: true,
    category: "fullstack",
    year: 2024,
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: 5 },
  { name: "Next.js", category: "frontend", level: 5 },
  { name: "TypeScript", category: "frontend", level: 4 },
  { name: "Tailwind CSS", category: "frontend", level: 5 },
  { name: "Framer Motion", category: "frontend", level: 4 },
  // Backend
  { name: "Node.js", category: "backend", level: 4 },
  { name: "Python", category: "backend", level: 4 },
  { name: "FastAPI", category: "backend", level: 3 },
  { name: "PostgreSQL", category: "backend", level: 4 },
  { name: "MongoDB", category: "backend", level: 3 },
  { name: "Redis", category: "backend", level: 3 },
  // Tools
  { name: "Git", category: "tools", level: 5 },
  { name: "Docker", category: "tools", level: 3 },
  { name: "Vercel", category: "tools", level: 5 },
  { name: "Figma", category: "tools", level: 3 },
  { name: "AWS", category: "tools", level: 3 },
  // Languages
  { name: "JavaScript", category: "languages", level: 5 },
  { name: "TypeScript", category: "languages", level: 4 },
  { name: "Python", category: "languages", level: 4 },
  { name: "SQL", category: "languages", level: 4 },
];

// ─── Tech marquee ────────────────────────────────────────────────────────────

export const techMarquee: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Tailwind",
  "Docker",
  "AWS",
  "GraphQL",
  "Prisma",
  "Stripe",
  "OpenAI",
  "Framer Motion",
];

// ─── Experience ──────────────────────────────────────────────────────────────

export const experience: Experience[] = [
  {
    company: "Dooomshell Softwares Pvt. Ltd.",
    role: "Full-Stack Developer",
    duration: "2025 – Present",
    description:
      "Working on full-stack development of production-grade AI platforms and scalable web systems. Architected and shipped Botinx, a WhatsApp Business API solution provider with AI-based chatbots and automations, and Skillix, an AI-driven coding assessment and talent matching engine.",
    tech: ["Next.js", "React", "FastAPI", "PostgreSQL", "MongoDB", "OpenAI", "Gemini", "Google MediaPipe"],
    current: true,
  },
];

// ─── Social links ────────────────────────────────────────────────────────────

export const social = {
  github: "https://github.com/parampanwar",
  linkedin: "https://linkedin.com/in/parampanwar",
  twitter: "https://twitter.com/parampanwar",
  email: "contact@parampanwar.xyz",
};

// ─── Meta ────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: "Param Panwar",
  title: "Param Panwar — Full-Stack Developer | Next.js & FastAPI Specialist",
  description:
    "Param Panwar is a Full-Stack Developer specializing in high-performance web systems, React, Next.js, and FastAPI. Discover scalable solutions, AI integrations, and developer insights.",
  url: "https://www.parampanwar.xyz",
  ogImage: "https://www.parampanwar.xyz/og.png",
  keywords: "Param Panwar, Full-Stack Developer India, Next.js Developer India, FastAPI Developer, Python Developer, Freelance Software Engineer, Botinx WhatsApp, Skillix AI",
};

// ─── AI Usage Data ───────────────────────────────────────────────────────────

export interface AiTool {
  name: string;
  category: string;
  usage: string;
  description: string;
  icon: string;
}

export interface AiStat {
  value: string;
  label: string;
  sublabel?: string;
}

export const aiTools: AiTool[] = [
  {
    name: "Claude",
    category: "Reasoning & Writing",
    usage: "Daily",
    description: "Architecture decisions, complex debugging, blog drafts, code reviews, and long-context analysis.",
    icon: "◆",
  },
  {
    name: "GitHub Copilot",
    category: "Code Completion",
    usage: "Daily",
    description: "Inline completions, unit test generation, refactoring boilerplate so I can focus on logic.",
    icon: "⌥",
  },
  {
    name: "ChatGPT / GPT-4o",
    category: "Research & Ideation",
    usage: "Daily",
    description: "Rapid prototyping ideas, API exploration, marketing copy, and quick knowledge lookups.",
    icon: "◎",
  },
  {
    name: "Cursor",
    category: "AI IDE",
    usage: "Daily",
    description: "Codebase-wide refactors, multi-file edits, and natural-language-to-code for complex features.",
    icon: "▷",
  },
  {
    name: "Perplexity",
    category: "Research",
    usage: "Weekly",
    description: "Deep technical research with citations — replaces hours of Stack Overflow and docs diving.",
    icon: "⊕",
  },
  {
    name: "Midjourney / DALL·E",
    category: "Design & Assets",
    usage: "Weekly",
    description: "UI mockup inspiration, blog cover images, placeholder visuals for rapid prototyping.",
    icon: "✦",
  },
  {
    name: "Whisper / ElevenLabs",
    category: "Voice & Audio",
    usage: "Project-based",
    description: "Transcription pipelines, voice interfaces, and audio feature development in client apps.",
    icon: "◈",
  },
  {
    name: "LangChain / LlamaIndex",
    category: "AI Frameworks",
    usage: "Project-based",
    description: "RAG pipelines, document Q&A systems, and agent orchestration for AI-heavy applications.",
    icon: "⬡",
  },
];

export const aiStats: AiStat[] = [
  { value: "4h+",  label: "AI-assisted daily",  sublabel: "coding + writing" },
  { value: "8+",   label: "AI tools in stack",   sublabel: "actively used"    },
  { value: "60%",  label: "Faster shipping",     sublabel: "vs pre-AI workflow"},
  { value: "3",    label: "AI SaaS shipped",     sublabel: "in production"    },
];

export const aiWorkflows = [
  {
    step: "01",
    title: "Spec → Architecture",
    description: "I describe the problem to Claude. It helps me reason through system design, edge cases, and tradeoffs before I write a single line.",
  },
  {
    step: "02",
    title: "Code → Cursor",
    description: "Cursor handles boilerplate, CRUD, and repetitive patterns. I focus on the 20% of logic that actually requires thinking.",
  },
  {
    step: "03",
    title: "Review → Copilot",
    description: "Copilot generates test cases, catches obvious bugs mid-flight, and documents functions as I write them.",
  },
  {
    step: "04",
    title: "Ship → Learn",
    description: "Post-ship, I use Perplexity to research what I didn't know, then feed learnings back into blog posts — also AI-assisted.",
  },
];
