'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { createAppTheme } from '@/theme/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const theme = createAppTheme(mode);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
