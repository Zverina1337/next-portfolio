'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectSectionProps {
  title: string
  children: React.ReactNode
  variant?: 'text' | 'list'
}

export default function ProjectSection({ title, children, variant = 'text' }: ProjectSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power1.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className='group overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/50 md:p-8'
    >
      {/* Title */}
      <h2 className='mb-4 text-2xl font-bold text-white md:text-3xl'>{title}</h2>

      {/* Content */}
      {variant === 'text' ? (
        <div className='whitespace-pre-line text-white/80 leading-relaxed'>{children}</div>
      ) : (
        <ul className='space-y-3'>
          {Array.isArray(children) ? (
            children.map((item, index) => (
              <li
                key={index}
                className='flex items-start gap-3 text-white/80'
              >
                <div className='mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400' />
                <span className='leading-relaxed'>{item}</span>
              </li>
            ))
          ) : typeof children === 'string' ? (
            <li className='flex items-start gap-3 text-white/80'>
              <div className='mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400' />
              <span className='leading-relaxed'>{children}</span>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  )
}