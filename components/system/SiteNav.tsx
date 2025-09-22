'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import getMasterTl from '@/components/lib/useMasterTl'

type NavItem = { href: string; label: string; idx: string }
const NAV: NavItem[] = [
  { href: '#home',     label: 'Домой',      idx: '01' },
  { href: '#about',    label: 'Обо мне',    idx: '02' },
  { href: '#projects', label: 'Проекты',    idx: '03' },
  { href: '#contact',  label: 'Контакты',   idx: '04' },
]

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function SiteNav() {
  const root = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const overlayTl = useRef<gsap.core.Timeline | null>(null)
  const marqueeTween = useRef<gsap.core.Tween | null>(null)
  const [open, setOpen] = useState(false)

  // ===== Intro: регистрируем header в master TL @ 'hero' (или локально) =====
  useLayoutEffect(() => {
    if (!root.current) return
    const tl = getMasterTl()

    const ctx = gsap.context(() => {
      const navIntro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          headerRef.current,
          { yPercent: -100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6 }
        )

      if (hasLabel(tl, 'hero')) {
        tl!.add(navIntro, 'hero') // синхронно с героем
      } else {
        navIntro.play(0) // фолбэк без задержки
      }
    }, root)

    return () => ctx.revert()
  }, [])

  // ===== Overlay menu timeline — создать ОДИН РАЗ =====
  useLayoutEffect(() => {
    if (!overlayRef.current) return
    const ctx = gsap.context(() => {
      gsap.set('#overlayClip', { clipPath: 'circle(0% at 100% 0%)' })
      gsap.set('.ov-item', { y: 20, opacity: 0 })

      overlayTl.current = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to('#overlayClip', { clipPath: 'circle(150% at 50% 50%)', duration: 0.5 }, 0)
        .to('.ov-item', { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, 0.1)
    }, overlayRef)

    return () => { ctx.revert(); overlayTl.current = null }
  }, [])

  // ===== Открыть/закрыть overlay без лагов =====
  useEffect(() => {
    const tl = overlayTl.current
    const node = overlayRef.current
    if (!tl || !node) return
    if (open) {
      node.classList.remove('pointer-events-none')
      tl.play(0)
    } else {
      tl.reverse().then(() => node.classList.add('pointer-events-none'))
    }
  }, [open])

  // ===== auto-hide header + scroll-spy =====
  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      const dirDown = y > lastY && y > 10
      lastY = y
      if (!open) {
        gsap.to(headerRef.current, {
          yPercent: dirDown ? -100 : 0,
          duration: 0.35,
          ease: 'power2.out',
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const sections = NAV.map(n => document.querySelector(n.href) as HTMLElement | null).filter(Boolean) as HTMLElement[]
    const ob = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id
        const link = document.querySelector(`a[href="${id}"]`)
        if (link && entry.isIntersecting) {
          document.querySelectorAll('a[data-active="true"]').forEach(el => el.setAttribute('data-active', 'false'))
          link.setAttribute('data-active', 'true')
        }
      })
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 })
    sections.forEach(s => ob.observe(s))

    return () => { window.removeEventListener('scroll', onScroll); ob.disconnect() }
  }, [open])

  // ===== hover underline for topbar links =====
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.nav-link'))
    links.forEach(a => {
      const line = a.querySelector('.u') as HTMLSpanElement | null
      const t = a.querySelector('.t') as HTMLElement | null
      if (!line || !t) return
      const enter = () => { gsap.to(line, { scaleX: 1, duration: 0.25, ease: 'power2.out' }); gsap.to(t, { y: -2, duration: 0.18 }) }
      const leave = () => { gsap.to(line, { scaleX: 0, duration: 0.3, ease: 'power2.out' }); gsap.to(t, { y: 0, duration: 0.18 }) }
      a.addEventListener('mouseenter', enter)
      a.addEventListener('mouseleave', leave)
    })
    return () => { links.forEach(a => a.replaceWith(a.cloneNode(true))) }
  }, [])

  // ===== «Магнит» на кнопке =====
  useEffect(() => {
    const btn = document.getElementById('menuBtn')
    const magnet = document.getElementById('menuBtnMagnet')
    const reset = () => gsap.to(magnet, { x: 0, y: 0, scale: 1, duration: 0.2 })
    if (btn && magnet) {
      const over = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = (e.clientX - cx) * 0.15
        const dy = (e.clientY - cy) * 0.15
        gsap.to(magnet, { x: dx, y: dy, scale: 1.04, duration: 0.15, ease: 'power2.out' })
      }
      btn.addEventListener('mousemove', over)
      btn.addEventListener('mouseleave', reset)
      return () => { btn.removeEventListener('mousemove', over); btn.removeEventListener('mouseleave', reset) }
    }
  }, [])

  // ===== Бесконечный тикер «AVAILABLE — MAY 2025» в header =====
  useLayoutEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      const track = headerRef.current!.querySelector('#availabilityTrack') as HTMLElement | null
      if (!track) return

      // дублируем контент один раз для бесшовной прокрутки
      if (!track.dataset.duped) {
        track.innerHTML = track.innerHTML + track.innerHTML
        track.dataset.duped = '1'
      }

      const container = track.parentElement as HTMLElement
      const setupMarquee = () => {
        const w = track.scrollWidth / 2 // ширина оригинального набора
        marqueeTween.current?.kill()
        gsap.set(track, { x: 0 })
        // скорость ~40px/с, но не меньше 10с на цикл
        const duration = Math.max(10, w / 40)
        marqueeTween.current = gsap.to(track, {
          x: -w,
          duration,
          ease: 'none',
          repeat: -1,
          onRepeat() { gsap.set(track, { x: 0 }) },
        })
      }

      // пересчитываем на ресайз контейнера/окна
      const ro = new ResizeObserver(() => setupMarquee())
      ro.observe(container)
      window.addEventListener('resize', setupMarquee)

      setupMarquee()

      return () => {
        marqueeTween.current?.kill()
        ro.disconnect()
        window.removeEventListener('resize', setupMarquee)
      }
    }, headerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative">
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[60] backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-foreground/10"
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center sm:gap-6 gap-0">
            <Link href="#home" className="font-medium">Zverinacode</Link>

            <div id="availability" className="sm:inline-flex hidden items-center gap-3 rounded-full border border-foreground/15 px-4 py-1">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" />
              <div className="relative w-[200px] overflow-hidden">
                <div id="availabilityTrack" className="whitespace-nowrap will-change-transform" aria-hidden>
                  <span className="mr-8 opacity-90">Next.js 14 • TypeScript • GSAP</span>
                  <span className="mr-8 opacity-90">Tailwind CSS • shadcn/ui</span>
                  <span className="mr-8 opacity-90">Чистая архитектура • Переиспользуемый UI</span>
                  <span className="mr-8 opacity-90">Доступен к проектам — Q4 2025</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="menuBtn"
            onClick={() => setOpen(o => !o)}
            className="group cursor-pointer relative inline-flex items-center justify-center rounded-full border border-foreground/15 px-4 py-1.5 text-sm"
            aria-expanded={open}
            aria-controls="overlayMenu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span id="menuBtnMagnet" className="relative inline-flex items-center justify-center">
              <span className="relative block h-[1.25rem] w-[3.5rem] overflow-hidden">
                <span className={'absolute inset-0 flex items-center justify-center transition-opacity duration-150 ' + (open ? 'opacity-0' : 'opacity-100')}>Меню</span>
                <span className={'absolute inset-0 flex items-center justify-center transition-opacity duration-150 ' + (open ? 'opacity-100' : 'opacity-0')}>Закрыть</span>
              </span>
            </span>
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        id="overlayMenu"
        className="pointer-events-none fixed inset-0 z-[50] grid place-items-center"
      >
        <div
          id="overlayClip"
          className="absolute inset-0 bg-background"
          style={{ clipPath: 'circle(0% at 100% 0%)' }}
        />
        <div className="relative z-10 grid place-items-center">
          <ul className="space-y-3 text-center">
            {NAV.map(n => (
              <li key={'ov-'+n.idx} className="ov-item cursor-pointer">
                <a href={n.href} onClick={() => setOpen(false)} className="text-3xl font-bold md:text-5xl">
                  <span className="inline-flex items-center gap-3">
                    <span className="text-cyan-500/90">{n.idx}</span>
                    <span>{n.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
