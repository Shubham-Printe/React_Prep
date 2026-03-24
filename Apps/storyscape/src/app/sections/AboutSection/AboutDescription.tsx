'use client';

import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useAboutInfo } from '@/hooks/usePortfolioData';

export default function AboutDescription() {
  const about = useAboutInfo();

  return (
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
  );
}
