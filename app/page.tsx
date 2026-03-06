import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian Properties — Luxury Real Estate',
  description: 'Find your dream home with Meridian Properties. Luxury real estate in Beverly Hills, Hollywood Hills, Malibu, and more.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-amber-400 mb-4">Meridian Properties</h1>
          <p className="text-xl text-slate-400">Coming Soon...</p>
          <a href="/admin" className="inline-block mt-8 text-amber-400 hover:underline">Admin Panel</a>
        </div>
      </div>
    </main>
  );
}
