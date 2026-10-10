import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}
export default function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className="pull-quote">
      {reduced
        ? text
        : words.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              start={i / words.length}
              end={(i + 1) / words.length}
            />
          ))}
    </p>
  );
}
