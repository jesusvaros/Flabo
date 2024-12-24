'use client'
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { StyledComponentsProvider } from './styles/StyledComponentsProvider';
import { theme } from "./styles/theme";
import { ThemeProvider } from './styles/theme/ThemeProvider';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <StyledThemeProvider theme={theme}>
        <StyledComponentsProvider>
          {children}
        </StyledComponentsProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}
