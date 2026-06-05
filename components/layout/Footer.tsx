import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { social, siteConfig } from "@/data/portfolio";

const FOOTER_LINKS = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rim mt-0">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="Param Panwar Logo"
                className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <p className="text-text-muted text-sm mt-3 leading-relaxed">
              Full-Stack Developer building scalable web apps with modern technologies.
              Open to freelance work and collaborations.
            </p>
            <a
              href={`mailto:${social.email}`}
              className="inline-flex items-center gap-2 mt-4 text-sm text-signal hover:underline underline-offset-4"
            >
              {social.email}
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
                Navigate
              </p>
              <ul className="space-y-3">
                {FOOTER_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
                Social
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
                  >
                    <FaGithub size={14} /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
                  >
                    <FaLinkedin size={14} /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="w-3.5 h-3.5 fill-current"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-rim flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted font-mono">
            © {year} {siteConfig.name}. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
