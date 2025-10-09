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
  const videoRef = useRef<HTMLVideoElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<HTMLDivElement[]>([])
  const videoContainerRef = useRef<HTMLDivElement>(null)
  // --------------------------- TAB CLICK
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

          // появление нового видео
          gsap.fromTo(videoEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })

          // появление нового описания с левого края
          gsap.fromTo(descEl, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })

          // прокрутка заголовка
          gsap.fromTo(titleEl, { x: 150, y: 0, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })

          // анимация линии под заголовком
          gsap.fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'left' })
        },
      })
    } else {
      setActiveIndex(index)
    }
  }

  // --------------------------- STARS & RADIAL
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Радиальный акцент
    const radialBg = document.createElement('div')
    Object.assign(radialBg.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300%',
      height: '300%',
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.04) 50%, rgba(0,0,0,0) 90%)',
      filter: 'blur(160px)',
      zIndex: '0',
    })
    container.appendChild(radialBg)

    // Слой звезд
    const starsLayer = document.createElement('div')
    Object.assign(starsLayer.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '0' })
    container.appendChild(starsLayer)

    // SVG линии
    const svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgLayer.setAttribute('width', '100%')
    svgLayer.setAttribute('height', '100%')
    Object.assign(svgLayer.style, { position: 'absolute', top: '0', left: '0', zIndex: '0' })
    container.appendChild(svgLayer)

    const numStars = 150
    const stars: HTMLDivElement[] = []
    const positions: { x: number; y: number }[] = []

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 2 + 1
      const top = Math.random() * container.clientHeight
      const left = Math.random() * container.clientWidth

      Object.assign(star.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
        left: `${left}px`,
        borderRadius: '50%',
        background: 'white',
        opacity: `${Math.random() * 0.5 + 0.2}`,
        pointerEvents: 'auto',
      })
      starsLayer.appendChild(star)
      stars.push(star)
      positions.push({ x: left, y: top })

      // плавное дрожание
      gsap.to(star, {
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 10 - 5,
        duration: Math.random() * 12 + 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // сияние на hover
      star.addEventListener('mouseenter', () => {
        gsap.to(star, { opacity: 1, scale: 1.5, duration: 0.5, ease: 'power2.out' })
      })
      star.addEventListener('mouseleave', () => {
        gsap.to(star, { opacity: Math.random() * 0.5 + 0.2, scale: 1, duration: 0.5, ease: 'power2.out' })
      })
    }

    // Линии между ближайшими звездами
    const lines: SVGLineElement[] = []
    const connectStar = (i: number) => {
      const pos = positions[i]
      const distances = positions
        .map((p, j) => ({ j, dist: (p.x - pos.x) ** 2 + (p.y - pos.y) ** 2 }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist)

      if (!distances.length) return
      const d = distances[0]
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', `${pos.x + 0.5}px`)
      line.setAttribute('y1', `${pos.y + 0.5}px`)
      line.setAttribute('x2', `${positions[d.j].x + 0.5}px`)
      line.setAttribute('y2', `${positions[d.j].y + 0.5}px`)
      line.setAttribute('stroke', 'rgba(255,255,255,0.15)')
      line.setAttribute('stroke-width', '1')
      svgLayer.appendChild(line)
      lines.push(line)

      gsap.to(line, {
        strokeOpacity: 0,
        duration: Math.random() * 5 + 1,
        ease: 'sine.inOut',
        onComplete: () => {
          if (svgLayer.contains(line)) svgLayer.removeChild(line)
          setTimeout(() => connectStar(i), Math.random() * 5000 + 1000)
        },
      })
    }

    stars.forEach((_, i) => setTimeout(() => connectStar(i), Math.random() * 6000 + 1000))

    // Дыхание радиального фона
    gsap.to(radialBg, { scale: 1.05, opacity: 0.18, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(radialBg, { opacity: () => Math.random() * 0.15 + 0.08, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    // Параллакс при скролле
    gsap.to([radialBg, starsLayer, svgLayer], {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

     // --------------------------- SCROLL VIDEO ANIMATION
    if (videoContainerRef.current) {
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
    }


    return () => {
      stars.forEach((s) => starsLayer.removeChild(s))
      lines.forEach((l) => svgLayer.removeChild(l))
      container.removeChild(starsLayer)
      container.removeChild(svgLayer)
      container.removeChild(radialBg)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              lineRef.current,
              { scaleX: 0 },
              { scaleX: 1, transformOrigin: '0% 50%', duration: 0.8, ease: 'power2.out' }
            )
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!tabsRef.current.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tabsRef.current.forEach((tab, i) => {
              gsap.fromTo(
                tab,
                { opacity: 0, y: 0 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.15 }
              )
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  return (
    <section ref={containerRef} className="relative py-10 px-4 sm:px-6 lg:px-12 bg-black text-white overflow-hidden min-h-[700px]">
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