'use client';

import { motion } from 'framer-motion';
import { Box, Typography, Card, LinearProgress, Stack } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkills, useBranding } from '@/hooks/usePortfolioData';

export default function TechnicalSkills() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const skills = useSkills();
  const branding = useBranding();

  return (
    <Box sx={{ mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
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
          {t('skills.technical.title')}
        </Typography>
      </motion.div>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
          gap: 4,
        }}
      >
        {skills.technical.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3 + (categoryIndex * 0.1),
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
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
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                {category.title}
              </Typography>
              
              <Stack spacing={3}>
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + (categoryIndex * 0.1) + (skillIndex * 0.05),
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        >
                          {skill.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                          }}
                        >
                          {skill.level}%
                        </Typography>
                      </Box>
                      
                      <LinearProgress
                        variant="determinate"
                        value={skill.level}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: branding.gradients.skills,
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
