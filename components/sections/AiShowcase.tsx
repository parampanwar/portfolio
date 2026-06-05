"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { aiTools, aiStats, aiWorkflows } from "@/data/portfolio";
import { cn } from "@/lib/utils";

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedStat({ value, label, sublabel, index }: {
  value: string; label: string; sublabel?: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState("0");

  // Extract numeric part and suffix
  const match = value.match(/^(\d+)(.*)$/);
  const numericTarget = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericTarget);
      setDisplayed(`${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    const delay = index * 120;
    setTimeout(() => requestAnimationFrame(tick), delay);
  }, [inView, numericTarget, suffix, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="card p-6 text-center hover:border-signal/40 transition-all duration-300">
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,255,71,0.06), transparent 70%)" }}
        />
        <p className="font-display font-bold text-4xl sm:text-5xl text-signal mb-2 tabular-nums">
          {inView ? displayed : "0"}
        </p>
        <p className="text-text-primary text-sm font-medium">{label}</p>
        {sublabel && <p className="text-text-muted text-xs mt-0.5 font-mono">{sublabel}</p>}
      </div>
    </motion.div>
  );
}

// ─── Tool card ───────────────────────────────────────────────────────────────
function ToolCard({ tool, index, isActive, onClick }: {
  tool: typeof aiTools[0]; index: number; isActive: boolean; onClick: () => void;
}) {
  const usageColor = tool.usage === "Daily"
    ? "text-signal border-signal/30 bg-signal/8"
    : tool.usage === "Weekly"
    ? "text-blue-400 border-blue-400/30 bg-blue-400/5"
    : "text-text-muted border-rim bg-surface-2";

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-2xl border transition-all duration-300 group",
        isActive
          ? "border-signal/50 bg-signal/5 shadow-lg shadow-signal/5"
          : "border-rim hover:border-rim-2 bg-surface hover:bg-surface-2"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center text-lg font-mono shrink-0 border",
            isActive ? "bg-signal/10 border-signal/30 text-signal" : "bg-surface-2 border-rim text-text-muted"
          )}>
            {tool.icon}
          </span>
          <div>
            <p className={cn(
              "font-display font-bold text-sm transition-colors",
              isActive ? "text-signal" : "text-text-primary group-hover:text-signal"
            )}>
              {tool.name}
            </p>
            <p className="text-xs text-text-muted">{tool.category}</p>
          </div>
        </div>
        <span className={cn(
          "text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0",
          usageColor
        )}>
          {tool.usage}
        </span>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-text-secondary leading-relaxed overflow-hidden"
          >
            {tool.description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Fake terminal / live AI stream ─────────────────────────────────────────
const TERMINAL_LINES = [
  { delay: 0,    text: "$ claude ask 'Review my auth middleware for security issues'", type: "input" },
  { delay: 800,  text: "◆ Analyzing codebase context...", type: "system" },
  { delay: 1600, text: "⚠  JWT secret hardcoded on line 42 — move to env vars", type: "warning" },
  { delay: 2200, text: "⚠  Missing rate limiting on /api/login — brute-force risk", type: "warning" },
  { delay: 2800, text: "✓  Token expiry correctly set to 15m", type: "success" },
  { delay: 3400, text: "✓  Refresh token rotation implemented properly", type: "success" },
  { delay: 4000, text: "→  Suggested fix: use bcrypt rounds ≥ 12 (currently 10)", type: "info" },
  { delay: 4600, text: "◆ Generating patch...", type: "system" },
  { delay: 5400, text: "✓  Patch written to auth.middleware.ts", type: "success" },
  { delay: 6000, text: "$ _", type: "input" },
];

function AiTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || running) return;
    setRunning(true);

    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
      }, line.delay);
    });
  }, [inView, running]);

  const typeColor = (type: string) => {
    switch (type) {
      case "input":   return "text-signal";
      case "system":  return "text-text-muted";
      case "warning": return "text-yellow-400";
      case "success": return "text-emerald-400";
      case "info":    return "text-blue-400";
      default:        return "text-text-secondary";
    }
  };

  return (
    <div ref={ref} className="rounded-2xl overflow-hidden border border-rim">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-rim">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-xs font-mono text-text-muted ml-2">AI-assisted dev workflow</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          <span className="text-[10px] font-mono text-signal">live</span>
        </div>
      </div>
      {/* Terminal body */}
      <div className="p-5 font-mono text-sm min-h-[260px] bg-[#0c0c12]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("mb-1.5 leading-relaxed", typeColor(line.type))}
          >
            {line.text}
            {i === visibleLines - 1 && line.type === "input" && (
              <span className="inline-block w-2 h-4 bg-signal ml-0.5 animate-pulse align-middle" />
            )}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export default function AiShowcase() {
  const [activeTool, setActiveTool] = useState<number | null>(0);

  return (
    <section id="ai" className="section relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">04</span>
          <div className="h-px flex-1 max-w-[60px] bg-rim" />
          <span className="text-xs font-mono text-signal uppercase tracking-widest">AI-Native</span>
        </motion.div>

        {/* Headline */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              I don't just use AI.
              <br />
              <span className="text-signal">I build with it.</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
              AI is deeply embedded in every layer of how I work — from the first line of a spec
              to the last commit. Not as a novelty, but as a genuine force multiplier that lets me
              ship faster and think deeper.
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {aiStats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Tools grid + terminal */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Tools */}
          <div>
            <h3 className="font-display font-bold text-xl text-text-primary mb-2">
              Daily AI stack
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Click any tool to see how I use it.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {aiTools.map((tool, i) => (
                <ToolCard
                  key={tool.name}
                  tool={tool}
                  index={i}
                  isActive={activeTool === i}
                  onClick={() => setActiveTool(activeTool === i ? null : i)}
                />
              ))}
            </div>
          </div>

          {/* Terminal + workflow */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                Real workflow
              </h3>
              <p className="text-text-muted text-sm mb-6">
                A typical AI-assisted code review session.
              </p>
              <AiTerminal />
            </div>
          </div>
        </div>

        {/* Workflow steps */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl text-text-primary mb-8"
          >
            How I ship with AI
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiWorkflows.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative card p-6 group hover:border-signal/30"
              >
                {/* Step connector line */}
                {i < aiWorkflows.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-[1px] w-4 h-px bg-rim z-10" />
                )}

                <p className="font-mono text-signal text-xs mb-4 font-bold">{step.step}</p>
                <h4 className="font-display font-bold text-text-primary text-sm mb-3 leading-snug">
                  {step.title}
                </h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  {step.description}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(232,255,71,0.04), transparent 60%)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(232,255,71,0.06) 0%, rgba(232,255,71,0.02) 100%)",
            border: "1px solid rgba(232,255,71,0.15)",
          }}
        >
          <div>
            <p className="font-display font-bold text-xl text-text-primary mb-1">
              Want AI built into your product?
            </p>
            <p className="text-text-secondary text-sm">
              I integrate LLMs, build RAG pipelines, and ship AI features that actually work in production.
            </p>
          </div>
          <a href="/contact" className="btn-primary shrink-0 whitespace-nowrap">
            Let's talk AI →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
