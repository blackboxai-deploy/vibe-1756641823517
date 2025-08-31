import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TMVBD Smart AI Customer Service - Enhanced with Real Data',
  description: 'Advanced AI customer service system for TMVBD Vehicle Tracking with real-time customer data integration, attractive yellow-themed interface, and personalized Bengali/English support.',
  keywords: [
    'TMVBD',
    'AI customer service', 
    'vehicle tracking',
    'Bangladesh',
    'real-time data',
    'Bengali support',
    'smart assistance'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}