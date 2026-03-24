'use client';

import { motion } from 'framer-motion';
import { Stack, Chip } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useSkills, useBranding } from '@/hooks/usePortfolioData';

export default function HeroSkills() {
  const { mode } = useCustomTheme();
  const skills = useSkills();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <Stack 
        direction="row" 
        spacing={2} 
        flexWrap="wrap" 
        useFlexGap
        sx={{ 
          mb: 4,
          justifyContent: { xs: 'center', lg: 'flex-start' }
        }}
      >
        {skills.quick.map((skill, index) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
          >
            <Chip
              label={skill}
              sx={{
                background: mode === 'dark' 
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(139, 92, 246, 0.1)',
                color: mode === 'dark' ? '#E0E7FF' : '#2563EB',
                border: mode === 'dark' 
                  ? '1px solid rgba(139, 92, 246, 0.3)'
                  : '1px solid rgba(139, 92, 246, 0.2)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                },
              }}
            />
          </motion.div>
        ))}
      </Stack>
    </motion.div>
  );
}
