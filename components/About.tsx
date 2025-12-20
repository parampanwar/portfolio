import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/button';
import { FaGithub, FaDownload } from 'react-icons/fa';

const About = () => {
  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume/param_panwar.pdf';
    link.download = 'param_panwar.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-20 lg:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background elements - Adjusted opacity and position for mobile to prevent overflow */}
      <div className="absolute top-10 -right-20 md:top-20 md:right-20 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float opacity-60 md:opacity-100" />

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-20"
        >
          {/* Responsive Text Size */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            About Me
          </h2>
          <div className="w-24 sm:w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">

          {/* Image with liquid glass frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex justify-center order-1"
          >
            <div className="relative group">
              {/* Liquid gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-[hsl(var(--gradient-mesh-2))] rounded-[2.5rem] sm:rounded-[3rem] blur-2xl opacity-50 animate-liquid-float group-hover:opacity-70 transition-opacity duration-500" />

              {/* Glass frame */}
              <div className="relative glass-panel p-2 sm:p-3 rounded-[2.5rem] sm:rounded-[3rem]">
                <Image
                  src="/param2.webp"
                  width={320}
                  height={320}
                  alt="Param Panwar"
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-[2rem] sm:rounded-[2.5rem] object-cover shadow-xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            // Order 2 ensures it stays below image on mobile, right of image on desktop
            className="lg:col-span-3 space-y-4 sm:space-y-6 order-2 text-center lg:text-left"
          >
            <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                Hi, I'm <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Param Panwar</span>—a passionate web and app developer
                with a knack for crafting innovative and user-friendly digital experiences.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                I'm currently pursuing a <span className="font-semibold">B.Tech at JECRC Jaipur</span>, graduating in 2026,
                where I've honed my technical skills and built a strong foundation in programming and problem-solving.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
                Fueled by curiosity and a love for technology, I thrive on transforming ideas into functional,
                beautiful applications. Whether it's designing <span className="font-semibold text-primary">responsive websites</span> or
                building <span className="font-semibold text-accent">seamless mobile apps</span>, I'm committed to delivering solutions
                that leave a lasting impact.
              </p>
            </div>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 justify-center lg:justify-start w-full">
              <Button
                size="lg"
                onClick={handleDownloadResume}
                className="w-full sm:w-auto px-8 py-6 rounded-xl sm:rounded-2xl text-lg glass-panel border-primary/20 hover:border-primary/40 backdrop-blur-xl transition-all duration-500 shadow-lg hover:shadow-primary/20"
              >
                <FaDownload className="mr-2" />
                Download Resume
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto px-8 py-6 rounded-xl sm:rounded-2xl text-lg glass-panel hover:bg-black/80 transition-all duration-500"
              >
                <a href="https://github.com/parampanwar" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="mr-2" />
                  View GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;