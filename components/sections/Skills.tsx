"use client";

import { motion } from "framer-motion";
import { skills, type Skill } from "@/data/portfolio";

const CATEGORIES: { key: Skill["category"]; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools & DevOps" },
];

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-mono text-text-muted">
          {"▪".repeat(skill.level)}{"◦".repeat(5 - skill.level)}
        </span>
      </div>
      <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(skill.level / 5) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background:
              skill.level >= 5
                ? "#e8ff47"
                : skill.level >= 4
                ? "rgba(232,255,71,0.7)"
                : "rgba(232,255,71,0.4)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section bg-surface/30">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">03</span>
          <div className="h-px flex-1 max-w-[60px] bg-rim" />
          <span className="text-xs font-mono text-signal uppercase tracking-widest">Skills</span>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map(({ key, label }) => {
            const catSkills = skills.filter((s) => s.category === key);
            return (
              <div key={key} className="card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-sm bg-signal" />
                  <h3 className="font-display font-semibold text-text-primary">{label}</h3>
                </div>
                <div className="space-y-4">
                  {catSkills.map((skill, i) => (
                    <SkillBar key={skill.name} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Signal strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent"
          style={{ transformOrigin: "left" }}
        />
      </div>
    </section>
  );
}
