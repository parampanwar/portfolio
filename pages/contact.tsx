import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/ContactForm";
import { social, siteConfig } from "@/data/portfolio";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Mail, Clock, ArrowUpRight } from "lucide-react";

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
        <title>Hire Software Engineer | AI Agents & RAG | Contact Param Panwar</title>
        <meta
          name="description"
          content="Get in touch with Param Panwar for autonomous AI agents development, production RAG systems, and full-stack software engineering."
        />
        <meta
          name="keywords"
          content="Hire Software Engineer, Hire AI Engineer, AI Agents Developer, RAG Systems, Contact Param Panwar, Python, Next.js"
        />
        <link rel="canonical" href={`${siteConfig.url}/contact`} />

        <meta
          property="og:title"
          content="Hire Software Engineer | AI Agents & RAG | Contact Param Panwar"
        />
        <meta
          property="og:description"
          content="Get in touch with Param Panwar for autonomous AI agents development, production RAG systems, and full-stack software engineering."
        />
        <meta property="og:url" content={`${siteConfig.url}/contact`} />

        {/* SERP Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Contact",
                  item: `${siteConfig.url}/contact`,
                },
              ],
            }),
          }}
        />
      </Head>

      <Navbar />

      <main id="main" className="container page-main">
        <p className="meta">Contact / Start a conversation</p>
        <h1 className="page-title">
          Good things start
          <br />
          with <em className="accent">hello.</em>
        </h1>
        <p className="max-w-2xl text-muted">
          Have a project in mind? I’m open to engineering autonomous AI agents, production RAG pipelines, full-time roles, and technical collaborations.
        </p>
        <div className="contact-grid">
          <div className="contact-details">
            <div>
              <h2 className="meta mb-4">Email</h2>
              <a
                className="text-link inline-flex items-center gap-1 break-all"
                href={`mailto:${social.email}`}
              >
                <span>{social.email}</span>
                <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              </a>
            </div>
            <div>
              <h2 className="meta mb-4">Response time</h2>
              <p>Usually within 24 hours</p>
              <p className="meta mt-3">
                <span className="status-dot" />
                Open to full-time roles
              </p>
            </div>
            <div>
              <h2 className="meta mb-4">Find me online</h2>
              {SOCIAL_LINKS.map(({ href, label }) => (
                <div key={label} className="mb-3">
                  <a
                    className="text-link inline-flex items-center gap-1"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title">Send a message.</h2>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
