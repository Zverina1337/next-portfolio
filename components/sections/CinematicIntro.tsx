'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import getMasterTl from '@/components/lib/useMasterTl'
import RulerTop from '@/components/animation/RulerTop'
import NetworkSphere3D from '@/components/animation/NetworkSphere3D'

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function CinematicIntro() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    const tl = getMasterTl()

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('#bg-accent', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.05)
        .fromTo('#taglineTop', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.12)
        .fromTo('#brand', { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '>-0.2')
        .fromTo('#bigTitleWrap', { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '>-0.1')
        .fromTo('#frame, #rulerTop', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '>-0.3')
        .fromTo('#threeSphereWrap', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 }, '<+0.05')

      if (hasLabel(tl, 'hero')) {
        tl!.add(intro, 'hero')
      }
      // ждём master TL, локально не проигрываем
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-black text-white"
      aria-label="Hero — Cinematic Intro"
    >
      {/* MASK под рамкой (линейка внутри) */}
      <div
        id="frameMask"
        className="
          pointer-events-none absolute z-[12]
          left-4 right-4 bottom-4 top-[80px]
          sm:left-6 sm:right-6 sm:bottom-6 sm:top-[96px]
          rounded-[24px] overflow-hidden
        "
        aria-hidden
      >
        <RulerTop />
      </div>

      {/* Рамка */}
      <div
        id="frame"
        aria-hidden
        className="
          pointer-events-none absolute z-[14]
          left-4 right-4 bottom-4 top-[80px]
          sm:left-6 sm:right-6 sm:bottom-6 sm:top-[96px]
          rounded-[24px] border-2 border-cyan-500/90
        "
      />

      {/* Дот-узор */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
                   [background-size:12px_12px] opacity-40"
      />

      {/* ── НОВЫЕ ФОНОВЫЕ КРУГИ ── */}
      <svg
        id="bg-circles"
        aria-hidden
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        style={{
          opacity: 0.5,
          // мягкая вертикальная маска: внизу плотнее, к верху — слабее
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0.2) 100%)',
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0.2) 100%)',
        }}
      >
        {/* центр чуть выше низа, чтобы получить дуги как на рефе */}
        <g fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1.2" strokeLinecap="round">
          {/* r подогнаны под вьюбокс 1000x700 */}
          <circle cx="500" cy="660" r="140" />
          <circle cx="500" cy="660" r="250" />
          <circle cx="500" cy="660" r="360" />
        </g>
      </svg>

      {/* Радиальный акцент (под всем) */}
      <div id="bg-accent" aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        <div className="h-[80vmin] w-[80vmin] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      {/* Контент */}
      <div className="container mx-auto px-6 pt-28 md:pt-36 pb-16">
        <p id="taglineTop" className="mx-auto mb-6 max-w-xl text-center text-[10px] uppercase tracking-[0.25em] opacity-80">
          Делаю быстрые и яркие фронтенд-интерфейсы: одинаково удобные и запоминающиеся.
        </p>

        <div id="brand" className="mb-3 text-center text-sm font-semibold tracking-[0.25em] opacity-90">
          ZVERINACODE
        </div>

        {/* Титул + уголки */}
        <div id="bigTitleWrap" className="relative z-10 mx-auto inline-block">
          <h1
            id="bigTitle"
            className="text-center font-extrabold uppercase leading-[0.86]
                       text-cyan-500 tracking-[-0.02em]
                       text-[12vw] sm:text-[10vw] md:text-[9vw] xl:text-[8vw]"
            style={{ textRendering: 'optimizeLegibility' }}
          >
            FRONTEND DEVELOPER
          </h1>
          <span className="pointer-events-none absolute left-0 top-0 -translate-x-3 -translate-y-2 h-5 w-5 border-l-2 border-t-2 border-cyan-500 opacity-80" />
          <span className="pointer-events-none absolute right-0 top-0 translate-x-3 -translate-y-2 h-5 w-5 border-r-2 border-t-2 border-cyan-500 opacity-80" />
          <span className="pointer-events-none absolute left-0 bottom-0 -translate-x-3 translate-y-2 h-5 w-5 border-l-2 border-b-2 border-cyan-500 opacity-80" />
          <span className="pointer-events-none absolute right-0 bottom-0 translate-x-3 translate-y-2 h-5 w-5 border-r-2 border-b-2 border-cyan-500 opacity-80" />
        </div>

        {/* 3D-сфера */}
        <div id="threeSphereWrap" className="relative mt-6 grid place-items-center">
          <NetworkSphere3D />
        </div>
      </div>
    </section>
  )
}
