import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { projects } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";
export default function Projects() {
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const reduced = useReducedMotion();
  return (
    <Section id="work" number="01" label="Selected work">
      <Reveal className="work-intro">
        <h2 className="section-title">
          Ideas into
          <br />
          <em>working products.</em>
        </h2>
        <p>Autonomous AI agents, production RAG pipelines, and high-performance software systems.</p>
      </Reveal>
      <div>
        {projects.map((project, i) => (
          <article
            key={project.id}
            className="project-row"
            style={{ top: 110 + i * 18 }}
            onPointerMove={(e) => {
              if (
                reduced ||
                e.pointerType !== "mouse" ||
                window.innerWidth < 1024
              )
                return;
              x.set(Math.min(e.clientX + 24, window.innerWidth - 384));
              y.set(Math.min(e.clientY + 20, window.innerHeight - 260));
              setActive(project.id);
            }}
            onPointerLeave={() => setActive(null)}
          >
            <Link
              className="project-link"
              href={`/work/${project.id}`}
              onClick={() => setActive(null)}
            >
              <span className="meta project-number">0{i + 1}</span>
              <div>
                <h3>{project.title}</h3>
                <div className="project-meta meta">
                  <span>{project.year}</span>
                  <span>{caseStudies[project.id].role}</span>
                </div>
                <p className="project-copy">{project.description}</p>
                <div className="stack">
                  {project.tech.map((t) => (
                    <span className="pill-muted" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowUpRight
                className="project-arrow"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </Link>
          </article>
        ))}
      </div>
      {active && (
        <motion.div
          className="project-preview"
          aria-hidden="true"
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Image src={`/projects/${active}.svg`} alt="" fill sizes="360px" />
        </motion.div>
      )}
    </Section>
  );
}
