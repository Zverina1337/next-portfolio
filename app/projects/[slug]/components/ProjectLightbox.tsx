'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'

interface ProjectLightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ProjectLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ProjectLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Открытие lightbox с анимацией
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !overlayRef.current || !contentRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    ).fromTo(
      contentRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' },
      '-=0.2'
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  // Закрытие с анимацией
  const handleClose = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      onClose()
      return
    }

    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.1'
    )
  }

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
      onClick={handleClose}
    >
      {/* Content */}
      <div
        ref={contentRef}
        className='relative max-h-[90vh] max-w-[90vw]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute -right-12 top-0 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20'
          aria-label='Закрыть'
        >
          <X className='h-6 w-6' />
        </button>

        {/* Image */}
        <div className='relative h-[80vh] w-[80vw] overflow-hidden rounded-lg'>
          <Image
            src={images[currentIndex]}
            alt={`Screenshot ${currentIndex + 1}`}
            fill
            className='object-contain'
            sizes='90vw'
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20'
              aria-label='Предыдущее изображение'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
            <button
              onClick={onNext}
              className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20'
              aria-label='Следующее изображение'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          </>
        )}

        {/* Counter */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
