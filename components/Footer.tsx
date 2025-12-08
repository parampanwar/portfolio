"use client";

import { FaGithub, FaLinkedinIn, FaCheck } from 'react-icons/fa';
import { BiLogoGmail } from 'react-icons/bi';
import { useState } from 'react';
import { scrollToSection } from "../utils/scrollToSection";
import type { FC, MouseEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface EmailLinkProps {
  email: string;
}

const EmailLink: FC<EmailLinkProps> = ({ email }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

    } catch (err) {
      console.error('Failed to copy text: ', err);
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex items-center leading-relaxed hover:cursor-pointer">
      <a
        onClick={handleCopy}
        className="text-foreground transition-colors duration-300 font-medium relative group"
      >
        {email}

        {/* Visual feedback for copying */}
        {isCopied && (
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded shadow-lg flex items-center gap-1 transition-opacity duration-300 whitespace-nowrap">
            <FaCheck className="w-3 h-3" /> Copied!
          </span>
        )}

        {/* Optional underline on hover */}
        <span className="absolute bottom-0 left-0 w-full h-px bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </a>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (sectionId: string) => {
    if (pathname === '/') {
      scrollToSection(`#${sectionId}`);
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Liquid background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />

      <div className="glass-panel relative mx-6 mb-6 rounded-3xl border-2">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-[hsl(var(--gradient-mesh-2))]">
                Param Panwar
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Full-Stack Developer passionate about creating beautiful web experiences with modern technologies
              </p>

              <EmailLink email="contact@parampanwar.com" />

            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground mb-6">Quick Links</h4>
              <nav className="flex flex-col space-y-3">
                {['Home', 'About', 'Skills', 'Projects'].map((item) => (
                  <a
                    key={item}
                    href={`/#${item.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(item.toLowerCase());
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 w-fit relative group cursor-pointer"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground mb-6">Connect</h4>
              <div className="flex gap-3">

                {[
                  { href: "mailto:contact@parampanwar.com", icon: BiLogoGmail, label: "Email" },
                  { href: "https://github.com/parampanwar", icon: FaGithub, label: "GitHub" },
                  { href: "https://linkedin.com/in/parampanwar", icon: FaLinkedinIn, label: "LinkedIn" }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center hover:scale-110 hover:bg-primary/10 transition-all duration-300 group"
                    aria-label={social.label}
                  >

                    <social.icon className="text-xl group-hover:text-primary transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} Param Panwar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;