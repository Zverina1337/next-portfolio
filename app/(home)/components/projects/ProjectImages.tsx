'use client'

import { useRef, useEffect, useState, memo, useMemo } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type ProjectImagesProps = {
  images?: { src: string; name: string }[]
}

const ProjectImages = memo(function ProjectImages({ images }: ProjectImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReduced, setPrefersReduced] = useState(false)

  // Генерация позиций для изображений в коллаже (мемоизировано)
  // ВАЖНО: useMemo должен быть ДО early return
  const imagePositions = useMemo(() => [
    // Основное большое изображение по центру
    { left: '25%', top: '30%', width: '60%', height: '65%', zIndex: 1 },
    // Второе изображение справа вверху
    { left: '80.5%', top: '10%', width: '10%', height: '70%', zIndex: 2 },
    // Третье изображение справа внизу
    { left: '13%', top: '92%', width: '22%', height: '15%', zIndex: 2 },
    // Четвертое маленькое слева внизу
    { left: '13%', top: '75%', width: '22%', height: '15%', zIndex: 4 },
    // Пятое справа по центру (небольшое)
    { left: '13%', top: '58%', width: '22%', height: '15%', zIndex: 1 },
  ], [])

  // Проверка prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handleChange = () => setPrefersReduced(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // GSAP параллакс анимация
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReduced) return
    if (!containerRef.current || !images || images.length === 0) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      if (!isMobile) {
        // Desktop: параллакс для каждого изображения
        images.forEach((_, index) => {
          const imageEl = containerRef.current?.querySelector(
            `[data-parallax-image="${index}"]`
          )
          if (!imageEl) return

          // Разные глубины для разных изображений
          const depth = index === 0 ? -50 : -120
          const scaleValue = index === 0 ? 1.05 : 1.08

          gsap.to(imageEl, {
            y: depth,
            scale: scaleValue,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [images, prefersReduced])

  // Fallback: если нет изображений
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full mx-auto rounded-2xl overflow-hidden border border-white/10 aspect-video z-10">
        {/* Анимированный градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-black/60 to-purple-950/40 animate-gradient" />

        {/* Декоративная сетка */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(34,211,238,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.4)_1px,transparent_1px)] [background-size:20px_20px]"
        />

        {/* Иконка камеры */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-cyan-500/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </div>
    )
  }

  const getImagePosition = (index: number) => {
    return imagePositions[index] || imagePositions[imagePositions.length - 1]
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto rounded-2xl overflow-hidden aspect-video z-10"
    >
      {/* Desktop: параллакс-коллаж с absolute positioning */}
      <div className="hidden md:block absolute inset-0">
        {images.slice(0, 6).map((image, index) => {
          const position = getImagePosition(index)

          return (
            <div
              key={index}
              data-parallax-image={index}
              className="absolute will-change-transform"
              style={position}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                <Image
                  src={image.src}
                  alt={image.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile: два изображения рядом БЕЗ параллакса */}
      <div className="md:hidden absolute inset-0 flex gap-2 p-4">
        {images.slice(0, 2).map((image, index) => (
          <div
            key={index}
            className="relative flex-1 rounded-lg overflow-hidden border border-cyan-500/20"
          >
            <Image
              src={image.src}
              alt={image.name}
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      {/* Декоративная сетка поверх */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-5 bg-[linear-gradient(rgba(34,211,238,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.3)_1px,transparent_1px)] [background-size:16px_16px]"
      />
    </div>
  )
})

export default ProjectImages
