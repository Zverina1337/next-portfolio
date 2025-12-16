'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface Particle {
  x: number
  y: number
  element: HTMLDivElement
}

export default function MouseTrail() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mousePos = useRef({ x: 0, y: 0 })
  const isMoving = useRef(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    // Отключаем на мобильных устройствах (touchscreen)
    const isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)

    if (prefersReduced || isMobile || !containerRef.current) return

    const container = containerRef.current
    const maxParticles = 12 // Увеличено для большей заметности

    // Создаём пул частиц
    for (let i = 0; i < maxParticles; i++) {
      const particle = document.createElement('div')
      particle.className = 'mouse-particle'
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(34, 211, 238, 0.7);
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 16px rgba(34, 211, 238, 0.7);
      `
      container.appendChild(particle)

      particlesRef.current.push({
        x: -100,
        y: -100,
        element: particle,
      })
    }

    let currentIndex = 0
    let lastEmitTime = 0
    const emitInterval = 50 // Интервал между частицами (мс) - уменьшен для большей плотности следа

    // Отслеживание движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      isMoving.current = true

      const now = Date.now()
      if (now - lastEmitTime < emitInterval) return

      lastEmitTime = now

      // Получаем следующую частицу из пула
      const particle = particlesRef.current[currentIndex]
      currentIndex = (currentIndex + 1) % maxParticles

      // Позиционируем частицу
      particle.x = e.clientX
      particle.y = e.clientY

      gsap.killTweensOf(particle.element)
      gsap.set(particle.element, {
        x: particle.x - 4,
        y: particle.y - 4,
        scale: 1,
        opacity: 0.9,
      })

      // Анимация затухания и уменьшения
      gsap.to(particle.element, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      })
    }

    // Определение остановки курсора
    let stopTimeout: NodeJS.Timeout
    const handleMouseStop = () => {
      clearTimeout(stopTimeout)
      stopTimeout = setTimeout(() => {
        isMoving.current = false
      }, 100)
    }

    const handleMouseMoveWithStop = (e: MouseEvent) => {
      handleMouseMove(e)
      handleMouseStop()
    }

    window.addEventListener('mousemove', handleMouseMoveWithStop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveWithStop)
      clearTimeout(stopTimeout)
      particlesRef.current.forEach((p) => p.element.remove())
      particlesRef.current = []
    }
  }, [])

  return <div ref={containerRef} aria-hidden className="pointer-events-none" />
}
