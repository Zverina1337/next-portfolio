'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type TimelineCardProps = {
  year: string
  title: string
  shortDescription: string
  fullDescription: string
  icon?: string
  tags?: string[]
  achievements?: string[]
  technologies?: string[]
  position?: 'left' | 'right'
}

export default function TimelineCard({
  year,
  title,
  shortDescription,
  fullDescription,
  icon = '✨',
  tags = [],
  achievements = [],
  technologies = [],
  position = 'right',
}: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Авто-открытие при скролле
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    if (!cardRef.current) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 70%', // Когда карточка на 70% экрана
        onEnter: () => {
          if (!isExpanded) {
            timeoutId = setTimeout(() => expandCard(), 300) // Небольшая задержка для плавности
          }
        },
      })
    }, cardRef)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      ctx.revert()
    }
  }, [])

  const expandCard = () => {
    if (!cardRef.current || !expandedRef.current) return
    if (isExpanded) return

    const card = cardRef.current
    const expanded = expandedRef.current

    setIsExpanded(true)

    // Убираем все предыдущие анимации
    gsap.killTweensOf([card, expanded])

    // Создаем timeline для синхронизации
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    // Плавное раскрытие без масштабирования (чтобы не прилипало к линии)
    tl.to(card, {
      borderRadius: '20px',
      duration: 0.6,
    }, 0)

    // Показываем expanded контент
    tl.to(expanded, {
      opacity: 1,
      maxHeight: '1000px',
      duration: 0.8,
      ease: 'power2.inOut',
    }, 0.1)

    // Иконка
    const iconEl = card.querySelector('[data-card-icon]')
    if (iconEl) {
      tl.to(iconEl, {
        scale: 1.1,
        rotation: 15,
        duration: 0.6,
        ease: 'back.out(1.3)',
      }, 0)
    }
  }

  const toggleExpand = () => {
    if (!cardRef.current || !expandedRef.current) return

    const card = cardRef.current
    const expanded = expandedRef.current

    // Убираем все предыдущие анимации
    gsap.killTweensOf([card, expanded])

    if (!isExpanded) {
      expandCard()
    } else {
      // Сворачиваем - ПЛАВНО
      setIsExpanded(false)

      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

      // Сначала скрываем контент
      tl.to(expanded, {
        opacity: 0,
        maxHeight: '0px',
        duration: 0.6,
      }, 0)

      // Затем уменьшаем карточку
      tl.to(card, {
        borderRadius: '16px',
        duration: 0.5,
      }, 0.1)

      // Иконка возвращается
      const iconEl = card.querySelector('[data-card-icon]')
      if (iconEl) {
        tl.to(iconEl, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
        }, 0)
      }
    }
  }

  return (
    <div className={`relative ${position === 'left' ? 'md:mr-8' : 'md:ml-8'}`}>
      {/* Основная карточка */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-white/10 to-white/5 border border-cyan-500/30 rounded-2xl backdrop-blur-sm will-change-transform overflow-hidden transition-all duration-300 hover:border-cyan-500/50"
        style={{
          boxShadow: isExpanded
            ? '0 8px 32px rgba(34, 211, 238, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Декоративная сетка (статична) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-5 bg-[linear-gradient(rgba(34,211,238,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.3)_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Контент */}
        <div className="relative z-10 p-6">
          {/* COLLAPSED РЕЖИМ */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div
                data-card-icon
                className="text-3xl flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  {year}
                </div>
                <h3 className="text-base sm:text-lg font-bold mt-1 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  {title}
                </h3>
              </div>
            </div>

            {/* Tags - первые 2 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 ml-2 flex-shrink-0">
                {tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-[9px] font-medium text-cyan-300 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-[9px] font-medium text-cyan-300">
                    +{tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Краткое описание */}
          <p className="text-sm opacity-80 leading-relaxed mb-4">
            {shortDescription}
          </p>

          {/* Кнопка "Подробнее" */}
          <button
            onClick={toggleExpand}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
          >
            <span>{isExpanded ? 'Свернуть' : 'Подробнее'}</span>
            <svg
              className="w-3 h-3 transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* EXPANDED РЕЖИМ */}
          <div
            ref={expandedRef}
            className="overflow-hidden opacity-0"
            style={{ maxHeight: '0px' }}
          >
            {/* Полное описание */}
            <p className="text-sm opacity-90 leading-relaxed mt-4 pt-4 border-t border-cyan-500/20">
              {fullDescription}
            </p>

            {/* Достижения */}
            {achievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <h4 className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                  🎯 Достижения
                </h4>
                <ul className="space-y-1.5">
                  {achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="text-xs opacity-80 flex items-start gap-2"
                    >
                      <span className="text-cyan-500 mt-0.5">→</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Технологии */}
            {technologies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <h4 className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wider">
                  🛠 Технологии
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-cyan-500/15 border border-white/15 rounded-lg text-[10px] font-medium text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Декоративный угловой акцент (уменьшен) */}
        <div
          className="absolute bottom-0 right-0 bg-gradient-to-tl from-cyan-500/10 to-transparent pointer-events-none transition-all duration-400"
          style={{
            width: isExpanded ? '4rem' : '3rem',
            height: isExpanded ? '4rem' : '3rem',
            borderTopLeftRadius: '100%',
          }}
        />
      </div>
    </div>
  )
}
