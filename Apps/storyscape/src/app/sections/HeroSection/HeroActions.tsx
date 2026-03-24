'use client';

import { motion } from 'framer-motion';
import { Stack } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/hooks/usePortfolioData';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function HeroActions() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
    >
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2}
        sx={{
          position: 'relative',
          zIndex: 10,
          mt: 2,
          pt: 4, // Increased top padding to accommodate hover transform
          pb: 2, // Added bottom padding for scale effect
          px: 2, // Added horizontal padding for scale effect
          '& > *': {
            position: 'relative',
            zIndex: 10,
          }
        }}
      >
        <AnimatedButton
          variant="contained"
          size="large"
          href="#contact"
          sx={{
            background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: `0 8px 32px ${branding.primaryColors[0]}40`,
            position: 'relative',
            zIndex: 10,
            // Removed borderRadius: 2 to use theme default (999)
            '&:hover': {
              boxShadow: `0 12px 40px ${branding.primaryColors[0]}60`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          {t('hero.cta.primary')}
        </AnimatedButton>
        
        <AnimatedButton
          variant="outlined"
          size="large"
          href="#projects"
          sx={{
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#D1D5DB',
            color: mode === 'dark' ? '#F1F5F9' : 'black',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            position: 'relative',
            zIndex: 10,
            // Removed borderRadius: 2 to use theme default (999)
            '&:hover': {
              borderColor: branding.primaryColors[0],
              color: branding.primaryColors[0],
              background: `${branding.primaryColors[0]}10`,
            },
          }}
        >
          {t('hero.cta.secondary')}
        </AnimatedButton>
      </Stack>
    </motion.div>
  );
}
