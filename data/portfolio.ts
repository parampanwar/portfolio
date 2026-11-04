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
      "WhatsApp Business API solution powered by autonomous AI agents, RAG-driven knowledge retrieval, automations, and broadcasting workflows.",
    tech: ["AI Agents", "RAG", "FastAPI", "Next.js", "OpenAI", "Gemini", "MongoDB"],
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
      "AI agent-driven skill assessment and recruiter matching platform featuring RAG-powered coding evaluation and verified engineering profiles.",
    longDescription:
      "A comprehensive talent evaluation platform leveraging autonomous AI agents and RAG pipelines. Features automated coding challenges, contextual AI portfolio profiling, and candidate-job matching. Built with Next.js, FastAPI, PostgreSQL, and OpenAI API.",
    tech: ["AI Agents", "RAG", "FastAPI", "Next.js", "Postgres", "OpenAI", "Gemini"],
    links: {
      live: "https://skillix.ezypayroll.in",
    },
    featured: true,
    category: "fullstack",
    year: 2026,
  },
  {
     id: "rferotary",
    title: "RFE ROTARY",
    description:
      "Full stack App for Rotary Friendship Exchange",
    longDescription: "A full-stack application for Rotary Friendship Exchange.",
    tech: ["MySQL", "Node.js", "Gemini"],
    links: {
      live: "https://rferotary.org",
    },
    featured: true,
    category: "fullstack",
    year: 2026,
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
  "AI Agents",
  "RAG Pipelines",
  "FastAPI",
  "Next.js",
  "Python",
  "TypeScript",
  "Vector DBs",
  "OpenAI",
  "Gemini",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
  "React",
  "Tailwind",
];

// ─── Experience ──────────────────────────────────────────────────────────────

export const experience: Experience[] = [
  {
    company: "Doomshell Softwares Pvt. Ltd.",
    role: "Software Engineer",
    duration: "2025 – Present",
    description:
      "Engineering production-grade AI agents, RAG knowledge retrieval pipelines, and scalable backend architectures. Architected and shipped Botinx, an enterprise WhatsApp solution featuring autonomous conversational agents and automations, and Skillix, an AI-driven coding assessment and talent matching engine.",
    tech: ["AI Agents", "RAG", "Next.js", "FastAPI", "PostgreSQL", "MongoDB", "OpenAI", "Gemini"],
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
  title: "Param Panwar — Software Engineer | AI Agents & RAG Systems Specialist",
  description:
    "Param Panwar is a Software Engineer specializing in autonomous AI Agents, production RAG pipelines, FastAPI, and Next.js. Discover scalable software architectures, agentic workflows, and developer insights.",
  url: "https://www.parampanwar.xyz",
  ogImage: "https://www.parampanwar.xyz/og.png",
  keywords: "Param Panwar, Software Engineer, AI Agents, RAG Pipelines, Retrieval-Augmented Generation, AI Engineer, FastAPI, Next.js, Python, Botinx, Skillix",
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
    name: "Midjourney / DALLÂ·E",
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

export const aiStats: AiStat[] = [];

export const aiWorkflows = [
  {
    step: "01",
    title: "Spec -> Architecture",
    description: "I describe the problem to Claude. It helps me reason through system design, edge cases, and tradeoffs before I write a single line.",
  },
  {
    step: "02",
    title: "Code -> Cursor",
    description: "Cursor handles boilerplate, CRUD, and repetitive patterns. I focus on the 20% of logic that actually requires thinking.",
  },
  {
    step: "03",
    title: "Review -> Copilot",
    description: "Copilot generates test cases, catches obvious bugs mid-flight, and documents functions as I write them.",
  },
  {
    step: "04",
    title: "Ship -> Learn",
    description: "Post-ship, I use Perplexity to research what I didn't know, then feed learnings back into blog posts — also AI-assisted.",
  },
];
