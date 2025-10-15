'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

type Project = { title: string; subtitle: string; video?: string; description: string }

const projects: Project[] = [
  {
    title: 'Dashboard',
    subtitle: 'Дашборд интернет-магазина',
    video: '/video/project-demo1.mp4',
    description:
      'Интерактивный дашборд с аналитикой продаж, визуализацией KPI и динамическими графиками, который позволяет отслеживать ключевые показатели бизнеса в режиме реального времени.',
  },
  {
    title: 'AI genius',
    subtitle: 'Интеграция с OpenAI API',
    video: '/video/project-demo2.mp4',
    description:
      'Система интеллектуальных подсказок и генерации контента на базе OpenAI API, позволяющая автоматически создавать тексты, рекомендации и ответы на вопросы пользователей.',
  },
  {
    title: 'Messanger',
    subtitle: 'Просто мессенджер',
    video: '/video/project-demo3.mp4',
    description:
      'Современный мессенджер с модульной архитектурой, обеспечивающий стабильную работу, поддержку UI-компонентов через Storybook и соблюдение стандартов кода через ESLint/Prettier.',
  },
  {
    title: 'Some project',
    subtitle: 'Акценты на Three.js',
    video: '/video/project-demo.mp4',
    description:
      'Проект с 3D-визуализацией на базе Three.js, плавной анимацией и минималистичным интерфейсом, который демонстрирует интерактивные элементы без перегрузки пользовательского интерфейса.',
  },
]

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<HTMLDivElement[]>([])

  // ---------------- TAB CLICK
  const handleTabClick = (index: number) => {
    if (index === activeIndex) return
    const videoEl = videoRef.current
    const descEl = descRef.current
    const titleEl = titleTextRef.current
    const lineEl = lineRef.current

    if (videoEl && descEl && titleEl && lineEl) {
      gsap.to([videoEl, descEl, titleEl], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setActiveIndex(index)

          gsap.fromTo(videoEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          gsap.fromTo(descEl, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
          gsap.fromTo(titleEl, { x: 150, y: 0, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
          gsap.fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'left' })
        },
      })
    } else {
      setActiveIndex(index)
    }
  }

  // ---------------- CANVAS STARS
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = containerRef.current.clientWidth
    let height = containerRef.current.clientHeight
    canvas.width = width
    canvas.height = height

    const numStars = 100
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      targetOpacity: Math.random() * 0.5 + 0.2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      // radial background
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5)
      grad.addColorStop(0, 'rgba(34,211,238,0.08)')
      grad.addColorStop(0.5, 'rgba(34,211,238,0.02)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // draw stars
      stars.forEach((s) => {
        // update position
        s.x += s.dx
        s.y += s.dy
        if (s.x < 0 || s.x > width) s.dx *= -1
        if (s.y < 0 || s.y > height) s.dy *= -1
        // smooth opacity
        s.opacity += (s.targetOpacity - s.opacity) * 0.02

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      })

      // draw lines between closest stars
      for (let i = 0; i < stars.length; i++) {
        let minDist = Infinity
        let closest = null
        for (let j = 0; j < stars.length; j++) {
          if (i === j) continue
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const dist = dx * dx + dy * dy
          if (dist < minDist) {
            minDist = dist
            closest = stars[j]
          }
        }
        if (closest && minDist < 150 * 150) {
          ctx.beginPath()
          ctx.moveTo(stars[i].x, stars[i].y)
          ctx.lineTo(closest.x, closest.y)
          ctx.strokeStyle = 'rgba(255,255,255,0.15)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      requestAnimationFrame(draw)
    }
    draw()

    // resize
    const handleResize = () => {
      width = containerRef.current?.clientWidth || width
      height = containerRef.current?.clientHeight || height
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ---------------- SCROLL TRIGGER VIDEO
  useEffect(() => {
    if (!videoContainerRef.current) return
    gsap.fromTo(
      videoContainerRef.current,
      { opacity: 0, y: 50, borderColor: 'rgba(255,255,255,0.1)' },
      {
        opacity: 1,
        y: 0,
        borderColor: '#22d3ee',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: videoContainerRef.current,
          start: 'top 80%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section ref={containerRef} className="relative py-10 px-4 sm:px-6 lg:px-12 bg-black text-white overflow-hidden min-h-[700px]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Заголовок */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center gap-5 overflow-hidden">
          <span className="text-3xl sm:text-4xl font-extrabold text-cyan-500 whitespace-nowrap inline-block">
            Проекты:
          </span>
          <span ref={titleTextRef} className="text-3xl sm:text-4xl font-extrabold text-cyan-500 whitespace-nowrap inline-block">
            {projects[activeIndex].title}
          </span>
        </div>
        <div
          ref={lineRef}
          className="h-1 w-full bg-cyan-500 origin-left mt-1"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Табы */}
      <div className="flex flex-wrap gap-6 mb-8 z-10 relative">
        {projects.map((p, i) => (
          <div
            key={i}
            ref={(el) => void (el && (tabsRef.current[i] = el))}
            className={`tab-item cursor-pointer min-h-[100px] rounded-2xl border p-5 flex-1 transition-transform ${
              activeIndex === i
                ? 'bg-white/10 border-cyan-500 scale-105'
                : 'bg-white/5 border-white/10 hover:scale-105'
            }`}
            onClick={() => handleTabClick(i)}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-cyan-500">{p.title}</h3>
            <p className="mt-2 text-white/75 sm:text-base">{p.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Центральное видео */}
      <div ref={videoContainerRef} className="relative w-full mx-auto rounded-2xl overflow-hidden border border-white/10 aspect-video z-10 mb-5">
        <video
          ref={videoRef}
          src={projects[activeIndex].video}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover rounded-2xl bg-black"
        />
        <div className="absolute bottom-4 left-4 text-white/80 text-sm sm:text-base z-10">
          {projects[activeIndex].subtitle}
        </div>
      </div>

      {/* Описание */}
      <p ref={descRef} className="py-5 text-white/70 z-10 relative border-y-2 border-b-white/10 max-w-max rounded-sm">
        {projects[activeIndex].description}
      </p>
    </section>
  )
}
