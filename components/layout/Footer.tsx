import Link from "@/components/ui/SiteLink";
import { social } from "@/data/portfolio";
import LocalClock from "@/components/ui/LocalClock";
import ThemeSelector from "@/components/ui/ThemeSelector";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="meta mb-8">Have something in mind?</p>
        <h2 className="footer-cta">
          Let's build something <em>together.</em>
        </h2>
        <a
          className="footer-email"
          aria-label={social.email}
          data-text={social.email}
          href={`mailto:${social.email}`}
        >
          {social.email}
        </a>
        <div className="footer-wordmark" aria-hidden="true">
          PARAM PANWAR
        </div>
        <div className="footer-columns">
          <div>
            <h3>Navigate</h3>
            {[
              ["Work", "/#work"],
              ["About", "/#about"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <div key={label}>
                <Link className="text-link" href={href}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h3>Social</h3>
            {[
              ["GitHub", social.github],
              ["LinkedIn", social.linkedin],
              ["X", social.twitter],
            ].map(([label, href]) => (
              <div key={label}>
                <a
                  className="text-link"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} ↗
                </a>
              </div>
            ))}
          </div>
          <div>
            <h3>Elsewhere</h3>
            <div>
              <a className="text-link" href="/resume">
                Résumé ↗
              </a>
            </div>
            <div>
              <a className="text-link" href={`mailto:${social.email}`}>
                Say hello ↗
              </a>
            </div>
            <p className="meta mt-5">
              Based in Jaipur
              <br />
              Working everywhere
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="meta">
            © {new Date().getFullYear()} Param Panwar
          </span>
          <LocalClock />
          <ThemeSelector />
          <button
            className="meta text-link"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
