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

export default function ParticleSystem({
  particleCount = 10,
  mouseInteraction = true,
  colors = [
    'rgba(139, 92, 246, 0.6)',
    'rgba(236, 72, 153, 0.6)',
    'rgba(59, 130, 246, 0.6)',
    'rgba(6, 182, 212, 0.6)',
    'rgba(34, 197, 94, 0.6)',
  ],
  size = { min: 2, max: 6 },
  speed = { min: 0.3, max: 1.2 },
  className = ''
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { mode } = useCustomTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { handleError } = useErrorHandler();

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
      opacity: Math.random() * 0.4 + 0.4, // Good visibility
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 500 + 400, // Longer life
    };
  }, [colors, size, speed]);

  // Update particle position
  const updateParticle = useCallback((particle: Particle): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return particle;

    // Mouse interaction with moderate effect
    if (mouseInteraction) {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150; // Moderate interaction range
      const force = Math.max(0, (maxDistance - distance) / maxDistance);
      
      if (distance < maxDistance) {
        // Moderate attraction/repulsion
        const attraction = force * 0.2;
        particle.vx += (dx / distance) * attraction;
        particle.vy += (dy / distance) * attraction;
        
        // Moderate size change
        particle.size = particle.originalSize * (1 + force * 0.8);
      } else {
        particle.size = particle.originalSize;
      }
    }

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Bounce off edges with moderate energy
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -0.7;
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -0.7;
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    }

    // Fade out over time
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = (1 - lifeRatio) * 0.4 + 0.4;

    return particle;
  }, [mouseInteraction]);

  // Draw particle with good visibility
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    try {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // Moderate glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = particle.color;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Subtle inner core
      ctx.shadowBlur = 0;
      ctx.globalAlpha = particle.opacity * 1.1;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      // Connection lines
      if (mouseInteraction) {
        particlesRef.current.forEach(otherParticle => {
          if (otherParticle.id !== particle.id) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.globalAlpha = (1 - distance / 100) * 0.2;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      }
      
      ctx.restore();
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.drawParticle');
    }
  }, [mouseInteraction, handleError]);

  // Animation loop
  const animate = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current
        .map(updateParticle)
        .filter(particle => particle.life < particle.maxLife);

      // Add new particles if needed
      while (particlesRef.current.length < particleCount) {
        particlesRef.current.push(createParticle(Date.now() + Math.random()));
      }

      // Draw all particles
      particlesRef.current.forEach(particle => drawParticle(ctx, particle));

      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.animate');
      setHasError(true);
    }
  }, [particleCount, createParticle, updateParticle, drawParticle, handleError]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    } catch (error) {
      handleError(error as Error, 'ParticleSystem.handleMouseMove');
    }
  }, [handleError]);

  // Handle resize
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

  // Initialize particles
  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Set canvas size to full viewport
      const updateCanvasSize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };

      updateCanvasSize();

      // Initialize particles
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(i));

      // Start animation
      setIsVisible(true);
      animationRef.current = requestAnimationFrame(animate);

      // Add event listeners
      if (mouseInteraction) {
        window.addEventListener('mousemove', handleMouseMove);
      }
      window.addEventListener('resize', handleResize);

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
  }, [particleCount, mouseInteraction, createParticle, animate, handleMouseMove, handleResize, handleError]);

  // Don't render if there's an error
  if (hasError) {
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
  count = 8, 
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  const { mode } = useCustomTheme();
  
  const colors = mode === 'dark' 
    ? [
        'rgba(139, 92, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(6, 182, 212, 0.5)',
      ]
    : [
        'rgba(139, 92, 246, 0.4)',
        'rgba(236, 72, 153, 0.4)',
        'rgba(59, 130, 246, 0.4)',
        'rgba(6, 182, 212, 0.4)',
      ];

  return (
    <ParticleSystem
      particleCount={count}
      mouseInteraction={false}
      colors={colors}
      size={{ min: 2, max: 5 }}
      speed={{ min: 0.2, max: 0.8 }}
      className={className}
    />
  );
}

// Interactive particles for hero section
export function InteractiveParticles({ 
  count = 12, 
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  const { mode } = useCustomTheme();
  
  const colors = mode === 'dark' 
    ? [
        'rgba(139, 92, 246, 0.6)',
        'rgba(236, 72, 153, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(6, 182, 212, 0.6)',
        'rgba(34, 197, 94, 0.6)',
      ]
    : [
        'rgba(139, 92, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)',
        'rgba(59, 130, 246, 0.5)',
        'rgba(6, 182, 212, 0.5)',
        'rgba(34, 197, 94, 0.5)',
      ];

  return (
    <ParticleSystem
      particleCount={count}
      mouseInteraction={true}
      colors={colors}
      size={{ min: 2, max: 6 }}
      speed={{ min: 0.3, max: 1.2 }}
      className={className}
    />
  );
}
