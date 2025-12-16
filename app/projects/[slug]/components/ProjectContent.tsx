'use client'

import { useEffect, useRef } from 'react'
import { Project } from '@/types/project'
import { FileText, Code, Trophy, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectTechStack from './ProjectTechStack'
import ProjectContentCard from './ProjectContentCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectContentProps {
  project: Project
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Анимация карточек при скролле
      gsap.utils.toArray('.content-card').forEach((card, index) => {
        gsap.from(card as Element, {
          scrollTrigger: {
            trigger: card as Element,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: index * 0.1,
          onComplete: () => {
            // После завершения анимации сбрасываем inline-стили
            // чтобы они не конфликтовали с hover-анимацией
            gsap.set(card as Element, { clearProps: 'y,opacity' })
          },
        })
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id='project-content' ref={contentRef} className='relative py-20 md:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        {/* Overview Section */}
        <div id='overview' className='mb-20 scroll-mt-32'>
          <h2 className='mb-12 text-4xl font-bold text-white md:text-5xl'>
            Обзор проекта
          </h2>

          {/* Bento Grid Layout */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* О проекте - Large card */}
            <ProjectContentCard
              icon={FileText}
              title='О проекте'
              variant='large'
              className='content-card md:col-span-2'
            >
              <p className='text-lg leading-relaxed text-white/80'>
                {project.detailedDescription}
              </p>
            </ProjectContentCard>

            {/* Ключевые возможности */}
            {project.features && project.features.length > 0 && (
              <ProjectContentCard
                icon={Sparkles}
                title='Ключевые возможности'
                variant='medium'
                className='content-card'
              >
                <ul className='space-y-3'>
                  {project.features.map((feature, index) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400' />
                      <span className='text-white/80'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </ProjectContentCard>
            )}

            {/* Технологии */}
            <ProjectContentCard
              icon={Code}
              title='Стек технологий'
              variant='medium'
              className='content-card'
            >
              <div className='flex flex-wrap gap-2'>
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className='rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-300'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </ProjectContentCard>
          </div>
        </div>

        {/* Process Section */}
        <div id='process' className='mb-20 scroll-mt-32'>
          <h2 className='mb-12 text-4xl font-bold text-white md:text-5xl'>
            Процесс разработки
          </h2>

          <ProjectContentCard
            icon={Code}
            title='Опыт разработки'
            variant='large'
            className='content-card'
          >
            <p className='text-lg leading-relaxed text-white/80'>
              {project.developmentExperience}
            </p>
          </ProjectContentCard>
        </div>

        {/* Achievements Section */}
        <div id='achievements' className='mb-20 scroll-mt-32'>
          <h2 className='mb-12 text-4xl font-bold text-white md:text-5xl'>
            Результаты и рост
          </h2>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Карьерные достижения */}
            {project.careerAchievements && project.careerAchievements.length > 0 && (
              <ProjectContentCard
                icon={Trophy}
                title='Карьерные достижения'
                variant='medium'
                className='content-card'
              >
                <ul className='space-y-4'>
                  {project.careerAchievements.map((achievement, index) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='mt-1.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20'>
                        <Trophy className='h-3.5 w-3.5 text-cyan-400' />
                      </div>
                      <span className='text-white/80'>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </ProjectContentCard>
            )}

            {/* Личностный рост */}
            {project.personalGrowth && project.personalGrowth.length > 0 && (
              <ProjectContentCard
                icon={Sparkles}
                title='Личностный рост'
                variant='medium'
                className='content-card'
              >
                <ul className='space-y-4'>
                  {project.personalGrowth.map((growth, index) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='mt-1.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20'>
                        <Sparkles className='h-3.5 w-3.5 text-purple-400' />
                      </div>
                      <span className='text-white/80'>{growth}</span>
                    </li>
                  ))}
                </ul>
              </ProjectContentCard>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}