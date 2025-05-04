import { HeaderNav } from '@passport/components/header-nav';
import { ThemeProvider } from '@passport/components/theme-provider';
import { Toaster } from '@passport/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pet Passport',
  description: 'Manage your pet health documents',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute='class'>
          <div className='flex flex-col min-h-svh'>
            <header className='sticky top-0 bg-background h-16 shrink-0 border-b px-4 z-100 flex items-center'>
              <HeaderNav />
            </header>
            <main className='flex-1 overflow-auto p-4'>{children}</main>
            <footer className='bg-accent py-6 text-background dark:text-foreground'>
              <div className='container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm'>
                <nav className='flex gap-6 items-center'>
                  <Link href='/about'>About</Link>
                  <Link href='/contact'>Contact</Link>
                  <Link href='/privacy'>Privacy</Link>
                  <Link href='/terms'>Terms</Link>
                  <button
                    aria-label='Toggle dark mode'
                    className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600'
                  >
                    <div className='w-5 h-5 rounded-full' />
                  </button>
                </nav>
              </div>
            </footer>
          </div>
          <Toaster theme='light' richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
