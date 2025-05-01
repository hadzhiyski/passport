import { AppBreadcrumbList } from '@passport/components/app-breadcrumb-list';
import { AppSidebar } from '@passport/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@passport/components/ui/sidebar';
import { Toaster } from '@passport/components/ui/sonner';
import { Separator } from '@radix-ui/react-separator';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@passport/components/theme-provider';

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
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset className='flex flex-col'>
              <header className='flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                <AppBreadcrumbList />
              </header>
              <div className='flex-1 overflow-auto p-4'>{children}</div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster theme='light' richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
