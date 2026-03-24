'use client';

import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function ProjectsFooter() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <AnimatedButton
          variant="outlined"
          size="large"
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.125rem',
            fontWeight: 600,
            textTransform: 'none',
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            color: mode === 'dark' ? '#F1F5F9' : 'black',
            '&:hover': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
          hoverScale={1.05}
          rippleColor={mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
        >
          {t('projects.actions.viewAll')}
        </AnimatedButton>
      </Box>
    </motion.div>
  );
}
