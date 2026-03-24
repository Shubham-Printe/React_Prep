'use client';

import { portfolioData, PortfolioData } from '@/data/portfolioData';

export function usePortfolioData(): PortfolioData {
  // In the future, this could fetch from an API or localStorage
  // For now, we return the static data
  return portfolioData;
}

// Helper functions to get specific data
export function usePersonalInfo() {
  const data = usePortfolioData();
  return data.personal;
}

export function useContactInfo() {
  const data = usePortfolioData();
  return data.contact;
}

export function useStats() {
  const data = usePortfolioData();
  return data.stats;
}

export function useSkills() {
  const data = usePortfolioData();
  return data.skills;
}

export function useExperience() {
  const data = usePortfolioData();
  return data.experience;
}

export function useProjects() {
  const data = usePortfolioData();
  return data.projects;
}

export function useAboutInfo() {
  const data = usePortfolioData();
  return data.about;
}

export function useBranding() {
  const data = usePortfolioData();
  return data.branding;
}

export function useConfig() {
  const data = usePortfolioData();
  return data.config;
}
