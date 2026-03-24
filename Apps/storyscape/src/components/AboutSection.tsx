'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAboutInfo, useStats, useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from './ParallaxBackground';
import { FloatingParticles } from './ParticleSystem';

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const about = useAboutInfo();
  const stats = useStats();
  const branding = useBranding();
  const config = useConfig();

  // Don't render if section is disabled
  if (!config.sections.about) {
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
        size={180}
        color={branding.gradients.about}
        speed={0.2}
        position={{ top: '15%', right: '10%' }}
      />
      <ParallaxBlob
        size={120}
        color="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
        speed={0.3}
        position={{ bottom: '20%', left: '5%' }}
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
                background: branding.gradients.about,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('about.title')}
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
              {t('about.subtitle')}
            </Typography>
          </motion.div>
        </Box>

        <Box id={id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 6,
            mb: 8,
          }}
        >
          {/* Left Column - Description */}
          <Box>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {about.sectionTitle}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.7,
                }}
              >
                {about.description1}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  color: 'text.secondary',
                  lineHeight: 1.7,
                }}
              >
                {about.description2}
              </Typography>
            </motion.div>
          </Box>

          {/* Right Column - Stats & Interests */}
          <Box>
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
                  mb: 4,
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
                    {t('about.stats.title')}
                  </Typography>
                  
                  <Box id={id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 3,
                    }}
                  >
                    {[
                      { value: stats.projects, label: t('about.stats.projects') },
                      { value: stats.years, label: t('about.stats.years') },
                      { value: stats.satisfaction, label: t('about.stats.satisfaction') },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.4 + (index * 0.1),
                          ease: [0.25, 0.46, 0.45, 0.94] 
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              background: branding.gradients.about,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              mb: 0.5,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>

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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
