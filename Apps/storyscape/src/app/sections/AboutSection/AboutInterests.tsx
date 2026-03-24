'use client';

import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useAboutInfo } from '@/hooks/usePortfolioData';

export default function AboutInterests() {
  const { mode } = useCustomTheme();
  const about = useAboutInfo();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
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
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 3,
            }}
          >
            {about.interestsTitle}
          </Typography>
          
          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
            useFlexGap
          >
            {about.interests.map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1),
                  ease: [0.25, 0.46, 0.45, 0.94] 
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
              >
                <Chip
                  label={interest}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
