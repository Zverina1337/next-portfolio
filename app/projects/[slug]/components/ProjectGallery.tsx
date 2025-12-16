'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import { gsap } from '@/lib/gsap-init'
import ProjectLightbox from './ProjectLightbox'

interface ProjectGalleryProps {
  screenshots: string[]
  projectTitle: string
}

// Отдельный компонент для элемента галереи с защитой от конфликта анимаций
function GalleryItem({
  screenshot,
  index,
  projectTitle,
  heightClass,
  onClick,
}: {
  screenshot: string
  index: number
  projectTitle: string
  heightClass: string
  onClick: () => void
}) {
  const itemRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    if (!itemRef.current) return

    // Убиваем все анимации и сбрасываем ScrollTrigger стили
    gsap.killTweensOf(itemRef.current)
    gsap.set(itemRef.current, { clearProps: 'y,scale,opacity' })
  }

  return (
    <button
      ref={itemRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`gallery-item group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 ${heightClass}`}
      aria-label={`Открыть скриншот ${index + 1}`}
    >
      {/* Image */}
      <Image
        src={screenshot}
        alt={`${projectTitle} - скриншот ${index + 1}`}
        fill
        className='object-cover transition-transform duration-700 group-hover:scale-110'
        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
        loading='lazy'
      />

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      {/* Glow effect на hover */}
      <div className='absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20' />
      </div>

      {/* Expand Icon */}
      <div className='absolute right-4 top-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
        <Maximize2 className='h-5 w-5 text-white' />
      </div>

      {/* Bottom Info */}
      <div className='absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-white/90'>Скриншот {index + 1}</span>
          <span className='text-xs text-white/60'>Нажмите для увеличения</span>
        </div>
      </div>

      {/* Number Badge */}
      <div className='absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400 backdrop-blur-sm transition-all duration-500 group-hover:scale-110'>
        {index + 1}
      </div>
    </button>
  )
}

export default function ProjectGallery({ screenshots, projectTitle }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !galleryRef.current) return

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.gallery-title', {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      })

      // Images stagger animation с улучшенным эффектом
      gsap.from('.gallery-item', {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 85%',
        },
        y: 60,
        scale: 0.85,
        opacity: 0,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: 'start',
        },
        ease: 'power2.out',
        onComplete: function () {
          // Сбрасываем inline-стили после завершения анимации
          gsap.set(this.targets(), { clearProps: 'y,scale,opacity' })
        },
      })
    }, galleryRef)

    return () => ctx.revert()
  }, [])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  if (!screenshots || screenshots.length === 0) {
    return null
  }

  return (
    <>
      <section id='gallery' ref={galleryRef} className='scroll-mt-32 py-20 md:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          {/* Title */}
          <h2 className='gallery-title mb-12 text-4xl font-bold text-white md:text-5xl'>
            Галерея проекта
          </h2>

          {/* Masonry-style Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {screenshots.map((screenshot, index) => {
              // Создаем вариативность высоты для masonry эффекта
              const heightVariants = ['aspect-video', 'aspect-[4/5]', 'aspect-square']
              const heightClass = heightVariants[index % heightVariants.length]

              return (
                <GalleryItem
                  key={index}
                  screenshot={screenshot}
                  index={index}
                  projectTitle={projectTitle}
                  heightClass={heightClass}
                  onClick={() => openLightbox(index)}
                />
              )
            })}
          </div>

          {/* Gallery Stats */}
          <div className='mt-12 flex items-center justify-center gap-8 text-sm text-white/60'>
            <div className='flex items-center gap-2'>
              <div className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
              <span>Всего изображений: {screenshots.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <ProjectLightbox
          images={screenshots}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  )
}