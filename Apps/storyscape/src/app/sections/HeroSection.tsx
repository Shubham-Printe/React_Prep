'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container
} from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useBranding, useConfig } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from '@/components/effects';
import { InteractiveParticles } from '@/components/effects';
import { 
  HeroBadge, 
  HeroTitle, 
  HeroSubtitle, 
  HeroSkills, 
  HeroActions, 
  HeroStats, 
  HeroProfile 
} from './HeroSection/index';

interface HeroSectionProps {
  id: string;
}

export default function HeroSection({ id }: HeroSectionProps) {
  const { mode } = useCustomTheme();
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
        overflow: 'visible',
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
            py: { xs: 12, sm: 10, md: 8 },
            pt: { xs: 20, sm: 18, md: 16 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Box sx={{ 
              mb: 4, 
              position: 'relative', 
              zIndex: 10, 
              mt: 2,
              // Center align content for mobile and tablet
              textAlign: { xs: 'center', lg: 'left' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', lg: 'flex-start' },
              // Add extra padding to accommodate button hover effects
              '& .MuiStack-root': {
                overflow: 'visible',
              }
            }}>
              {/* <HeroBadge /> */}
              <HeroTitle />
              <HeroSubtitle />
              <HeroSkills />
              <HeroActions />
            </Box>
          </motion.div>

          {/* Right Column - Profile Picture and Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
                mt: 2,
              }}
            >
              {/* Profile Picture */}
              <HeroProfile />
              
              {/* Stats */}
              <HeroStats />
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
