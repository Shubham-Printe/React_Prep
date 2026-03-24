'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Stack
} from '@mui/material';
import { 
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Email as EmailIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfig } from '@/hooks/usePortfolioData';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';

const sectionsConfig = [
  { id: 'hero', labelKey: 'navigation.home', icon: HomeIcon },
  { id: 'about', labelKey: 'navigation.about', icon: PersonIcon },
  { id: 'experience', labelKey: 'navigation.experience', icon: WorkIcon },
  { id: 'skills', labelKey: 'navigation.skills', icon: CodeIcon },
  { id: 'projects', labelKey: 'navigation.projects', icon: FolderIcon },
  { id: 'contact', labelKey: 'navigation.contact', icon: EmailIcon },
];

export default function SidebarNavigation() {
  const { t } = useLanguage();
  const { mode } = useCustomTheme();
  const config = useConfig();
  const [activeSection, setActiveSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sections = sectionsConfig.filter(section => 
    config.sections[section.id as keyof typeof config.sections]
  );

  // Show sidebar after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 150);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Scroll to the element with offset for fixed header
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 80; // Account for header height
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Box
            sx={{
              position: 'fixed',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              display: { xs: 'none', lg: 'block' },
            }}
          >
            <Box
              sx={{
                background: mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.9)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '0 20px 20px 0',
                border: `1px solid ${mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.2)'}`,
                borderLeft: 'none',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                width: isExpanded ? 220 : 70,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              }}
            >
              {/* Toggle Button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 1.5,
                  borderBottom: `1px solid ${mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)'}`,
                }}
              >
                <IconButton
                  onClick={toggleExpanded}
                  size="small"
                  sx={{
                    color: mode === 'dark' ? '#F1F5F9' : 'black',
                    '&:hover': {
                      background: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {isExpanded ? <ArrowLeftIcon /> : <ArrowRightIcon />}
                </IconButton>
              </Box>

              {/* Navigation Items */}
              <Stack spacing={0.5} sx={{ p: 1 }}>
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1 
                      }}
                    >
                      <Tooltip 
                        title={t(section.labelKey)} 
                        placement="right"
                        disableHoverListener={isExpanded}
                      >
                        <Box
                          onClick={() => scrollToSection(section.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            background: isActive 
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                              : 'transparent',
                            border: isActive 
                              ? '1px solid rgba(139, 92, 246, 0.3)'
                              : '1px solid transparent',
                            color: isActive 
                              ? '#8B5CF6'
                              : (mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              background: isActive 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)'
                                : (mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.1)' 
                                  : 'rgba(0, 0, 0, 0.1)'),
                              transform: 'translateX(4px)',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: isActive ? '4px' : '0px',
                              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                              borderRadius: '0 2px 2px 0',
                              transition: 'width 0.3s ease',
                            },
                          }}
                        >
                          <IconComponent 
                            sx={{ 
                              fontSize: 24, 
                              mr: isExpanded ? 2 : 0,
                              minWidth: 24,
                            }} 
                          />
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isActive ? 600 : 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {t(section.labelKey)}
                                </Typography>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Box>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </Stack>

              {/* Progress Indicator */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)'}`,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 4,
                    background: mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      borderRadius: 2,
                    }}
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </Box>
                {isExpanded && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      mt: 1,
                      color: mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.6)' 
                        : 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {sections.findIndex(s => s.id === activeSection) + 1} / {sections.length}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
