'use client';

import { motion } from 'framer-motion';
import { Box, Typography, CardContent, CardActions, Chip, Stack } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBranding } from '@/hooks/usePortfolioData';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface ProjectCardProps {
  project: {
    title: string;
    status: string;
    category: string;
    description: string;
    features: string[];
    technologies: string[];
    demoUrl?: string;
    codeUrl?: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const branding = useBranding();

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
            <Box
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
              {project.features.slice(0, 7).map((feature, featureIndex) => (
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: branding.gradients.projects,
                        flexShrink: 0,
                        mt: '0.5em', // Position bullet in the middle of the first line (half of line-height)
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
  );
}
