'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import type { ProjectFiltersState, ProjectsData } from '@/types/project'
import ProjectSearch from './components/ProjectSearch'
import ProjectFilters from './components/ProjectFilters'
import ProjectList from './components/ProjectList'
import AnimatedGrid from './components/AnimatedGrid'

export default function ProjectsPage() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const [filters, setFilters] = useState<ProjectFiltersState>({
    search: '',
    technologies: [],
    types: [],
    years: [],
    statuses: [],
  })

  // Infinite scroll состояние
  const [displayCount, setDisplayCount] = useState(5) // Показываем первые 5 проектов
  const sentinelRef = useRef<HTMLDivElement>(null)

  const headerRef = useRef<HTMLDivElement>(null)

  // Загрузка данных из SSR (из data-attribute в layout.tsx)
  useEffect(() => {
    try {
      const dataElement = document.getElementById('projects-data')
      if (!dataElement) {
        throw new Error('Projects data not found')
      }

      const data = JSON.parse(dataElement.dataset.projects || '{}')
      setProjectsData(data)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setIsLoading(false)
    }
  }, [])

  // GSAP анимация заголовка
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !headerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
    })

    return () => ctx.revert()
  }, [])

  // Фильтрация проектов
  const filteredProjects = useMemo(() => {
    if (!projectsData?.projects) return []

    return projectsData.projects.filter((project) => {
      // Поиск по названию и технологиям
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        !filters.search ||
        project.title.toLowerCase().includes(searchLower) ||
        project.shortDescription.toLowerCase().includes(searchLower) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchLower))

      // Фильтр по технологиям
      const matchesTech =
        filters.technologies.length === 0 ||
        filters.technologies.some((tech) => project.technologies.includes(tech))

      // Фильтр по типу проекта
      const matchesType = filters.types.length === 0 || filters.types.includes(project.type)

      // Фильтр по году
      const matchesYear = filters.years.length === 0 || filters.years.includes(project.year)

      // Фильтр по статусу
      const matchesStatus =
        filters.statuses.length === 0 || filters.statuses.includes(project.status)

      return matchesSearch && matchesTech && matchesType && matchesYear && matchesStatus
    })
  }, [projectsData, filters])

  // Сброс displayCount при изменении фильтров
  useEffect(() => {
    setDisplayCount(5)
  }, [filters])

  // Infinite scroll с IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredProjects.length > displayCount) {
          setDisplayCount((prev) => Math.min(prev + 5, filteredProjects.length))
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [displayCount, filteredProjects.length])

  // Проекты для отображения (с учетом infinite scroll)
  const displayedProjects = filteredProjects.slice(0, displayCount)

  // Ключ для сброса анимации при изменении фильтров
  const filterKey = useMemo(() => JSON.stringify(filters), [filters])

  // Обработчик изменения поиска (debounce реализован внутри ProjectSearch)
  const handleSearchChange = useCallback(
    (value: string) => setFilters((prev) => ({ ...prev, search: value })),
    []
  )

  // Извлечение уникальных технологий и годов для фильтров
  const availableTechnologies = useMemo(() => {
    if (!projectsData?.projects) return []
    const techs = new Set<string>()
    projectsData.projects.forEach((p) => p.technologies.forEach((t) => techs.add(t)))
    return Array.from(techs).sort()
  }, [projectsData])

  const availableYears = useMemo(() => {
    if (!projectsData?.projects) return []
    const years = new Set<number>()
    projectsData.projects.forEach((p) => years.add(p.year))
    return Array.from(years).sort((a, b) => b - a) // От новых к старым
  }, [projectsData])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Анимированная сетка с интерактивными точками */}
      <AnimatedGrid />

      {/* Центральное свечение с анимацией дыхания */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, rgba(168, 85, 247, 0.08) 30%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Главный контейнер */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Минималистичный заголовок */}
        <div ref={headerRef} className="mb-16">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text
                       bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 tracking-tight mb-4"
            style={{
              textShadow: '0 0 40px rgba(34,211,238,0.5)',
            }}
          >
            Проекты
          </h1>
          <p className="text-lg sm:text-xl text-white/60">
            Коллекция коммерческих, образовательных и pet-проектов
          </p>
        </div>

        {/* Двухколоночная структура: Фильтры (слева) + Проекты (справа) */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-12">
          {/* Левая колонка - Поиск и Фильтры */}
          <aside className="space-y-6">
            {/* Поиск */}
            <div>
              <ProjectSearch value={filters.search} onChange={handleSearchChange} />
            </div>

            {/* Фильтры */}
            <div className="sticky top-6">
              <ProjectFilters
                filters={filters}
                onChange={setFilters}
                availableTechnologies={availableTechnologies}
                availableYears={availableYears}
              />
            </div>
          </aside>

          {/* Правая колонка - Список проектов */}
          <main>
            <ProjectList projects={displayedProjects} isLoading={isLoading} error={error} filterKey={filterKey} />

            {/* Sentinel для infinite scroll */}
            {displayCount < filteredProjects.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500/70 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500/40 animate-pulse" />
                </div>
              </div>
            )}

            {/* Индикатор конца списка */}
            {displayCount >= filteredProjects.length && filteredProjects.length > 0 && (
              <div className="mt-12 text-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-4" />
                <p className="text-white/40 text-sm">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'проект' : 'проектов'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Сканирующая линия снизу */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 w-full h-[1px]
                   bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
      />
    </div>
  )
}
