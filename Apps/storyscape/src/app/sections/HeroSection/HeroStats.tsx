'use client';

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStats, useBranding } from '@/hooks/usePortfolioData';

export default function HeroStats() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const stats = useStats();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2, // Reduced from 3 to 2
          p: 3, // Reduced from 4 to 3
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
          borderRadius: 4,
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        {Object.entries(stats).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.6 + (index * 0.1) }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 1.5, // Reduced from 2 to 1.5
                borderRadius: 2,
                background: mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Typography
                variant="h4" // Reduced from h3 to h4
                sx={{
                  fontWeight: 700, // Reduced from 800 to 700
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, // Added responsive sizing
                  background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5, // Reduced from 1 to 0.5
                }}
              >
                {value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Added responsive sizing
                }}
              >
                {t(`hero.stats.${key}`)}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}
