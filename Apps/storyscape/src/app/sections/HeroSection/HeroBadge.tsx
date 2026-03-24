'use client';

import { motion } from 'framer-motion';
import { Chip } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/hooks/usePortfolioData';

export default function HeroBadge() {
  const { t } = useLanguage();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Chip
        label={t('hero.badge')}
        sx={{
          background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
          color: '#F8FAFC',
          fontWeight: 600,
          px: 2,
          py: 1,
          mb: 3,
          '& .MuiChip-label': {
            px: 2,
          },
        }}
      />
    </motion.div>
  );
}
