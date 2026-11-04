import { experience } from "@/data/portfolio";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { ArrowUpRight } from "lucide-react";
export default function About() {
  return (
    <Section id="about" number="02" label="A little about me">
      <h2 className="section-title">
        Built with <em>intention.</em>
      </h2>
      <div className="about-grid">
        <WordReveal text="I’m Param — a software engineer building autonomous AI agents, production RAG pipelines, and high-performance software systems." />
        <Reveal className="about-details">
          <p>
            Based in Jaipur, India. I specialize in AI Agents, RAG architecture,
            FastAPI, and Next.js, bridging intelligent foundation models and scalable infrastructure.
          </p>
          <p>
            At Doomshell Softwares Pvt. Ltd., I engineer autonomous AI agents, RAG-powered
            conversational platforms, and automated assessment systems, turning complex
            AI capabilities into production-ready software.
          </p>
          <p>
            Outside work, I explore multi-agent orchestration, test advanced retrieval (RAG) strategies,
            and design scalable system architectures. Fueled by chai.
            Open to remote work.
          </p>
          <a
            className="text-link inline-flex items-center gap-1"
            href="/resume"
          >
            Download résumé
            <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
      <div className="timeline">
        <p className="meta">Experience</p>
        {experience.map((exp) => (
          <div key={exp.company} className="about-grid mt-6">
            <div>
              <p className="meta">{exp.duration}</p>
              <h3>{exp.company}</h3>
              <p>{exp.role}</p>
            </div>
            <div>
              <p className="text-muted mb-6">{exp.description}</p>
              <div className="stack">
                {exp.tech.map((t) => (
                  <span key={t} className="pill-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
