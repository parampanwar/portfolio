import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import Marquee from "@/components/ui/Marquee";
export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-top">
          <span className="meta">
            <span className="status-dot" />
            Open to full-time roles · Jaipur, IN
          </span>
          <span className="meta">AI Agents · RAG Systems · Software Architecture</span>
        </div>
        <h1>
          <SplitText
            lines={[
              "Software engineer",
              "engineering intelligent products",
              <>
                with <em className="accent">purpose.</em>
              </>,
            ]}
          />
        </h1>
        <Reveal delay={0.35} className="hero-bottom">
          <p>
            I’m Param. I engineer autonomous AI agents, production RAG pipelines, and
            high-performance software systems that solve real problems.
          </p>
          <div className="hero-buttons">
            <MagneticButton href="/#work">View my work</MagneticButton>
            <MagneticButton href="/contact" secondary>
              Get in touch
            </MagneticButton>
          </div>
        </Reveal>
      </div>
      <Marquee />
    </section>
  );
}
