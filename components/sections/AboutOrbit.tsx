'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import getMasterTl from '@/components/lib/useMasterTl'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = (() => void) | null

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function AboutScrollPhases() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    if (!section) return

    const tlMaster = getMasterTl()
    let cleanupScene: CleanupFn = null
    let callbackTween: gsap.core.Tween | null = null
    let ribbonTween: gsap.core.Tween | null = null

    const makeVarSetters = (el: HTMLElement) => ({
      setMX: (v: number) => el.style.setProperty('--mx', `${v}px`),
      setMY: (v: number) => el.style.setProperty('--my', `${v}px`),
    })

    const buildMagneticCTA = () => {
      const cta = section.querySelector<HTMLAnchorElement>('#aboutCTA a')
      const spot = cta?.querySelector<HTMLSpanElement>('.cta-spot')
      if (!cta || !spot) return () => {}

      const { setMX, setMY } = makeVarSetters(spot)
      const qScale = gsap.quickTo(cta, 'scale', { duration: 0.18, ease: 'power2.out' })
      const qShadow = (v: string) => gsap.to(cta, { filter: v, duration: 0.2, ease: 'power2.out' })
      const qInner  = (v: string) => gsap.to(cta, { boxShadow: v, duration: 0.2, ease: 'power2.out' })

      let rect: DOMRect | null = null
      const onEnter = () => {
        rect = cta.getBoundingClientRect()
        qScale(1.03)
        qShadow('drop-shadow(0 8px 28px rgba(34,211,238,0.20))')
        qInner('inset 0 0 0 1px rgba(34,211,238,0.35)')
        gsap.to(spot, { opacity: 1, duration: 0.15, ease: 'power2.out' })
      }
      const onMove = (e: MouseEvent) => {
        if (!rect) rect = cta.getBoundingClientRect()
        setMX(e.clientX - rect.left)
        setMY(e.clientY - rect.top)
      }
      const onLeave = () => {
        qScale(1)
        qShadow('none')
        qInner('inset 0 0 0 0 rgba(0,0,0,0)')
        gsap.to(spot, { opacity: 0, duration: 0.2, ease: 'power2.out' })
        rect = null
      }

      cta.addEventListener('mouseenter', onEnter)
      cta.addEventListener('mousemove', onMove)
      cta.addEventListener('mouseleave', onLeave)
      return () => {
        cta.removeEventListener('mouseenter', onEnter)
        cta.removeEventListener('mousemove', onMove)
        cta.removeEventListener('mouseleave', onLeave)
      }
    }

    const buildCardHover = () => {
      const cards = Array.from(section.querySelectorAll<HTMLDivElement>('.about-card'))
      const cleans: Array<() => void> = []

      cards.forEach((card) => {
        const spot = card.querySelector<HTMLElement>('.hover-spot')
        if (!spot) return
        const { setMX, setMY } = makeVarSetters(spot)
        const qScale   = gsap.quickTo(card, 'scale',   { duration: 0.18, ease: 'power2.out' })
        const qY       = gsap.quickTo(card, 'y',       { duration: 0.18, ease: 'power2.out' })
        const qOpacity = gsap.quickTo(spot, 'opacity', { duration: 0.15, ease: 'power2.out' })
        const qShadow  = (v: string) => gsap.to(card, { filter: v,    duration: 0.18, ease: 'power2.out' })
        const qInner   = (v: string) => gsap.to(card, { boxShadow: v, duration: 0.18, ease: 'power2.out' })

        let rect: DOMRect | null = null
        const onEnter = () => {
          rect = card.getBoundingClientRect()
          qScale(1.03); qY(-2); qOpacity(1)
          qShadow('drop-shadow(0 10px 30px rgba(34,211,238,0.20))')
          qInner('inset 0 0 0 1px rgba(34,211,238,0.25)')
        }
        const onMove = (e: MouseEvent) => {
          if (!rect) rect = card.getBoundingClientRect()
          setMX(e.clientX - rect.left)
          setMY(e.clientY - rect.top)
        }
        const onLeave = () => {
          qScale(1); qY(0); qOpacity(0)
          qShadow('none')
          qInner('inset 0 0 0 0 rgba(0,0,0,0)')
          rect = null
        }

        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        cleans.push(() => {
          card.removeEventListener('mouseenter', onEnter)
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => cleans.forEach((fn) => fn())
    }

    const buildScene = () => {
      if (cleanupScene) return

      gsap.set(section, { opacity: 1 })
      gsap.set('#aboutHero', { left: '50%', top: '50%', xPercent: -50, yPercent: -50, scale: 1, opacity: 1 })
      gsap.set('#aboutBody', { opacity: 0, y: 20 })
      gsap.set('#aboutUnderline', { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.set('.about-card', { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' })
      gsap.set('.skill-fill', { width: 0 })
      gsap.set('#aboutCTA', { opacity: 0, y: 16 })
      gsap.set('#aboutSheen, .card-sheen', { opacity: 0, backgroundPositionX: '-120%' })
      gsap.set('.glow-ring', { opacity: 0, scale: 0.96 })
      gsap.set('#ambientSweep', { backgroundPosition: '0% 0%' })
      gsap.set('#aboutDivider', { scaleX: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=240%',
          scrub: true,
          pin: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('#ambientSweep', { backgroundPosition: '200% 0%', duration: 1.2, ease: 'none' }, 0)
      tl.to('#aboutHero', { scale: 0.98, duration: 0.25, ease: 'power1.out' }, 0.02)
      tl.to('#aboutHero', {
        left: 24, top: 96, xPercent: 0, yPercent: 0, scale: 0.62, duration: 0.55, ease: 'power2.inOut',
      }, 0.24)

      tl.to('#aboutUnderline', { scaleX: 1, duration: 0.35, ease: 'power2.out' }, '>-0.15')
      tl.to('#aboutSheen', { opacity: 1, backgroundPositionX: '120%', duration: 0.6, ease: 'power2.out' }, '<')
      tl.to('#aboutSheen', { opacity: 0, duration: 0.25, clearProps: 'opacity,backgroundPositionX' }, '<+0.35')
      tl.to('#aboutBody', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '>-0.1')

      tl.to('.about-card', {
        opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power2.out', stagger: 0.12,
      }, '>-0.05')
      tl.to('.glow-ring', { opacity: 0.35, scale: 1.02, duration: 0.25, stagger: 0.12 }, '<')
      tl.to('.glow-ring', { opacity: 0.08, scale: 1.0,  duration: 0.35, stagger: 0.12 }, '>-0.15')
      tl.to('.card-sheen', {
        opacity: 1, backgroundPositionX: '130%', duration: 0.6, ease: 'power2.out', stagger: 0.12,
      }, '<')
      tl.to('.card-sheen', {
        opacity: 0, duration: 0.25, stagger: 0.12, clearProps: 'opacity,backgroundPositionX',
      }, '<+0.35')

      tl.to('.skill-fill', {
        width: (i, el) => (el as HTMLElement).dataset.value ? (el as HTMLElement).dataset.value + '%' : '0%',
        duration: 0.8, ease: 'power2.out', stagger: 0.08,
      }, '>-0.2')

      tl.to('#aboutCTA', { opacity: 1, y: 0, duration: 0.4 }, '>-0.1')
      tl.to('#aboutDivider', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '>-0.05')

      tl.add(() => {
        const track = section.querySelector('#aboutRibbonTrack') as HTMLElement | null
        if (!track) return
        if (!track.dataset.duped) {
          track.innerHTML = track.innerHTML + track.innerHTML
          track.dataset.duped = '1'
        }
        const run = () => {
          const w = track.scrollWidth / 2
          ribbonTween?.kill()
          gsap.set(track, { x: 0 })
          ribbonTween = gsap.to(track, {
            x: -w,
            duration: Math.max(12, w / 80),
            ease: 'none',
            repeat: -1,
            onRepeat() { gsap.set(track, { x: 0 }); }
          })
        }
        run()
        const ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(run) : null
        ro?.observe(track)

        // ✅ безопасная цепочка cleanup без optional-call
        cleanupScene = ((prev: CleanupFn) => () => {
          ro?.disconnect()
          ribbonTween?.kill()
          if (prev) prev()
        })(cleanupScene)
      }, '>-0.05')

      const cleanCards = buildCardHover()
      const cleanCTA = buildMagneticCTA()

      // ✅ общий cleanup — тоже без optional-call
      cleanupScene = ((prev: CleanupFn) => () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        ribbonTween?.kill()
        cleanCards()
        cleanCTA()
        ScrollTrigger.getAll().filter(st => st.vars.trigger === section).forEach(st => st.kill())
        if (prev) prev()
      })(cleanupScene)
    }

    if (hasLabel(tlMaster, 'about')) {
      callbackTween = gsap.to({}, { duration: 0, onComplete: buildScene })
      tlMaster!.add(callbackTween, 'about')
    } else {
      buildScene()
    }

    return () => {
      if (cleanupScene) cleanupScene()
      if (callbackTween) callbackTween.kill()
    }
  }, [])

  return (
    <section
      ref={root}
      id="about"
      className="relative min-h-[100svh] overflow-hidden bg-black text-white"
      aria-label="About — phased scroll reveal"
      style={{ opacity: 0 }}
    >
      {/* ambient sweep — мягкие диагональные полосы */}
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

      {/* точечный фон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40
                   bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
                   [background-size:12px_12px]"
      />

      {/* герой */}
      <div id="aboutHero" className="absolute z-[5] max-w-[92vw]" style={{ willChange: 'transform' }}>
        <h2
          className="text-[12vw] sm:text-[9vw] md:text-[8vw] font-extrabold leading-[0.9]
                     tracking-[-0.02em] text-cyan-500"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          Обо мне
        </h2>

        <div className="relative mt-2 h-1 w-[44vw] max-w-[420px] overflow-hidden rounded">
          <div id="aboutUnderline" className="absolute inset-y-0 left-0 w-full bg-cyan-500/80 origin-left scale-x-0" />
          <div
            id="aboutSheen"
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)',
              backgroundSize: '220% 100%',
              backgroundPositionX: '-120%',
              mixBlendMode: 'screen',
              opacity: 0,
            }}
          />
        </div>

        <p className="mt-4 max-w-[70vw] sm:max-w-[400px] text-base sm:text-2xl text-white/85">
          Я ускоряю интерфейсы и делаю их выразительными: меньше трения — больше ощущения продукта.
        </p>
      </div>

      {/* контент */}
      <div id="aboutBody" className="relative z-[4] container mx-auto px-6 pt-[220px] md:pt-[275px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* левая колонка */}
          <div>
            <p className="text-base md:text-lg opacity-90">
              За последние годы собрал десятки интерфейсов на <b>Next.js</b> и <b>TypeScript</b> — от промо-страниц до
              сложных дашбордов. Люблю анимацию, но только когда она усиливает смысл: <b>GSAP</b>, <b>ScrollTrigger</b>,
              микро-взаимодействия и внимание к деталям.
            </p>

            <p className="mt-4 text-base md:text-lg opacity-90">
              Важное для меня: производительность, доступность, дизайн-система и понятная архитектура. Пишу чисто и
              предсказуемо, чтобы команда двигалась быстро.
            </p>

            {/* скилл-бары */}
            <div className="mt-6 space-y-3">
              {[
                { label: 'Next.js / React', val: 95 },
                { label: 'TypeScript', val: 92 },
                { label: 'GSAP / ScrollTrigger', val: 90 },
                { label: 'Three.js / WebGL', val: 80 },
                { label: 'Perf / A11y', val: 88 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                    <span>{s.label}</span>
                    <span>{s.val}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="skill-fill h-full rounded-full"
                      data-value={s.val}
                      style={{
                        width: 0,
                        background: 'linear-gradient(90deg, rgba(34,211,238,0.35), rgba(34,211,238,1))',
                        boxShadow: '0 0 12px rgba(34,211,238,0.35) inset',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div id="aboutCTA" className="mt-6">
              <a
                href="#projects"
                className="relative inline-flex items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2
                           text-sm font-medium text-white hover:bg-white/5 transition-colors will-change-transform"
              >
                <span
                  className="cta-spot pointer-events-none absolute inset-0 opacity-0 rounded-full"
                  style={{
                    ['--mx' as any]: '24px',
                    ['--my' as any]: '12px',
                    background:
                      'radial-gradient(120px 80px at var(--mx) var(--my), rgba(34,211,238,0.27), rgba(34,211,238,0) 60%)',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(6px)',
                  }}
                />
                Смотреть проекты →
              </a>
            </div>
          </div>

          {/* правая колонка — карточки */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '95', s: '+', title: 'Lighthouse Perf', text: 'Оптимизация рендеринга, бандлов и ассетов.' },
              { n: '1',  s: '×', title: 'Доступность',      text: 'Фокус-стейты, контрасты, клавиатурная навигация.' },
              { n: '10', s: '+', title: 'Dev-опыт',         text: 'ESLint/Prettier, Storybook, модульная архитектура.' },
              { n: '3',  s: 'D', title: 'Визуал',           text: 'Акценты на Three.js без перегруза UI.' },
            ].map((c, i) => (
              <div
                key={i}
                className="about-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 will-change-[transform,clip-path]"
                style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
              >
                <span
                  className="glow-ring pointer-events-none absolute inset-[-1px] rounded-2xl"
                  style={{
                    background: 'radial-gradient(80% 80% at 50% 50%, rgba(34,211,238,0.45), rgba(34,211,238,0) 70%)',
                    filter: 'blur(6px)',
                    opacity: 0,
                    transform: 'scale(0.96)',
                    WebkitMaskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
                    maskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
                  }}
                  aria-hidden
                />
                <span
                  className="card-sheen pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen"
                  style={{
                    background:
                      'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: '220% 100%',
                    backgroundPositionX: '-120%',
                    opacity: 0,
                    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
                    maskImage: 'linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)',
                  }}
                  aria-hidden
                />
                <div
                  className="hover-spot pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    ['--mx' as any]: '50px',
                    ['--my' as any]: '50px',
                    background:
                      'radial-gradient(140px 140px at var(--mx) var(--my), rgba(34,211,238,0.22), rgba(34,211,238,0) 60%)',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                  }}
                  aria-hidden
                />
                <div className="relative z-10">
                  <div className="text-3xl font-extrabold text-cyan-500">
                    {c.n}{c.s}{i === 2 && ' DX'}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/70">{c.title}</div>
                  <p className="mt-2 text-sm text-white/75">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* низ секции */}
        <div id="aboutBottom" className="relative z-[4] mt-14">
          <div
            id="aboutDivider"
            className="mx-auto h-[2px] w-[88%] max-w-4xl origin-left bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent"
          />
          <div id="aboutRibbon" className="mt-6 relative mx-auto w-full overflow-hidden py-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
            <div id="aboutRibbonTrack" className="whitespace-nowrap will-change-transform text-white/80">
              {[
                'Next.js','TypeScript','GSAP','Three.js','Accessibility','Design Systems',
                'Motion Design','Performance','DX','SSR/SSG','Animations','UI Kits'
              ].map((t, i) => (
                <span key={i} className="mx-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                  <span className="inline-block h-[6px] w-[6px] rounded-full bg-cyan-500/80" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2
                         text-sm font-medium text-white hover:bg-white/5 transition-colors"
            >
              Смотреть проекты →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
