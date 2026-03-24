'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  originalSize: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  mouseInteraction?: boolean;
  colors?: string[];
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  className?: string;
}

// Performance detection utilities
const detectLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }
  
  // Check hardware capabilities
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  
  // Much more reasonable low-end device detection
  return cores <= 1 || memory <= 1 || 
         (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) || false;
};

const getOptimalSettings = () => {
  const isLowEnd = detectLowEndDevice();
  
  return {
    targetFPS: isLowEnd ? 20 : 30,
    particleCount: isLowEnd ? 10 : 30, // Increased by 10x: 1 -> 10, 3 -> 30
    enableMouseInteraction: !isLowEnd,
    enableAnimations: true,
  };
};

export default function ParticleSystem({
  particleCount = 30, // Increased from 3 to 30
  mouseInteraction = true,
  colors = [
    'rgba(139, 92, 246, 0.3)',
    'rgba(236, 72, 153, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(6, 182, 212, 0.3)',
    'rgba(34, 197, 94, 0.3)',
  ],
  size = { min: 1, max: 3 },
  speed = { min: 0.2, max: 0.8 },
  className = ''
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastFrameTimeRef = useRef<number>(0);
  const { mode } = useCustomTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { handleError } = useErrorHandler();

  // Performance settings
  const performanceSettings = getOptimalSettings();
  const actualParticleCount = Math.min(particleCount, performanceSettings.particleCount);
  const actualMouseInteraction = mouseInteraction && performanceSettings.enableMouseInteraction;
  const targetFPS = performanceSettings.targetFPS;
  const frameInterval = 1000 / targetFPS;

  // Generate random particle
  const createParticle = useCallback((id: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const particleSize = Math.random() * (size.max - size.min) + size.min;
    return {
      id,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
      vy: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
      size: particleSize,
      originalSize: particleSize,
      opacity: Math.random() * 0.4 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 500 + 400,
    };
  }, [colors, size, speed]);

  // Update particle position
  const updateParticle = useCallback((particle: Particle): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return particle;

    // Mouse interaction with reduced calculations
    if (actualMouseInteraction) {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 120; // Reduced interaction range
      const force = Math.max(0, (maxDistance - distance) / maxDistance);
      
      if (distance < maxDistance) {
        const attraction = force * 0.15; // Reduced force
        particle.vx += (dx / distance) * attraction;
        particle.vy += (dy / distance) * attraction;
        particle.size = particle.originalSize * (1 + force * 0.6);
      } else {
        particle.size = particle.originalSize;
      }
    }

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Bounce off edges with reduced energy
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -0.6;
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -0.6;
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    }

    // Fade out over time
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = (1 - lifeRatio) * 0.4 + 0.4;

    return particle;
  }, [actualMouseInteraction]);

  // Draw particle with optimized rendering
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    try {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Reduced glow effect for better performance
      ctx.shadowBlur = 8;
      ctx.shadowColor = particle.color;
      
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.drawParticle');
    }
  }, [handleError]);

  // Optimized animation loop with frame rate limiting
  const animate = useCallback((currentTime: number) => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Frame rate limiting
      if (currentTime - lastFrameTimeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current
        .map(updateParticle)
        .filter(particle => particle.life < particle.maxLife);

      // Add new particles if needed
      while (particlesRef.current.length < actualParticleCount) {
        particlesRef.current.push(createParticle(Date.now() + Math.random()));
      }

      // Draw all particles
      particlesRef.current.forEach(particle => drawParticle(ctx, particle));

      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.animate');
      setHasError(true);
    }
  }, [actualParticleCount, createParticle, updateParticle, drawParticle, handleError, frameInterval]);

  // Handle mouse movement with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !actualMouseInteraction) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.handleMouseMove');
    }
  }, [actualMouseInteraction, handleError]);

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.handleResize');
    }
  }, [handleError]);

  // Initialize particles with performance checks
  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Skip initialization on low-end devices if animations are disabled
      if (!performanceSettings.enableAnimations) {
        return;
      }

      // Set canvas size to full viewport
      const updateCanvasSize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };

      updateCanvasSize();

      // Initialize particles
      particlesRef.current = Array.from({ length: actualParticleCount }, (_, i) => createParticle(i));

      // Start animation
      setIsVisible(true);
      animationRef.current = requestAnimationFrame(animate);

      // Add event listeners
      if (actualMouseInteraction) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
      }
      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.initialize');
      setHasError(true);
    }
  }, [actualParticleCount, actualMouseInteraction, createParticle, animate, handleMouseMove, handleResize, handleError, performanceSettings.enableAnimations]);

  // Don't render if there's an error or animations are disabled
  if (hasError || !performanceSettings.enableAnimations) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        zIndex: 1,
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
        }}
      />
    </motion.div>
  );
}

// Floating particles for specific sections
export function FloatingParticles({ 
  count = 20, // Increased from 2 to 20 (10x)
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  const { mode } = useCustomTheme();
  
  const colors = mode === 'dark' 
    ? [
        'rgba(139, 92, 246, 0.2)', // Reduced opacity
        'rgba(236, 72, 153, 0.2)',
        'rgba(59, 130, 246, 0.2)',
        'rgba(6, 182, 212, 0.2)',
      ]
    : [
        'rgba(139, 92, 246, 0.15)', // Even more subtle in light mode
        'rgba(236, 72, 153, 0.15)',
        'rgba(59, 130, 246, 0.15)',
        'rgba(6, 182, 212, 0.15)',
      ];

  return (
    <ParticleSystem
      particleCount={count}
      mouseInteraction={false}
      colors={colors}
      size={{ min: 1, max: 2 }} // Smaller particles
      speed={{ min: 0.1, max: 0.4 }} // Slower movement
      className={className}
    />
  );
}

// Interactive particles for hero section
export function InteractiveParticles({ 
  count = 40, // Increased from 4 to 40 (10x)
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  const { mode } = useCustomTheme();
  
  const colors = mode === 'dark' 
    ? [
        'rgba(139, 92, 246, 0.4)', // Reduced opacity
        'rgba(236, 72, 153, 0.4)',
        'rgba(59, 130, 246, 0.4)',
        'rgba(6, 182, 212, 0.4)',
        'rgba(34, 197, 94, 0.4)',
      ]
    : [
        'rgba(139, 92, 246, 0.3)',
        'rgba(236, 72, 153, 0.3)',
        'rgba(59, 130, 246, 0.3)',
        'rgba(6, 182, 212, 0.3)',
        'rgba(34, 197, 94, 0.3)',
      ];

  return (
    <ParticleSystem
      particleCount={count}
      mouseInteraction={true}
      colors={colors}
      size={{ min: 1, max: 4 }} // Smaller particles
      speed={{ min: 0.2, max: 0.8 }} // Slower movement
      className={className}
    />
  );
}
