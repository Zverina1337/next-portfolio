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

    // чистим прежнюю верстку из TL (на случай dev HMR)
    tl.clear()

    // разметка: опакити управляет GSAP (без CSS transition)
    gsap.set(overlayRef.current, { opacity: 1 })

    // сегмент прелоадера
    tl.addLabel('boot', 0)
      // держим слой (ничего не делаем) до начала фейда
      .to({}, { duration: Math.max(0, durationMs / 1000 - fadeMs / 1000) }, 'boot')
      // fade out оверлея
      .to(overlayRef.current, {
        opacity: 0,
        duration: fadeMs / 1000,
        ease: 'power2.out',
      })
      // размонтируем слой
      .add(() => setVisible(false))

    // точка старта анимации героя — ровно когда начинается fade
    tl.addLabel('hero', Math.max(0, durationMs / 1000 - fadeMs / 1000))

    // стартуем общий таймлайн
    tl.play(0)

    return () => {
      // не очищаем master TL при анмаунте прелоадера — он управляет и Hero
    }
  }, [durationMs, fadeMs])

  if (!visible) return null

  return (
    <div ref={overlayRef} aria-hidden="true" className="fixed inset-0 z-[1000] grid place-items-center bg-cyan-500">
      <div className="flex h-64 w-full items-center justify-center">
        <Eye />
      </div>
    </div>
  )
}
