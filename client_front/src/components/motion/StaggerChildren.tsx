'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay between each child (seconds) */
  stagger?: number;
  /** Initial delay before first child animates (seconds) */
  delay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.08,
  delay = 0,
  once = true,
}: StaggerContainerProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
  distance = 24,
}: StaggerItemProps) {
  const dirOffset = (() => {
    switch (direction) {
      case 'up':    return { y: distance };
      case 'down':  return { y: -distance };
      case 'left':  return { x: distance };
      case 'right': return { x: -distance };
      default:      return { y: distance };
    }
  })();

  const item = {
    hidden: { opacity: 0, ...dirOffset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
