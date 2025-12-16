'use client'

import { useRef, useEffect } from 'react'

interface Dot {
  x: number
  y: number
  baseOpacity: number
  currentOpacity: number
}

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Размер canvas (только viewport, т.к. используем fixed)
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    // Генерация сетки точек
    const spacing = 24 // Расстояние между точками (как в BlockIntro: 12px * 2)
    const dots: Dot[] = []

    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        dots.push({
          x,
          y,
          baseOpacity: 0.15, // Увеличена видимость точек
          currentOpacity: 0.15,
        })
      }
    }

    dotsRef.current = dots

    // Отслеживание мыши (координаты относительно viewport)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateCanvasSize)

    // Анимационный цикл
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const influenceRadius = 150 // Радиус влияния курсора

      dots.forEach((dot) => {
        // Расстояние от курсора до точки
        const dx = mouseX - dot.x
        const dy = mouseY - dot.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Интерполяция opacity в зависимости от расстояния
        if (distance < influenceRadius) {
          const influence = 1 - distance / influenceRadius
          dot.currentOpacity = dot.baseOpacity + influence * 0.5 // Увеличиваем до 0.65 максимум
        } else {
          // Плавное возвращение к базовой opacity
          dot.currentOpacity += (dot.baseOpacity - dot.currentOpacity) * 0.1
        }

        // Рисуем точку
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.currentOpacity})`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2)
        ctx.fill()

        // Добавляем небольшой glow для точек рядом с курсором
        if (distance < influenceRadius / 2) {
          const glowIntensity = 1 - (distance / (influenceRadius / 2))
          ctx.fillStyle = `rgba(34, 211, 238, ${glowIntensity * 0.3})`
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      rafRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateCanvasSize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.4 }}
    />
  )
}
