import { motion } from 'framer-motion';
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
    <section id="about" className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float" />
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            About Me
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Image with liquid glass frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative">
              {/* Liquid gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-[hsl(var(--gradient-mesh-2))] rounded-[3rem] blur-2xl opacity-50 animate-liquid-float" />
              
              {/* Glass frame */}
              <div className="relative glass-panel p-3 rounded-[3rem]">
                <img
                  src="/param2.jpg"
                  alt="Param Panwar"
                  className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[2.5rem] object-cover"
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
            className="lg:col-span-3 space-y-6"
          >
            <div className="glass-panel p-8 rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-lg leading-relaxed text-foreground/90">
                Hi, I'm <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Param Panwar</span>—a passionate web and app developer 
                with a knack for crafting innovative and user-friendly digital experiences.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-lg leading-relaxed text-foreground/90">
                I'm currently pursuing a <span className="font-semibold">B.Tech at JECRC Jaipur</span>, graduating in 2026, 
                where I've honed my technical skills and built a strong foundation in programming and problem-solving.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:scale-[1.02] transition-transform duration-500">
              <p className="text-lg leading-relaxed text-foreground/90">
                Fueled by curiosity and a love for technology, I thrive on transforming ideas into functional, 
                beautiful applications. Whether it's designing <span className="font-semibold text-primary">responsive websites</span> or 
                building <span className="font-semibold text-accent">seamless mobile apps</span>, I'm committed to delivering solutions 
                that leave a lasting impact.
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={handleDownloadResume}
                className="px-8 py-6 rounded-2xl text-lg glass-panel border-primary/20 hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
              >
                <FaDownload />
                Download Resume
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="px-8 py-6 rounded-2xl text-lg glass-panel hover:bg-black transition-all duration-500"
              >
                <a href="https://github.com/parampanwar" target="_blank" rel="noopener noreferrer">
                <FaGithub />
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
