'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import RulerTop from '@/components/animation/RulerTop'
import NetworkSphere3D from '@/components/animation/NetworkSphere3D'
import getMasterTl from '@/components/lib/useMasterTl'

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function CinematicIntro() {
  const root = useRef<HTMLDivElement>(null)
  const bgCirclesRef = useRef<SVGSVGElement>(null)
  const bgAccentRef = useRef<HTMLDivElement>(null)
  const sphereWrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    const tl = getMasterTl()

    const ctx = gsap.context(() => {
      // Основной таймлайн появления
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('#bg-accent', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.05)
        .fromTo('#taglineTop', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.12)
        .fromTo('#brand', { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '>-0.2')
        .fromTo('#bigTitleWrap', { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '>-0.1')
        .fromTo('#threeSphereWrap', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, '<+0.05')

      if (hasLabel(tl, 'hero')) tl!.add(intro, 'hero')

      // Анимация бирюзового радиального акцента
      if (bgAccentRef.current) {
        gsap.to(bgAccentRef.current, {
          scale: 1.05,
          opacity: 0.18,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Плавное движение фоновых кругов
      if (bgCirclesRef.current) {
        gsap.to(bgCirclesRef.current, {
          y: -30,
          x: 15,
          scale: 1.08,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={root}
      className="relative isolate w-full bg-black text-white overflow-hidden"
      aria-label="Hero — Cinematic Intro"
    >
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-20 py-20">
        <div className="relative w-full rounded-[24px] border-2 border-cyan-500/90 p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden">

          {/* Фоновые круги */}
          <svg
            ref={bgCirclesRef}
            id="bg-circles"
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid meet"
          >
            <g fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={1.2} strokeLinecap="round">
              <circle cx="500" cy="660" r="140" />
              <circle cx="500" cy="660" r="250" />
              <circle cx="500" cy="660" r="360" />
            </g>
          </svg>

          {/* Бирюзовый радиальный акцент */}
          <div
            ref={bgAccentRef}
            aria-hidden
            className="pointer-events-none absolute -z-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="rounded-full blur-3xl"
              style={{
                width: '200vmin',
                height: '200vmin',
                maxWidth: '2000px',
                maxHeight: '2000px',
                background: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0) 100%)',
              }}
            />
          </div>

          {/* Mask линейки */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] z-0">
            <RulerTop />
          </div>

          {/* Контент */}
          <div className="relative z-10 text-center">
            <p id="taglineTop" className="mx-auto mb-6 max-w-lg text-[10px] uppercase tracking-[0.25em] opacity-80">
              Делаю быстрые и яркие фронтенд-интерфейсы: одинаково удобные и запоминающиеся.
            </p>
            <div id="brand" className="mb-3 text-sm font-semibold tracking-[0.25em] opacity-90">ZVERINACODE</div>

            <div id="bigTitleWrap" className="relative mx-auto inline-block max-w-md">
              <h1 id="bigTitle" className="text-center font-extrabold uppercase leading-[0.86] text-cyan-500 tracking-[-0.02em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                FRONTEND DEVELOPER
              </h1>
              <span className="absolute left-0 top-0 -translate-x-3 -translate-y-2 h-5 w-5 border-l-2 border-t-2 border-cyan-500 opacity-80" />
              <span className="absolute right-0 top-0 translate-x-3 -translate-y-2 h-5 w-5 border-r-2 border-t-2 border-cyan-500 opacity-80" />
              <span className="absolute left-0 bottom-0 -translate-x-3 translate-y-2 h-5 w-5 border-l-2 border-b-2 border-cyan-500 opacity-80" />
              <span className="absolute right-0 bottom-0 translate-x-3 translate-y-2 h-5 w-5 border-r-2 border-b-2 border-cyan-500 opacity-80" />
            </div>

            {/* 3D-сфера */}
            <div id="threeSphereWrap" ref={sphereWrapRef} className="relative mt-8 grid place-items-center cursor-grab">
              <div className="w-full max-w-full sm:max-w-[720px]">
                <NetworkSphere3D />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Дот-узор */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40
                 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
                 [background-size:12px_12px]" />
    </section>
  )
}
