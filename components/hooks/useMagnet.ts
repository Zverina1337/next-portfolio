'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function useMagnet(
  btnRef: React.RefObject<HTMLElement | null>, 
  magnetRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const btn = btnRef.current
    const magnet = magnetRef.current
    const reset = () => gsap.to(magnet, { x: 0, y: 0, scale: 1, duration: 0.2 })
    if (!btn || !magnet) return
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
  }, [btnRef, magnetRef])
}
