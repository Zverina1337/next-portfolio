'use client'

import { useEffect, useRef } from 'react'

type Project = {
  title: string
  subtitle: string
  metrics: string
  video?: string
}

const projects: Project[] = [
  { title: 'Lighthouse Perf', subtitle: 'Оптимизация рендеринга и бандлов', metrics: '95+' },
  { title: 'Accessibility', subtitle: 'Фокус-стейты, контрасты, навигация', metrics: '100%' },
  { title: 'Dev-опыт', subtitle: 'ESLint/Prettier, Storybook, модульная архитектура', metrics: '10+' },
  { title: 'Визуал', subtitle: 'Акценты на Three.js без перегруза UI', metrics: '3D' },
  { title: 'Центральное видео', subtitle: 'Видео о проекте', metrics: '', video: '/video/project-demo.mp4' },
]

export default function ProjectsBlock() {
  const starsContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!starsContainerRef.current) return
    const container = starsContainerRef.current

    // создаем canvas для линий
    const canvas = document.createElement('canvas')
    canvasRef.current = canvas
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none'
    container.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // создаем звезды
    const numStars = 60
    const stars: { x: number; y: number; el: HTMLDivElement }[] = []

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div')
      star.className = 'absolute bg-white rounded-full'
      const size = Math.random() * 2 + 1
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      const x = Math.random() * container.clientWidth
      const y = Math.random() * container.clientHeight
      star.style.left = `${x}px`
      star.style.top = `${y}px`
      container.appendChild(star)
      stars.push({ x, y, el: star })

      // мерцание
      const opacity = Math.random() * 0.5 + 0.2
      const duration = Math.random() * 2 + 1
      const animate = () => {
        star.animate(
          [{ opacity: `${opacity}` }, { opacity: `${Math.random() * 0.5 + 0.2}` }],
          { duration: duration * 1000, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }
        )
      }
      animate()
    }

    // рисуем линии между ближайшими звездами
    const maxDist = 120
    let rafId: number
    const animateLines = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i]
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j]
          const dx = s1.x - s2.x
          const dy = s1.y - s2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(34,211,238,${0.15 * (1 - dist / maxDist)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(s1.x, s1.y)
            ctx.lineTo(s2.x, s2.y)
            ctx.stroke()
          }
        }
      }
      rafId = requestAnimationFrame(animateLines)
    }
    animateLines()

    return () => {
      stars.forEach((s) => container.removeChild(s.el))
      container.removeChild(canvas)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-12 bg-black text-white overflow-hidden">
      {/* контейнер с относительным позиционированием для звезд */}
      <div ref={starsContainerRef} className="relative w-full h-full -z-10 pointer-events-none" />

      <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-500 mb-12 text-center">
        Наши проекты
      </h2>

      {/* Верхний ряд карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {projects.slice(0, 4).map((p, i) => (
          <div
            key={i}
            className="relative min-h-[180px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 cursor-pointer will-change-transform hover:scale-105 transition-transform"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-cyan-500">{p.title}</h3>
            <p className="mt-2 text-white/75 sm:text-base">{p.subtitle}</p>
            <div className="mt-3 text-sm sm:text-base font-medium text-white/70">{p.metrics}</div>
          </div>
        ))}
      </div>

      {/* Центральный блок с видео */}
      <div className="relative w-full mx-auto mb-12 rounded-2xl overflow-hidden border border-white/10 aspect-video max-w-4xl">
        <video
          src={projects[4].video}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base">
          {projects[4].subtitle}
        </div>
      </div>
    </section>
  )
}
