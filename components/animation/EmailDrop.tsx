// components/EmailDrop.tsx
'use client'

import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
  email: string
  intervalMs?: number // интервал между «падениями»
  className?: string
}

const useIsoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function EmailDrop({ email, intervalMs = 2200, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const aRef = useRef<HTMLAnchorElement | null>(null)
  const bRef = useRef<HTMLAnchorElement | null>(null)
  const activeIsA = useRef(true)
  const timerRef = useRef<number | null>(null)
  const animating = useRef(false)

  // init layout
  useIsoLayout(() => {
    const wrap = wrapRef.current, a = aRef.current, b = bRef.current
    if (!wrap || !a || !b) return

    // фиксируем высоту по высоте строки
    const h = Math.ceil(a.getBoundingClientRect().height || 0)
    wrap.style.height = `${h}px`

    // стартовые позиции: A — видим, B — сверху
    gsap.set(a, { yPercent: 0 })
    gsap.set(b, { yPercent: -100 })
    a.style.pointerEvents = 'auto'
    b.style.pointerEvents = 'none'

    const tick = () => {
      if (animating.current) return
      animating.current = true

      const incoming = activeIsA.current ? b : a   // тот, что «падает» сверху
      const outgoing = activeIsA.current ? a : b   // текущий, который уезжает вниз

      // входящий: -100% -> 0%, исходящий: 0% -> +100%
      const tl = gsap.timeline({
        defaults: { duration: 0.55, ease: 'power3.inOut' },
        onComplete: () => {
          // сразу возвращаем ушедший наверх (готов к следующему «падению»)
          gsap.set(outgoing, { yPercent: -100 })
          // меняем активный
          activeIsA.current = !activeIsA.current
          // кликабельность только у видимого
          const vis = activeIsA.current ? a : b
          const invis = activeIsA.current ? b : a
          vis.style.pointerEvents = 'auto'
          invis.style.pointerEvents = 'none'
          animating.current = false
        }
      })

      tl.fromTo(incoming, { yPercent: -100 }, { yPercent: 0 }, 0)
        .to(outgoing, { yPercent: 100 }, 0)
    }

    // автозапуск с интервалом
    const start = () => {
      if (timerRef.current) return
      timerRef.current = window.setInterval(tick, intervalMs) as unknown as number
    }
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    start()

    // пауза при ховере/фокусе (чтобы спокойно кликать)
    const onEnter = () => stop()
    const onLeave = () => start()
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    wrap.addEventListener('focusin', onEnter)
    wrap.addEventListener('focusout', onLeave)

    const onResize = () => {
      const nh = Math.ceil(a.getBoundingClientRect().height || 0)
      wrap.style.height = `${nh}px`
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
      wrap.removeEventListener('focusin', onEnter)
      wrap.removeEventListener('focusout', onLeave)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf([a, b])
    }
  }, [email, intervalMs])

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      aria-live="polite"
    >
      <a ref={aRef} href={`mailto:${email}`} className="absolute inset-0 block">
        <span className="truncate text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {email}
        </span>
      </a>
      <a ref={bRef} href={`mailto:${email}`} className="absolute inset-0 block">
        <span className="truncate text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {email}
        </span>
      </a>
    </div>
  )
}
