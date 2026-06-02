"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { scrollToSection } from "../utils/scrollToSection";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleNav = (target: string) => {
    setIsMenuOpen(false);
    if (!target.includes("#")) {
      router.push(target);
      return;
    }
    const sectionId = target.replace("/", "");

    if (pathname === "/") {
      scrollToSection(sectionId);
    } else {
      router.push("/" + sectionId);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.div
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => handleNav("/#home")}>
            Home
          </Button>
          <Button variant="ghost" onClick={() => handleNav("/#skills")}>
            Skills
          </Button>
          <Button variant="ghost" onClick={() => handleNav("/#about")}>
            About
          </Button>
          {/* <Button variant="ghost" onClick={() => handleNav("/contact")}>
            Contact
          </Button> */}
          <Button variant="ghost" onClick={() => handleNav("/#projects")}>
            Projects
          </Button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="glass-panel w-16 h-16 rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="5" r="2" fill="currentColor" opacity={isMenuOpen ? 0 : 1} />
              <circle cx="12" cy="19" r="2" fill="currentColor" opacity={isMenuOpen ? 0 : 1} />
            </svg>
          </motion.div>
        </motion.button>

        {/* Radial Menu */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
          className="absolute bottom-0 left-0 "
        >
          {[
            { label: "Projects", section: "#projects", angle: 180 },
            { label: "Skills", section: "#skills", angle: -135 },
            { label: "Home", section: "#home", angle: -90 },
            { label: "About", section: "#about", angle: -45 },
            { label: "Contact", section: "/contact", angle: 0 }
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
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="absolute bottom-8 left-0"
            >
              <Button variant="hero" size="lg"
                onClick={() => handleNav(item.section)}
                className="w-14 h-14 rounded-full text-xs"
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;