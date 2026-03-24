import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#8B5CF6' : '#2563EB', // Better contrast blue
    },
    secondary: {
      main: mode === 'dark' ? '#EC4899' : '#DC2626', // Better contrast red
    },
    background: {
      default: mode === 'dark' ? '#0A0A0A' : '#FFFFFF',
      paper: mode === 'dark' ? '#1A1A1A' : '#F8FAFC',
    },
    text: {
      primary: mode === 'dark' ? '#F1F5F9' : '#111827', // Softer off-white instead of pure white
      secondary: mode === 'dark' ? '#CBD5E1' : '#4B5563', // Softer secondary text
    },
    // Add custom colors for better light mode
  },
  typography: {
    fontFamily: ['"SF Pro Display"', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '12px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: mode === 'dark' 
            ? 'linear-gradient(45deg, #8B5CF6 30%, #EC4899 90%)'
            : 'linear-gradient(45deg, #2563EB 30%, #DC2626 90%)',
          boxShadow: mode === 'dark' 
            ? '0 3px 5px 2px rgba(139, 92, 246, .3)'
            : '0 3px 5px 2px rgba(37, 99, 235, .3)',
          color: '#F8FAFC', // Softer white for button text
          '&:hover': {
            boxShadow: mode === 'dark' 
              ? '0 3px 10px 2px rgba(139, 92, 246, .5)'
              : '0 3px 10px 2px rgba(37, 99, 235, .5)',
          },
        },
        outlinedPrimary: {
          color: mode === 'dark' ? '#8B5CF6' : '#2563EB',
          borderColor: mode === 'dark' ? '#8B5CF6' : '#2563EB',
          '&:hover': {
            backgroundColor: mode === 'dark' 
              ? 'rgba(139, 92, 246, 0.1)'
              : 'rgba(37, 99, 235, 0.1)',
            borderColor: mode === 'dark' ? '#8B5CF6' : '#2563EB',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' 
            ? 'rgba(0,0,0,0.8)' 
            : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: mode === 'dark' 
            ? 'none'
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          boxShadow: mode === 'dark' 
            ? '0 4px 30px rgba(0, 0, 0, 0.1)'
            : '0 4px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(5px)',
          border: mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.15)'
            : '1px solid rgba(0, 0, 0, 0.15)',
          color: mode === 'dark' ? '#F1F5F9' : '#111827', // Softer white for chip text
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#8B5CF6' : '#2563EB',
            },
          },
        },
      },
    },
  },
});
