import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TRACKPULSE — AI Track Condition Intelligence',
  description: 'AI-powered visual track condition analysis for real-time racing tyre strategy. See the track. Predict the window. Race smarter.',
  openGraph: {
    title: 'TRACKPULSE — AI Track Condition Intelligence',
    description: 'AI-powered visual track condition analysis for real-time racing tyre strategy.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
