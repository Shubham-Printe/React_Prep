'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
  retry: () => void;
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError, retry }: ErrorFallbackProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        p: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 6,
              borderRadius: 3,
              background: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'error.main',
                mb: 2,
                background: 'linear-gradient(135deg, #f44336 0%, #ff5722 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('error.title')}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {t('error.message')}
            </Typography>

            {process.env.NODE_ENV === 'development' && error && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 2,
                  background: mode === 'dark' 
                    ? 'rgba(244, 67, 54, 0.1)'
                    : 'rgba(244, 67, 54, 0.05)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)'}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    color: 'error.main',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.message}
                </Typography>
                {error.stack && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      display: 'block',
                      mt: 2,
                    }}
                  >
                    {error.stack}
                  </Typography>
                )}
              </Box>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 4, justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                onClick={retry}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  },
                }}
              >
                {t('error.retry')}
              </Button>
              
              <Button
                variant="outlined"
                onClick={resetError}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                  color: mode === 'dark' ? '#F1F5F9' : 'black',
                  '&:hover': {
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                    backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                {t('error.reset')}
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would typically send the error to a service like Sentry, LogRocket, etc.
      console.error('Production error:', error);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetKeys.length > 0) {
        this.resetError();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 100);
  };

  retry = () => {
    this.resetError();
    // Force a re-render by updating a dummy state
    this.forceUpdate();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, fallbackComponent: FallbackComponent } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            resetError={this.resetError}
            retry={this.retry}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={error}
          resetError={this.resetError}
          retry={this.retry}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
