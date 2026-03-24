'use client';

import React, { useState } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps extends Omit<ButtonProps, 'onClick'> {
  loading?: boolean;
  loadingText?: string;
  hoverScale?: number;
  rippleColor?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export default function AnimatedButton({
  children,
  loading = false,
  loadingText,
  hoverScale = 1.05,
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  href,
  target,
  rel,
  onClick,
  sx,
  ...props
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || !onClick) return;
    
    try {
      await onClick(event);
    } catch (error) {
      console.error('Button click error:', error);
    }
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      style={{ 
        position: 'relative',
        overflow: 'visible', // Changed from 'hidden' to 'visible'
        borderRadius: 'inherit',
      }}
    >
      <Button
        {...props}
        onClick={href ? undefined : handleClick}
        disabled={loading || props.disabled}
        sx={{
          position: 'relative',
          overflow: 'visible', // Changed from 'hidden' to 'visible'
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          ...sx,
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CircularProgress 
                size={16} 
                sx={{ 
                  color: 'inherit',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }} 
              />
              {loadingText || 'Loading...'}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple Effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              initial={{ 
                scale: 0, 
                opacity: 0.6,
                x: '-50%',
                y: '-50%',
              }}
              animate={{ 
                scale: 4, 
                opacity: 0,
              }}
              exit={{ 
                scale: 4, 
                opacity: 0,
              }}
              transition={{ 
                duration: 0.6,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: rippleColor,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );

  // If href is provided, wrap with Link
  if (href) {
    return (
      <Link 
        href={href} 
        target={target}
        rel={rel}
        style={{ textDecoration: 'none' }}
      >
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}
