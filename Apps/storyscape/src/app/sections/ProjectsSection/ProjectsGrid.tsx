'use client';

import { Box } from '@mui/material';
import { useProjects } from '@/hooks/usePortfolioData';
import ProjectCard from './ProjectCard';

export default function ProjectsGrid() {
  const projects = useProjects();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 4,
        mb: 6,
      }}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.title} project={project} index={index} />
      ))}
    </Box>
  );
}
