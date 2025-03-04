import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Flabo",
  description: "Flabo is a simple and easy to use ticketing system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground w-full`}
      >
        <Providers>
          <div className="w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
