'use client';

import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onError?: (error: Error, context?: string) => void;
  fallbackMessage?: string;
  logError?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { onError, logError = true } = options;

  const handleError = useCallback((error: Error, context?: string) => {
    if (logError) {
      console.error(`Error in ${context || 'unknown context'}:`, error);
    }

    if (onError) {
      onError(error, context);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to error reporting service
      // errorReportingService.captureException(error, { context });
    }
  }, [onError, logError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  const withErrorHandling = useCallback(<T extends unknown[], R>(
    fn: (...args: T) => R,
    context?: string
  ) => {
    return (...args: T): R | null => {
      try {
        return fn(...args);
      } catch (error) {
        handleError(error as Error, context);
        return null;
      }
    };
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    withErrorHandling,
  };
}
