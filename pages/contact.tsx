import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Send, Loader2, Mail, MessageSquare, User, Zap } from 'lucide-react';
import { FaBrain, FaRobot, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { ContactForm } from '@/components/ContactForm';
import { MdOutlineMessage } from "react-icons/md";
import Footer from '@/components/Footer';
const contactSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    email: z.string().trim().email({ message: "Invalid email address" }).max(255),
    subject: z.string().trim().min(1, { message: "Subject is required" }).max(200),
    message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: "Message sent!",
            description: "Thank you for reaching out. I'll respond soon.",
        });

        reset();
        setIsSubmitting(false);
    };

    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com/parampanwar', label: 'GitHub' },
        { icon: FaLinkedin, href: 'https://linkedin.com/in/parampanwar', label: 'LinkedIn' },
        { icon: FaTwitter, href: 'https://twitter.com/parampanwar', label: 'Twitter' },
    ];

    return (
        <>
            <section id="contact" className="min-h-screen flex items-center justify-center py-32 px-6 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-liquid-float" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-3xl animate-liquid-float-2" />

                {/* Neural dots */}
                <div className="absolute inset-0 neural-dots opacity-20" />

                <div className="max-w-6xl w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6">
                            <FaRobot className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Let's Connect</span>
                        </div>

                        <h2 className="text-5xl sm:text-7xl font-bold mb-6 gradient-text-animated">
                            Get in Touch
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full mx-auto mb-6" />
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            Ready to build something <span className="text-primary">intelligent</span> together?
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* AI Assistant Card */}
                            <div className="glass-panel p-6 rounded-3xl border-2 border-primary/30">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <MdOutlineMessage className="w-7 h-7 text-primary-foreground" />
                                    </div>
                                    <div>
                                        {/* <h3 className="font-bold text-foreground">AI Assistant</h3> */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                            {/* <span className="text-sm text-muted-foreground">Online</span> */}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Drop me a message and I'll get back to you faster than a neural network can process!
                                    Looking forward to discussing your next AI-powered project.
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="glass-panel p-6 rounded-3xl space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-dark-surface flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <a href="mailto:param@example.com" className="text-foreground hover:text-primary transition-colors">
                                            contact@parampanwar.xyz
                                        </a>
                                    </div>
                                </div>

                            </div>

                            {/* Social Links */}
                            <div className="glass-panel p-6 rounded-3xl">
                                <h4 className="font-medium text-foreground mb-4">Connect with me</h4>
                                <div className="flex gap-3">
                                    {socialLinks.map(({ icon: Icon, href, label }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-xl bg-dark-surface flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 border border-transparent transition-all duration-300 group"
                                        >
                                            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            {/* Contact Form */}
                            <div className="glass-card p-8 md:p-10 animate-scale-in border rounded-xl bg-shadow">
                                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                                <ContactForm />
                            </div>
                        </motion.div>

                    </div>
                </div>

            </section>
            <Footer />
        </>
    );
};

export default Contact;
