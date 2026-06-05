"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { techMarquee, social } from "@/data/portfolio";

const ROLES = ["Full-Stack Developer", "FastAPI Specialist", "API Architect", "Open Source Builder"];

function TypewriterRole() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const current = ROLES[roleIdx];

    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 60);
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="text-signal cursor-blink font-mono text-lg sm:text-xl font-medium">
      {displayed}
    </span>
  );
}

function TechMarquee() {
  const doubled = [...techMarquee, ...techMarquee];

  return (
    <div className="relative overflow-hidden py-4 -mx-6">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #0a0a0f, transparent)" }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, #0a0a0f, transparent)" }}
      />

      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="pill-muted shrink-0"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-16 px-6 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-px h-48 bg-gradient-to-b from-signal/40 to-transparent" />
      <div className="absolute top-0 right-0 w-48 h-px bg-gradient-to-l from-signal/40 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto w-full py-20"
      >
        {/* Status badge */}
        <motion.div variants={item} className="mb-8">
          <span className="pill">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            Available for work
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div variants={item} className="mb-6">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight">
            <span className="block text-text-primary">Param</span>
            <span className="block text-text-primary">Panwar</span>
            <span className="block text-stroke mt-2">Developer</span>
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.div variants={item} className="mb-8 h-8 flex items-center">
          <TypewriterRole />
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={item}
          className="text-text-secondary text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
        >
          I build production-grade web applications — fast, scalable, and maintainable.
          Focused on React, Next.js, and FastAPI ecosystems.
          Currently open to freelance projects and full-time opportunities.
        </motion.p>

        {/* CTA row */}
        <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-16">
          <Link href="/#projects" className="btn-primary group">
            View my work
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
          <Link href="/contact" className="btn-ghost">
            Get in touch
          </Link>
          <div className="flex items-center gap-3 ml-2">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-rim text-text-muted hover:text-text-primary hover:border-rim-2 transition-all"
            >
              <Github size={16} />
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-rim text-text-muted hover:text-text-primary hover:border-rim-2 transition-all"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-rim text-text-muted hover:text-text-primary hover:border-rim-2 transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-3.5 h-3.5 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={item}
          className="grid grid-cols-3 gap-6 max-w-sm"
        >
          {[
            { value: "3+", label: "Projects shipped" },
            { value: "1", label: "Year building" },
            { value: "100%", label: "Client satisfaction" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display font-bold text-2xl sm:text-3xl text-text-primary">{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Tech marquee at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="max-w-5xl mx-auto w-full pb-8"
      >
        <p className="text-xs font-mono text-text-muted mb-3 uppercase tracking-wider">
          Technologies I work with
        </p>
        <TechMarquee />
      </motion.div>
    </section>
  );
}
