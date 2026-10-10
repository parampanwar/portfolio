import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { projects, Project, siteConfig } from "@/data/portfolio";
import { caseStudies } from "@/data/caseStudies";
export default function CaseStudy({ project }: { project: Project }) {
  const story = caseStudies[project.id];
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  return (
    <>
      <Head>
        <title>{project.title} — Param Panwar</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={`${siteConfig.url}/work/${project.id}`} />
      </Head>
      <Navbar />
      <main id="main" className="container page-main">
        <Link className="meta text-link" href="/#work">
          ← Selected work
        </Link>
        <h1 className="page-title">{project.title}</h1>
        <p className="meta">
          {project.year} / {story.role}
        </p>
        <p className="max-w-3xl mt-8">{project.description}</p>
        <div ref={ref} className="case-image">
          <motion.div
            style={{
              y: reduced ? 0 : y,
              position: "absolute",
              inset: "-30px 0",
            }}
          >
            <Image
              src={`/projects/${project.id}.svg`}
              alt={`${project.title} — typographic project illustration`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 85vw"
            />
          </motion.div>
        </div>
        <p className="meta mb-10">Project illustration</p>
        {[
          ["Problem", story.problem],
          ["What I built", story.built],
          ["Stack", project.tech.join(" / ")],
          ["Result", story.result],
        ].map(([title, copy], i) => (
          <Reveal className="case-section" key={title}>
            <div>
              <p className="meta mb-4">0{i + 1}</p>
              <h2>{title}</h2>
            </div>
            <p>{copy}</p>
          </Reveal>
        ))}
        <div className="flex flex-wrap gap-6 mt-12">
          <a
            className="btn-primary"
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
          >
            Visit project ↗
          </a>
          <Link className="btn-ghost" href="/contact">
            Let’s work together ↗
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((p) => ({ params: { slug: p.id } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = projects.find((p) => p.id === params?.slug);
  return project ? { props: { project } } : { notFound: true };
};
