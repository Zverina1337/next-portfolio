import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio — Anim Starter',
  description: 'Next.js 14 + GSAP + r3f + shadcn/ui + Tailwind starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh" lang="en">
        {children}
      </body>
    </html>
  );
}