import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';
import { TemplateLayout } from '@/components/custom/template-layout';
import '@/app/globals.css';
import './globals.css';
import './custom.css';

export const metadata: Metadata = {
  title: 'Deriv Digits Trading App',
  description: 'A white-label trading application powered by Deriv',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full lg:h-auto" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background flex min-h-dvh flex-col overflow-hidden max-lg:h-dvh max-lg:overflow-hidden lg:block lg:h-auto lg:min-h-screen lg:overflow-x-hidden lg:overflow-y-auto`}
      >
        <TemplateLayout>{children}</TemplateLayout>
      </body>
    </html>
  );
}
