'use client'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import useCarousel from '@/components/hooks/useCarousel'

export default function RunningLine({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  
  useCarousel(containerRef, trackRef)

  return (
    <div className={clsx('items-center gap-3 rounded-full border border-foreground/15 px-4 py-1', className)} id="availability">
      <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" />
      <div ref={containerRef} className="relative w-[200px] overflow-hidden">
        <div ref={trackRef} className="whitespace-nowrap will-change-transform" aria-hidden>
          <span className="mr-8 opacity-90">Next.js 14 • TypeScript • GSAP</span>
          <span className="mr-8 opacity-90">Tailwind CSS • shadcn/ui</span>
          <span className="mr-8 opacity-90">Чистая архитектура • Переиспользуемый UI</span>
          <span className="mr-8 opacity-90">Доступен к проектам — Q4 2025</span>
        </div>
      </div>
    </div>
  )
}