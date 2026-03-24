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
  AboutHeader, 
  AboutDescription, 
  AboutStats, 
  AboutInterests 
} from './AboutSection/index';

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  const { mode } = useCustomTheme();
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
        <AboutHeader />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 6,
            mb: 8,
          }}
        >
          {/* Left Column - Description */}
          <AboutDescription />

          {/* Right Column - Stats & Interests */}
          <Box>
            <AboutStats />
            <AboutInterests />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
