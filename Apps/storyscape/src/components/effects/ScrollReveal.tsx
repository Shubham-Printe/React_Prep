'use client';

import { motion } from 'framer-motion';
import { useScrollTrigger, useScrollStagger, useTextReveal, useSectionReveal } from '@/hooks/useScrollAnimations';

interface ScrollRevealProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  triggerPoint?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animationType = 'fadeIn',
  triggerPoint = 0.1,
  delay = 0,
  duration = 0.8,
  className
}: ScrollRevealProps) {
  const { ref, isInView, variants } = useScrollTrigger(triggerPoint, animationType);

  const customVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        delay,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ 
        // Ensure elements maintain their space
        minHeight: 'fit-content',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered reveal for multiple children
interface StaggerRevealProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  triggerPoint?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  className?: string;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  triggerPoint = 0.2,
  animationType = 'fadeIn',
  className
}: StaggerRevealProps) {
  const { ref, isInView, staggerDelay: hookStaggerDelay } = useScrollStagger(staggerDelay, triggerPoint);
  const { variants } = useScrollTrigger(triggerPoint, animationType);

  const containerVariants = {
    hidden: { 
      opacity: 0,
      // Keep elements in place to prevent layout shift
      y: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: hookStaggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ 
        minHeight: 'fit-content',
        width: '100%'
      }}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Text reveal with typewriter effect
interface TextRevealProps {
  children: React.ReactNode;
  animationType?: 'typewriter' | 'fadeIn' | 'slideUp';
  triggerPoint?: number;
  delay?: number;
  className?: string;
}

export function TextReveal({
  children,
  animationType = 'fadeIn',
  triggerPoint = 0.3,
  delay = 0,
  className
}: TextRevealProps) {
  const { ref, isInView, variants } = useTextReveal(triggerPoint, animationType);

  const customVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        delay,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ 
        minHeight: 'fit-content',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
}

// Section reveal with stagger children
interface SectionRevealProps {
  children: React.ReactNode;
  sectionId: string;
  triggerPoint?: number;
  className?: string;
}

export function SectionReveal({
  children,
  sectionId,
  triggerPoint = 0.1,
  className
}: SectionRevealProps) {
  const { ref, isInView, sectionVariants, itemVariants } = useSectionReveal(sectionId, triggerPoint);

  return (
    <motion.div
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      style={{ 
        minHeight: 'fit-content',
        width: '100%'
      }}
    >
      <motion.div variants={itemVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// Floating elements with scroll-based movement
interface FloatingElementProps {
  children: React.ReactNode;
  speed?: number;
  amplitude?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingElement({
  children,
  speed = 1,
  amplitude = 20,
  className,
  style
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 3 / speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
