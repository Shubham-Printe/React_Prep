'use client';

import { motion } from 'framer-motion';
import { Typography, Card, Stack, Chip } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkills } from '@/hooks/usePortfolioData';

export default function SoftSkills() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const skills = useSkills();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'text.primary',
          mb: 4,
          textAlign: 'center',
        }}
      >
        {t('skills.softSkills.title')}
      </Typography>
      
      <Card
        sx={{
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          justifyContent="center"
        >
          {skills.soft.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + (index * 0.05),
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
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
      </Card>
    </motion.div>
  );
}
