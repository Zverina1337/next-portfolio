'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'

type Skill = {
  name: string
  icon: string
  level: number
  category: 'frontend' | 'backend' | 'tools' | 'ai'
}

// Реальные навыки из резюме
const SKILLS: Skill[] = [
  // Frontend
  { name: 'Vue 3 / Nuxt.js', icon: '💚', level: 95, category: 'frontend' },
  { name: 'React / Next.js', icon: '⚛️', level: 90, category: 'frontend' },
  { name: 'TypeScript', icon: '📘', level: 92, category: 'frontend' },
  { name: 'Tailwind CSS', icon: '🎨', level: 95, category: 'frontend' },
  { name: 'HTML5 / CSS3', icon: '🌐', level: 95, category: 'frontend' },

  // Backend
  { name: 'Node.js', icon: '🟢', level: 80, category: 'backend' },
  { name: 'Express.js', icon: '🚂', level: 85, category: 'backend' },
  { name: 'Nest.js', icon: '🐈', level: 35, category: 'backend' },

  // Tools
  { name: 'Docker', icon: '🐳', level: 50, category: 'tools' },
  { name: 'Git / GitHub', icon: '🌿', level: 50, category: 'tools' },
  { name: 'Vite', icon: '⚡', level: 55, category: 'tools' },

  // AI Инструменты
  { name: 'ChatGPT 4/5', icon: '🤖', level: 95, category: 'ai' },
  { name: 'Ollama + Continue', icon: '🔧', level: 85, category: 'ai' },
]

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Инструменты',
  ai: 'AI Инструменты',
}

const CATEGORY_COLORS = {
  frontend: 'from-cyan-500 to-blue-500',
  backend: 'from-green-500 to-emerald-500',
  tools: 'from-purple-500 to-pink-500',
  ai: 'from-orange-500 to-red-500',
}

function SkillCard({ skill }: { skill: Skill }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.05,
        duration: 0.4,
        ease: 'back.out(1.5)',
      })

      // Анимация иконки
      const icon = card.querySelector('[data-skill-icon]')
      if (icon) {
        gsap.to(icon, {
          scale: 1.2,
          rotation: 360,
          duration: 0.6,
          ease: 'back.out(2)',
        })
      }

      // Анимация прогресс-бара
      const bar = card.querySelector('[data-skill-progress]')
      if (bar) {
        gsap.to(bar, {
          scaleY: 1.1,
          duration: 0.3,
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      })

      const icon = card.querySelector('[data-skill-icon]')
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
        })
      }

      const bar = card.querySelector('[data-skill-progress]')
      if (bar) {
        gsap.to(bar, {
          scaleY: 1,
          duration: 0.3,
        })
      }
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      data-skill-card
      className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-sm cursor-pointer overflow-hidden group"
    >
      {/* Декоративный градиентный фон */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[skill.category]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Иконка */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <div
          data-skill-icon
          className="text-5xl drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
        >
          {skill.icon}
        </div>

        {/* Название */}
        <h3 className="text-lg font-bold text-white min-h-[3rem] flex items-center justify-center">
          {skill.name}
        </h3>

        {/* Прогресс */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/60">Уровень</span>
            <span className="text-xs font-semibold text-cyan-400">
              {skill.level}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              data-skill-progress
              className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[skill.category]} rounded-full origin-left transition-all duration-300`}
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Категория */}
        <div
          className={`px-3 py-1 bg-gradient-to-r ${CATEGORY_COLORS[skill.category]} bg-opacity-20 border border-white/20 rounded-full text-[10px] font-medium`}
        >
          {CATEGORY_LABELS[skill.category]}
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 right-2 flex gap-0.5 opacity-20">
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
      </div>
    </div>
  )
}

export default function AboutSkills() {
  const root = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(root, { threshold: 0.1 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !isVisible) return

    const ctx = gsap.context(() => {
      // Анимация появления карточек
      const cards = root.current?.querySelectorAll('[data-skill-card]')
      cards?.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.05,
          }
        )
      })
    }, root)

    return () => ctx.revert()
  }, [isVisible])

  return (
    <section
      ref={root}
      id="about-skills"
      className="relative w-full bg-gradient-to-b from-black via-slate-950 to-black text-white py-20 overflow-hidden"
      aria-label="Skills and Tools"
    >
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-500 mb-4">
            НАВЫКИ & ИНСТРУМЕНТЫ
          </h2>
          <p className="text-base sm:text-lg opacity-70 max-w-2xl mx-auto">
            Технологии, с которыми я работаю для создания современных веб-приложений
          </p>
        </div>

        {/* Сетка навыков */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SKILLS.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>

        {/* AI-блок (особое внимание) */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 border-2 border-orange-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🚀</div>
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-3">
                  Ключевая фишка: AI-интеграция в разработку
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Глубоко интегрирую AI-инструменты в процесс разработки, что позволяет увеличивать
                  скорость работы в 2-3 раза. Использую Memory Bank, Feedback Loop, MCP Tools, Prompt Engineering,
                  Context Management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-xs font-medium">
                    ChatGPT 4/5
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-xs font-medium">
                    DeepSeek
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-xs font-medium">
                    Ollama + Continue
                  </span>
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-lg text-xs font-medium">
                    Local AI Environment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm opacity-80">
              💡 <span className="font-semibold">1.5 года опыта</span> коммерческой разработки + постоянное изучение новых технологий
            </p>
          </div>
        </div>
      </div>

      {/* Декоративный фон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10
                   bg-[radial-gradient(rgba(34,211,238,0.3)_1px,transparent_1px)]
                   [background-size:32px_32px]"
      />
    </section>
  )
}
