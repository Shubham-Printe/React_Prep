'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  TextField,
  Card,
  CardContent,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import { useState } from 'react';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactInfo, useBranding, useConfig, usePersonalInfo } from '@/hooks/usePortfolioData';
import { ParallaxBlob } from './ParallaxBackground';
import { FloatingParticles } from './ParticleSystem';
import AnimatedButton from './ui/AnimatedButton';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactSectionProps {
  id: string;
}

export default function ContactSection({ id }: ContactSectionProps) {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const contact = useContactInfo();
  const branding = useBranding();
  const config = useConfig();
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
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Don't render if section is disabled
  if (!config.sections.contact) {
    return null;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return t('contact.validation.firstName.required');
        if (value.trim().length < 2) return t('contact.validation.firstName.minLength');
        if (value.trim().length > 50) return t('contact.validation.firstName.maxLength');
        return undefined;
      
      case 'lastName':
        if (!value.trim()) return t('contact.validation.lastName.required');
        if (value.trim().length < 2) return t('contact.validation.lastName.minLength');
        if (value.trim().length > 50) return t('contact.validation.lastName.maxLength');
        return undefined;
      
      case 'email':
        if (!value.trim()) return t('contact.validation.email.required');
        if (!validateEmail(value)) return t('contact.validation.email.invalid');
        return undefined;
      
      case 'subject':
        if (!value.trim()) return t('contact.validation.subject.required');
        if (value.trim().length < 5) return t('contact.validation.subject.minLength');
        if (value.trim().length > 100) return t('contact.validation.subject.maxLength');
        return undefined;
      
      case 'message':
        if (!value.trim()) return t('contact.validation.message.required');
        if (value.trim().length < 10) return t('contact.validation.message.minLength');
        if (value.trim().length > 1000) return t('contact.validation.message.maxLength');
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof FormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
      
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box id={id}
      sx={{
        py: { xs: 8, md: 12 },
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Particles */}
      {config.showParticles && (
        <FloatingParticles count={8} />
      )}
      
      {/* Parallax Background Elements */}
      <ParallaxBlob
        size={200}
        color={branding.gradients.contact}
        speed={0.2}
        position={{ top: '20%', right: '5%' }}
      />
      <ParallaxBlob
        size={150}
        color="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
        speed={0.3}
        position={{ bottom: '25%', left: '8%' }}
      />

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 700,
                background: branding.gradients.contact,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('contact.title')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {t('contact.subtitle')}
            </Typography>
          </motion.div>
        </Box>

        <Box id={id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 8,
            alignItems: 'start',
          }}
        >
          {/* Contact Information */}
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

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px 0px -100px 0px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
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
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Box id={id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 3,
                      }}
                    >
                      <TextField
                        label={t('contact.form.firstName')}
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      
                      <TextField
                        label={t('contact.form.lastName')}
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        required
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>

                    <TextField
                      label={t('contact.form.email')}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      onBlur={handleBlur('email')}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label={t('contact.form.subject')}
                      value={formData.subject}
                      onChange={handleInputChange('subject')}
                      onBlur={handleBlur('subject')}
                      error={!!errors.subject}
                      helperText={errors.subject}
                      required
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <TextField
                      label={t('contact.form.message')}
                      value={formData.message}
                      onChange={handleInputChange('message')}
                      onBlur={handleBlur('message')}
                      error={!!errors.message}
                      helperText={errors.message}
                      required
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <AnimatedButton
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        background: branding.gradients.contact,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                        },
                        '&:disabled': {
                          background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        },
                      }}
                      hoverScale={1.02}
                      rippleColor="rgba(255, 255, 255, 0.3)"
                    >
                      {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                    </AnimatedButton>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('contact.form.success')}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {t('contact.form.error')}
        </Alert>
      </Snackbar>
    </Box>
  );
}
