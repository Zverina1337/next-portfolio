'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import TimelineCard, { type TimelineCardProps } from './TimelineCard'

// Реальные данные из резюме
const TIMELINE_EVENTS: TimelineCardProps[] = [
  {
    year: '2024-Сейчас',
    title: 'Frontend-разработчик @ Hpace.dev',
    shortDescription: 'Коммерческая разработка крупных проектов. Работа с CRM, сервисами для маркетплейсов и системами мониторинга.',
    fullDescription: 'Участвовал в разработке 4+ крупных проектов: CRM система для медиков (Vue 3), сервис для продавцов маркетплейсов Mpb.TOP (React), система поиска IT-специалистов Contractis (Nuxt.js), платформа мониторинга поставок V1T (Next.js).',
    icon: '💼',
    position: 'right',
    tags: ['Commercial', 'Full-time', '10 мес'],
    achievements: [
      'Ускорение разработки в 2-3 раза за счет AI-инструментов',
      'Участие в создании backend на Express.js для CRM с БД на 1200+ таблиц',
      'Разработка модуля техподдержки с мессенджером для Mpb.TOP',
      'Полная адаптивная верстка дашборда и отчетов в проекте V1T',
      'Активное участие в архитектурных решениях',
    ],
    technologies: ['Vue 3', 'React', 'Next.js', 'Nuxt.js', 'TypeScript', 'PHP/Laravel', 'Express.js'],
  },
  {
    year: '2023-2024',
    title: 'Frontend-разработчик @ ProfTeam',
    shortDescription: 'Круг лучших разработчиков техникума для проектной деятельности и реализации бизнес-решений на основе IT.',
    fullDescription: 'Работал над образовательной IT-платформой для объединения компаний и студентов. Разрабатывал основные пользовательские интерфейсы, систему взаимодействия между студентами и компаниями.',
    icon: '🎓',
    position: 'left',
    tags: ['Team', 'Education', 'ТТИТ'],
    achievements: [
      'Создание образовательной платформы ProfTeam',
      'Разработка пользовательских интерфейсов',
      'Интеграция с REST API',
      'Работа в команде разработчиков',
    ],
    technologies: ['Vue.js', 'JavaScript', 'REST API', 'SCSS'],
  },
  {
    year: '2022-2023',
    title: 'Начало пути во Frontend',
    shortDescription: 'Изучение основ веб-разработки, HTML/CSS/JavaScript. Создание первых pet-проектов для закрепления знаний.',
    fullDescription: 'Активно изучал современные фреймворки и библиотеки. Создал несколько полноценных приложений: AI-платформу для генерации контента, интернет-магазин с админкой, клон мессенджера с real-time общением.',
    icon: '🚀',
    position: 'right',
    tags: ['Learning', 'Pet Projects', 'Self-study'],
    achievements: [
      'Genius AI - платформа для генерации контента (OpenAI API)',
      'Ecommerce Platform - интернет-магазин с админ-панелью',
      'Messenger Clone - клон Telegram с Socket.io',
      'Освоение Vue 3, React, Node.js, MongoDB, PostgreSQL',
    ],
    technologies: ['Vue 3', 'React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'PostgreSQL', 'OpenAI API'],
  },
]

export default function AboutTimeline() {
  const root = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(root, { threshold: 0.1 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !isVisible || !lineRef.current) return

    const ctx = gsap.context(() => {
      // Анимация линии по скроллу
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        }
      )

      // Анимация карточек
      const cards = root.current?.querySelectorAll('[data-timeline-card]')
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%', // Изменено с 80% на 90% для более раннего срабатывания
              end: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // Анимация точек-маркеров
      const dots = root.current?.querySelectorAll('[data-timeline-dot]')
      dots?.forEach((dot) => {
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 85%', // Изменено с 75% на 85%
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [isVisible])

  return (
    <section
      ref={root}
      id="about-timeline"
      className="relative w-full bg-black text-white pb-0 pt-20 overflow-hidden"
      aria-label="Career Timeline"
    >
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 md:px-12">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-500 mb-4">
            МОЙ ПУТЬ
          </h2>
          <p className="text-base sm:text-lg opacity-70">
            Roadmap моего профессионального развития
          </p>
        </div>

        {/* Timeline контейнер */}
        <div className="relative">
          {/* Вертикальная центральная линия */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 overflow-hidden">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-cyan-500 to-transparent origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {/* События */}
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {TIMELINE_EVENTS.map((event, index) => {
              const isLeft = event.position === 'left'

              return (
                <div
                  key={index}
                  data-timeline-card
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  {/* Карточка слева (на мобилке всегда по центру) */}
                  {isLeft ? (
                    <>
                      <div>
                        <TimelineCard {...event} />
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div>
                        <TimelineCard {...event} />
                      </div>
                    </>
                  )}

                  {/* Центральная точка */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <div
                      data-timeline-dot
                      className="relative w-5 h-5 rounded-full bg-cyan-500 border-4 border-black"
                    >
                      {/* Пульсирующее кольцо */}
                      <div className="absolute inset-0 rounded-full bg-cyan-500/50 animate-ping" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Финальная точка */}
          <div className="relative mt-20 text-center">
            <div className="absolute left-1/2 -translate-x-1/2 -top-10">
              <div
                data-timeline-dot
                className="w-6 h-6 rounded-full bg-cyan-500 border-4 border-black animate-pulse"
              />
            </div>
            <p className="text-sm opacity-60 pt-8">И это только начало пути...</p>
          </div>
        </div>
      </div>

      {/* Декоративный фон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20
                   bg-[radial-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)]
                   [background-size:24px_24px]"
      />

      {/* Градиент снизу для плавного перехода к следующей секции */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-transparent via-black/40 to-transparent" />
    </section>
  )
}
