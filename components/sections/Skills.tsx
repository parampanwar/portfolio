import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
const groups = {
  "AI & Agents": [
    "AI Agents & Tool Calling",
    "RAG Architecture",
    "Vector DBs & Embeddings",
    "OpenAI & Gemini APIs",
    "LangChain & LlamaIndex",
  ],
  Backend: ["Python", "FastAPI", "Node.js", "REST & WebSockets"],
  Frontend: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
  ],
  Data: ["PostgreSQL", "MongoDB", "Redis", "SQL"],
  DevOps: ["Docker", "Git", "Vercel", "AWS"],
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
