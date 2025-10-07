'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Eye from '../animation/Eye'
import getMasterTl from '../lib/useMasterTl'

type Props = { durationMs?: number; fadeMs?: number }

export default function BootPreloader({
  durationMs = 1500,
  fadeMs = 400,
}: Props) {
  const [visible, setVisible] = useState(true)
  const overlayRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const tl = getMasterTl()
    if (!overlayRef.current || !tl) return

    // чистим предыдущий таймлайн (HMR)
    tl.clear()
    gsap.set(overlayRef.current, { opacity: 1 })

    tl.addLabel('boot', 0)
      .to({}, { duration: Math.max(0, durationMs / 1000 - fadeMs / 1000) }, 'boot')
      .to(overlayRef.current, {
        opacity: 0,
        duration: fadeMs / 1000,
        ease: 'power2.out',
      })
      .add(() => setVisible(false))

    tl.addLabel('hero', Math.max(0, durationMs / 1000 - fadeMs / 1000))
    tl.play(0)

    return () => {}
  }, [durationMs, fadeMs])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1000] grid place-items-center bg-cyan-500"
    >
      <div className="flex items-center justify-center max-w-[90vw] max-h-[90vh]">
        <Eye />
      </div>
    </div>
  )
}
