import { experience } from "@/data/portfolio";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
export default function About() {
  return (
    <Section id="about" number="02" label="A little about me">
      <h2 className="section-title">
        Built with <em>intention.</em>
      </h2>
      <div className="about-grid">
        <WordReveal text="I’m Param — a full-stack developer who cares about how things work, how they feel, and whether they make someone’s day a little easier." />
        <Reveal className="about-details">
          <p>
            Based in Jaipur, India. I specialize in React, Next.js, and FastAPI,
            creating frontend and backend architectures that work in harmony.
          </p>
          <p>
            At Doomshell Softwares Pvt. Ltd., I build AI chatbot systems and
            coding assessment platforms, turning complex ideas into
            production-ready code.
          </p>
          <p>
            Outside work, I write about web development, learn new technologies,
            and explore AI algorithms and system architecture. Fueled by chai.
            Open to remote work.
          </p>
          <a className="text-link" href="/resume">
            Download résumé ↗
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
