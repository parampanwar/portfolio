import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ease } from "@/components/ui/Reveal";
function Cursor() {
  const x = useMotionValue(-100),
    y = useMotionValue(-100);
  const [active, setActive] = useState(false),
    [visible, setVisible] = useState(false);
  const sx = useSpring(x, { stiffness: 700, damping: 40 }),
    sy = useSpring(y, { stiffness: 700, damping: 40 });
  useEffect(() => {
    if (!matchMedia("(pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      setVisible(true);
      x.set(e.clientX - 4);
      y.set(e.clientY - 4);
      setActive(!!(e.target as HTMLElement).closest("a,button,input,textarea"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);
  return (
    <motion.div
      aria-hidden="true"
      className="cursor-dot"
      style={{ x: sx, y: sy }}
      animate={{ scale: active ? 3 : 1, opacity: visible ? 0.65 : 0 }}
    />
  );
}
function IntroLoader() {
  const [show, setShow] = useState(false),
    [count, setCount] = useState(0);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio-intro")) {
        setShow(false);
        return;
      }
      sessionStorage.setItem("portfolio-intro", "1");
    } catch {
      return;
    }
    setShow(true);
    const start = performance.now();
    const interval = setInterval(() => {
      const next = Math.min(100, Math.round((performance.now() - start) / 7));
      setCount(next);
      if (next === 100) {
        clearInterval(interval);
        setShow(false);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="intro-loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p>Param Panwar</p>
          <span className="meta">{count.toString().padStart(3, "0")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default function MotionSystem({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();
  const internal = ["/admin", "/login"].includes(router.pathname);
  useEffect(() => {
    if (reduced || internal) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, anchors: true, duration: 1.05 });
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [reduced, internal]);
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease }}>
      {mounted && !internal && reduced === false && (
        <>
          <Cursor />
          <IntroLoader />
        </>
      )}
      <motion.div
        key={router.asPath.split("#")[0]}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
