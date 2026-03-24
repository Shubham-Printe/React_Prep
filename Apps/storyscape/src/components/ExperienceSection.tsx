'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  Chip,
  Stack
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExperience, useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from './ParallaxBackground';
import { FloatingParticles } from './ParticleSystem';

interface ExperienceSectionProps {
  id: string;
}

export default function ExperienceSection({ id }: ExperienceSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const experience = useExperience();
  const branding = useBranding();
  const config = useConfig();

  // Don't render if section is disabled
  if (!config.sections.experience) {
    return null;
  }

  return (
    <Box id={id}
      sx={{
        py: { xs: 8, md: 12 },
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
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
        size={220}
        color={branding.gradients.experience}
        speed={0.2}
        position={{ top: '25%', right: '8%' }}
      />
      <ParallaxBlob
        size={160}
        color="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
        speed={0.3}
        position={{ bottom: '15%', left: '12%' }}
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
                background: branding.gradients.experience,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('experience.title')}
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
              {t('experience.subtitle')}
            </Typography>
          </motion.div>
        </Box>

        <Box id={id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: { xs: 20, md: 40 },
              top: 0,
              bottom: 0,
              width: 2,
              background: branding.gradients.experience,
              borderRadius: 1,
            },
          }}
        >
          {experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.title}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <Box id={id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 4,
                  position: 'relative',
                  pl: { xs: 6, md: 8 },
                }}
              >
                {/* Timeline Dot */}
                <Box id={id}
                  sx={{
                    position: 'absolute',
                    left: { xs: -6, md: -8 },
                    top: 8,
                    width: { xs: 12, md: 16 },
                    height: { xs: 12, md: 16 },
                    borderRadius: '50%',
                    background: branding.gradients.experience,
                    border: `4px solid ${mode === 'dark' ? '#0A0A0A' : '#F8FAFC'}`,
                    zIndex: 2,
                  }}
                />

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
                    width: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      {exp.title}
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {exp.company}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 400,
                        mb: 2,
                      }}
                    >
                      {exp.duration}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {exp.description}
                  </Typography>

                  {/* Achievements */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {t('experience.achievements.title')}
                    </Typography>
                    
                    <Stack spacing={1}>
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.3 + (index * 0.1) + (achievementIndex * 0.05),
                            ease: [0.25, 0.46, 0.45, 0.94] 
                          }}
                        >
                          <Box id={id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box id={id}
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: branding.gradients.experience,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.secondary',
                                lineHeight: 1.5,
                              }}
                            >
                              {achievement}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>

                  {/* Technologies */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {t('experience.technologies.title')}
                    </Typography>
                    
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {exp.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.4 + (index * 0.1) + (techIndex * 0.05),
                            ease: [0.25, 0.46, 0.45, 0.94] 
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
                          }}
                        >
                          <Chip
                            label={tech}
                            size="small"
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
                  </Box>
                </Card>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
