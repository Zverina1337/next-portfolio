'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'

type Props = { email?: string; className?: string }
const useIsoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const isTouch = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function MagneticContactButton({ email, className }: Props) {
  const zoneRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  useIsoLayout(() => {
    const zone = zoneRef.current
    const btn = btnRef.current
    if (!zone || !btn || isTouch()) return

    gsap.set(btn, { x: 0, y: 0, rotation: 0, scale: 1, force3D: true, transformOrigin: '50% 50%' })

    // Более плавные и медленные анимации для "магнитного" эффекта
    const qx   = gsap.quickTo(btn, 'x',        { duration: 0.8, ease: 'power2.out', overwrite: true })
    const qy   = gsap.quickTo(btn, 'y',        { duration: 0.8, ease: 'power2.out', overwrite: true })
    const qrot = gsap.quickTo(btn, 'rotation', { duration: 0.9, ease: 'power1.out', overwrite: true })
    const qsc  = gsap.quickTo(btn, 'scale',    { duration: 0.7, ease: 'power2.out', overwrite: true })

    let cx = 0, cy = 0, R = 1, MAX_SHIFT = 120

    const computeGeometry = () => {
      const r = zone.getBoundingClientRect()
      cx = r.left + r.width / 2
      cy = r.top + r.height / 2
      R = Math.max(1, Math.min(r.width, r.height) * 0.5)
      // Уменьшаем MAX_SHIFT для более сдержанного движения
      MAX_SHIFT = Math.min(120, R * 0.8)
    }

    const onEnter = () => {
      computeGeometry()
      qsc(1.06)
    }

    const onMove = (e: PointerEvent) => {
      // нормализованные координаты относительно центра
      let nx = (e.clientX - cx) / R
      let ny = (e.clientY - cy) / R
      // мягкий clamp, чтобы у краёв не дёргалось
      const clamp = (v: number) => Math.tanh(v) // плавнее, чем жесткий Math.max/min
      nx = clamp(nx)
      ny = clamp(ny)

      const mag = Math.hypot(nx, ny) // 0..~1
      // Более мягкая сила притяжения (степень 0.9 вместо 0.75)
      const eased = Math.pow(Math.min(1, mag), 0.9)
      const dirx = mag ? nx / mag : 0
      const diry = mag ? ny / mag : 0

      const dx = dirx * MAX_SHIFT * eased
      const dy = diry * MAX_SHIFT * eased

      qx(dx); qy(dy)
      // Уменьшаем вращение для более сдержанного эффекта
      qrot((Math.atan2(dy, dx) * 180 / Math.PI) * 0.06)
      // Меньше масштабирования
      qsc(1 + 0.03 * eased)
    }

    const onLeave = () => { qx(0); qy(0); qrot(0); qsc(1) }

    zone.addEventListener('pointerenter', onEnter, { passive: true })
    zone.addEventListener('pointermove',  onMove,  { passive: true })
    zone.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('resize', computeGeometry, { passive: true })
    window.addEventListener('scroll', computeGeometry, { passive: true })

    return () => {
      zone.removeEventListener('pointerenter', onEnter)
      zone.removeEventListener('pointermove',  onMove)
      zone.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', computeGeometry)
      window.removeEventListener('scroll', computeGeometry)
    }
  }, [])

  return (
    <div
      ref={zoneRef}
      className={clsx(
        'relative inline-grid place-items-center w-[22rem] sm:w-[26rem] h-[8rem] sm:h-[9rem]',
        className
      )}
    >
      <button
        ref={btnRef}
        onClick={() => { window.location.href = 'mailto:' + (email || '') }}
        className={clsx(
          // ВАЖНО: никаких transition по transform — ими управляет GSAP
          'pointer-events-auto inline-flex items-center gap-4 rounded-full border-2 px-9 sm:px-12 py-4 sm:py-5',
          'bg-black border-white/10 backdrop-blur-md select-none',
          'transition-colors' // можно добавить transition-shadow/transition-colors и т.п.
        )}
        aria-label="Contact"
      >
        <span className="text-xl sm:text-2xl font-semibold tracking-wide text-white">CONTACT</span>
        <span className="grid place-items-center rounded-full border-2 w-11 h-11 sm:w-12 sm:h-12 border-white/20 bg-white/[0.03] ring-1 ring-inset ring-[color:var(--accent)]/30">
          <svg className="w-5 h-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  )
}
