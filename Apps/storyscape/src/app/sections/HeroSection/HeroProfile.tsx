'use client';

import { motion } from 'framer-motion';
import { Box, Avatar, Typography } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useBranding } from '@/hooks/usePortfolioData';

export default function HeroProfile() {
  const { mode } = useCustomTheme();
  const branding = useBranding();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 4,
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
          borderRadius: 4,
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Profile Picture */}
        <Avatar
          src="/profile-photo.jpeg" // Add your photo here
          alt="Profile Photo"
          sx={{
            width: { xs: 180, sm: 210, md: 240 }, // Increased by 50% from 120, 140, 160
            height: { xs: 180, sm: 210, md: 240 }, // Increased by 50% from 120, 140, 160
            mb: 3,
            border: `3px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: `0 8px 32px ${mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
            // Remove gradient background and emoji since we have a real photo
            background: 'transparent',
            '&::before': {
              display: 'none', // Hide the emoji
            },
            // Shift photo down by 10-15 pixels
            '& .MuiAvatar-img': {
              objectPosition: 'center 0px', // Adjust the 10px value as needed (10-15px)
            },
          }}
        />

        {/* Professional Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            background: `linear-gradient(135deg, ${branding.primaryColors[0]} 0%, ${branding.primaryColors[1]} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Senior Software Engineer
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
            maxWidth: 180,
            lineHeight: 1.5,
            fontSize: '0.875rem',
          }}
        >
          Crafting digital experiences with modern technologies
        </Typography>
      </Box>
    </motion.div>
  );
}
