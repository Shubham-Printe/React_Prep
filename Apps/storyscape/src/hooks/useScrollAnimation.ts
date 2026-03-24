'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring, useInView } from 'framer-motion';

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
      setIsScrolling(true);
      
      // Reset scrolling state after a delay
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  return { scrollY, scrollDirection, isScrolling };
}

export function useParallax(offset = 50) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -offset]);
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return springY;
}

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return { scrollYProgress, scaleX };
}

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold, 
    once: true,
    margin: '-100px 0px -100px 0px'
  });

  return { ref, isInView };
}

export function useScrollCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useScrollReveal();

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration]);

  return { ref, count };
}

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const updateVelocity = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime > 0) {
        setVelocity(Math.abs(deltaY / deltaTime));
      }
      
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener('scroll', updateVelocity, { passive: true });
    return () => window.removeEventListener('scroll', updateVelocity);
  }, []);

  return velocity;
}

export function useScrollSnap(snapPoints: number[]) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const updateSnapPoint = () => {
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const closestSnapPoint = snapPoints.reduce((closest, point, index) => {
        const distance = Math.abs(currentScroll - (point * windowHeight));
        const closestDistance = Math.abs(currentScroll - (snapPoints[closest] * windowHeight));
        return distance < closestDistance ? index : closest;
      }, 0);
      
      setCurrentSnapPoint(closestSnapPoint);
    };

    window.addEventListener('scroll', updateSnapPoint, { passive: true });
    return () => window.removeEventListener('scroll', updateSnapPoint);
  }, [snapPoints]);

  return currentSnapPoint;
}
