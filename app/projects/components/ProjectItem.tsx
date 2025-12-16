'use client'

import { useRef, useEffect, memo } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import type { Project } from '@/types/project'
import CompactSphere from '@/components/ui/custom/3D/CompactSphere'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProjectItemProps {
  project: Project
  index?: number
}

// Мемоизация для предотвращения лишних re-renders при infinite scroll
const ProjectItem = memo(function ProjectItem({ project, index = 0 }: ProjectItemProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Анимация появления при скролле
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
          delay: index * 0.08,
          ease: 'power2.out',
        }
      )
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  // Hover-эффекты с GSAP
  const handleMouseEnter = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !cardRef.current || !glowRef.current) return

    // Убиваем все текущие анимации и сбрасываем стили от появления
    gsap.killTweensOf([cardRef.current, glowRef.current])
    gsap.set(cardRef.current, { clearProps: 'opacity' })

    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out',
    })

    gsap.to(glowRef.current, {
      opacity: 0.4,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !cardRef.current || !glowRef.current) return

    // Убиваем все текущие анимации
    gsap.killTweensOf([cardRef.current, glowRef.current])

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
            Завершен
          </span>
        )
      case 'in-progress':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            В процессе
          </span>
        )
      case 'planned':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
            Запланирован
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer block"
    >
      {/* Glow эффект при hover */}
      <div
        ref={glowRef}
        aria-hidden
        className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 pointer-events-none"
      />

      {/* Основная карточка */}
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-0">
          {/* 3D Сфера */}
          <div className="relative w-full h-48 md:h-auto bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/10 flex items-center justify-center">
            <CompactSphere size={180} color={0x22d3ee} />

            {/* Градиентный оверлей для плавного перехода */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:to-transparent pointer-events-none" />
          </div>

          {/* Контент */}
          <div className="p-6 space-y-4">
            {/* Заголовок и метаданные */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                {getStatusBadge(project.status)}
              </div>

              {/* Год и тип */}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-cyan-400/90 font-medium">{project.year}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60">{getTypeLabel(project.type)}</span>
              </div>
            </div>

            {/* Описание */}
            <p className="text-white/70 leading-relaxed line-clamp-3">
              {project.shortDescription}
            </p>

            {/* Технологии */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 8).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300/90 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 8 && (
                <span className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/50">
                  +{project.technologies.length - 8}
                </span>
              )}
            </div>

            {/* Ссылка на проект */}
            {project.link && (
              <div className="pt-2">
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                      >
                        <span>Открыть проект</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Внешняя ссылка на проект заказчика. Представлено для демонстрации навыков.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
})

export default ProjectItem
