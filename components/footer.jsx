const Footer = () => {
    return (
        <footer className="flex flex-col items-center text-white font-light text-center space-y-2">
            <span className="flex space-x-4 font-semibold">
                <a href="#about">ABOUT</a>
                <a href="#skills">SKILLS</a>
                <a href="#project">PROJECTS</a>
            </span>
            <span>Copyright © 2025 Param Panwar.</span>
            <span className="sm:ml-2 sm:whitespace-nowrap">All Rights Reserved</span>
        </footer>
    );
};

export default Footer;
