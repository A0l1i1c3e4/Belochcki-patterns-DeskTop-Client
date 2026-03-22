import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { themeApi } from '../shared/api/themeApi';
import type { ThemeMode } from '../shared/api/themeApi';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => Promise<void>;
  isThemeLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: 'rgba(255,255,255,0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e293b',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#90caf9',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#90caf9',
          },
          '& input': {
            color: '#f8fafc',
          },
          '& textarea': {
            color: '#f8fafc',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#cbd5e1',
          '&.Mui-focused': {
            color: '#90caf9',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#cbd5e1',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#f8fafc',
        },
        icon: {
          color: '#cbd5e1',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(144, 202, 249, 0.16)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(144, 202, 249, 0.24)',
          },
        },
      },
    },
  },
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('LIGHT');
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await themeApi.getTheme();
        setMode(savedTheme);
      } catch (error) {
        console.error('Не удалось загрузить тему:', error);
        setMode('LIGHT');
      } finally {
        setIsThemeLoading(false);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', mode === 'DARK' ? 'dark' : 'light');
  }, [mode]);

  const toggleTheme = async () => {
    const nextMode: ThemeMode = mode === 'LIGHT' ? 'DARK' : 'LIGHT';

    try {
      setMode(nextMode);
      await themeApi.updateTheme(nextMode);
    } catch (error) {
      console.error('Не удалось сохранить тему:', error);
      setMode(mode);
    }
  };

  const muiTheme = useMemo(() => {
    return mode === 'DARK' ? darkTheme : lightTheme;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isThemeLoading }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme должен использоваться внутри AppThemeProvider');
  }

  return context;
};