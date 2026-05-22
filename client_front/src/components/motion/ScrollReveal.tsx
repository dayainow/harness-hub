'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the element slides in from */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Delay in seconds */
  delay?: number;
  /** Distance the element travels (px) */
  distance?: number;
  /** Trigger once or every time it enters viewport */
  once?: boolean;
}

const directionOffset = (dir: string, distance: number) => {
  switch (dir) {
    case 'up':    return { y: distance };
    case 'down':  return { y: -distance };
    case 'left':  return { x: distance };
    case 'right': return { x: -distance };
    default:      return { y: distance };
  }
};

export function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  distance = 30,
  once = true,
}: ScrollRevealProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directionOffset(direction, distance),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
        delay,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
