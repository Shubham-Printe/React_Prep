'use client';

import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnhancedThemeToggle() {
  const { mode, toggleMode } = useTheme();
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    await toggleMode();
    
    // Reset animation state after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isDarkMode = mode === 'dark';

  return (
    <Tooltip title={t('navigation.toggleTheme').replace('{mode}', isDarkMode ? 'light' : 'dark')}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <IconButton
          onClick={handleToggle}
          disabled={isAnimating}
          sx={{
            color: '#F8FAFC',
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)',
            border: `2px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`,
            width: 56,
            height: 56,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)',
              borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(236, 72, 153, 0.6)',
              boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`,
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 0,
              height: 0,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.3s ease, height 0.3s ease',
            },
            '&:active::before': {
              width: '100%',
              height: '100%',
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: isDarkMode ? 180 : -180 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: isDarkMode ? -180 : 180 
              }}
              transition={{ 
                duration: 0.3,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isDarkMode ? (
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: 'easeInOut'
                  }}
                >
                  <LightMode />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: [0, -360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: 'easeInOut'
                  }}
                >
                  <DarkMode />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </IconButton>
      </motion.div>
    </Tooltip>
  );
}
