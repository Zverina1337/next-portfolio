// components/typography/KineticSlogan.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

type Variant = 'fade-up' | 'flip'

type Props = {
  phrases: string[]
  variant?: Variant
  loop?: boolean
  holdMs?: number        // пауза после появления
  inStagger?: number     // задержка между буквами (сек)
  className?: string
}

export default function AnimatedSlogan({
  phrases,
  variant = 'fade-up',
  loop = true,
  holdMs = 1600,
  inStagger = 0.04,
  className,
}: Props) {
  const [idx, setIdx] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<GSAPTimeline | null>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // безопасно разбиваем строку на символы (с учётом эмодзи/суррогатов)
  const chars = useMemo(() => [...(phrases[idx] ?? '')], [phrases, idx])

  // основной цикл анимации
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (prefersReduced) {
      // без анимации: просто автосмена текста
      if (!loop) return
      const t = setTimeout(() => setIdx(i => (i + 1) % phrases.length), holdMs)
      return () => clearTimeout(t)
    }

    const ctx = gsap.context(() => {
      const letters = Array.from(root.querySelectorAll<HTMLSpanElement>('.char'))
      if (!letters.length) return

      // сброс стилей
      gsap.set(letters, { clearProps: 'all' })

      tlRef.current?.kill()
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tlRef.current = tl

      if (variant === 'fade-up') {
        tl.fromTo(
          letters,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: inStagger }
        )
        tl.to(letters, { y: -12, opacity: 0, duration: 0.45, stagger: inStagger }, `+=${holdMs / 1000}`)
      } else if (variant === 'flip') {
        gsap.set(letters, { transformPerspective: 600 })
        tl.fromTo(
          letters,
          { rotateX: 90, y: 6, opacity: 0 },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.5, stagger: inStagger }
        )
        tl.to(letters, { rotateX: -90, y: -4, opacity: 0, duration: 0.4, stagger: inStagger }, `+=${holdMs / 1000}`)
      }

      tl.then(() => {
        if (loop) setIdx(i => (i + 1) % phrases.length)
      })
    }, root)

    return () => {
      ctx.revert()
      tlRef.current?.kill()
      tlRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, variant, inStagger, holdMs, loop, prefersReduced, phrases.length])

  return (
    <div
      ref={rootRef}
      className={className}
      aria-live="polite"
      role="status"
    >
      {chars.map((ch, i) => {
        const c = ch === ' ' ? '\u00A0' : ch
        return (
          <span key={i} className="char inline-block will-change-transform">
            {c}
          </span>
        )
      })}
    </div>
  )
}
