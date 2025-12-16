'use client'

import { useEffect, useRef, useState } from 'react'
import { Project } from '@/types/project'
import { ExternalLink, ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'
import ProjectBreadcrumbs from './ProjectBreadcrumbs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProjectHeroProps {
  project: Project
}

const TYPE_LABELS = {
  commercial: 'Коммерческий',
  education: 'Образовательный',
  pet: 'Pet-проект',
}

const STATUS_LABELS = {
  completed: 'Завершен',
  'in-progress': 'В разработке',
  planned: 'Запланирован',
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse move effect для параллакса
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 20
      const y = (clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // GSAP анимации
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !heroRef.current) return

    const ctx = gsap.context(() => {
      // Анимация появления контента
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.from('.hero-breadcrumbs', {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
      .from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.7,
      }, '-=0.5')
      .from('.hero-meta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      }, '-=0.4')
      .from('.hero-badges', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      }, '-=0.5')
      .from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
      }, '-=0.3')

      // Parallax эффект для изображения при скролле
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: 150,
          scale: 1.1,
          ease: 'none',
        })
      }

      // Fade out overlay при скролле
      gsap.to('.hero-overlay', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0.3,
        ease: 'none',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Скролл к контенту
  const scrollToContent = () => {
    const content = document.querySelector('#project-content')
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={heroRef} className='relative flex min-h-screen items-center overflow-hidden'>
      {/* Background Image с Parallax */}
      {project.image && (
        <div ref={imageRef} className='absolute inset-0 -z-20'>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className='object-cover'
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: 'transform 0.3s ease-out',
            }}
            priority
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className='hero-overlay absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90' />
        </div>
      )}

      {/* Декоративные элементы */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        {/* Floating orbs */}
        <div className='absolute left-[10%] top-[20%] h-64 w-64 animate-pulse rounded-full bg-cyan-500/10 blur-3xl' />
        <div className='absolute right-[15%] top-[40%] h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl' />

        {/* Grid pattern */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Content */}
      <div className='relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8'>
        {/* Breadcrumbs */}
        <div className='hero-breadcrumbs mb-8'>
          <ProjectBreadcrumbs projectTitle={project.title} />
        </div>

        {/* Main Content Grid */}
        <div className='grid gap-12 lg:grid-cols-[1fr_auto]'>
          {/* Left: Title & Info */}
          <div className='space-y-8'>
            {/* Title */}
            <h1 className='hero-title bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-6xl font-bold leading-tight text-transparent md:text-7xl lg:text-8xl'>
              {project.title}
            </h1>

            {/* Description */}
            <p className='hero-description max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl'>
              {project.shortDescription}
            </p>

            {/* Metadata */}
            <div className='flex flex-wrap gap-6 text-base text-white/70'>
              {project.year && (
                <div className='hero-meta flex items-center gap-2'>
                  <div className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
                  <span className='font-medium'>{project.year}</span>
                </div>
              )}
              {project.team && (
                <div className='hero-meta flex items-center gap-2'>
                  <div className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
                  <span>Команда: {project.team}</span>
                </div>
              )}
              {project.duration && (
                <div className='hero-meta flex items-center gap-2'>
                  <div className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
                  <span>Длительность: {project.duration}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            {project.link && (
              <div className='hero-cta'>
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <a
                        href={project.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group inline-flex items-center gap-3 rounded-full border border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25'
                      >
                        <span>Посетить проект</span>
                        <ExternalLink className='h-5 w-5 transition-transform group-hover:translate-x-1' />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="text-xs">
                        Внешняя ссылка на проект заказчика. Представлено для демонстрации навыков.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          {/* Right: Badges & Stats */}
          <div className='flex flex-col gap-6 lg:items-end'>
            {/* Type Badge */}
            <div className='hero-badges inline-flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-white/10 to-white/5 px-6 py-3 backdrop-blur-sm'>
              <div className='h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50' />
              <span className='text-base font-medium text-white'>
                {TYPE_LABELS[project.type]}
              </span>
            </div>

            {/* Status Badge */}
            <div
              className={`hero-badges inline-flex items-center gap-3 rounded-2xl border px-6 py-3 backdrop-blur-sm ${
                project.status === 'completed'
                  ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5'
                  : project.status === 'in-progress'
                    ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5'
                    : 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5'
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  project.status === 'completed'
                    ? 'bg-green-400 shadow-lg shadow-green-400/50'
                    : project.status === 'in-progress'
                      ? 'animate-pulse bg-yellow-400 shadow-lg shadow-yellow-400/50'
                      : 'bg-purple-400 shadow-lg shadow-purple-400/50'
                }`}
              />
              <span className='text-base font-medium text-white'>
                {STATUS_LABELS[project.status]}
              </span>
            </div>

            {/* Stats Cards */}
            <div className='hero-badges grid gap-4'>
              <div className='rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'>
                <div className='text-sm text-white/60'>Сложность</div>
                <div className='mt-1 flex items-baseline gap-2'>
                  <span className='text-3xl font-bold text-white'>{project.complexity}</span>
                  <span className='text-white/40'>/10</span>
                </div>
              </div>
              <div className='rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'>
                <div className='text-sm text-white/60'>Часов работы</div>
                <div className='mt-1 text-3xl font-bold text-white'>{project.hoursSpent}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          aria-label='Прокрутить к контенту'
        >
          <div className='flex flex-col items-center gap-2'>
            <span className='text-sm text-white/60'>Прокрутите вниз</span>
            <ArrowDown className='h-6 w-6 text-cyan-400' />
          </div>
        </button>
      </div>
    </section>
  )
}
