'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import RulerTop from '@/components/ui/custom/RulerTop'
import getMasterTl from '@/components/hooks/useMasterTl'

// Dynamic import для Sphere - оптимизация bundle size главной страницы
const Sphere = dynamic(() => import('@/components/ui/custom/3D/Sphere'), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-cyan-500/10 animate-pulse" />
    </div>
  ),
  ssr: false,
})
import AnimatedRadialAccent from '@/components/ui/custom/animated/AnimatedRadialAccent'
import AnimatedBG from '@/components/ui/custom/animated/AnimatedBg'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver' 

export default function CinematicIntroOptimized() {
  const root = useRef<HTMLDivElement>(null)
  const sphereWrapRef = useRef<HTMLDivElement>(null)

  // триггерим анимацию, когда секция видна хотя бы на 20%
  const isVisible = useIntersectionObserver(root, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !isVisible) return

    const tl = getMasterTl()
    const ctx = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if(!root.current) return

    intro
      .fromTo(root.current.querySelector('[data-el="taglineTop"]'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '<0.1')
      .fromTo(root.current.querySelector('[data-el="brand"]'),       { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '<0.1')
      .fromTo(root.current.querySelector('[data-el="bigTitleWrap"]'),{ y: 20,  opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.8 }, '<0.1')
      .fromTo(sphereWrapRef.current,                                  { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, '<0.05')

      // если у master есть метка 'hero' — вставляем, иначе просто проигрываем локально
    if (tl?.labels && Object.prototype.hasOwnProperty.call(tl.labels, 'hero')) {
      tl.add(intro, 'hero')
    } else {
      intro.play(0)
    }
    }, root)

    return () => ctx.revert()
  }, [isVisible])

  return (
    <section
      id="home"
      ref={root}
      className="relative isolate w-full bg-black text-white overflow-hidden"
      aria-label="Hero — Cinematic Intro"
      data-testid="cinematic-intro"
    >
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-20 py-20">
        <div className="relative w-full rounded-[24px] border-2 border-cyan-500/90 p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden">
          <AnimatedRadialAccent />
          <AnimatedBG
            variant="rings"
            tint="rgba(255,255,255,0.10)"
            accent="rgba(34,211,238,0.35)"
            particles={true}
            className="pointer-events-none absolute inset-0 z-0 w-full h-full -top-1/6"
          />
          <div className="absolute inset-0 overflow-hidden rounded-[24px] z-0" data-testid="ruler-mask">
            <RulerTop />
          </div>

          <div className="relative z-10 text-center">
            <p data-el="taglineTop" className="mx-auto mb-6 max-w-lg text-[10px] uppercase tracking-[0.25em] opacity-80">
              Делаю быстрые и яркие фронтенд-интерфейсы: одинаково удобные и запоминающиеся.
            </p>
            <div data-el="brand" className="mb-3 text-sm font-semibold tracking-[0.25em] opacity-90">
              ZVERINACODE
            </div>

            <div data-el="bigTitleWrap" className="relative mx-auto inline-block max-w-md">
              <h1 className="text-center font-extrabold uppercase leading-[0.86] text-cyan-500 tracking-[-0.02em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                FRONTEND DEVELOPER
              </h1>
              <span className="absolute left-0 top-0 -translate-x-3 -translate-y-2 h-5 w-5 border-l-2 border-t-2 border-cyan-500 opacity-80" />
              <span className="absolute right-0 top-0 translate-x-3 -translate-y-2 h-5 w-5 border-r-2 border-t-2 border-cyan-500 opacity-80" />
              <span className="absolute left-0 bottom-0 -translate-x-3 translate-y-2 h-5 w-5 border-l-2 border-b-2 border-cyan-500 opacity-80" />
              <span className="absolute right-0 bottom-0 translate-x-3 translate-y-2 h-5 w-5 border-r-2 border-b-2 border-cyan-500 opacity-80" />
            </div>

            <div ref={sphereWrapRef} className="relative mt-8 flex items-center justify-center" data-testid="sphere-wrap">
              <Sphere />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40
                   bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
                   [background-size:12px_12px]"
      />
    </section>
  )
}
