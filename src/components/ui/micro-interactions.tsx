import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Hover efekt pro karty
export const HoverCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Fade in animace
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6,
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in animace
export const SlideIn = ({ 
  children, 
  direction = 'left',
  delay = 0,
  className = '' 
}: { 
  children: ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}) => {
  const variants = {
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    up: { y: -50, opacity: 0 },
    down: { y: 50, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse animace pro důležité elementy
export const Pulse = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <motion.div
    animate={{ 
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8]
    }}
    transition={{ 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger animace pro seznamy
export const StaggerContainer = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Button micro-interactions
export const AnimatedButton = ({ 
  children, 
  className = '',
  onClick,
  disabled = false
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    transition={{ duration: 0.1 }}
    onClick={onClick}
    disabled={disabled}
    className={className}
  >
    {children}
  </motion.button>
);

// Floating animace
export const Floating = ({ 
  children, 
  intensity = 10,
  duration = 3,
  className = '' 
}: { 
  children: ReactNode; 
  intensity?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    animate={{ 
      y: [-intensity, intensity, -intensity],
      rotate: [-1, 1, -1]
    }}
    transition={{ 
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);




