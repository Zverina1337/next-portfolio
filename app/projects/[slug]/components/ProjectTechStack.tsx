'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code, Sparkles } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectTechStackProps {
  technologies: string[]
  features: string[]
}

export default function ProjectTechStack({ technologies, features }: ProjectTechStackProps) {
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

      // Stagger animation для тегов
      gsap.from('.tech-tag', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.2)',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className='overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm md:p-8'
    >
      {/* Title */}
      <h2 className='mb-6 text-2xl font-bold text-white md:text-3xl'>
        Технологии и возможности
      </h2>

      {/* Technologies */}
      <div className='mb-8'>
        <div className='mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400'>
          <Code className='h-4 w-4' />
          <span>Технологии</span>
        </div>
        <div className='flex flex-wrap gap-2'>
          {technologies.map((tech, index) => (
            <span
              key={index}
              className='tech-tag inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-white transition-all hover:scale-105 hover:border-cyan-400/50 hover:bg-cyan-500/20'
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <div className='mb-3 flex items-center gap-2 text-sm font-medium text-purple-400'>
          <Sparkles className='h-4 w-4' />
          <span>Ключевые возможности</span>
        </div>
        <div className='flex flex-wrap gap-2'>
          {features.map((feature, index) => (
            <span
              key={index}
              className='tech-tag inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-white transition-all hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/20'
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}