import Link from "./SiteLink";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
export default function MagneticButton({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 24 }),
    sy = useSpring(y, { stiffness: 220, damping: 24 });
  return (
    <motion.span
      className="magnetic"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.12);
        y.set((e.clientY - r.top - r.height / 2) * 0.15);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link className={secondary ? "btn-ghost" : "btn-primary"} href={href}>
        {children}
        <ArrowUpRight className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      </Link>
    </motion.span>
  );
}
