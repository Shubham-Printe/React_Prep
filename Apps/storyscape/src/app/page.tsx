'use client';

import { Suspense } from 'react';
import { Box } from '@mui/material';
import { Navigation, SidebarNavigation, Footer } from '@/components/layout';
import { ParticleSystem, EnhancedScrollProgress } from '@/components/effects';
import { ErrorBoundary, LoadingSpinner, SectionErrorBoundary } from '@/components/common';
import { 
  HeroSection, 
  AboutSection, 
  ExperienceSection, 
  SkillsSection, 
  ProjectsSection, 
  ContactSection 
} from './sections';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Home() {
  const { config } = usePortfolioData();

  return (
    <ErrorBoundary fallbackComponent={({ resetError, retry }) => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 4,
          textAlign: 'center',
        }}
      >
        <h1>Something went wrong</h1>
        <p>We&apos;re sorry, but something unexpected happened.</p>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <button onClick={resetError}>Reset</button>
          <button onClick={retry}>Retry</button>
        </Box>
      </Box>
    )}>
      <Suspense fallback={<LoadingSpinner />}>
        <Navigation />
        <SidebarNavigation />
        <EnhancedScrollProgress />
        
        {config.sections.hero && (
          <SectionErrorBoundary sectionName="hero">
            <HeroSection id="hero" />
          </SectionErrorBoundary>
        )}
        
        {config.sections.about && (
          <SectionErrorBoundary sectionName="about">
            <AboutSection id="about" />
          </SectionErrorBoundary>
        )}
        
        {config.sections.experience && (
          <SectionErrorBoundary sectionName="experience">
            <ExperienceSection id="experience" />
          </SectionErrorBoundary>
        )}
        
        {config.sections.skills && (
          <SectionErrorBoundary sectionName="skills">
            <SkillsSection id="skills" />
          </SectionErrorBoundary>
        )}
        
        {config.sections.projects && (
          <SectionErrorBoundary sectionName="projects">
            <ProjectsSection id="projects" />
          </SectionErrorBoundary>
        )}
        
        {config.sections.contact && (
          <SectionErrorBoundary sectionName="contact">
            <ContactSection id="contact" />
          </SectionErrorBoundary>
        )}
        
        {config.showParticles && <ParticleSystem />}
        <Footer id="footer" />
      </Suspense>
    </ErrorBoundary>
  );
}
