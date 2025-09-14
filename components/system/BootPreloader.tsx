'use client'
import { useEffect, useState } from 'react'
import Eye from '../animation/Eye'

export default function BootPreloader({
  durationMs = 1500,
  fadeMs = 400,
}: { durationMs?: number; fadeMs?: number }) {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const hold = setTimeout(() => setFading(true), durationMs)
    const hide = setTimeout(() => setVisible(false), durationMs + fadeMs)
    return () => { clearTimeout(hold); clearTimeout(hide) }
  }, [durationMs, fadeMs])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1000] grid place-items-center bg-cyan-500 transition-opacity"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${fadeMs}ms` }}
    >
      <div className="
        flex
        h-64
        w-full
        items-center
        justify-center
      ">
        <Eye/>
      </div>
    </div>
  )
}
