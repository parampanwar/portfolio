import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import Head from "next/head";
const Contact = () => {
    return (
        <>
        <Head>
  <title>Contact – Param Panwar</title>
  <meta name="description" content="Get in touch with Param Panwar for web and app development projects." />
</Head>
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Gradient background effects */}
            <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 ">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Contact Now
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have a question or want to work together? Drop me a message and I'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {/* Contact Form */}
                        <div className="glass-card p-8 md:p-10 animate-scale-in">
                            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                            <ContactForm />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            <div className="glass-card p-8 md:p-10">
                                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="glass-icon-wrapper">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Email</h3>
                                            <a
                                                href="mailto:hello@example.com"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                contact@parampanwar.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-start gap-4 group">
                                        <div className="glass-icon-wrapper">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Phone</h3>
                                            <a
                                                href="tel:+1234567890"
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                +91 8278636404
                                            </a>
                                        </div>
                                    </div> */}

                                    <div className="flex items-start gap-4 group">
                                        <div className="glass-icon-wrapper">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">Location</h3>
                                            <p className="text-muted-foreground">
                                                Jaipur, Rajasthan<br />
                                                India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Contact;
