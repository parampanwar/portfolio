import ReusableButtons from './ReusableButtons';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
const AboutSection = () => {
    return (
        <section id="about" className="min-h-screen flex items-center justify-center snap-start ">
          <div className="flex flex-col items-center w-full max-w-5xl p-6 gap-8">

            <motion.div
              className="flex flex-col w-full tabletM:w-1/2 gap-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              
              <h2 className="text-5xl font-bold text-gray-800 mb-2 border-3 border-gray-700 rounded-3xl px-5 py-5 w-fit self-center">
                About Me</h2>
                <motion.div
              className="w-full tabletM:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Image
                src="/param2.jpg"
                alt="Param Panwar"
                width={150}
                height={150}
                className="rounded-full shadow-lg transition-transform duration-300"
              />
            </motion.div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Hi, I’m Param Panwar—a passionate web and app developer with a knack for crafting innovative and user-friendly digital experiences.  I’m currently pursuing a B.Tech at JECRC Jaipur, graduating in 2026, where I’ve honed my technical skills and built a strong foundation in programming and problem-solving.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Fueled by curiosity and a love for technology, I thrive on transforming ideas into functional, beautiful applications. Whether it’s designing <span className="italic">responsive websites</span> or building <span className="italic">seamless mobile apps</span>, I’m committed to delivering solutions that leave a lasting impact.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                When I’m not coding, I’m exploring new tools, refining my craft, or connecting with the tech community. Let’s create something extraordinary together!
              </p>
            </motion.div>

     
            
            <ReusableButtons
                href="/resume/param_panwar_resume.pdf"
                target="_self"
                download="param_panwar.pdf"
              >
                Download Résumé
              </ReusableButtons>
          </div>
        </section>
    );
};
export default AboutSection;