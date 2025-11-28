'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import AnimatedBG from '@/components/ui/custom/animated/AnimatedBg'
import AnimatedRadialAccent from '@/components/ui/custom/animated/AnimatedRadialAccent'
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver'

export default function AboutHero() {
  const root = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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
        .fromTo(root.current.querySelector('[data-el="label"]'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '<0.1')
        .fromTo(root.current.querySelector('[data-el="name"]'), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '<0.1')
        .fromTo(root.current.querySelector('[data-el="role"]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '<0.1')
        .fromTo(root.current.querySelector('[data-el="description"]'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '<0.2')
        .fromTo(avatarRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, '<0.1')
        .fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, '<0.3')

      intro.play(0)
    }, root)

    return () => ctx.revert()
  }, [isVisible])

  return (
    <section
      id="about-hero"
      ref={root}
      className="relative isolate w-full bg-black text-white overflow-hidden"
      aria-label="About Hero"
    >
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-6 md:px-12 lg:px-20 py-20">
        <div className="relative w-full rounded-[24px] border-2 border-cyan-500/90 p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden">
          <AnimatedRadialAccent />
          <AnimatedBG
            variant="rings"
            tint="rgba(255,255,255,0.10)"
            accent="rgba(34,211,238,0.35)"
            particles={true}
            className="pointer-events-none absolute inset-0 z-0 w-full h-full"
          />

          {/* декоративная grid-подложка */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40
                       bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
                       [background-size:12px_12px]"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Левая колонка: текст */}
            <div className="space-y-6">
              <p data-el="label" className="text-[10px] uppercase tracking-[0.25em] opacity-80">
                ПОЗНАКОМИМСЯ БЛИЖЕ
              </p>

              <div>
                <h1 data-el="name" className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-500 tracking-tight mb-2">
                  ZVERINACODE
                </h1>
                <p data-el="role" className="text-xl sm:text-2xl font-semibold opacity-90">
                  Frontend Developer с AI-интеграцией
                </p>
              </div>

              <p data-el="description" className="text-base sm:text-lg opacity-80 max-w-xl leading-relaxed">
                Frontend-разработчик с 1.5 годами опыта, специализирующийся на Vue.js и React.
                Глубоко интегрирую AI-инструменты в процесс разработки, что позволяет увеличивать
                скорость работы в 2-3 раза. Имею полное понимание полного цикла разработки — от
                интеграции API до проектирования масштабируемой архитектуры.
              </p>

              {/* Декоративная вертикальная линия - намек на roadmap */}
              <div className="relative pt-8">
                <div
                  ref={lineRef}
                  className="absolute left-0 top-0 w-[2px] h-32 bg-gradient-to-b from-cyan-500 to-transparent origin-top"
                  style={{ transform: 'scaleY(0)' }}
                />
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-sm opacity-70">Опыт: 1.5 года коммерческой разработки</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500/70" />
                    <span className="text-sm opacity-70">Стек: Vue 3, React, Next.js, TypeScript</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
                    <span className="text-sm opacity-70">Локация: UTC+7 (Томск)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка: аватар */}
            <div className="flex justify-center lg:justify-end">
              <div
                ref={avatarRef}
                className="relative w-64 h-64 sm:w-80 sm:h-80"
              >
                {/* Основной круг с заглушкой */}
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/60 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">👨‍💻</div>
                      <p className="text-sm opacity-60">Фото здесь</p>
                    </div>
                  </div>
                </div>

                {/* Внешнее кольцо (декор) */}
                <div className="absolute -inset-4 rounded-full border border-cyan-500/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-6 rounded-full border border-cyan-500/20 animate-[spin_30s_linear_infinite_reverse]" />

                {/* Угловые акценты */}
                <span className="absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-cyan-500 opacity-80" />
                <span className="absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-cyan-500 opacity-80" />
                <span className="absolute -left-3 -bottom-3 h-6 w-6 border-l-2 border-b-2 border-cyan-500 opacity-80" />
                <span className="absolute -right-3 -bottom-3 h-6 w-6 border-r-2 border-b-2 border-cyan-500 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
