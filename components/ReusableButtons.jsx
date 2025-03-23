// components/button.jsx
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa'; 

const ReusableButtons = ({
  href,
  children,
  icon: Icon, 
  target = '_blank', 
  rel = 'noopener noreferrer', 
  className = '', 
  download,
  ...props 
}) => {
  return (
    <motion.button
      className={`border-3 border-purple-500/50 px-4 py-2 rounded-2xl cursor-pointer bg-gray-700/50 text-purple-300 transition-all duration-300 hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 ${className}`}
      
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true }}
      {...props} 
    >
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        className="text-inherit no-underline flex items-center gap-2"
      >
        {Icon && <Icon className="text-xl" />}
        {children}
      </a>
    </motion.button>
  );
};

export default ReusableButtons;