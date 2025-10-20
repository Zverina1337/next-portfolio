import type { Metadata } from 'next'
import './globals.css'
import Preloader from '@/components/ui/custom/preloader/Preloader'
import Navigation from '@/components/navigation/Navigation.client'

export const metadata: Metadata = {
  title: 'Portfolio — Anim Starter',
  description: 'Next.js 14 + GSAP + r3f + shadcn/ui + Tailwind starter',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className='dark'>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <Preloader durationMs={1500}/>
        <Navigation />
        {children}
      </body>
    </html>
  );
}