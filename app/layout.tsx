import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Providers } from './providers'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Here2Order",
  description: "Restaurant Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>
                {children}
              </Providers>
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
