'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from '@/components/effects';
import { FloatingParticles } from '@/components/effects';
import { 
  ExperienceHeader, 
  ExperienceTimeline 
} from './ExperienceSection/index';

interface ExperienceSectionProps {
  id: string;
}

export default function ExperienceSection({ id }: ExperienceSectionProps) {
  const { mode } = useCustomTheme();
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
        <ExperienceHeader />
        <ExperienceTimeline />
      </Container>
    </Box>
  );
}
