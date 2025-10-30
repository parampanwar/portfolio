import { motion } from 'framer-motion';
import { FaCode, FaReact, FaServer, FaWrench } from 'react-icons/fa';

const skillsData = [
  {
    category: "Programming",
    skills: ["C", "C++", "Python"],
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    icon: FaCode
  },
  {
    category: "Frontend",
    skills: ["HTML & CSS", "ReactJS & NextJS", "Tailwind CSS"],
    gradient: "from-cyan-500 via-teal-500 to-cyan-600",
    icon: FaReact
  },
  {
    category: "Backend",
    skills: ["Django", "NodeJS", "FastAPI"],
    gradient: "from-teal-500 via-green-500 to-teal-600",
    icon: FaServer
  },
  {
    category: "Other",
    skills: ["Git", "MongoDB", "SQL"],
    gradient: "from-purple-500 via-pink-500 to-purple-600",
    icon: FaWrench
  }
];

const Skills = () => {
    
  return (
    <section id="skills" className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
      {/* Background liquid blob */}
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-liquid-float-2" />
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            My Skills
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsData.map((skillGroup, index) => {
            
            // This is the fix: Define IconComponent *inside* the map
            const IconComponent = skillGroup.icon;

            return (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-panel h-full p-8 rounded-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${skillGroup.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Icon badge */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skillGroup.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="text-3xl text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  <h3 className="relative text-2xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                    {skillGroup.category}
                  </h3>
                  
                  <ul className="relative space-y-4">
                    {skillGroup.skills.map((skill, skillIndex) => (
                      <motion.li 
                        key={skill} 
                        className="flex items-center gap-3 group/item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1 + skillIndex * 0.1,
                          duration: 0.5
                        }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${skillGroup.gradient} group-hover/item:w-3 group-hover/item:h-3 transition-all duration-300`} />
                        <span className="text-base text-foreground/80 group-hover/item:text-foreground group-hover/item:translate-x-1 transition-all duration-300">
                          {skill}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;