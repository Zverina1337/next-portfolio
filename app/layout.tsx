import type { Metadata } from 'next'
import './globals.css'
import Preloader from '@/components/ui/custom/preloader/Preloader'
import Navigation from '@/components/navigation/Navigation.client'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import MouseTrail from '@/components/ui/custom/MouseTrail'

export const metadata: Metadata = {
  title: 'Zverinacode',
  description: 'Next.js 14 + GSAP + shadcn/ui + Tailwind starter',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className='dark'>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <SmoothScrollProvider>
          <Preloader durationMs={1500}/>
          <Navigation />
          <MouseTrail />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}