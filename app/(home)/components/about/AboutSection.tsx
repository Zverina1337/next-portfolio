'use client'

import { useEffect, useRef } from 'react'
import AboutCarousel from './AboutCarousel'
import AboutHeader from './AboutHeader'
import AboutParagraphs from './AboutParagraphs'
import SkillList from '@/components/ui/custom/skill/SkillList'
import StatsGrid from '@/components/ui/custom/stats/StatsGrid'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import { usePrefersReducedMotion } from '@/components/hooks/usePrefersReducedMotion'
import { getGsap } from '@/components/lib/utils'
import { skills, stats, techs } from './about.data'

export default function AboutSection() {
  const root = useRef<HTMLElement | null>(null)
  const appeared = useIntersectionObserver(root, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' })
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!appeared || reduced) return
    let ctx: gsap.Context | undefined

    ;(async () => {
      const gsap = await getGsap()
      ctx = gsap.context((self) => {
        const section = root.current
        if (!section) return

        const q = self.selector!

        gsap.to(section, { opacity: 1, duration: 0.5 })

        // поэтапный вход контента
        gsap.fromTo(
          q('[data-about-body] > *'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }
        )

        gsap.fromTo(
          q('.about-card'),
          { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' },
          { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, stagger: 0.12 }
        )

        // прогресс-бар навыков
        gsap.fromTo(
          q('.skill-fill'),
          { width: 0 },
          {
            width: (i, el: HTMLElement) => {
              const v = Number(el.dataset.value ?? 0)
              const clamped = Math.max(0, Math.min(100, v))
              return `${clamped}%`
            },
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.08,
          }
        )

        gsap.fromTo(
          q('[data-about-cta]'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        )

        gsap.fromTo(
          q('[data-about-divider]'),
          { scaleX: 0, transformOrigin: '0% 50%' },
          { scaleX: 1, duration: 0.5, ease: 'power2.out' }
        )
      }, root)
    })()

    return () => ctx?.revert()
  }, [appeared, reduced])

  return (
    <section
      ref={root}
      id="about"
      className="relative h-[85vh] overflow-hidden bg-black text-white opacity-0 motion-safe:opacity-0"
      aria-label="About — phased reveal"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.30] mix-blend-screen"
        style={{
          background:
            'repeating-linear-gradient(110deg, rgba(34,211,238,0.06) 0 24px, rgba(34,211,238,0.0) 24px 48px)',
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 0%',
        }}
      />

      <div
        data-about-body
        className="relative z-[4] container mx-auto px-4 sm:px-6 md:px-12 lg:px-18 pt-12 sm:pt-16 md:pt-20 space-y-12 max-w-[1920px] h-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-[700px]">
            <AboutHeader />
            <AboutParagraphs />

            <SkillList items={skills} />

          </div>

          <StatsGrid items={stats} />
        </div>
        <div className='absolute bottom-16 left-0 w-full max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-18'>
          <div data-about-divider className="h-px w-full bg-white/10" aria-hidden />
          <AboutCarousel items={techs as unknown as string[]}/>
        </div>

      </div>
    </section>
  )
}
