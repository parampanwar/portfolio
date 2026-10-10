import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
const groups = {
  Frontend: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Framer Motion",
    "Figma",
  ],
  Backend: ["Node.js", "Python", "FastAPI"],
  Data: ["PostgreSQL", "MongoDB", "Redis", "SQL"],
  DevOps: ["Git", "Docker", "Vercel", "AWS"],
};
export default function Skills() {
  return (
    <Section id="skills" number="03" label="Tools of the trade">
      <h2 className="section-title">
        The right tool.
        <br />
        <em>For the real problem.</em>
      </h2>
      <div className="skills-grid">
        {Object.entries(groups).map(([name, items], i) => (
          <Reveal key={name} delay={i * 0.06}>
            <h3>{name}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
