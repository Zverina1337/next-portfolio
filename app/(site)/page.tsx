'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import SiteNav from '@/components/system/SiteNav'
import getMasterTl from '@/components/lib/useMasterTl'

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return
    const tl = getMasterTl()
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 0) фон-акцент
      intro.fromTo('#bg-accent', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0.05)

      // 1) имя: размытие → чётко, плюс строчное раскрытие
      intro
        .fromTo(
          '#heroName',
          { filter: 'blur(6px)', letterSpacing: '0.08em', opacity: 0 },
          { filter: 'blur(0px)', letterSpacing: '-0.01em', opacity: 1, duration: 0.9 },
          0.12
        )
        .fromTo('.reveal-line', { yPercent: 120 }, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.12)

      if (hasLabel(tl, 'hero')) tl!.add(intro, 'hero')
      else intro.play(0)
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden bg-background text-foreground"
      aria-label="Hero — Intro"
    >
      <SiteNav />

      {/* мягкий радиальный акцент */}
      <div id="bg-accent" aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
        <div className="h-[80vmin] w-[80vmin] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* Имя крупно — c shine-клипом по глифам */}
      <div className="container mx-auto px-4 pt-28 md:pt-36 pb-16">
        <h1 id="heroName" className="relative leading-[0.88] select-none will-change-transform">
          <span className="block overflow-hidden">
            <span className="reveal-line block">
              <span className="shine-wrap font-black tracking-tight text-6xl md:text-8xl xl:text-9xl" data-text="DANIIL">
                DANIIL
              </span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="reveal-line block">
              <span className="shine-wrap font-black tracking-tight text-6xl md:text-8xl xl:text-9xl" data-text="ZVORYGIN">
                ZVORYGIN
              </span>
            </span>
          </span>
        </h1>
      </div>

      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
    </section>
  )
}
