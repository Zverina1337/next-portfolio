'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PT_Sans_Narrow } from 'next/font/google'

// Fonts (with Cyrillic)
const ptSansNarrow = PT_Sans_Narrow({ subsets: ['latin', 'cyrillic'], weight: ['400', '700'], display: 'swap' })

export type ContactBlockProps = {
  id?: string
  className?: string
  accent?: string // HEX (default #22d3ee)
  email: string
  intervalMs?: number // how often email "drops"
  navLinks?: { label: string; href: string }[]
  socials?: { behance?: string; linkedin?: string; instagram?: string; x?: string; telegram?: string; whatsapp?: string }
  ornamentVariant?: 'tech' | 'chevron'
}

const useIsoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useReducedMotion() {
  const [v, setV] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setV(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return v
}

function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// EmailDrop — simple top→down swap of the same email (clickable)
function EmailDrop({ email, intervalMs = 2200, className = '' }: { email: string; intervalMs?: number; className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const aRef = useRef<HTMLAnchorElement | null>(null)
  const bRef = useRef<HTMLAnchorElement | null>(null)
  const activeIsA = useRef(true)
  const timerRef = useRef<number | null>(null)
  const animating = useRef(false)

  // set height from the invisible measure line
  const setHeightFromMeasure = () => {
    const wrap = wrapRef.current
    const measure = measureRef.current
    if (!wrap || !measure) return 0
    const h = Math.ceil(measure.getBoundingClientRect().height || 0)
    wrap.style.height = `${Math.max(1, h)}px`
    return h
  }

  useIsoLayout(() => {
    const wrap = wrapRef.current
    const a = aRef.current
    const b = bRef.current
    if (!wrap || !a || !b) return

    let destroyed = false

    const setupPositions = () => {
      gsap.set([a, b], { clearProps: 'y,yPercent' })
      gsap.set(a, { yPercent: 0 })
      gsap.set(b, { yPercent: -100 })
      a.style.pointerEvents = 'auto'
      b.style.pointerEvents = 'none'
    }

    const tick = () => {
      if (animating.current) return
      animating.current = true
      const incoming = activeIsA.current ? b : a
      const outgoing = activeIsA.current ? a : b
      const tl = gsap.timeline({
        defaults: { duration: 0.55, ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(outgoing, { yPercent: -100 })
          activeIsA.current = !activeIsA.current
          const vis = activeIsA.current ? a : b
          const invis = activeIsA.current ? b : a
          vis.style.pointerEvents = 'auto'
          invis.style.pointerEvents = 'none'
          animating.current = false
        },
      })
      tl.fromTo(incoming, { yPercent: -100 }, { yPercent: 0 }, 0)
        .to(outgoing, { yPercent: 100 }, 0)
    }

    const start = () => {
      if (!timerRef.current) {
        timerRef.current = window.setInterval(tick, intervalMs) as unknown as number
      }
    }
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    // robust measuring retries
    let attempts = 0
    const ensureMeasured = () => {
      const h = setHeightFromMeasure()
      if (h > 0) {
        setupPositions()
        start()
        return
      }
      attempts += 1
      if (attempts < 20) {
        requestAnimationFrame(ensureMeasured)
      } else {
        wrap.style.height = '32px' // safe fallback
        setupPositions()
        start()
      }
    }

    ensureMeasured();
    const fontsReady: Promise<FontFaceSet> | undefined =
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready;

    fontsReady?.then(() => {
      if (!destroyed) ensureMeasured();
    });
    window.addEventListener('load', ensureMeasured)

    // pause on hover/focus so mailto is easy to click
    const onEnter = () => stop()
    const onLeave = () => start()
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    wrap.addEventListener('focusin', onEnter)
    wrap.addEventListener('focusout', onLeave)

    // keep height in sync with font metrics
    const ro = new ResizeObserver(() => setHeightFromMeasure())
    if (measureRef.current) ro.observe(measureRef.current)

    return () => {
      destroyed = true
      stop()
      window.removeEventListener('load', ensureMeasured)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
      wrap.removeEventListener('focusin', onEnter)
      wrap.removeEventListener('focusout', onLeave)
      ro.disconnect()
      gsap.killTweensOf([a, b])
    }
  }, [email, intervalMs])

  return (
    <div ref={wrapRef} className={clsx('relative overflow-hidden', className)} aria-live="polite">
      {/* invisible measure line for accurate height (kept in layout) */}
      <span ref={measureRef} style={{ visibility: 'hidden' }} className="block whitespace-nowrap leading-[1.2]">
        <span className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight pb-[0.03em]">gjpqy {email}</span>
      </span>
      <a ref={aRef} href={`mailto:${email}`} className="absolute inset-0 block will-change-transform">
        <span className="whitespace-nowrap leading-[1.2] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white pb-[0.03em]">{email}</span>
      </a>
      <a ref={bRef} href={`mailto:${email}`} className="absolute inset-0 block will-change-transform">
        <span className="whitespace-nowrap leading-[1.2] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white pb-[0.03em]">{email}</span>
      </a>
    </div>
  )
}

export default function ContactBlock({
  id = 'contact',
  className,
  accent = '#22d3ee',
  email = 'danii.zvorugin@gmail.com',
  intervalMs = 2200,
  navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'CONTACT', href: '#contact' },
  ],
  socials = {},
  ornamentVariant = 'tech',
}: ContactBlockProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const zoneRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const prefersReduced = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  // Entrance animations
  useIsoLayout(() => {
    const ctx = gsap.context(() => {
      const base = { duration: prefersReduced ? 0.2 : 0.9, ease: 'power3.out' as const }
      gsap.set('[data-heading]', { autoAlpha: 0, y: 24 })
      gsap.set('[data-title]', { autoAlpha: 0, y: 24 })
      gsap.set(buttonRef.current, { autoAlpha: 0, y: 10 })
      gsap.set('[data-nav] a', { autoAlpha: 0, y: 16 })
      gsap.set('[data-info] > *', { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true } })
      tl.to('[data-heading]', { autoAlpha: 1, y: 0, ...base })
        .to('[data-title]', { autoAlpha: 1, y: 0, ...base }, '-=0.6')
        .to(buttonRef.current, { autoAlpha: 1, y: 0, ...base }, '-=0.6')
        .to('[data-nav] a', { autoAlpha: 1, y: 0, stagger: prefersReduced ? 0.02 : 0.06, ...base }, '-=0.6')
        .to('[data-info] > *', { autoAlpha: 1, y: 0, stagger: prefersReduced ? 0.02 : 0.06, ...base }, '-=0.6')
    }, rootRef)
    return () => ctx.revert()
  }, [prefersReduced])

  // Magnetic button (smooth to cursor)
  useIsoLayout(() => {
    const zone = zoneRef.current
    const btn = buttonRef.current
    if (!zone || !btn) return
    if (prefersReduced || isTouchDevice()) return

    const qx = gsap.quickTo(btn, 'x', { duration: 0.65, ease: 'expo.out' })
    const qy = gsap.quickTo(btn, 'y', { duration: 0.65, ease: 'expo.out' })
    const qrot = gsap.quickTo(btn, 'rotate', { duration: 0.65, ease: 'expo.out' })
    const qsc = gsap.quickTo(btn, 'scale', { duration: 0.65, ease: 'expo.out' })

    const MAX_SHIFT = 220 // px

    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const R = Math.max(1, Math.min(r.width, r.height) * 0.5)
      let nx = (e.clientX - cx) / R
      let ny = (e.clientY - cy) / R
      nx = Math.max(-1, Math.min(1, nx))
      ny = Math.max(-1, Math.min(1, ny))
      const mag = Math.hypot(nx, ny)
      const eased = Math.pow(Math.min(1, mag), 0.6)
      const dirx = mag ? nx / mag : 0
      const diry = mag ? ny / mag : 0
      const dx = dirx * MAX_SHIFT * eased
      const dy = diry * MAX_SHIFT * eased
      qx(dx); qy(dy); qrot(dx * 0.06); qsc(1 + 0.04 * eased)
    }

    const onLeave = () => { qx(0); qy(0); qrot(0); qsc(1) }

    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
    }
  }, [prefersReduced])

  const style = { ['--accent' as string]: accent } as React.CSSProperties

  return (
    <section
      id={id}
      ref={rootRef}
      style={style}
      className={clsx(
        'relative isolate overflow-hidden',
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        'py-24 sm:py-28 lg:py-32',
        'bg-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30',
        className,
      )}
    >
      {/* Futuristic top separator */}
      {ornamentVariant === 'tech' ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-1 text-[color:var(--accent)]">
          <div className="mx-4">
            <svg className="w-full h-10 [filter:drop-shadow(0_0_12px_color-mix(in_oklab,var(--accent),transparent_70%))]" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="segGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="transparent" />
                  <stop offset="0.2" stopColor="currentColor" />
                  <stop offset="0.8" stopColor="currentColor" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 20 H140 l12-8 h56 l12 8 H340 l16-10 h84 l16 10 h120 l22-12 h40 l22 12 H900 l16-8 h64 l16 8 H1200" pathLength="1200" strokeDasharray="120 1080">
                  <animate attributeName="stroke-dashoffset" from="0" to="-1200" dur="7s" repeatCount="indefinite" />
                </path>
                <path d="M0 20 H140 l12-8 h56 l12 8 H340 l16-10 h84 l16 10 h120 l22-12 h40 l22 12 H900 l16-8 h64 l16 8 H1200" stroke="url(#segGrad)" opacity="0.9" />
                <circle cx="180" cy="20" r="1.8" />
                <circle cx="520" cy="20" r="1.8" />
                <circle cx="880" cy="20" r="1.8" />
              </g>
            </svg>
          </div>
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-1 text-[color:var(--accent)]">
          <div className="mx-4">
            <svg className="w-full h-10 [filter:drop-shadow(0_0_10px_color-mix(in_oklab,var(--accent),transparent_70%))]" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="transparent" />
                  <stop offset="0.15" stopColor="currentColor" />
                  <stop offset="0.85" stopColor="currentColor" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
                <pattern id="chevPat" width="40" height="12" patternUnits="userSpaceOnUse">
                  <g>
                    <path d="M4 2 L14 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24 2 L34 6 L24 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="40 0" dur="3.2s" repeatCount="indefinite" />
                  </g>
                </pattern>
              </defs>
              {/* base beam */}
              <rect x="0" y="19" width="1200" height="2" fill="url(#beamGrad)" />
              {/* chevrons overlay */}
              <rect x="0" y="13" width="1200" height="14" fill="url(#chevPat)" fillOpacity="0.9" />
              {/* end caps */}
              <circle cx="12" cy="20" r="1.6" fill="currentColor" />
              <circle cx="1188" cy="20" r="1.6" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
      <div data-heading className="text-center mb-6 sm:mb-8">
        <div className="text-xs sm:text-sm tracking-[0.2em] text-slate-300/80 uppercase">READY TO WORK?</div>
      </div>

      <div ref={zoneRef} className="relative select-none mb-12 sm:mb-14">
        <h1
          data-title
          className={clsx(
            ptSansNarrow.className,
            'block w-full text-center font-extrabold whitespace-nowrap leading-[0.8] text-[color:var(--accent)] text-[clamp(4rem,21vw,24rem)]'
          )}
        >
          CONTACT ME
        </h1>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <button
            ref={buttonRef}
            onClick={() => { window.location.href = 'mailto:' + (email || '') }}
            className={clsx(
              'pointer-events-auto group inline-flex items-center gap-4 rounded-full border-2 px-8 sm:px-10 py-3 sm:py-4',
              'bg-black border-white/10 backdrop-blur-md',
              'transition-transform duration-300 will-change-transform',
            )}
          >
            <span className="text-xl sm:text-2xl font-semibold tracking-wide text-white">CONTACT</span>
            <span className="grid place-items-center rounded-full border-2 w-10 h-10 sm:w-12 sm:h-12 border-white/20 bg-white/[0.03] ring-1 ring-inset ring-[color:var(--accent)]/30">
              <IconArrow className="w-5 h-5 text-[color:var(--accent)]" />
            </span>
          </button>
        </div>
      </div>

      <nav data-nav className="mb-8 sm:mb-10 flex items-center justify-center gap-4 sm:gap-6 text-sm text-slate-300/90">
        {navLinks?.map((l, i) => (
          <React.Fragment key={l.href}>
            {i > 0 && <span className="text-[color:var(--accent)]/80">✦</span>}
            <a
              href={l.href}
              className={clsx(
                'relative px-1 py-0.5',
                'text-slate-300/90 hover:text-white transition-colors',
                'after:content-[""] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full',
                'after:bg-[color:var(--accent)] after:origin-left after:scale-x-0 after:transition-transform after:duration-300',
                'hover:after:scale-x-100 focus-visible:after:scale-x-100'
              )}
            >
              {l.label}
            </a>
          </React.Fragment>
        ))}
      </nav>

      <div data-info className="mb-2 grid grid-cols-1 md:grid-cols-2 border-y border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div className="p-5 sm:p-6 text-slate-300/90">
          <p className="max-w-xl text-sm sm:text-base">ЕСТЬ КАКАЯ-НИБУДЬ ИДЕЯ? ДАВАЙ ОБСУДИМ И СДЕЛАЕМ ЧТО-НИБУДЬ КРУТОЕ ВМЕСТЕ!</p>
        </div>
        <div className="p-5 sm:p-6 flex items-center">
          <EmailDrop email={email} intervalMs={intervalMs} />
        </div>
      </div>

      {(socials?.behance || socials?.linkedin || socials?.instagram || socials?.x || socials?.telegram || socials?.whatsapp) && (
        <div data-socials className="mt-6 flex flex-wrap gap-3">
          {socials?.behance && <Chip href={socials.behance}>BEHANCE</Chip>}
          {socials?.linkedin && <Chip href={socials.linkedin}>LINKEDIN</Chip>}
          {socials?.instagram && <Chip href={socials.instagram}>INSTAGRAM</Chip>}
          {socials?.x && <Chip href={socials.x}>X</Chip>}
          {socials?.telegram && <Chip href={socials.telegram}>TELEGRAM</Chip>}
          {socials?.whatsapp && <Chip href={socials.whatsapp}>WHATSAPP</Chip>}
        </div>
      )}
    
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-20%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </section>
  )
}

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-wide',
        'border-2 border-white/15 text-slate-200 hover:text-white',
        'hover:border-[color:var(--accent)]/60 hover:bg-[color:var(--accent)]/10',
        'transition-colors',
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
      {children}
    </a>
  )
}

function IconArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
