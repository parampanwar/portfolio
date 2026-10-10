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
          <span className="meta">Engineer / Builder / Curious mind</span>
        </div>
        <h1>
          <SplitText
            lines={[
              "Full-stack engineer",
              "building AI products",
              <>
                that <em className="accent">ship.</em>
              </>,
            ]}
          />
        </h1>
        <Reveal delay={0.35} className="hero-bottom">
          <p>
            I’m Param. I bring frontend craft and backend thinking together to
            build useful, production-ready products.
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
