'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, darkTheme, lightTheme ,ThemeDark} from './theme';

type ThemeContextType = {
  theme: Theme | ThemeDark;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    // Listen for system preference changes
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : 'light'}>
        {children}
        <style jsx global>{`
          :root {
            color-scheme: ${isDark ? 'dark' : 'light'};
          }

          body {
            background-color: ${theme.colors.background.primary};
            color: ${theme.colors.text.primary};
          }

          /* Add smooth transition for theme changes */
          body * {
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
              border-color 0.2s ease-in-out;
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
};
