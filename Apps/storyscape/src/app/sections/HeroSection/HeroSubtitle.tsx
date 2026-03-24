'use client';

import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { usePersonalInfo } from '@/hooks/usePortfolioData';

export default function HeroSubtitle() {
  const { mode } = useCustomTheme();
  const personal = usePersonalInfo();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.5rem' },
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#111827',
            mb: 3,
            textAlign: { xs: 'center', lg: 'left' },
          }}
        >
          {personal.title}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
            mb: 4,
            lineHeight: 1.6,
            maxWidth: '600px',
            textAlign: { xs: 'center', lg: 'left' },
            mx: { xs: 'auto', lg: 0 },
          }}
        >
          {personal.subtitle}
        </Typography>
      </motion.div>
    </>
  );
}
