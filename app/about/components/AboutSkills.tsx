'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'

// Dynamic import для SkillsPyramid - уменьшает bundle размер на ~214KB
const SkillsPyramid = dynamic(() => import('@/components/ui/custom/3D/SkillsPyramid'), {
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="w-32 h-32 relative">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl animate-pulse" />
      </div>
    </div>
  ),
  ssr: false, // Three.js не работает на сервере
})

type Skill = {
  name: string
  icon: string
}

// Реальные навыки из резюме
const SKILLS: Skill[] = [
  // Frontend
  { name: 'Vue 3', icon: '/icons/vue.svg',},
  { name: 'Nuxt.js', icon: '/icons/nuxt.svg',},
  { name: 'React', icon: '/icons/react.svg',},
  { name: 'Next.js', icon: '/icons/next.svg',},
  { name: 'TypeScript', icon: '/icons/ts.svg',},
  { name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg',},
  { name: 'HTML5', icon: '/icons/html.svg',},
  { name: 'CSS3', icon: '/icons/css.svg',},

  // Backend
  { name: 'Node.js', icon: '/icons/nodejs.svg', },
  { name: 'Express.js', icon: '/icons/express.svg', },
  { name: 'Nest.js', icon: '/icons/nest.svg',},
  { name: 'Laravel', icon: '/icons/laravel.svg',},

  // Tools
  { name: 'Docker', icon: '/icons/docker.svg',},
  { name: 'Git / GitHub', icon: '/icons/git.svg',},

  // AI Инструменты
  { name: 'ChatGPT 4/5', icon: '🤖',},
  { name: 'Claude Code', icon: '🤖',},
  { name: 'Ollama + Continue', icon: '🤖', },
]

export default function AboutSkills() {
  const root = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(root, { threshold: 0.1 })

  return (
    <section
      ref={root}
      id="about-skills"
      className="relative w-full text-white overflow-hidden"
      aria-label="Skills and Tools"
    >
      {/* Плавный градиентный переход от предыдущей секции */}
      <div className="w-full h-40 bg-gradient-to-b from-black via-slate-950/50 to-slate-950" />

      {/* Основной контент с фоном */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black py-12">
        {/* Заголовок */}
        <div className="text-center mb-12 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-500 mb-4">
            НАВЫКИ & ИНСТРУМЕНТЫ
          </h2>
          <p className="text-base sm:text-lg opacity-70 max-w-2xl mx-auto">
            Технологии, с которыми я работаю для создания современных веб-приложений
          </p>
        </div>

        {/* Пирамида навыков с физикой - на всю ширину */}
        <SkillsPyramid skills={SKILLS} isVisible={isVisible} />
      </div>

      {/* Плавный переход к следующей секции */}
      <div className="w-full h-40 bg-gradient-to-b from-black via-slate-950/50 to-black" />
    </section>
  )
}
