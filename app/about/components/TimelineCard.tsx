'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'

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
}: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    if (!cardRef.current || !glowRef.current || !expandedRef.current) return

    const card = cardRef.current
    const glow = glowRef.current
    const expanded = expandedRef.current

    // Убираем все предыдущие анимации
    gsap.killTweensOf([card, glow, expanded])

    if (!isExpanded) {
      // Разворачиваем
      setIsExpanded(true)

      // Создаем timeline для синхронизации
      const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })

      // Мягкое растекание карточки
      tl.to(card, {
        scaleX: 1.05,
        scaleY: 1.08,
        borderRadius: '28px',
        duration: 0.9,
      }, 0)

      // Glow эффект
      tl.to(glow, {
        opacity: 0.6,
        scale: 1.15,
        duration: 0.8,
      }, 0)

      // Показываем expanded контент с задержкой
      tl.to(expanded, {
        opacity: 1,
        maxHeight: '1000px',
        duration: 0.7,
        ease: 'power1.inOut',
      }, 0.15)

      // Иконка
      const iconEl = card.querySelector('[data-card-icon]')
      if (iconEl) {
        tl.to(iconEl, {
          scale: 1.2,
          rotation: 180,
          duration: 0.7,
          ease: 'back.out(1.3)',
        }, 0)
      }
    } else {
      // Сворачиваем - ПЛАВНО
      setIsExpanded(false)

      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })

      // Сначала скрываем контент
      tl.to(expanded, {
        opacity: 0,
        maxHeight: '0px',
        duration: 0.7,
      }, 0)

      // Затем уменьшаем карточку
      tl.to(card, {
        scaleX: 1,
        scaleY: 1,
        borderRadius: '24px',
        duration: 0.8,
      }, 0.1)

      // Glow исчезает мягко
      tl.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
      }, 0.1)

      // Иконка возвращается
      const iconEl = card.querySelector('[data-card-icon]')
      if (iconEl) {
        tl.to(iconEl, {
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: 'back.out(1.2)',
        }, 0)
      }
    }
  }

  return (
    <div className="relative">
      {/* Glow эффект "растекания" */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-cyan-500/50 via-blue-500/40 to-purple-500/30 blur-3xl opacity-0 -z-10 pointer-events-none"
      />

      {/* Основная карточка */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-cyan-500/40 rounded-[24px] backdrop-blur-md will-change-transform overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: isExpanded ? '0 20px 60px rgba(34, 211, 238, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Волновой фон */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none transition-opacity duration-500"
          style={{ opacity: isExpanded ? 1 : 0 }}
        />

        {/* Ripple эффект */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-600"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15) 0%, transparent 60%)',
            opacity: isExpanded ? 0.6 : 0,
          }}
        />

        {/* Декоративная сетка */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.2)_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Контент */}
        <div className="relative z-10 p-5">
          {/* COLLAPSED РЕЖИМ */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                data-card-icon
                className="text-3xl flex-shrink-0 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]"
              >
                {icon}
              </div>
              <div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  {year}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-1 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  {title}
                </h3>
              </div>
            </div>

            {/* Tags - первые 2 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 max-w-[40%]">
                {tags.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-[9px] font-medium text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 2 && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-[9px] font-medium text-cyan-300">
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
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300"
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
                      className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20 rounded-lg text-[10px] font-medium text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Декоративный угловой акцент */}
        <div
          className="absolute bottom-0 right-0 bg-gradient-to-tl from-cyan-500/20 to-transparent pointer-events-none transition-all duration-400"
          style={{
            width: isExpanded ? '6rem' : '4rem',
            height: isExpanded ? '6rem' : '4rem',
            borderTopLeftRadius: '100%',
          }}
        />

        {/* Декоративные точки */}
        <div className="absolute top-3 right-3 flex gap-0.5 opacity-20 pointer-events-none">
          <div className="w-1 h-1 rounded-full bg-cyan-500" />
          <div className="w-1 h-1 rounded-full bg-cyan-500" />
          <div className="w-1 h-1 rounded-full bg-cyan-500" />
        </div>
      </div>
    </div>
  )
}
