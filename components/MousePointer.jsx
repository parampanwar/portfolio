import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MousePointer() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(isTouch);

        if (!isTouch) {
            const handleMouseMove = (e) => {
                requestAnimationFrame(() => {
                    setMousePosition({ x: e.clientX, y: e.clientY });
                });
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    useEffect(() => {
        if (!isTouchDevice) {
            const handleHover = (e) => {
                if (e.target.closest('a, button')) setIsHovering(true);
            };
            const handleLeave = (e) => {
                if (!e.target.closest('a, button')) setIsHovering(false);
            };
            document.addEventListener('mouseover', handleHover);
            document.addEventListener('mouseout', handleLeave);
            return () => {
                document.removeEventListener('mouseover', handleHover);
                document.removeEventListener('mouseout', handleLeave);
            };
        }
    }, [isTouchDevice]);

    useEffect(() => {
        if (!isTouchDevice) {
            document.body.style.cursor = 'none';
            return () => {
                document.body.style.cursor = 'auto';
            };
        }
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-50 hidden md:block" // Hide on small screens
            style={{
                x: mousePosition.x,
                y: mousePosition.y,
                translateX: '-50%',
                translateY: '-50%',
            }}
            transition={{ type: 'tween', duration: 0, ease: 'linear' }}
        >
            <div
                className={`rounded-full shadow-md transition-all duration-300 ${
                    isHovering ? 'w-9 h-9 opacity-30 mix-blend-difference' : 'w-2.5 h-2.5 opacity-80'
                }`}
                style={{ backgroundColor: isHovering ? '#fff' : '#fff' }}
            />
        </motion.div>
    );
}