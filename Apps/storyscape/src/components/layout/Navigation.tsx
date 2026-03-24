'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactInfo, useConfig, usePersonalInfo } from '@/hooks/usePortfolioData';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { EnhancedThemeToggle } from '../common';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navigation() {
  const { t } = useLanguage();
  const { mode } = useCustomTheme();
  const contact = useContactInfo();
  const config = useConfig();
  const personal = usePersonalInfo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: t('navigation.home'), icon: <HomeIcon /> },
    { id: 'about', label: t('navigation.about'), icon: <PersonIcon /> },
    { id: 'experience', label: t('navigation.experience'), icon: <WorkIcon /> },
    { id: 'skills', label: t('navigation.skills'), icon: <CodeIcon /> },
    { id: 'projects', label: t('navigation.projects'), icon: <FolderIcon /> },
    { id: 'contact', label: t('navigation.contact'), icon: <EmailIcon /> },
  ].filter(section => config.sections[section.id as keyof typeof config.sections]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
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
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  // NEW: Simple and reliable scroll function for mobile
  const scrollToSection = (sectionId: string) => {
    console.log('Scrolling to section:', sectionId);
    
    // Close mobile menu first
    setMobileMenuOpen(false);
    
    // Wait for menu to close, then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      console.log('Element found:', element);
      
      if (element) {
        // Get the element's position relative to the viewport
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        // Calculate offset for mobile (smaller header on mobile)
        const offset = window.innerWidth < 768 ? 60 : 80;
        const targetPosition = elementTop - offset;
        
        console.log('Scrolling to position:', targetPosition);
        
        // Use scrollTo with smooth behavior
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      } else {
        console.error('Section element not found:', sectionId);
      }
    }, 200); // Longer delay to ensure menu closes
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            background: scrolled 
              ? (mode === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)')
              : (mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
            backdropFilter: 'blur(20px)',
            borderBottom: scrolled 
              ? (mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)')
              : (mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
            transition: 'all 0.3s ease',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ 
            justifyContent: 'space-between',
            py: 1,
            minHeight: { xs: 64, sm: 72 },
          }}>
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    border: '2px solid transparent',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    padding: '2px',
                  }}
                >
                  {personal.avatar ? (
                    <Box
                      component="img"
                      src={personal.avatar}
                      alt={`${personal.name} Profile`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: '#F8FAFC',
                          fontSize: '1.2rem',
                        }}
                      >
                        {personal.initials}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {t('navigation.portfolio')}
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 1,
              opacity: scrolled ? 0.7 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              {sections.slice(0, 3).map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                >
                  <Chip
                    label={section.label}
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      background: activeSection === section.id 
                        ? (mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)')
                        : 'transparent',
                      color: activeSection === section.id 
                        ? (mode === 'dark' ? '#8B5CF6' : '#2563EB')
                        : (mode === 'dark' ? 'white' : '#111827'),
                      border: activeSection === section.id
                        ? (mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(37, 99, 235, 0.3)')
                        : (mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)'),
                      '&:hover': {
                        background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                        borderColor: mode === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(37, 99, 235, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Social Links */}
              <Box sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                gap: 1,
                opacity: scrolled ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                {contact.socialLinks?.github && (
                  <IconButton
                    href={contact.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: mode === 'dark' ? '#F1F5F9' : '#111827',
                      '&:hover': {
                        background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                )}
                
                {contact.socialLinks?.linkedin && (
                  <IconButton
                    href={contact.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: mode === 'dark' ? '#F1F5F9' : '#111827',
                      '&:hover': {
                        background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Resume Download */}
              {contact.resumeUrl && (
                <IconButton
                  href={contact.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: mode === 'dark' ? '#F1F5F9' : '#111827',
                    background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                    border: mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.2)',
                    '&:hover': {
                      background: mode === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              )}

              {/* Theme Toggle */}
              <EnhancedThemeToggle />

              {/* Mobile Menu Button */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  color: mode === 'dark' ? '#F1F5F9' : '#111827',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* NEW: Simplified Mobile Menu using Drawer */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            top: '64px', // Position below the header
            height: 'calc(100vh - 64px)',
            background: mode === 'dark' 
              ? 'rgba(15, 15, 15, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.3)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Navigation Items */}
          <List>
            {sections.map((section) => (
              <ListItem key={section.id} disablePadding>
                <ListItemButton
                  onClick={() => scrollToSection(section.id)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    mb: 1,
                    background: activeSection === section.id 
                      ? (mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)')
                      : 'transparent',
                    '&:hover': {
                      background: mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeSection === section.id 
                      ? (mode === 'dark' ? '#8B5CF6' : '#2563EB')
                      : (mode === 'dark' ? 'white' : '#111827'), 
                    minWidth: 40 
                  }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={section.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: activeSection === section.id 
                          ? (mode === 'dark' ? '#8B5CF6' : '#2563EB')
                          : (mode === 'dark' ? 'white' : '#111827'),
                        fontWeight: activeSection === section.id ? 600 : 500,
                        fontSize: '1.1rem',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ 
            borderColor: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
            my: 2,
          }} />
          
          {/* Mobile Social Links */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {contact.socialLinks?.github && (
              <IconButton
                href={contact.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: mode === 'dark' ? '#F1F5F9' : '#111827',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
            )}
            {contact.socialLinks?.linkedin && (
              <IconButton
                href={contact.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: mode === 'dark' ? '#F1F5F9' : '#111827',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            )}
            {contact.resumeUrl && (
              <IconButton
                href={contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: mode === 'dark' ? '#F1F5F9' : '#111827',
                  background: mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                  border: mode === 'dark' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(37, 99, 235, 0.2)',
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
