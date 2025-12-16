'use client'

import { useRef, useState } from 'react'
import { LucideIcon } from 'lucide-react'
import gsap from 'gsap'

interface ProjectContentCardProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  variant?: 'large' | 'medium' | 'small'
  className?: string
}

export default function ProjectContentCard({
  icon: Icon,
  title,
  children,
  variant = 'medium',
  className = '',
}: ProjectContentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!cardRef.current || !glowRef.current) return

    // Убиваем ВСЕ анимации на элементах, включая ScrollTrigger
    gsap.killTweensOf([cardRef.current, glowRef.current])

    // Сбрасываем y и opacity от ScrollTrigger анимации
    gsap.set(cardRef.current, { clearProps: 'y,opacity' })

    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })

    tl.to(cardRef.current, {
      scale: 1.02,
      duration: 0.4,
    }, 0)
    .to(glowRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
    }, 0)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!cardRef.current || !glowRef.current) return

    // Убиваем ВСЕ анимации на элементах
    gsap.killTweensOf([cardRef.current, glowRef.current])

    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })

    tl.to(cardRef.current, {
      scale: 1,
      duration: 0.4,
    }, 0)
    .to(glowRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
    }, 0)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Убиваем предыдущую анимацию перемещения glow
    gsap.killTweensOf(glowRef.current)

    // Позиционируем glow эффект
    gsap.to(glowRef.current, {
      x: x - 150,
      y: y - 150,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const sizeClasses = {
    large: 'p-8 md:p-10',
    medium: 'p-6 md:p-8',
    small: 'p-4 md:p-6',
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-500/30 ${sizeClasses[variant]} ${className}`}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className='pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 blur-3xl'
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Content */}
      <div className='relative z-10'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/50'>
            <Icon
              className='h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:rotate-12'
            />
          </div>
          <h3 className='text-2xl font-bold text-white'>{title}</h3>
        </div>

        {/* Children content */}
        <div className='text-base text-white/70'>{children}</div>
      </div>

      {/* Border gradient on hover */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background:
            'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        }}
      />
    </div>
  )
}