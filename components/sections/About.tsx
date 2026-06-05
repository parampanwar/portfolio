"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, MapPin, Coffee } from "lucide-react";
import { experience } from "@/data/portfolio";
import { trackEvent } from "@/lib/analytics";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">02</span>
          <div className="h-px flex-1 max-w-[60px] bg-rim" />
          <span className="text-xs font-mono text-signal uppercase tracking-widest">About</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text side */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold mb-8 leading-tight">
              Building on the web
              <br />
              <span className="text-signal">since day one.</span>
            </motion.h2>

            <motion.div variants={fadeUp} className="space-y-4 text-text-secondary leading-relaxed mb-8">
              <p>
                Hey, I'm Param — a Full-Stack Developer based in India with a passion for building
                products that are fast, accessible, and genuinely useful. I specialize in the
                React/Next.js and FastAPI ecosystems, creating backend and frontend architectures that work in harmony.
              </p>
              <p>
                Currently, I am a Full-Stack Developer at Dooomshell Softwares Pvt. Ltd., working on the 
                development of AI chatbot systems and coding assessment platforms. I love turning complex ideas into clean, production-ready code.
              </p>
              <p>
                When I'm not coding for work, I'm writing about web development on my blog, learning new technologies, 
                or exploring advanced AI algorithms and system architectures.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              <span className="pill-muted">
                <MapPin size={12} /> India
              </span>
              <span className="pill-muted">
                <Coffee size={12} /> Fueled by chai
              </span>
              <span className="pill">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                Open to remote work
              </span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <a
                href="/resume"
                download
                onClick={() => trackEvent("resume_download", { filename: "param_panwar.pdf" })}
                className="btn-primary inline-flex"
              >
                <Download size={16} />
                Download Résumé
              </a>
            </motion.div>
          </motion.div>

          {/* Right side — experience timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="font-display text-sm uppercase tracking-widest text-text-muted font-medium mb-6">
              Experience
            </h3>

            <div className="space-y-6 relative">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-rim" />

              {experience.map((exp, i) => (
                <div key={i} className="relative pl-8">
                  {/* Dot */}
                  <div
                    className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: exp.current ? "#e8ff47" : "#2a2a38",
                      background: exp.current ? "rgba(232,255,71,0.1)" : "#0a0a0f",
                    }}
                  >
                    {exp.current && (
                      <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
                    )}
                  </div>

                  <div className="card p-5 hover:border-rim-2">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-display font-semibold text-text-primary text-sm">
                          {exp.role}
                        </p>
                        <p className="text-signal text-xs font-mono mt-0.5">{exp.company}</p>
                      </div>
                      <span className="pill-muted text-xs shrink-0">{exp.duration}</span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span key={t} className="pill-muted text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
