'use client';

import React, { useState } from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps extends CardProps {
  hoverScale?: number;
  hoverElevation?: number;
  tiltIntensity?: number;
  glowColor?: string;
  children: React.ReactNode;
}

export default function AnimatedCard({
  children,
  hoverScale = 1.02,
  hoverElevation = 8,
  tiltIntensity = 5,
  glowColor = 'rgba(139, 92, 246, 0.3)',
  sx,
  ...props
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        scale: hoverScale,
        rotateX: tiltIntensity,
        rotateY: tiltIntensity,
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <Card
        {...props}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
            opacity: isHovered ? 0.2 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease',
            pointerEvents: 'none',
            zIndex: 2,
          },
          '&:hover::after': {
            transform: 'translateX(100%)',
          },
          '&:hover': {
            boxShadow: `0 ${hoverElevation * 2}px ${hoverElevation * 4}px rgba(0, 0, 0, 0.1), 0 0 4px ${glowColor}`,
          },
          ...sx,
        }}
      >
        <div style={{ position: 'relative', zIndex: 3 }}>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
