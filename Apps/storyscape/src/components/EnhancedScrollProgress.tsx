'use client';

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useScrollProgress, useScrollColor } from '@/hooks/useScrollAnimations';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';

export default function EnhancedScrollProgress() {
  const { mode } = useCustomTheme();
  const progress = useScrollProgress();
  const progressColor = useScrollColor('#8B5CF6', '#EC4899');

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        zIndex: 9999,
        background: mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
          scaleX: progress,
          transformOrigin: '0%',
        }}
      />
      
      {/* Scroll percentage indicator */}
      <motion.div
        style={{
          position: 'absolute',
          top: -30,
          right: 0,
          fontSize: '12px',
          fontWeight: 600,
          opacity: progress,
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          style={{
            color: progressColor,
          }}
        >
          {Math.round(progress.get() * 100)}%
        </motion.div>
      </motion.div>
    </Box>
  );
}

// Circular scroll progress
export function CircularScrollProgress() {
  const { mode } = useCustomTheme();
  const progress = useScrollProgress();
  const progressColor = useScrollColor('#8B5CF6', '#EC4899');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}
    >
      <motion.div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${progressColor.get()} ${progress.get() * 100}%, transparent 0%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            background: `conic-gradient(from 0deg, ${progressColor.get()} ${progress.get() * 100}%, transparent 0%)`,
          }}
          transition={{ duration: 0.1 }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              color: progressColor.get(),
            }}
          >
            {Math.round(progress.get() * 100)}%
          </Typography>
        </motion.div>
      </motion.div>
    </Box>
  );
}
