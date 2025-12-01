'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'
import AsciiPortrait from './AsciiPortrait'

export default function AboutHero() {
  const root = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  // триггер анимации при появлении секции
  const isVisible = useIntersectionObserver(root, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !isVisible) return

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (!root.current) return

      intro
        .fromTo(root.current.querySelector('[data-el="name"]'), { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0)
        .fromTo(root.current.querySelector('[data-el="role"]'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2)
        .fromTo(root.current.querySelector('[data-el="bio"]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .fromTo(avatarRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0.2)

      intro.play(0)
    }, root)

    return () => ctx.revert()
  }, [isVisible])

  return (
    <section
      id="about-hero"
      ref={root}
      className="relative isolate w-full min-h-screen bg-black text-white overflow-hidden flex items-center"
      aria-label="About Hero"
    >
      {/* Киберпанк grid фон */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-20
                   bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)]
                   bg-[size:50px_50px]"
      />

      {/* Radial glow accent */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]
                   bg-gradient-radial from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Левая колонка: Биография */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <h1
                data-el="name"
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text
                           bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400 tracking-tight"
                style={{
                  textShadow: '0 0 40px rgba(34,211,238,0.5)'
                }}
              >
                ZVERINACODE
              </h1>

              <p
                data-el="role"
                className="text-xl sm:text-2xl font-semibold text-cyan-100/90"
              >
                Frontend Developer
              </p>
            </div>

            <div data-el="bio" className="space-y-6">
              <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90">
                Создаю быстрые и выразительные интерфейсы на <span className="text-cyan-400 font-semibold">Vue</span> и <span className="text-cyan-400 font-semibold">React</span>, 
                сочетая эстетику и функциональность. Для меня важны плавные сценарии, 
                логика взаимодействий и ощущение цельного продукта.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-white/85">
                Разрабатываю приложения на <span className="text-cyan-400 font-semibold">Next.js</span>, <span className="text-cyan-400 font-semibold">Nuxt.js</span> и <span className="text-cyan-400 font-semibold">TypeScript</span> — 
                от CRM-систем и дашбордов до интерактивных платформ. 
                Внедряю <span className="text-cyan-400 font-semibold">AI-инструменты</span> (<span className="text-cyan-400 font-semibold">Claude Code</span>, DeepSeek, Ollama), 
                которые ускоряют процесс в 2-3 раза и помогают поддерживать высокий уровень кода.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-white/85">
                Работаю с <span className="text-cyan-400 font-semibold">Docker</span>, <span className="text-cyan-400 font-semibold">Node.js</span> и <span className="text-cyan-400 font-semibold">Express</span> — выстраиваю инфраструктуру и CI-процессы. 
                Особое внимание уделяю <span className="text-cyan-400 font-semibold">производительности</span>, <span className="text-cyan-400 font-semibold">доступности</span> (WCAG) и архитектуре компонентов. 
                Код — чистый, типобезопасный и легко масштабируемый.
              </p>

              {/* Ключевые факты */}
              <div className="pt-4 space-y-3 border-l-2 border-cyan-500/30 pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm text-gray-400">
                    <span className="text-cyan-400 font-medium">Опыт:</span> 1.5 года коммерческой разработки
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                  <span className="text-sm text-gray-400">
                    <span className="text-cyan-400 font-medium">Стек:</span> Vue 3, React, Next.js, TypeScript
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                  <span className="text-sm text-gray-400">
                    <span className="text-cyan-400 font-medium">Локация:</span> UTC+7 (Томск)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: ASCII портрет */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={avatarRef}
              className="relative w-full max-w-md lg:max-w-lg"
            >
              <AsciiPortrait />
            </div>
          </div>

        </div>
      </div>

      {/* Сканирующая линия снизу */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[1px]
                   bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
      />
    </section>
  )
}
