'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import type { Project } from '@/types/project'
import ProjectItem from './ProjectItem'
import EmptyState from './EmptyState'

interface ProjectListProps {
  projects: Project[] | null
  isLoading: boolean
  error: Error | null
  filterKey?: string // Ключ для сброса анимации при изменении фильтров
}

export default function ProjectList({ projects, isLoading, error, filterKey }: ProjectListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(0)
  const prevFilterKeyRef = useRef(filterKey)

  // Сбрасываем счетчик при изменении фильтров
  useEffect(() => {
    if (filterKey !== prevFilterKeyRef.current) {
      prevLengthRef.current = 0
      prevFilterKeyRef.current = filterKey
    }
  }, [filterKey])

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !listRef.current || !projects || projects.length === 0) return

    const ctx = gsap.context(() => {
      const items = listRef.current?.querySelectorAll('[data-project-item]')
      if (!items) return

      const itemsArray = Array.from(items)
      const prevLength = prevLengthRef.current

      // Анимируем только новые элементы (с индексом >= prevLength)
      const newItems = itemsArray.slice(prevLength)

      if (newItems.length > 0) {
        gsap.fromTo(
          newItems,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          }
        )
      }
    }, listRef)

    // Обновляем предыдущую длину после анимации
    prevLengthRef.current = projects.length

    return () => ctx.revert()
  }, [projects])

  // Loading состояние
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        {/* Киберпанк loader */}
        <div className="relative w-32 h-32 mb-8">
          {/* Внешнее вращающееся кольцо */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-cyan-500/50 animate-spin" />

          {/* Среднее кольцо с обратным вращением */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 border-l-purple-500/50"
            style={{
              animation: 'spin 1.5s linear infinite reverse',
            }}
          />

          {/* Внутреннее свечение */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl animate-pulse" />

          {/* Центральная точка */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
        </div>

        {/* Текст */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">Загрузка проектов</h3>
          <p className="text-white/50 text-sm">Инициализация данных...</p>
        </div>

        {/* Декоративные точки */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-cyan-500/70 animate-pulse delay-75" />
          <div className="w-2 h-2 rounded-full bg-cyan-500/40 animate-pulse delay-150" />
        </div>
      </div>
    )
  }

  // Error состояние
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        {/* Иконка ошибки */}
        <div className="relative w-32 h-32 mb-8">
          {/* Красное свечение */}
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-3xl animate-pulse" />

          {/* Иконка крестика */}
          <div className="relative w-full h-full rounded-full border-4 border-red-500/30 bg-red-500/5 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Текст */}
        <div className="text-center max-w-md space-y-3">
          <h3 className="text-2xl font-bold text-red-400">Ошибка загрузки</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {error.message || 'Не удалось загрузить проекты. Попробуйте перезагрузить страницу.'}
          </p>

          {/* Кнопка перезагрузки */}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 text-sm font-medium"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    )
  }

  // Empty состояние
  if (!projects || projects.length === 0) {
    return <EmptyState />
  }

  // Success состояние - список проектов
  return (
    <div ref={listRef} className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} data-project-item>
          <ProjectItem project={project} />
        </div>
      ))}
    </div>
  )
}
