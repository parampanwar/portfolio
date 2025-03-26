// components/WelcomeText.jsx
import { motion } from 'framer-motion';

const WelcomeText = ({ text = 'Hello' }) => {

  const letterVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 10,
        type: 'spring',
        stiffness: 200,
        damping: 10,
        mass: 0.8,
      },
    }),
  };

  return (
    <h1 className="text-8xl font-bold text-left main-text">
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={letterVariants}
          initial="initial"
          animate="animate"
          style={{ originY: 0.5 }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h1>
  );
};

export default WelcomeText;