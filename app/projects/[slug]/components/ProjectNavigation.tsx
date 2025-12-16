'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Project } from '@/types/project'
import { ChevronLeft, ChevronRight, ArrowUpCircle } from 'lucide-react'
import gsap from 'gsap'

interface ProjectNavigationProps {
  prev: Project | null
  next: Project | null
}

export default function ProjectNavigation({ prev, next }: ProjectNavigationProps) {
  const [prevHover, setPrevHover] = useState(false)
  const [nextHover, setNextHover] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const prevRef = useRef<HTMLAnchorElement>(null)
  const nextRef = useRef<HTMLAnchorElement>(null)
  const backToTopRef = useRef<HTMLButtonElement>(null)

  // Показываем кнопку "наверх" при скролле
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Магнитный эффект с улучшенной физикой
  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement>,
    ref: React.RefObject<HTMLAnchorElement | null>
  ) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(ref.current, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (ref: React.RefObject<HTMLAnchorElement | null>) => {
    if (!ref.current) return

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!prev && !next) {
    return null
  }

  return (
    <>
      <section className='relative border-t border-white/10 py-20 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          {/* Section Title */}
          <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold text-white md:text-4xl'>
              Другие проекты
            </h2>
            <p className='mt-3 text-white/60'>
              Исследуйте больше работ из портфолио
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {/* Previous Project */}
            {prev ? (
              <Link
                ref={prevRef}
                href={`/projects/${prev.slug}`}
                onMouseMove={(e) => handleMouseMove(e, prevRef)}
                onMouseLeave={() => {
                  handleMouseLeave(prevRef)
                  setPrevHover(false)
                }}
                onMouseEnter={() => setPrevHover(true)}
                className='group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20'
              >
                {/* Content */}
                <div className='relative p-8'>
                  {/* Arrow Icon */}
                  <div className='mb-4 flex items-center gap-2 text-cyan-400'>
                    <ChevronLeft
                      className={`h-5 w-5 transition-transform duration-300 ${prevHover ? '-translate-x-2' : ''}`}
                    />
                    <span className='text-sm font-medium uppercase tracking-wide'>
                      Предыдущий проект
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className='mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan-400 md:text-3xl'>
                    {prev.title}
                  </h3>

                  {/* Short Description */}
                  <p className='mb-4 line-clamp-2 text-white/70'>
                    {prev.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className='flex flex-wrap gap-2'>
                    {prev.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className='rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className={`pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl transition-opacity duration-700 ${prevHover ? 'opacity-100' : 'opacity-0'}`}
                />
              </Link>
            ) : (
              <div />
            )}

            {/* Next Project */}
            {next ? (
              <Link
                ref={nextRef}
                href={`/projects/${next.slug}`}
                onMouseMove={(e) => handleMouseMove(e, nextRef)}
                onMouseLeave={() => {
                  handleMouseLeave(nextRef)
                  setNextHover(false)
                }}
                onMouseEnter={() => setNextHover(true)}
                className='group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20'
              >
                {/* Content */}
                <div className='relative p-8 text-right'>
                  {/* Arrow Icon */}
                  <div className='mb-4 flex items-center justify-end gap-2 text-purple-400'>
                    <span className='text-sm font-medium uppercase tracking-wide'>
                      Следующий проект
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 transition-transform duration-300 ${nextHover ? 'translate-x-2' : ''}`}
                    />
                  </div>

                  {/* Project Title */}
                  <h3 className='mb-3 text-2xl font-bold text-white transition-colors group-hover:text-purple-400 md:text-3xl'>
                    {next.title}
                  </h3>

                  {/* Short Description */}
                  <p className='mb-4 line-clamp-2 text-white/70'>
                    {next.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className='flex flex-wrap justify-end gap-2'>
                    {next.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className='rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className={`pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl transition-opacity duration-700 ${nextHover ? 'opacity-100' : 'opacity-0'}`}
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          ref={backToTopRef}
          onClick={scrollToTop}
          className='fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/50 bg-black/80 text-cyan-400 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/50'
          aria-label='Вернуться наверх'
        >
          <ArrowUpCircle className='h-6 w-6' />
        </button>
      )}
    </>
  )
}
