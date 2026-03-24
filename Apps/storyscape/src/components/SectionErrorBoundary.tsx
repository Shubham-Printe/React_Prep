'use client';

import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ErrorBoundary from './ErrorBoundary';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  fallback?: React.ReactNode;
}

function SectionErrorFallback({ 
  resetError, 
  retry, 
  sectionName 
}: { 
  resetError: () => void; 
  retry: () => void; 
  sectionName: string; 
}) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        background: mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.02)',
        border: mode === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.05)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: 2,
        mx: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 2,
              fontWeight: 500,
            }}
          >
            {t('error.sectionError').replace('{section}', sectionName)}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'text.disabled',
              mb: 3,
            }}
          >
            {t('error.sectionMessage')}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              size="small"
              onClick={retry}
              sx={{
                textTransform: 'none',
                px: 3,
              }}
            >
              {t('error.retry')}
            </Button>
            
            <Button
              variant="text"
              size="small"
              onClick={resetError}
              sx={{
                textTransform: 'none',
                px: 3,
              }}
            >
              {t('error.dismiss')}
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Box>
  );
}

export default function SectionErrorBoundary({ 
  children, 
  sectionName, 
  fallback 
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackComponent={({ resetError, retry }) => (
        <SectionErrorFallback
          resetError={resetError}
          retry={retry}
          sectionName={sectionName}
        />
      )}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}
