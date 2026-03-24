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
  SkillsHeader, 
  TechnicalSkills, 
  SoftSkills 
} from './SkillsSection/index';

interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  const { mode } = useCustomTheme();
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
        <SkillsHeader />
        <TechnicalSkills />
        <SoftSkills />
      </Container>
    </Box>
  );
}
