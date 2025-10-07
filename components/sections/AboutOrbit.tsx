'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

type CTASpotStyle = React.CSSProperties & {
  '--mx'?: string | number
  '--my'?: string | number
}

const ctaSpotStyle: CTASpotStyle = {
  '--mx': '24px',
  '--my': '12px',
  background:
    'radial-gradient(120px 80px at var(--mx) var(--my), rgba(34,211,238,0.27), rgba(34,211,238,0) 60%)',
  backgroundRepeat: 'no-repeat',
  filter: 'blur(6px)',
}

export default function AboutScrollPhases() {
  const root = useRef<HTMLElement>(null)
  const ribbonRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    const ribbon = ribbonRef.current
    if (!section) return

    // IntersectionObserver для анимации появления
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(section, { opacity: 1, duration: 0.5 })

            gsap.fromTo(
              '#aboutBody',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }
            )

            gsap.fromTo(
              '.about-card',
              { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' },
              { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, stagger: 0.12 }
            )

            gsap.fromTo(
              '.skill-fill',
              { width: 0 },
              {
                width: (i, el) =>
                  (el as HTMLElement).dataset.value ? (el as HTMLElement).dataset.value + '%' : '0%',
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.08,
              }
            )

            gsap.fromTo('#aboutCTA', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 })
            gsap.fromTo('#aboutDivider', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' })

            // ✅ автоскролл карусели технологий
            if (ribbon) {
              const totalWidth = ribbon.scrollWidth / 2
              // дублируем содержимое для бесконечного скролла
              if (!ribbon.dataset.duped) {
                ribbon.innerHTML = ribbon.innerHTML + ribbon.innerHTML
                ribbon.dataset.duped = '1'
              }
              gsap.to(ribbon, {
                x: -totalWidth,
                duration: totalWidth / 80,
                ease: 'linear',
                repeat: -1,
                onRepeat: () => { gsap.set(ribbon, { x: 0 }) },
              })
            }

            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={root}
      id="about"
      className="relative min-h-screen overflow-hidden bg-black text-white opacity-0"
      aria-label="About — phased reveal"
    >
      {/* ambient sweep */}
      <div
        id="ambientSweep"
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.30] mix-blend-screen"
        style={{
          background:
            'repeating-linear-gradient(110deg, rgba(34,211,238,0.06) 0 24px, rgba(34,211,238,0.0) 24px 48px)',
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 0%',
        }}
      />

      {/* контент */}
      <div
        id="aboutBody"
        className="relative z-[4] container mx-auto px-4 sm:px-6 md:px-12 lg:px-18 pt-12 sm:pt-16 md:pt-20 space-y-12 max-w-[1920px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* левая колонка */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-[700px]">
            {/* Заголовок */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-500 leading-tight">
              Обо мне
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-white/85">
              Я ускоряю интерфейсы и делаю их выразительными: меньше трения — больше ощущения продукта.
            </p>

            <p className="text-sm sm:text-base md:text-lg opacity-90">
              За последние годы собрал десятки интерфейсов на <b>Next.js</b> и <b>TypeScript</b> — от промо-страниц до сложных дашбордов. Люблю анимацию, но только когда она усиливает смысл: <b>GSAP</b>, микро-взаимодействия и внимание к деталям.
            </p>

            <p className="text-sm sm:text-base md:text-lg opacity-90">
              Важное для меня: производительность, доступность, дизайн-система и понятная архитектура. Пишу чисто и предсказуемо, чтобы команда двигалась быстро.
            </p>

            {/* скилл-бары */}
            <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 md:space-y-5">
              {[
                { label: 'Next.js / React', val: 95 },
                { label: 'TypeScript', val: 92 },
                { label: 'GSAP / ScrollTrigger', val: 90 },
                { label: 'Three.js / WebGL', val: 80 },
                { label: 'Perf / A11y', val: 88 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs md:text-sm text-white/70">
                    <span>{s.label}</span>
                    <span>{s.val}%</span>
                  </div>
                  <div className="h-1 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="skill-fill h-full rounded-full"
                      data-value={s.val}
                      style={{
                        width: 0,
                        background: 'linear-gradient(90deg, rgba(34,211,238,0.35), rgba(34,211,238,1))',
                        boxShadow: '0 0 8px rgba(34,211,238,0.35) inset',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div id="aboutCTA" className="mt-6 sm:mt-8 md:mt-10">
              <a
                href="#projects"
                className="relative inline-flex items-center gap-2 rounded-full border border-cyan-500/40 px-4 sm:px-5 py-2 text-sm sm:text-base md:text-lg font-medium text-white hover:bg-white/5 transition-colors will-change-transform"
              >
                Смотреть проекты →
              </a>
            </div>
          </div>

          {/* правая колонка — карточки */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {[
              { n: '95', s: '+', title: 'Lighthouse Perf', text: 'Оптимизация рендеринга, бандлов и ассетов.' },
              { n: '1', s: '×', title: 'Доступность', text: 'Фокус-стейты, контрасты, клавиатурная навигация.' },
              { n: '10', s: '+', title: 'Dev-опыт', text: 'ESLint/Prettier, Storybook, модульная архитектура.' },
              { n: '3', s: 'D', title: 'Визуал', text: 'Акценты на Three.js без перегруза UI.' },
            ].map((c, i) => (
              <div
                key={i}
                className="about-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 will-change-[transform,clip-path]"
              >
                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-500">{c.n}{c.s}{i === 2 && ' DX'}</div>
                  <div className="mt-1 text-[9px] sm:text-xs uppercase tracking-wider text-white/70">{c.title}</div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/75">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* карусель технологий с автоскроллом */}
        <div id="aboutBottom" className="relative z-[4] mt-10 sm:mt-14 overflow-hidden">
          <div
            ref={ribbonRef}
            id="aboutRibbonTrack"
            className="whitespace-nowrap flex gap-6 text-white/80 will-change-transform"
          >
            {[
              'Next.js','TypeScript','GSAP','Three.js','Accessibility','Design Systems',
              'Motion Design','Performance','DX','SSR/SSG','Animations','UI Kits'
            ].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="inline-block h-[6px] w-[6px] rounded-full bg-cyan-500/80" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
