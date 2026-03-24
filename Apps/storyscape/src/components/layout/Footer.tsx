'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  IconButton,
  Divider
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useContactInfo, usePersonalInfo } from '@/hooks/usePortfolioData';

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps) {
  const { mode } = useCustomTheme();
  const contact = useContactInfo();
  const personal = usePersonalInfo();

  return (
    <Box 
      id={id}
      component="footer"
      sx={{
        py: { xs: 4, md: 6 },
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        borderTop: mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Main Footer Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3,
            }}
          >
            {/* Brand & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
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
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {personal.name}
                  </Typography>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#4B5563',
                    maxWidth: '400px',
                    lineHeight: 1.5,
                  }}
                >
                  {personal.subtitle}
                </Typography>
              </Stack>
            </motion.div>

            {/* Social Links & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Stack spacing={2} sx={{ alignItems: { xs: 'center', sm: 'flex-end' } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
                    fontWeight: 500,
                  }}
                >
                  Let&apos;s connect
                </Typography>
                
                <Stack direction="row" spacing={1}>
                  {contact.socialLinks?.github && (
                    <IconButton
                      href={contact.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#374151',
                        '&:hover': {
                          color: '#8B5CF6',
                          background: mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
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
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#374151',
                        '&:hover': {
                          color: '#8B5CF6',
                          background: mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
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
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#374151',
                        '&:hover': {
                          color: '#8B5CF6',
                          background: mode === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </motion.div>
          </Box>

          <Divider sx={{ borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

          {/* Bottom Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                © {new Date().getFullYear()} {personal.name}. All rights reserved.
              </Typography>
            </motion.div>


          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
