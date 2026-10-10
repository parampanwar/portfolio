import { techMarquee } from "@/data/portfolio";
export default function Marquee() {
  return (
    <div
      className="marquee"
      aria-label={`Technology: ${techMarquee.join(", ")}`}
    >
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((n) => (
          <span key={n}>
            {techMarquee.slice(0, 8).map((tech) => (
              <span key={tech}>
                {tech}
                <i> / </i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
