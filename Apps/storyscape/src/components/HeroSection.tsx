'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Chip
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePersonalInfo, useStats, useSkills, useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from './ParallaxBackground';
import { InteractiveParticles } from './ParticleSystem';
import AnimatedButton from './ui/AnimatedButton';

interface HeroSectionProps {
  id: string;
}

export default function HeroSection({ id }: HeroSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const personal = usePersonalInfo();
  const stats = useStats();
  const skills = useSkills();
  const branding = useBranding();
  const config = useConfig();

  return (
    <Box
      id={id}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
      }}
    >
      {/* Background Elements */}
      <ParallaxBlob
        size={400}
        color="rgba(139, 92, 246, 0.23)" // Increased from 0.15 to 0.23 (50% increase)
        speed={0.2}
        position={{ top: '10%', right: '10%' }}
      />
      <ParallaxBlob
        size={300}
        color="rgba(236, 72, 153, 0.18)" // Increased from 0.12 to 0.18 (50% increase)
        speed={0.15}
        position={{ bottom: '20%', left: '5%' }}
      />

      {/* Interactive Particles */}
      {config.showParticles && (
        <InteractiveParticles count={12} className="hero-particles" />
      )}

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 6,
            alignItems: 'center',
            minHeight: '100vh',
            py: 8,
          }}
        >
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Box sx={{ mb: 4 }}>
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
                    background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('hero.greeting').replace('{name}', personal.name)}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.5rem', sm: '2rem', lg: '2.5rem' },
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#111827',
                    mb: 3,
                  }}
                >
                  {personal.title}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                    mb: 4,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                  }}
                >
                  {personal.subtitle}
                </Typography>
              </motion.div>

              {/* Quick Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4 }}>
                  {skills.quick.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
                    >
                      <Chip
                        label={skill}
                        variant="outlined"
                        sx={{
                          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#D1D5DB',
                          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#111827',
                          '&:hover': {
                            borderColor: branding.primaryColors[0],
                            color: branding.primaryColors[0],
                          },
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
            </Box>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,
                p: 4,
                background: mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.05)',
                borderRadius: 4,
                border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              {Object.entries(stats).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 + (index * 0.1) }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {t(`hero.stats.${key}`)}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
