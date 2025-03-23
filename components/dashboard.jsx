import ReusableButtons from './ReusableButtons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import WelcomeText from '/components/WelcomeText';
const MyDashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (


        <div className="flex flex-col justify-between w-full gap-6 p-6 rounded-standard tabletM:p-7 ">
            <section id="home" className="min-h-screen flex items-center justify-center ">
                <div className='absolute top-7 right-7 flex gap-6'>
                    <a href="https://www.instagram.com/parampanwar36" target='blank'>
                        <FaInstagram className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" /></a>
                    <a href="https://www.linkedin.com/in/parampanwar" target='blank'>
                        <FaLinkedinIn className="text-2xl cursor-pointer transition-colors duration-300  hover:scale-110" /></a>
                    <a href="https://www.github.com/parampanwar" target='blank'>
                        <FaGithub className="text-2xl cursor-pointer  transition-colors duration-300  hover:scale-110" /></a>
                    <a href="mailto:parampanwar36@gmail.com">
                        <BiLogoGmail className="text-2xl cursor-pointer transition-transform duration-300 hover:scale-110" /></a>

                </div>
                <div className="flex flex-col justify-between w-full gap-2 tabletM:flex-row ">
                    <div className="flex gap-3 items-center">
                        {/* Hamburger Menu (Visible on Small Screens) */}
                        <div className="absolute top-7 left-7 md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-3xl focus:outline-none">
                                {isOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>

                        {/* Navigation Menu */}
                        <div className={`absolute left-0 top-16 w-full bg-gray-900 text-white shadow-md 
    flex flex-col items-center gap-6 py-6 transition-all duration-300 
    md:relative md:w-auto md:bg-transparent md:shadow-none 
    ${isOpen ? "flex" : "hidden md:flex flex-col"}`} >
    
    <a href="#about" className="cursor-pointer transition-transform duration-300 hover:scale-110">About</a>
    <a href="#skills" className="cursor-pointer transition-transform duration-300 hover:scale-110">Skills</a>
    <a href="#projects" className="cursor-pointer transition-transform duration-300 hover:scale-110">Projects</a>
</div>
                        <div className='flex items-center justify-start h-screen p-10  tabletM:-ml-16 '>
                            <div className="flex flex-col">

                                <WelcomeText />

                                <p className="text-2xl font-light ">
                                    I'm Param Panwar
                                </p>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <Image
                                src="/param.jpg"
                                alt="Param Panwar"
                                width={300}
                                height={50}
                                className="rounded-full shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 items-center "></div>
                </div>
            </section>
        </div>
    );
};
export default MyDashboard;