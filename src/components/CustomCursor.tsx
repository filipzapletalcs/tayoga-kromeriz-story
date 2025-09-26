import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Different spring configs for different elements
  const springConfig = { damping: 25, stiffness: 350 };
  const slowSpringConfig = { damping: 30, stiffness: 120 };
  const verySlowSpringConfig = { damping: 35, stiffness: 80 };
  
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const slowCursorXSpring = useSpring(cursorX, slowSpringConfig);
  const slowCursorYSpring = useSpring(cursorY, slowSpringConfig);
  
  const verySlowCursorXSpring = useSpring(cursorX, verySlowSpringConfig);
  const verySlowCursorYSpring = useSpring(cursorY, verySlowSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.onclick !== null ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Hide custom cursor on mobile devices
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                       'ontouchstart' in window;
      if (isMobile) {
        setIsHidden(true);
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
        
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
      
      {/* Third lotus layer - very slow follow */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9996]"
        style={{
          x: verySlowCursorXSpring,
          y: verySlowCursorYSpring,
        }}
        animate={{
          scale: isPointer ? 1.5 : 0.9,
          rotate: isPressed ? -120 : 0,
          opacity: isHidden ? 0 : 0.1,
        }}
        transition={{ duration: 0.6 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <g className="origin-center">
            {[30, 90, 150, 210, 270, 330].map((rotation, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="12"
                rx="3"
                ry="6"
                fill="currentColor"
                className="text-primary"
                opacity="0.4"
                transform={`rotate(${rotation} 20 20)`}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Second lotus layer - medium slow follow */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9997]"
        style={{
          x: slowCursorXSpring,
          y: slowCursorYSpring,
        }}
        animate={{
          scale: isPointer ? 1.8 : 1,
          rotate: isPressed ? 180 : 0,
          opacity: isHidden ? 0 : 0.15,
        }}
        transition={{ duration: 0.4 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <g className="origin-center">
            {[0, 72, 144, 216, 288].map((rotation, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="10"
                rx="4"
                ry="8"
                fill="currentColor"
                className="text-primary"
                opacity="0.3"
                transform={`rotate(${rotation} 20 20)`}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* First lotus layer - normal follow */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isPointer ? 1.3 : 0.8,
          rotate: isPressed ? 90 : 0,
          opacity: isHidden ? 0 : 0.2,
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <g className="origin-center">
            {[45, 135, 225, 315].map((rotation, i) => (
              <ellipse
                key={i}
                cx="20"
                cy="11"
                rx="3.5"
                ry="7"
                fill="currentColor"
                className="text-primary"
                opacity="0.4"
                transform={`rotate(${rotation} 20 20)`}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Center dot with breathing glow - direct follow */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isPressed ? 0.7 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {/* Breathing glow */}
          <motion.div
            className="absolute w-4 h-4 rounded-full bg-primary/30 blur-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Second breathing layer */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-primary/20 blur-xs"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          {/* Center dot */}
          <motion.div
            className="relative w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: isPointer ? [1, 0.6, 1] : [1, 1.1, 1],
            }}
            transition={{
              duration: isPointer ? 0.3 : 2,
              repeat: isPointer ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;