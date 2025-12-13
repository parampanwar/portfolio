import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
const projectsData = [
    {
        title: "Shoponcell",
        description: "A SaaS Product for Whatsapp and RCS Marketing",
        liveUrl: "https://shoponcell.com",
        tags: ["NextJS", "Full-Stack"],
        gradient: "from-blue-500 to-cyan-500",
        logo: "/shoponcell_light_logo.4f3e0d21.svg"
    },
    {
        title: "Portfolio",
        description: "Personal portfolio website showcasing projects, skills, and professional journey",
        githubUrl: "https://github.com/parampanwar/portfolio",
        tags: ["React", "Tailwind", "Framer Motion"],
        gradient: "from-purple-500 to-pink-500",
        logo: "/param.svg"
    },
    {
        title: "Cashbook",
        description: "Financial tracking application for managing personal expenses and budgets efficiently",
        githubUrl: "https://github.com/parampanwar/cashbookapp",
        tags: ["React Native", "Mobile", "Finance"],
        gradient: "from-green-500 to-emerald-500"
    },
    {
        title: "To-Do List",
        description: "Task management system with Django backend for organizing daily activities",
        githubUrl: "https://github.com/parampanwar/django-projects-to-do-list",
        tags: ["Django", "Python", "Web App"],
        gradient: "from-orange-500 to-red-500"
    }
];

const Projects = () => {
    return (
        <section id="projects" className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float" />

            <div className="max-w-7xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-6xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Featured Projects
                    </h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6" />
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        A collection of projects that showcase my development journey
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="glass-panel h-full p-8 rounded-3xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                <div className="relative space-y-6">

                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`
      w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg 
      group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
      ${project.logo
                                                    ? 'bg-white/90 p-1'
                                                    : `bg-gradient-to-br ${project.gradient}`
                                                }
    `}
                                        >
                                            {project.logo ? (
                                                <Image
                                                    src={project.logo}
                                                    alt={`${project.title} logo`}
                                                    width={48}
                                                    height={48}
                                                // Removed the unnecessary `className="bg-white"` here
                                                />
                                            ) : (
                                                <span className="text-2xl font-bold text-white drop-shadow">
                                                    {project.title.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Project info */}
                                    <div>
                                        <h3 className="text-3xl font-bold mb-3 text-foreground group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed text-base">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-4 py-2 text-sm font-medium glass-panel rounded-full hover:scale-105 transition-transform duration-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        {project.liveUrl && (
                                            <Button
                                                asChild
                                                size="lg"
                                                className="gap-2 rounded-2xl glass-panel border-primary/20 hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
                                            >
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    <FaExternalLinkAlt />
                                                    View Live
                                                </a>
                                            </Button>
                                        )}
                                        {project.githubUrl && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="gap-2 rounded-2xl glass-panel hover:bg-black transition-all duration-500"
                                            >
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                    <FaGithub />
                                                    GitHub
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
