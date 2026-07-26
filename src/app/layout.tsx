import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Career Portal — AI-Powered Career Development',
  description: 'Adaptive career readiness and development platform for Students and Job Seekers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100 font-sans">
      <body className="h-full flex flex-col antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
