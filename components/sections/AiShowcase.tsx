import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
export default function AiShowcase() {
  return (
    <Section id="ai" number="04" label="Applied AI">
      <Reveal>
        <h2 className="section-title">
          AI, with a <em>purpose.</em>
        </h2>
        <p className="ai-copy">
          I build autonomous AI agents and production RAG pipelines into products where they earn their place: enterprise customer conversations, contextual document intelligence, coding assessments, and talent matching. From multi-agent orchestration and tool calling to hybrid semantic search, I architect AI systems that are reliable, fast, and grounded in real data.
        </p>
      </Reveal>
    </Section>
  );
}
