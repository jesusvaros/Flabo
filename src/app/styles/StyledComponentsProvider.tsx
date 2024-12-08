'use client';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from './theme/ThemeProvider';
import { useEffect, useState } from 'react';

export function StyledComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <StyledThemeProvider theme={theme}>
      {isClient ? children : null}
    </StyledThemeProvider>
  );
}
