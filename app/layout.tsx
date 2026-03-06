import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian Properties — Luxury Real Estate',
  description: 'Find your dream home with Meridian Properties.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
