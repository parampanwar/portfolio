import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './ui/button';
import { scrollToSection } from "../utils/scrollToSection";

const Hero = () => {
  const text = "Hello!";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <section id="home" className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Liquid gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-10" />

      {/* Animated liquid blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30 animate-liquid-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-mesh-1)) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-25 animate-liquid-float-2"
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-mesh-2)) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20 animate-liquid-float"
        style={{
          background: 'radial-gradient(circle, hsl(var(--gradient-mesh-3)) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animationDelay: '5s'
        }}
      />

      {/* Glass navigation bar - Desktop */}
      <motion.div
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => scrollToSection("#home")}
            className="gap-2 relative overflow-hidden bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%),hsl(var(--primary))] bg-[length:200%_100%,100%_100%] bg-[-200%_0,0_0] bg-no-repeat animate-shine transition-colors duration-300 ease-in-out"
          >
            Home
          </Button>

          <Button
            variant="ghost"
            onClick={() => scrollToSection("#skills")}
            className="gap-2 relative overflow-hidden bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%),hsl(var(--primary))] bg-[length:200%_100%,100%_100%] bg-[-200%_0,0_0] bg-no-repeat animate-shine transition-colors duration-300 ease-in-out"
          >
            Skills
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection("#about")}
            className="gap-2 relative overflow-hidden bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%),hsl(var(--primary))] bg-[length:200%_100%,100%_100%] bg-[-200%_0,0_0] bg-no-repeat animate-shine transition-colors duration-300 ease-in-out"
          >
            About
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection("#projects")}
            className="gap-2 relative overflow-hidden bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%),hsl(var(--primary))] bg-[length:200%_100%,100%_100%] bg-[-200%_0,0_0] bg-no-repeat animate-shine transition-colors duration-300 ease-in-out"
          >
            Projects
          </Button>
        </div>
      </motion.div>

      {/* Floating Orb Navigation - Mobile */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="glass-panel w-16 h-16 rounded-full flex items-center justify-center "
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="5" r="2" fill="currentColor" opacity={isMenuOpen ? 0 : 1}/>
              <circle cx="12" cy="19" r="2" fill="currentColor" opacity={isMenuOpen ? 0 : 1}/>
            </svg>
          </motion.div>
        </motion.button>

        {/* Radial Menu Items */}
        <motion.div
          className="absolute bottom-0 left-0 right-1 -translate-x-1/2"
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
        >
          {[
            { label: "Home", section: "#home", angle: -90 },
            { label: "Skills", section: "#skills", angle: -135 },
            { label: "About", section: "#about", angle: -45 },
            { label: "Projects", section: "#projects", angle: 180 }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              variants={{
                open: {
                  x: Math.cos((item.angle * Math.PI) / 180) * 100,
                  y: Math.sin((item.angle * Math.PI) / 180) * 100,
                  opacity: 1,
                  scale: 1,
                },
                closed: {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="absolute bottom-8 left-8"
            >
              <Button
                onClick={() => {
                  scrollToSection(item.section);
                  setIsMenuOpen(false);
                }}
                className="w-14 h-14 rounded-full p-0 text-xs font-medium hover:scale-110 transition-transform duration-300"
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Backdrop blur when menu is open */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0  -z-10"
          />
        )}
      </div>

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
