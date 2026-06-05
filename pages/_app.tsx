import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "@/styles/globals.css";
import { siteConfig } from "@/data/portfolio";

export default function App({ Component, pageProps }: AppProps) {
  // Prevent FOUC on initial load
  useEffect(() => {
    document.documentElement.classList.add("loaded");
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        
        {/* Resource Hints for Core Web Vitals */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Fallback Social Metadata */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:image" content={siteConfig.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@parampanwar" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
