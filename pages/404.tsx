import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/data/portfolio";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found | {siteConfig.name}</title>
      </Head>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="font-mono text-signal text-sm mb-4 uppercase tracking-widest">Error 404</p>
          <h1 className="font-display text-7xl sm:text-9xl font-bold text-text-primary mb-4 leading-none">
            Not
            <br />
            <span className="text-stroke">Found</span>
          </h1>
          <p className="text-text-secondary max-w-sm mx-auto mb-10">
            The page you're looking for doesn't exist or was moved.
          </p>
          <Link href="/" className="btn-primary">
            ← Back to home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
