'use client';

import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePersonalInfo, useBranding } from '@/hooks/usePortfolioData';

export default function HeroTitle() {
  const { t } = useLanguage();
  const personal = usePersonalInfo();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '2.5rem', sm: '3.5rem', lg: '4rem' },
          lineHeight: 1.1,
          mb: 2,
          textAlign: { xs: 'center', lg: 'left' },
          background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {t('hero.greeting').replace('{name}', personal.name)}
      </Typography>
    </motion.div>
  );
}
