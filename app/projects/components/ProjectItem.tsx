'use client'

import { useRef, useEffect, useState, memo } from 'react'
import { gsap } from 'gsap'
import type { Project } from '@/types/project'

interface ProjectItemProps {
  project: Project
  index?: number
}

// Мемоизация для предотвращения лишних re-renders при infinite scroll
const ProjectItem = memo(function ProjectItem({ project, index = 0 }: ProjectItemProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !cardRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
        }
      )
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commercial':
        return 'Коммерческий'
      case 'education':
        return 'Образовательный'
      case 'pet':
        return 'Pet-проект'
      default:
        return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен'
      case 'in-progress':
        return 'В процессе'
      case 'planned':
        return 'Запланирован'
      default:
        return status
    }
  }

  return (
    <div
      ref={cardRef}
      className="relative border-l-2 border-cyan-500/30 pl-6 py-4 hover:border-cyan-500/60 transition-all duration-300 group"
    >

      <div className="space-y-3">
        {/* Заголовок и год */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {project.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-cyan-400/80">{project.year}</span>
              <span className="text-xs text-white/40">·</span>
              <span className="text-xs text-white/50">{getTypeLabel(project.type)}</span>
              <span className="text-xs text-white/40">·</span>
              <span className="text-xs text-purple-400/70">{getStatusLabel(project.status)}</span>
            </div>
          </div>
        </div>

        {/* Краткое описание */}
        <p className="text-sm text-white/70 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Технологии - минималистично */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 6).map((tech, i) => (
            <span key={i} className="text-xs text-cyan-400/70">
              {tech}
            </span>
          ))}
          {project.technologies.length > 6 && (
            <span className="text-xs text-white/40">+{project.technologies.length - 6}</span>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? '↑ Свернуть' : '→ Подробнее'}
          </button>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-cyan-400 transition-colors"
            >
              Открыть ↗
            </a>
          )}
        </div>

        {/* Расширенное содержимое */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-4 animate-fadeIn">
            <p className="text-sm text-white/80 leading-relaxed">{project.fullDescription}</p>

            {project.features.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-cyan-400/80 mb-2 uppercase tracking-wider">
                  Особенности
                </h4>
                <ul className="space-y-1.5">
                  {project.features.map((feature, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-cyan-500/70 mt-0.5">—</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Все технологии */}
            <div>
              <h4 className="text-xs font-semibold text-cyan-400/80 mb-2 uppercase tracking-wider">
                Стек
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="text-xs text-cyan-400/70">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ProjectItem
