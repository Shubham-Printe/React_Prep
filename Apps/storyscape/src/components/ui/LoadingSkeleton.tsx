'use client';

import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'shimmer';
  count?: number;
  spacing?: number;
}

export default function LoadingSkeleton({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  animation = 'shimmer',
  count = 1,
  spacing = 1,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      animate={animation === 'shimmer' ? {
        background: [
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
        ],
        backgroundSize: '200% 100%',
      } : undefined}
      transition={animation === 'shimmer' ? {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      } : undefined}
      style={{ marginBottom: index < count - 1 ? spacing * 8 : 0 }}
    >
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        animation={animation === 'shimmer' ? false : animation}
        sx={{
          borderRadius: variant === 'circular' ? '50%' : 1,
          ...(animation === 'shimmer' && {
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
          }),
        }}
      />
    </motion.div>
  ));

  return <Box>{skeletons}</Box>;
}

// Predefined skeleton layouts
export function CardSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <LoadingSkeleton variant="rectangular" height={200} animation="shimmer" />
      <Box sx={{ mt: 2 }}>
        <LoadingSkeleton variant="text" width="80%" height={24} animation="shimmer" />
        <LoadingSkeleton variant="text" width="60%" height={20} animation="shimmer" />
        <LoadingSkeleton variant="text" width="100%" height={16} count={3} animation="shimmer" />
      </Box>
    </Box>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <LoadingSkeleton variant="rectangular" width={80} height={24} animation="shimmer" />
        <LoadingSkeleton variant="rectangular" width={60} height={24} animation="shimmer" />
      </Box>
      <LoadingSkeleton variant="text" width="90%" height={28} animation="shimmer" />
      <LoadingSkeleton variant="text" width="100%" height={16} count={4} animation="shimmer" />
      <Box sx={{ mt: 3 }}>
        <LoadingSkeleton variant="rectangular" width="100%" height={32} count={2} animation="shimmer" />
      </Box>
    </Box>
  );
}

export function ProfileSkeleton() {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <LoadingSkeleton variant="circular" width={200} height={200} animation="shimmer" />
      <Box sx={{ mt: 3 }}>
        <LoadingSkeleton variant="text" width="60%" height={32} animation="shimmer" />
        <LoadingSkeleton variant="text" width="40%" height={24} animation="shimmer" />
        <LoadingSkeleton variant="text" width="100%" height={16} count={3} animation="shimmer" />
      </Box>
    </Box>
  );
}
