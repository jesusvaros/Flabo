import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type Theme = typeof lightTheme ;
export type ThemeDark = typeof darkTheme ;

const baseTheme = {
  spacing,
  typography,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    base: 'all 0.2s ease-in-out',
    slow: 'all 0.3s ease-in-out',
    fast: 'all 0.1s ease-in-out',
  },
} as const;

export const lightTheme = {
  ...baseTheme,
  colors: {
    ...colors,
    background: {
      primary: colors.white,
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      tertiary: colors.gray[500],
      inverse: colors.white,
    },
    border: {
      primary: colors.gray[200],
      secondary: colors.gray[300],
    },
  },
} as const;

export const darkTheme = {
  ...baseTheme,
  colors: {
    ...colors,
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
    },
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[300],
      tertiary: colors.gray[400],
      inverse: colors.gray[900],
    },
    border: {
      primary: colors.gray[700],
      secondary: colors.gray[600],
    },
  },
} as const;
