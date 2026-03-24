'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkills, useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from './ParallaxBackground';
import { FloatingParticles } from './ParticleSystem';

interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const skills = useSkills();
  const branding = useBranding();
  const config = useConfig();

  // Don't render if section is disabled
  if (!config.sections.skills) {
    return null;
  }

  return (
    <Box id={id}
      sx={{
        py: { xs: 8, md: 12 },
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)'
          : 'linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Particles */}
      {config.showParticles && (
        <FloatingParticles count={8} />
      )}
      
      {/* Parallax Background Elements */}
      <ParallaxBlob
        size={200}
        color={branding.gradients.skills}
        speed={0.2}
        position={{ top: '20%', left: '10%' }}
      />
      <ParallaxBlob
        size={150}
        color="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
        speed={0.3}
        position={{ bottom: '30%', right: '15%' }}
      />

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 700,
                background: branding.gradients.skills,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('skills.title')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {t('skills.subtitle')}
            </Typography>
          </motion.div>
        </Box>

        {/* Technical Skills */}
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

          <Box id={id}
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
                          <Box id={id}
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

        {/* Soft Skills */}
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
      </Container>
    </Box>
  );
}
