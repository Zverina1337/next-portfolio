'use client'

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import MagneticButton from '@/components/ui/custom/MagneticButton'
import { useReducedMotion } from '@/components/hooks/useReducedMotion'
import EmailDrop from './ui/EmailDrop'
import SocialChip from './ui/SocialChip'
import ContactOrnament, { type OrnamentVariant } from './ui/ContactOrnament'
import ContactNavigation, { type NavLink } from './ui/ContactNavigation'
import SocialLinks from './ui/SocialLinks'
import Contact3DBackground from './ui/Contact3DBackground'
import { useContactAnimations } from './hooks/useContactAnimations'

export type ContactBlockProps = {
  id?: string
  className?: string
  accent?: string // HEX цвет акцента (по умолчанию #22d3ee)
  email: string
  intervalMs?: number // Интервал анимации email (мс)
  navLinks?: NavLink[]
  ornamentVariant?: OrnamentVariant
}

export default function ContactBlock({
  id = 'contact',
  className,
  accent = '#22d3ee',
  email = 'danii.zvorugin@gmail.com',
  intervalMs = 2200,
  navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    { label: 'PROJECTS', href: '/projects' },
  ],
  ornamentVariant = 'tech',
}: ContactBlockProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  const prefersReduced = useReducedMotion()

  // Регистрация ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  // GSAP анимации появления элементов
  useContactAnimations(rootRef, prefersReduced)

  const style = { ['--accent' as string]: accent } as React.CSSProperties

  return (
    <section
      id={id}
      ref={rootRef}
      style={style}
      className={clsx(
        'relative isolate overflow-hidden',
        'mx-auto w-full max-w-[1920px]',
        'px-6 sm:px-8 md:px-12 lg:px-20',
        'pt-12 sm:pt-16 lg:pt-20',
        'min-h-[30vh] flex flex-col justify-center',
        'bg-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30',
        className
      )}
    >
      {/* 3D фон с буквами CONTACT */}
      <Contact3DBackground />

      {/* Декоративный орнамент сверху */}
      <ContactOrnament variant={ornamentVariant} accent={accent} />

      {/* Заголовок секции */}
      <div data-heading className="text-center mb-6 sm:mb-8">
        <div className="text-xs sm:text-sm tracking-[0.2em] text-slate-300/80 uppercase">
          READY TO WORK?
        </div>
      </div>

      {/* MagneticButton в центре */}
      <div className="flex justify-center items-center mb-8 sm:mb-10" data-button>
        <MagneticButton email={email} />
      </div>

      {/* Социальные ссылки */}
      <div className="mb-8 sm:mb-10">
        <SocialLinks />
      </div>

      {/* Навигация */}
      <ContactNavigation links={navLinks} accent={accent} />

      {/* Информация + Email */}
      <div
        data-info
        className="grid grid-cols-1 md:grid-cols-2 border-y border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10"
      >
        <div className="p-5 sm:p-6 text-slate-300/90">
          <p className="max-w-xl text-sm sm:text-base">
            ЕСТЬ КАКАЯ-НИБУДЬ ИДЕЯ? ДАВАЙ ОБСУДИМ И СДЕЛАЕМ ЧТО-НИБУДЬ КРУТОЕ ВМЕСТЕ!
          </p>
        </div>
        <div className="p-5 sm:p-6 flex items-center">
          <EmailDrop email={email} intervalMs={intervalMs} />
        </div>
      </div>
      
    </section>
  )
}
