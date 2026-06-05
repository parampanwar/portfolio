"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    if (router.pathname !== "/") return;

    const sections = ["projects", "about", "skills"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(`/#${id}`);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [router.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return activeSection === href;
    return router.pathname === href || router.pathname.startsWith(href + "/");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full flex justify-center transition-all duration-500 ease-out",
          scrolled ? "pt-4" : "pt-0"
        )}
      >
        <nav className={cn(
          "transition-all duration-500 ease-out flex items-center justify-between px-6",
          scrolled
            ? "h-12 w-[calc(100%-2rem)] md:w-full max-w-5xl rounded-full bg-ink/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "h-16 w-full max-w-6xl rounded-none bg-transparent border-b border-transparent"
        )}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group"
            aria-label="Param Panwar — Home"
          >
            <img
              src="/logo.png"
              alt="Param Panwar Logo"
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive(href)
                      ? "text-ink bg-signal"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]"
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("resume_download", { filename: "param_panwar.pdf" })}
              className="hidden md:inline-flex btn-ghost text-xs py-2 px-4"
            >
              Résumé ↗
            </a>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-rim text-text-secondary hover:text-text-primary hover:border-rim-2 transition-all"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-x-0 z-40 glass-strong border-b border-rim p-6 md:hidden transition-all duration-500",
              scrolled ? "top-20" : "top-16"
            )}
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive(href)
                        ? "text-ink bg-signal"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-4 border-t border-rim">
                <a
                  href="/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setMobileOpen(false);
                    trackEvent("resume_download", { filename: "param_panwar.pdf" });
                  }}
                  className="block btn-ghost text-sm text-center"
                >
                  Download Résumé ↗
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
