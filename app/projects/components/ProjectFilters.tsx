'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import type { ProjectFiltersState, ProjectType, ProjectStatus } from '@/types/project'

interface ProjectFiltersProps {
  filters: ProjectFiltersState
  onChange: (filters: ProjectFiltersState) => void
  availableTechnologies: string[]
  availableYears: number[]
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'commercial', label: 'Коммерческие' },
  { value: 'education', label: 'Образовательные' },
  { value: 'pet', label: 'Pet-проекты' },
]

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'completed', label: 'Завершены' },
  { value: 'in-progress', label: 'В процессе' },
  { value: 'planned', label: 'Запланированы' },
]

export default function ProjectFilters({
  filters,
  onChange,
  availableTechnologies,
  availableYears,
}: ProjectFiltersProps) {
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !filtersRef.current) return

    const ctx = gsap.context(() => {
      const sections = filtersRef.current?.querySelectorAll('[data-filter-section]')
      if (sections) {
        gsap.fromTo(
          sections,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          }
        )
      }
    }, filtersRef)

    return () => ctx.revert()
  }, [])

  const toggleTechnology = (tech: string) => {
    const newTechs = filters.technologies.includes(tech)
      ? filters.technologies.filter((t) => t !== tech)
      : [...filters.technologies, tech]
    onChange({ ...filters, technologies: newTechs })
  }

  const toggleType = (type: ProjectType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    onChange({ ...filters, types: newTypes })
  }

  const toggleStatus = (status: ProjectStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    onChange({ ...filters, statuses: newStatuses })
  }

  const toggleYear = (year: number) => {
    const newYears = filters.years.includes(year)
      ? filters.years.filter((y) => y !== year)
      : [...filters.years, year]
    onChange({ ...filters, years: newYears })
  }

  const clearFilters = () => {
    onChange({
      search: filters.search,
      technologies: [],
      types: [],
      years: [],
      statuses: [],
    })
  }

  const activeFiltersCount =
    filters.technologies.length +
    filters.types.length +
    filters.years.length +
    filters.statuses.length

  return (
    <div ref={filtersRef} className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <h3 className="text-sm font-semibold text-cyan-400/80 uppercase tracking-wider">
          Фильтры
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-white/40 hover:text-cyan-400 transition-colors"
          >
            Сбросить ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Тип проекта */}
      <div data-filter-section className="space-y-2">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Тип
        </h4>
        <div className="space-y-1.5">
          {PROJECT_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.types.includes(value)}
                onChange={() => toggleType(value)}
                className="w-3.5 h-3.5 rounded border-cyan-500/30 bg-transparent text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-white/60 group-hover:text-cyan-400 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Статус */}
      <div data-filter-section className="space-y-2">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Статус
        </h4>
        <div className="space-y-1.5">
          {PROJECT_STATUSES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.statuses.includes(value)}
                onChange={() => toggleStatus(value)}
                className="w-3.5 h-3.5 rounded border-cyan-500/30 bg-transparent text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-white/60 group-hover:text-cyan-400 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Технологии */}
      <div data-filter-section className="space-y-2">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Технологии
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableTechnologies.map((tech) => {
            const isActive = filters.technologies.includes(tech)
            return (
              <button
                key={tech}
                onClick={() => toggleTechnology(tech)}
                className={`text-xs transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-white/40 hover:text-cyan-400/70'
                }`}
              >
                {tech}
              </button>
            )
          })}
        </div>
      </div>

      {/* Года */}
      <div data-filter-section className="space-y-2">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Год</h4>
        <div className="flex flex-wrap gap-2">
          {availableYears.map((year) => {
            const isActive = filters.years.includes(year)
            return (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`text-xs transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-white/40 hover:text-cyan-400/70'
                }`}
              >
                {year}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
