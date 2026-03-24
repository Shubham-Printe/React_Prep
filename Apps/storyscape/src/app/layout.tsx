import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeRegistry } from '@/components/common';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shubham Printe | Senior Full-Stack Engineer",
  description: "Full-stack engineer with 4+ years building production web apps (React, TypeScript) and backend services (Node.js, REST APIs). Portfolio of projects and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider>
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
