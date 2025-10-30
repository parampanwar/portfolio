'use client'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from 'react'
import type { AppProps } from 'next/app';
import '../styles/global.css';
// Create the client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // We only want to run this code on the client
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* This <Component /> is the page being rendered (e.g., index.tsx) */}
        <Component {...pageProps} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default MyApp;