'use client';

import { motion } from 'framer-motion';
import { useParallax, useScrollOpacity, useScrollBlur } from '@/hooks/useScrollAnimations';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  speed?: number;
  opacity?: boolean;
  blur?: boolean;
  className?: string;
}

export default function ParallaxBackground({ 
  children, 
  speed = 0.5, 
  opacity = false, 
  blur = false,
  className 
}: ParallaxBackgroundProps) {
  const y = useParallax(speed * 100);
  const scrollOpacity = useScrollOpacity(0, 1000);
  const scrollBlur = useScrollBlur(5);

  return (
    <motion.div
      className={className}
      style={{
        y: y,
        opacity: opacity ? scrollOpacity : 1,
        filter: blur ? `blur(${scrollBlur}px)` : 'none',
      }}
    >
      {children}
    </motion.div>
  );
}

// Specialized parallax components
export function ParallaxBlob({ 
  size = 200, 
  color = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  speed = 0.3,
  position = { top: '20%', left: '10%' }
}: {
  size?: number;
  color?: string;
  speed?: number;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
}) {
  const y = useParallax(speed * 100);
  const scrollOpacity = useScrollOpacity(0, 800);

  const positionStyle = {
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: 'blur(80px)',
        zIndex: 0,
        ...positionStyle,
        y: y,
        opacity: scrollOpacity,
      }}
    />
  );
}

export function ParallaxText({ 
  children, 
  speed = 0.2,
  className 
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const y = useParallax(speed * 50);

  return (
    <motion.div
      className={className}
      style={{ y: y }}
    >
      {children}
    </motion.div>
  );
}
