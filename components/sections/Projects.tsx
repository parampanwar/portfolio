"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  web: "Web",
  fullstack: "Full Stack",
  ai: "AI / ML",
  mobile: "Mobile",
};

const CATEGORIES = ["all", ...Array.from(new Set(projects.map((p) => p.category)))];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group card p-6 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {project.featured && (
              <span className="pill text-[10px] py-0.5 px-2">Featured</span>
            )}
            <span className="pill-muted text-[10px] py-0.5 px-2">
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className="text-xs font-mono text-text-muted">{project.year}</span>
          </div>
          <h3 className="font-display font-bold text-text-primary text-lg group-hover:text-signal transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 shrink-0">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub`}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-rim text-text-muted hover:text-text-primary hover:border-rim-2 transition-all"
            >
              <Github size={14} />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live site`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-signal text-ink hover:opacity-90 transition-all"
            >
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-rim">
        {project.tech.map((t) => (
          <span key={t} className="pill-muted text-[11px] py-0.5">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = projects.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  return (
    <section id="projects" className="section">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">01</span>
          <div className="h-px flex-1 max-w-[60px] bg-rim" />
          <span className="text-xs font-mono text-signal uppercase tracking-widest">Work</span>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <h2 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
            Selected
            <br />
            <span className="text-stroke">Projects</span>
          </h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-signal text-ink"
                    : "border border-rim text-text-muted hover:border-rim-2 hover:text-text-secondary"
                )}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-16">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
}
