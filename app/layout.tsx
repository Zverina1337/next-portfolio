import type { Metadata } from 'next'
import './globals.css'
import BootPreloader from '@/components/system/BootPreloader'

export const metadata: Metadata = {
  title: 'Portfolio — Anim Starter',
  description: 'Next.js 14 + GSAP + r3f + shadcn/ui + Tailwind starter',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className='dark'>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <BootPreloader durationMs={1500}/>
        {children}
      </body>
    </html>
  );
}