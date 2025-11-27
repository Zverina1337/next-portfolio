'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { gsap } from 'gsap'

// Безопасный useLayoutEffect для SSR
const useIsoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type EmailDropProps = {
  email: string
  intervalMs?: number
  className?: string
}

/**
 * EmailDrop — анимированный компонент email с эффектом "падения"
 * Email меняется каждые intervalMs, анимация останавливается при hover/focus
 */
export default function EmailDrop({ email, intervalMs = 2200, className = '' }: EmailDropProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const aRef = useRef<HTMLAnchorElement | null>(null)
  const bRef = useRef<HTMLAnchorElement | null>(null)
  const activeIsA = useRef(true)
  const timerRef = useRef<number | null>(null)
  const animating = useRef(false)

  // Установить высоту контейнера из невидимого measure элемента
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
      tl.fromTo(incoming, { yPercent: -100 }, { yPercent: 0 }, 0).to(outgoing, { yPercent: 100 }, 0)
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

    // Робастное измерение с повторными попытками
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
        wrap.style.height = '32px' // Безопасный fallback
        setupPositions()
        start()
      }
    }

    ensureMeasured()

    // Дождаться загрузки шрифтов
    const fontsReady: Promise<FontFaceSet> | undefined = (
      document as Document & { fonts?: FontFaceSet }
    ).fonts?.ready

    fontsReady?.then(() => {
      if (!destroyed) ensureMeasured()
    })

    window.addEventListener('load', ensureMeasured)

    // Остановить анимацию при hover/focus для удобства клика на mailto
    const onEnter = () => stop()
    const onLeave = () => start()
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    wrap.addEventListener('focusin', onEnter)
    wrap.addEventListener('focusout', onLeave)

    // Синхронизировать высоту с метриками шрифта
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
      {/* Невидимый measure элемент для точной высоты (с символами с выносными элементами) */}
      <span
        ref={measureRef}
        style={{ visibility: 'hidden' }}
        className="block whitespace-nowrap leading-[1.2]"
      >
        <span className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight pb-[0.03em]">
          gjpqy {email}
        </span>
      </span>
      <a ref={aRef} href={`mailto:${email}`} className="absolute inset-0 block will-change-transform">
        <span className="whitespace-nowrap leading-[0.8] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white pb-[0.03em]">
          {email}
        </span>
      </a>
      <a ref={bRef} href={`mailto:${email}`} className="absolute inset-0 block will-change-transform">
        <span className="whitespace-nowrap leading-[0.8] text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white pb-[0.03em]">
          {email}
        </span>
      </a>
    </div>
  )
}
