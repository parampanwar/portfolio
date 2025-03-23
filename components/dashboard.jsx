import ReusableButtons from './ReusableButtons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from "react";
import { FaInstagram, FaLinkedinIn, FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import WelcomeText from '/components/WelcomeText';

const MyDashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <section id="home" className="min-h-screen flex relative">
            {/* Social Links */}
            <div className='absolute top-7 right-7 flex gap-6'>
                <a href="https://www.instagram.com/parampanwar36" target='blank'>
                    <FaInstagram className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" />
                </a>
                <a href="https://www.linkedin.com/in/parampanwar" target='blank'>
                    <FaLinkedinIn className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" />
                </a>
                <a href="https://www.github.com/parampanwar" target='blank'>
                    <FaGithub className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" />
                </a>
                <a href="mailto:parampanwar36@gmail.com">
                    <BiLogoGmail className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" />
                </a>
            </div>

            {/* Hamburger Menu Button (Visible on Small Screens) */}
            <div className="absolute top-7 left-7 md:hidden z-50">
                <button onClick={() => setIsOpen(!isOpen)} className="text-3xl focus:outline-none">
                    {isOpen ? <FaTimes className='text-white'/> : <FaBars className='text-white'/>}
                </button>
            </div>

            {/* Mobile Menu with Transition */}
            <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: isOpen ? 0 : '-100%' }} 
                transition={{ type: 'tween', duration: 0.3 }}
                className={`fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center gap-6 text-white text-2xl z-40 ${isOpen ? 'block' : 'hidden'}`}
            >
                <a href="#about" className="cursor-pointer hover:scale-110" onClick={() => setIsOpen(false)}>About</a>
                <a href="#skills" className="cursor-pointer hover:scale-110" onClick={() => setIsOpen(false)}>Skills</a>
                <a href="#projects" className="cursor-pointer hover:scale-110" onClick={() => setIsOpen(false)}>Projects</a>
            </motion.div>

            {/* Left Navigation (Desktop) */}
            <div className="hidden md:flex flex-col gap-6 p-10 fixed left-0 top-1/2 transform -translate-y-1/2">
                <a href="#about" className="cursor-pointer transition-transform duration-300 hover:scale-110">About</a>
                <a href="#skills" className="cursor-pointer transition-transform duration-300 hover:scale-110">Skills</a>
                <a href="#projects" className="cursor-pointer transition-transform duration-300 hover:scale-110">Projects</a>
            </div>

            {/* Main Content */}
            <div className="flex flex-row tabletM:flex-row items-center justify-center w-full ml-20">
                {/* Text Section */}
                <div className="flex flex-col text-center tabletM:text-left">
                    <WelcomeText />
                    <p className="text-2xl font-light">I'm Param Panwar</p>
                </div>
                {/* Image Section */}
                <div className="flex justify-center mt-6 ml-20 tabletM:mt-0 tabletM:ml-10">
                    <Image
                        src="/param.jpg"
                        alt="Param Panwar"
                        width={300}
                        height={50}
                        className="rounded-full shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
};

export default MyDashboard;