import type { GetStaticProps } from "next";
import Head from "next/head";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import AiShowcase from "@/components/sections/AiShowcase";
import { siteConfig } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords} />
        <link rel="canonical" href={siteConfig.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content={siteConfig.title} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:url" content={siteConfig.url} />
        
        {/* Unified Entity @graph Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  "url": siteConfig.url,
                  "name": siteConfig.name,
                  "description": siteConfig.description,
                  "publisher": { "@id": `${siteConfig.url}/#person` }
                },
                {
                  "@type": "Person",
                  "@id": `${siteConfig.url}/#person`,
                  "name": siteConfig.name,
                  "url": siteConfig.url,
                  "image": `${siteConfig.url}/logo.png`,
                  "sameAs": [
                    "https://github.com/parampanwar",
                    "https://linkedin.com/in/parampanwar",
                    "https://twitter.com/parampanwar"
                  ],
                  "jobTitle": "Full-Stack Developer",
                  "knowsAbout": [
                    "React",
                    "Next.js",
                    "FastAPI",
                    "TypeScript",
                    "Python",
                    "MongoDB",
                    "PostgreSQL",
                    "OpenAI",
                    "System Design",
                    "API Architectures"
                  ]
                },
                {
                  "@type": "WebPage",
                  "@id": `${siteConfig.url}/#webpage`,
                  "url": siteConfig.url,
                  "name": siteConfig.title,
                  "isPartOf": { "@id": `${siteConfig.url}/#website` },
                  "about": { "@id": `${siteConfig.url}/#person` },
                  "description": siteConfig.description
                }
              ]
            }),
          }}
        />
      </Head>

      <Navbar />

      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <AiShowcase />
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
