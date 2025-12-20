import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from './ui/button';
import { FaRobot, FaCode, FaBrain } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-liquid-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-liquid-float-2" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-32 relative z-10">
        <motion.div
          className="text-center max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-8"
          >
            <HiSparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Developer</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </motion.div>

          {/* Main heading with animated gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-4 gradient-text-animated">
              Hello!
            </h1>
          </motion.div>

          {/* Name with glass panel */}
          <motion.div
            className="glass-panel px-8 sm:px-12 py-6 rounded-3xl mb-8 inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold">
              I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-glow-cyan">Param Panwar</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Full-Stack Developer building <span className="text-primary">intelligent</span> web experiences with cutting-edge{' '}
            <span className="text-accent">AI integration</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link href="#projects">
                <FaRobot className="w-5 h-5" />
                View Projects
              </Link>
            </Button> 
            <Button variant="neon" size="xl" asChild>
              <Link href="/contact">
                <FaCode className="w-5 h-5" />
                Get in Touch
              </Link>
            </Button>
          </motion.div>

          {/* Floating tech icons */}
          <motion.div
            className="flex justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { icon: FaBrain, delay: 0, color: 'primary' },
              { icon: FaCode, delay: 0.1, color: 'accent' },
              { icon: FaRobot, delay: 0.2, color: 'primary' },
            ].map(({ icon: Icon, delay, color }, index) => (
              <motion.div
                key={index}
                className={`glass-panel p-4 rounded-2xl border-${color === 'primary' ? 'primary' : 'accent'}/30`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + delay }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className={`w-6 h-6 ${color === 'primary' ? 'text-primary' : 'text-accent'}`} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <Link href="/skills">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="glass-panel px-4 py-3 rounded-full cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-accent mx-auto" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
