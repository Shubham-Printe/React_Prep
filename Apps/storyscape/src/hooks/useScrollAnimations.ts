'use client';

import { useRef } from 'react';
import { useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Hook for parallax scrolling effects
export function useParallax(offset: number = 50) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return springY;
}

// Hook for scroll-triggered visibility
export function useScrollVisibility(threshold: number = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once: false,
    margin: '-100px 0px -100px 0px'
  });
  
  return { ref, isInView };
}

// Hook for scroll progress (0 to 1)
export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return scaleX;
}

// Hook for scroll-based rotation
export function useScrollRotation(maxRotation: number = 360) {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, maxRotation]);
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 30 });
  
  return springRotate;
}

// Hook for scroll-based scale
export function useScrollScale(minScale: number = 0.8, maxScale: number = 1.2) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [maxScale, minScale]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  
  return springScale;
}

// Hook for scroll-based opacity
export function useScrollOpacity(startFade: number = 0, endFade: number = 1000) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [startFade, endFade], [1, 0]);
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  
  return springOpacity;
}

// Hook for scroll-based blur
export function useScrollBlur(maxBlur: number = 10) {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 1000], [0, maxBlur]);
  const springBlur = useSpring(blur, { stiffness: 100, damping: 30 });
  
  return springBlur;
}

// Hook for scroll-based color changes
export function useScrollColor(startColor: string, endColor: string) {
  const { scrollY } = useScroll();
  const color = useTransform(scrollY, [0, 1000], [startColor, endColor]);
  
  return color;
}

// Hook for scroll-triggered animations with custom triggers
export function useScrollTrigger(
  triggerPoint: number = 0.5,
  animationType: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' = 'fadeIn'
) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: triggerPoint,
    once: true, // Only animate once to prevent flickering
    margin: '-50px 0px -50px 0px' // Reduced margin for more stable triggering
  });

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: {},
      visible: {}
    };

    switch (animationType) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 30 }, // Reduced distance to prevent layout shift
          visible: { opacity: 1, y: 0 }
        };
      case 'slideDown':
        return {
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 }
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 }, // Reduced scale to prevent layout shift
          visible: { opacity: 1, scale: 1 }
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -10 }, // Reduced rotation
          visible: { opacity: 1, rotate: 0 }
        };
      default:
        return baseVariants;
    }
  };

  return {
    ref,
    isInView,
    variants: getAnimationVariants()
  };
}

// Hook for scroll-based stagger animations
export function useScrollStagger(
  staggerDelay: number = 0.1,
  triggerPoint: number = 0.2
) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: triggerPoint,
    once: true, // Only animate once
    margin: '-50px 0px -50px 0px'
  });

  return {
    ref,
    isInView,
    staggerDelay
  };
}

// Hook for scroll-based text reveal
export function useTextReveal(
  triggerPoint: number = 0.3,
  animationType: 'typewriter' | 'fadeIn' | 'slideUp' = 'fadeIn'
) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: triggerPoint,
    once: true, // Only animate once
    margin: '-50px 0px -50px 0px'
  });

  const getTextVariants = () => {
    switch (animationType) {
      case 'typewriter':
        return {
          hidden: { width: 0 },
          visible: { 
            width: 'auto',
            transition: {
              duration: 2,
              ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
            }
          }
        };
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
            }
          }
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 20 }, // Reduced distance
          visible: { 
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  return {
    ref,
    isInView,
    variants: getTextVariants()
  };
}

// Hook for scroll-based section reveals
export function useSectionReveal(
  sectionId: string,
  triggerPoint: number = 0.1
) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: triggerPoint,
    once: true, // Only animate once
    margin: '-50px 0px -50px 0px'
  });

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 20, // Reduced distance
      scale: 0.98 // Reduced scale
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
        staggerChildren: 0.1 // Reduced stagger delay
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 10 // Reduced distance
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number]
      }
    }
  };

  return {
    ref,
    isInView,
    sectionVariants,
    itemVariants
  };
}
