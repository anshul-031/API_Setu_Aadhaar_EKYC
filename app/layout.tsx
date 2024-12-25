import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aadhaar eKYC Verification',
  description: 'Secure Aadhaar verification using APISetuGov',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Script 
          src="/js/ekyc-form.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}