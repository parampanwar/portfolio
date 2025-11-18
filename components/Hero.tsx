import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './ui/button';
import { scrollToSection } from "../utils/scrollToSection";

const Hero = () => {
  const text = "Hello!";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <section id="home" className="min-h-screen flex flex-col relative overflow-hidden bg-background">     

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-32 relative z-10">
        <motion.div
          className="text-center max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated greeting with liquid glass effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-7xl sm:text-9xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--gradient-mesh-1))] via-[hsl(var(--gradient-mesh-2))] to-[hsl(var(--gradient-mesh-3))] bg-300% animate-gradient-shift">
              {text}
            </h1>
          </motion.div>

          <motion.div
            className="glass-panel px-8 sm:px-12 py-6 rounded-3xl mb-8 inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold">
              I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Param Panwar</span>
            </h2>
          </motion.div>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Full-Stack Developer crafting beautiful web experiences with modern technologies
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 rounded-2xl glass-panel border-primary/20 hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
            >
              <a href="#projects">View Projects</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 rounded-2xl glass-panel  transition-all duration-500 "
            >
              <a href="#about">Learn More</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-foreground/20 rounded-full flex justify-center p-2"
        >
          <motion.div 
            className="w-2 h-2 bg-foreground/40 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
