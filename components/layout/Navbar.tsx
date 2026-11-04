import Link from "@/components/ui/SiteLink";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import LocalClock from "@/components/ui/LocalClock";
const links = [
  ["Work", "/#work"],
  ["About", "/#about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false),
    [hidden, setHidden] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const panel = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setHidden(y > 180 && y > previous && Math.abs(y - previous) > 3);
      previous = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const items = [
          trigger.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLAnchorElement>("a") || [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      trigger.current?.focus();
    };
  }, [open]);
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled || open ? "scrolled" : ""} ${hidden && !open ? "hidden-header" : ""}`}
        onFocus={() => setHidden(false)}
      >
        <div className="container header-inner">
          <Link className="wordmark text-link" href="/">
            Param Panwar
          </Link>
          <LocalClock />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link key={label} className="text-link" href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <a href="/resume" className="btn-ghost resume-pill">
              <span className="inline-flex items-center gap-1.5">
                Résumé
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </a>
            <button
              ref={trigger}
              className="icon-button menu-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav>
              {[...links, ["Résumé", "/resume"]].map(([label, href], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : i * 0.07, duration: 0.6 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2"
                  >
                    {label}
                    {href === "/resume" && (
                      <ArrowUpRight className="w-6 h-6" aria-hidden="true" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-10">
              <LocalClock />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
