'use client'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from 'react'
import type { AppProps } from 'next/app';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import Chatbot from "@/components/Chatbot"
import '../styles/global.css';
import Head from "next/head";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const Lenis = require('@studio-freight/lenis')

      const lenis = new Lenis({
        duration: 1.2, // speed
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out function
        smoothTouch: true,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      // Clean up on unmount
      return () => {
        lenis.destroy()
      }
    }
  }, [])
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Param Panwar",
              "url": "https://www.parampanwar.com",
              "image": "https://www.parampanwar.com/logo.png"
            })
          }}
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* <Chatbot /> */}
          <Toaster />
          <Sonner />
          <Navbar />
          <Component {...pageProps} />

        </TooltipProvider>
      </QueryClientProvider>
         </>
      );
 
}

export default MyApp;