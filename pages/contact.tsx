import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ContactForm";
import { social, siteConfig } from "@/data/portfolio";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Clock } from "lucide-react";

const XIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    style={{ width: size, height: size }}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: FaGithub, href: social.github, label: "GitHub" },
  { icon: FaLinkedin, href: social.linkedin, label: "LinkedIn" },
  { icon: XIcon, href: social.twitter, label: "X" },
];

export default function Contact() {
  return (
    <>
      <Head>
        <title>Hire Full-Stack Developer | Contact Param Panwar</title>
        <meta name="description" content="Get in touch with Param Panwar for freelance full-stack development, software engineering services, or AI application integrations." />
        <meta name="keywords" content="Hire Developer, Hire React Developer, Contact Param Panwar, Freelance Engineer India" />
        <link rel="canonical" href={`${siteConfig.url}/contact`} />
        
        <meta property="og:title" content="Hire Full-Stack Developer | Contact Param Panwar" />
        <meta property="og:description" content="Get in touch with Param Panwar for freelance full-stack development, software engineering services, or AI application integrations." />
        <meta property="og:url" content={`${siteConfig.url}/contact`} />
        
        {/* SERP Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": siteConfig.url
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Contact",
                  "item": `${siteConfig.url}/contact`
                }
              ]
            }),
          }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-16">
        <section className="section">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              <span className="pill mb-4">Contact</span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 leading-tight">
                Let's build
                <br />
                <span className="text-signal">something.</span>
              </h1>
              <p className="text-text-secondary mt-6 max-w-xl text-lg leading-relaxed">
                Have a project in mind? I'm open to freelance work, full-time opportunities,
                and interesting collaborations.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12">
              {/* Info column */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Email */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-signal/10 border border-signal/20 flex items-center justify-center">
                      <Mail size={14} className="text-signal" />
                    </div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Email</p>
                  </div>
                  <a
                    href={`mailto:${social.email}`}
                    className="text-text-primary hover:text-signal transition-colors text-sm font-medium"
                  >
                    {social.email}
                  </a>
                </div>

                {/* Response time */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-2 border border-rim flex items-center justify-center">
                      <Clock size={14} className="text-text-muted" />
                    </div>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Response time</p>
                  </div>
                  <p className="text-text-secondary text-sm">Usually within 24 hours</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                    <span className="text-xs text-signal font-mono">Available now</span>
                  </div>
                </div>

                {/* Social */}
                <div className="card p-5">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
                    Find me online
                  </p>
                  <div className="space-y-3">
                    {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group"
                      >
                        <Icon size={16} className="text-text-muted group-hover:text-signal transition-colors" />
                        <span className="text-sm">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Form column */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="lg:col-span-3"
              >
                <div className="card p-8">
                  <h2 className="font-display font-bold text-text-primary text-xl mb-6">
                    Send a message
                  </h2>
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
