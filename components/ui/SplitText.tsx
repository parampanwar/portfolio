import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { ease } from "./Reveal";
export default function SplitText({ lines }: { lines: ReactNode[] }) {
  const reduced = useReducedMotion();
  return (
    <>
      {lines.map((line, i) => (
        <span className="masked-line" key={i}>
          <motion.span
            initial={{ y: reduced ? 0 : "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: i * 0.12, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
