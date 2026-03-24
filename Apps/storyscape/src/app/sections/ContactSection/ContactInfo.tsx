'use client';

import { motion } from 'framer-motion';
import { Typography, Card, CardContent, Stack } from '@mui/material';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactInfo, useBranding, usePersonalInfo } from '@/hooks/usePortfolioData';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function ContactInfo() {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const contact = useContactInfo();
  const branding = useBranding();
  const personal = usePersonalInfo();
  const handleResumeDownload = () => {
    if (contact.resumeUrl) {
      const link = document.createElement("a");
      link.href = contact.resumeUrl;
      link.download = `${personal.name.replace(" ", "_")}_Resume.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'text.primary',
          mb: 4,
        }}
      >
        {t('contact.info.title')}
      </Typography>

      <Stack spacing={4}>
        <Card
          sx={{
            background: mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            p: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              {t('contact.info.email')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
              }}
            >
              {contact.email}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              {t('contact.info.phone')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
              }}
            >
              {contact.phone}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              {t('contact.info.location')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
              }}
            >
              {contact.location}
            </Typography>
          </CardContent>
        </Card>

        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'center' }}
        >
          {contact.resumeUrl && (
            <AnimatedButton
              variant="contained"
              onClick={handleResumeDownload}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: branding.gradients.contact,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                },
              }}
              hoverScale={1.05}
              rippleColor="rgba(255, 255, 255, 0.3)"
            >
              {t('contact.actions.downloadResume')}
            </AnimatedButton>
          )}
          
          <AnimatedButton
            variant="outlined"
            href={contact.socialLinks?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
              color: mode === 'dark' ? '#F1F5F9' : 'black',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 2,
              '&:hover': {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              },
            }}
            hoverScale={1.05}
            rippleColor={mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
          >
            {t('contact.actions.followMe')}
          </AnimatedButton>
        </Stack>
      </Stack>
    </motion.div>
  );
}
