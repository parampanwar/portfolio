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
          I build AI into products where it earns its place: customer
          conversations, coding assessments, and talent matching. In my own
          workflow, AI supports research, architecture, prototyping, and review
          — while I own the decisions and the code that ships.
        </p>
      </Reveal>
    </Section>
  );
}
