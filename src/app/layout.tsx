import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from './styles/theme';
import { StyledComponentsProvider } from './styles/StyledComponentsProvider';
import StyledComponentsRegistry from './registry';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flabo web",
  description: "a ver que hacemos ahora",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <StyledComponentsProvider>
              {children}
            </StyledComponentsProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
