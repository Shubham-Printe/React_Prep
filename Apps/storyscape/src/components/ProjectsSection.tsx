'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProjects, useBranding, useConfig } from '@/hooks/usePortfolioData';
import AnimatedCard from './ui/AnimatedCard';
import AnimatedButton from './ui/AnimatedButton';
import { ParallaxBlob } from './ParallaxBackground';
import { FloatingParticles } from './ParticleSystem';

interface ProjectsSectionProps {
  id: string;
}

export default function ProjectsSection({ id }: ProjectsSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const projects = useProjects();
  const branding = useBranding();
  const config = useConfig();

  // Don't render if section is disabled
  if (!config.sections.projects) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return '#10B981';
      case 'in development':
        return '#F59E0B';
      case 'archived':
        return '#6B7280';
      default:
        return '#8B5CF6';
    }
  };

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
        size={250}
        color={branding.gradients.projects}
        speed={0.2}
        position={{ top: '15%', left: '5%' }}
      />
      <ParallaxBlob
        size={180}
        color="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
        speed={0.3}
        position={{ bottom: '20%', right: '10%' }}
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
                background: branding.gradients.projects,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('projects.title')}
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
              {t('projects.subtitle')}
            </Typography>
          </motion.div>
        </Box>

        <Box id={id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 6,
          }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
            >
              <AnimatedCard
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  },
                }}
                hoverScale={1.02}
                glowColor={branding.primaryColors[0]}
              >
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box id={id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </Typography>
                      
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(project.status),
                          color: '#F8FAFC',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    
                    <Chip
                      label={project.category}
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
                        mb: 2,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {project.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {t('projects.features')}
                    </Typography>
                    
                    <Stack spacing={1}>
                      {project.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.3 + (index * 0.1) + (featureIndex * 0.05),
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
                                background: branding.gradients.projects,
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
                              {feature}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {t('projects.technologies.title')}
                    </Typography>
                    
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {project.technologies.map((tech, techIndex) => (
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
                </CardContent>

                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ width: '100%' }}
                  >
                    {project.demoUrl && (
                      <AnimatedButton
                        variant="contained"
                        size="small"
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          flex: 1,
                          background: branding.gradients.projects,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                          },
                        }}
                        hoverScale={1.05}
                        rippleColor="rgba(255, 255, 255, 0.3)"
                      >
                        {t('projects.actions.liveDemo')}
                      </AnimatedButton>
                    )}
                    
                    {project.codeUrl && (
                      <AnimatedButton
                        variant="outlined"
                        size="small"
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          flex: 1,
                          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                          color: mode === 'dark' ? '#F1F5F9' : 'black',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          },
                        }}
                        hoverScale={1.05}
                        rippleColor={mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                      >
                        {t('projects.actions.code')}
                      </AnimatedButton>
                    )}
                  </Stack>
                </CardActions>
              </AnimatedCard>
            </motion.div>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <AnimatedButton
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                color: mode === 'dark' ? '#F1F5F9' : 'black',
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
              hoverScale={1.05}
              rippleColor={mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
            >
              {t('projects.actions.viewAll')}
            </AnimatedButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
