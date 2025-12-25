'use client'

import { useEffect, useRef } from 'react'
import TabItem from './TabItem'
import ProjectImages from './ProjectImages'
import AnimatedStarsBg from '@/components/ui/custom/animated/AnimatedStarsBg'
import useActiveIndex from './hooks/useActiveIndex'
import useScrollTrigger from './hooks/useScrollTrigger'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import gsap from 'gsap'
import portfolioData from '@/data/projects.json'

const projects = portfolioData.showcaseProjects

export default function ProjectsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleTextRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const { activeIndex, handleTabClick } = useActiveIndex()
  useScrollTrigger(videoContainerRef)

  const isSectionVisible = useIntersectionObserver(containerRef, { threshold: 0.2 })
  const isVideoVisible = useIntersectionObserver(videoContainerRef, { threshold: 0.2 })
  const isStatsVisible = useIntersectionObserver(statsRef, { threshold: 0.3 })

  // === АНИМАЦИЯ СТАТИСТИКИ ===
  useEffect(() => {
    if (isStatsVisible) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.stat-bar-fill',
          { width: 0 },
          {
            width: (i, el: HTMLElement) => `${el.dataset.value}%`,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.1,
          }
        )
        gsap.fromTo(
          '.stat-value',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 0.3 }
        )
      }, statsRef)
      return () => ctx.revert()
    }
  }, [isStatsVisible, activeIndex])

  return (
    <section
      ref={containerRef}
      className={`relative flex justify-center items-center bg-black w-full min-h-[65vh] transition-opacity duration-1000 ${
        isSectionVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <AnimatedStarsBg containerRef={containerRef} canvasRef={canvasRef} />

      <div className='max-w-[1920px] relative text-white overflow-hidden min-h-[700px] py-10 px-4 sm:px-6 lg:px-12 w-full'>
        {/* === Заголовок === */}
        <header className="relative z-10 mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-500">Проекты:</h2>
          <h3
            ref={titleTextRef}
            className="text-2xl sm:text-3xl font-bold text-white mt-2"
          >
            {projects[activeIndex].title}
          </h3>
          <div
            ref={lineRef}
            className="h-[2px] w-full bg-cyan-500 mt-1 scale-x-100 origin-left"
          />
        </header>

        {/* === Табуляция проектов === */}
        <div className="flex flex-wrap gap-6 mb-8 z-10 relative">
          {projects.map((project, index) => (
            <TabItem
              key={index}
              project={project}
              index={index}
              activeIndex={activeIndex}
              onClick={handleTabClick}
            />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
          {/* КОЛЛАЖИ */}
          <ProjectImages images={projects[activeIndex].images} />

          {/* СТАТИСТИКА */}
          <div
            ref={statsRef}
            className={`transition-opacity duration-1000 w-full lg:w-[35%] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md ${
              isStatsVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h3 className="text-xl text-cyan-400 font-semibold mb-4 tracking-wide">
              Статистика проекта
            </h3>

            <p className="text-white/70 text-sm mb-6">
              {projects[activeIndex].description}
            </p>

            <div className="flex flex-col gap-4">
              {projects[activeIndex].stats?.map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/80 text-sm">{stat.label}</span>
                    <span
                      className="text-cyan-400 font-medium stat-value"
                      data-value={stat.value}
                    >
                      {stat.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-900 to-cyan-500 stat-bar-fill"
                      data-value={stat.value}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
