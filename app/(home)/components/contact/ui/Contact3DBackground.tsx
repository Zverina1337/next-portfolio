"use client"

import { useEffect, useRef, memo } from "react"
import { useReducedMotion } from "@/components/hooks/useReducedMotion"

type Letter = {
  char: string
  x: number // текущая позиция X
  y: number // текущая позиция Y
  vx: number // velocity X
  vy: number // velocity Y
  rotation: number // текущий угол поворота (радианы)
  rotationVelocity: number // скорость вращения
  originalX: number // стартовая позиция X
  originalY: number // стартовая позиция Y
  isMain: boolean // часть слова CONTACT
  size: number // размер шрифта (64px для main, 48px для random)
  brightness: number // текущая яркость (0-1)
  targetBrightness: number // целевая яркость
}

const Contact3DBackground = memo(function Contact3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lettersRef = useRef<Letter[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const supportsFilterRef = useRef(false)
  const isVisibleRef = useRef(true)
  const lastMouseMoveRef = useRef<number>(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Feature detection: проверка поддержки ctx.filter
    supportsFilterRef.current = (() => {
      try {
        ctx.filter = "blur(1px)"
        return ctx.filter !== "none"
      } catch {
        return false
      }
    })()

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    // Canvas resize функция с debounce
    let resizeTimeout: NodeJS.Timeout
    const resizeCanvas = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const rect = container.getBoundingClientRect()
        canvas.width = rect.width * pixelRatio
        canvas.height = rect.height * pixelRatio
        canvas.style.width = rect.width + "px"
        canvas.style.height = rect.height + "px"
        ctx.scale(pixelRatio, pixelRatio)

        // Реинициализация букв при resize
        initLetters(rect.width, rect.height)
      }, 300)
    }

    // Инициализация букв
    const initLetters = (width: number, height: number) => {
      const letters: Letter[] = []
      const mainWord = "CONTACT"

      // 1. Создаем CONTACT буквы (растянуты на всю ширину с отступами)
      const margin = 150 // отступы по бокам
      const usableWidth = width - margin * 2
      const letterSpacing = usableWidth / (mainWord.length - 1) // динамическое расстояние
      const startX = margin
      const centerY = height / 2

      mainWord.split("").forEach((char, i) => {
        const x = startX + i * letterSpacing
        const y = centerY
        letters.push({
          char,
          x,
          y,
          vx: 0,
          vy: 0,
          rotation: 0,
          rotationVelocity: 0,
          originalX: x,
          originalY: y,
          isMain: true,
          size: 300, // Увеличено с 200px до 300px
          brightness: 0.6,
          targetBrightness: 0.6,
        })
      })

      lettersRef.current = letters
    }

    // Mouse tracking с throttle (16ms = ~60fps)
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMouseMoveRef.current < 16) return
      lastMouseMoveRef.current = now

      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    // Animation loop с улучшенной физикой
    let lastTime = performance.now()

    const animate = () => {
      // Проверка видимости: если элемент не в viewport, пропускаем рендеринг
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const now = performance.now()
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1) // Cap at 100ms для стабильности
      lastTime = now

      const rect = container.getBoundingClientRect()
      const canvasWidth = rect.width
      const canvasHeight = rect.height

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      lettersRef.current.forEach((letter, index) => {
        // 1. РАССТОЯНИЕ ОТ КУРСОРА
        const dx = letter.x - mouseX
        const dy = letter.y - mouseY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const interactionRadius = letter.isMain ? 80 : 60

        // 2. REPULSION FORCE (отталкивание от курсора)
        if (distance < interactionRadius && distance > 0) {
          const force = (1 - distance / interactionRadius) * 0.5
          const angle = Math.atan2(dy, dx)
          letter.vx += Math.cos(angle) * force * 300 * deltaTime
          letter.vy += Math.sin(angle) * force * 300 * deltaTime

          // Highlight при приближении
          letter.targetBrightness = letter.isMain ? 1.2 : 0.5
        } else {
          // Reset brightness
          letter.targetBrightness = letter.isMain ? 0.6 : 0.2
        }

        // 3. FRICTION (затухание скорости)
        letter.vx *= 0.92
        letter.vy *= 0.92

        // 4. UPDATE POSITION
        letter.x += letter.vx * deltaTime
        letter.y += letter.vy * deltaTime

        // 5. SPRING FORCE (возврат к original position)
        const returnForce = 0.05
        letter.x += (letter.originalX - letter.x) * returnForce
        letter.y += (letter.originalY - letter.y) * returnForce

        // 6. BOUNDARY DETECTION (буквы не выходят за края)
        const margin = letter.size / 2
        if (letter.x < margin) letter.x = margin
        if (letter.x > canvasWidth - margin) letter.x = canvasWidth - margin
        if (letter.y < margin) letter.y = margin
        if (letter.y > canvasHeight - margin) letter.y = canvasHeight - margin

        // 7. IDLE WOBBLE (плавное покачивание в состоянии покоя)
        // Отключаем для prefers-reduced-motion
        if (!prefersReducedMotion) {
          const t = now / 1000
          const wobbleSpeed = letter.isMain ? 0.5 : 0.3
          const wobbleAmount = letter.isMain ? 2 : 1
          letter.y +=
            Math.sin(t * wobbleSpeed + index * 0.5) * wobbleAmount * deltaTime * 10
        }

        // 8. ROTATION BASED ON VELOCITY (вращение зависит от скорости движения)
        // Упрощаем для prefers-reduced-motion
        if (!prefersReducedMotion) {
          const speed = Math.sqrt(letter.vx * letter.vx + letter.vy * letter.vy)
          letter.rotationVelocity = speed * 0.01
          letter.rotation += letter.rotationVelocity
          letter.rotationVelocity *= 0.95 // Damping
        } else {
          // Сбрасываем rotation для статичного отображения
          letter.rotation = 0
          letter.rotationVelocity = 0
        }

        // 9. SMOOTH BRIGHTNESS TRANSITION
        letter.brightness += (letter.targetBrightness - letter.brightness) * 0.1

        // 10. RENDER LETTER
        ctx.save()
        ctx.translate(letter.x, letter.y)
        ctx.rotate(letter.rotation)

        // Font settings
        ctx.font = `bold ${letter.size}px sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Цвета (cyan для main, slate для random)
        const color = letter.isMain ? "#22d3ee" : "#64748b"
        const glowColor = letter.isMain ? "#0ea5e9" : "#94a3b8"

        // Псевдо-3D эффект через CSS фильтры
        if (supportsFilterRef.current) {
          // Bevel эффект: светлая тень сверху-слева + темная снизу-справа
          ctx.filter = `
            drop-shadow(-1px -1px 0px rgba(255, 255, 255, 0.4))
            drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.6))
            drop-shadow(0 0 ${20 * letter.brightness}px ${glowColor})
          `
        } else {
          // Fallback для старых браузеров: простой glow
          ctx.shadowBlur = 20 * letter.brightness
          ctx.shadowColor = glowColor
        }

        ctx.fillStyle = color
        ctx.globalAlpha = 0.6 + letter.brightness * 0.4

        ctx.fillText(letter.char, 0, 0)

        // Сброс фильтра для следующей итерации
        if (supportsFilterRef.current) {
          ctx.filter = "none"
        }

        ctx.restore()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // ResizeObserver для автоматического resize
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(container)

    // IntersectionObserver для проверки видимости элемента
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting
        })
      },
      { threshold: 0.1 }
    )
    intersectionObserver.observe(container)

    // Инициализация
    resizeCanvas()
    container.addEventListener("mousemove", handleMouseMove, { passive: true })
    animate()

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      container.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      lettersRef.current = []
    }
  }, [prefersReducedMotion])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none hidden lg:block"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
})

export default Contact3DBackground
