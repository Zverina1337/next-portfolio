'use client'

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PT_Sans_Narrow } from 'next/font/google'

import MagneticButton from '@/components/ui/custom/MagneticButton'
import { useReducedMotion } from '@/components/hooks/useReducedMotion'
import EmailDrop from './ui/EmailDrop'
import SocialChip from './ui/SocialChip'
import ContactOrnament, { type OrnamentVariant } from './ui/ContactOrnament'
import ContactNavigation, { type NavLink } from './ui/ContactNavigation'
import { useContactAnimations } from './hooks/useContactAnimations'

// Шрифт PT Sans Narrow с кириллицей
const ptSansNarrow = PT_Sans_Narrow({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  display: 'swap',
})

export type ContactBlockProps = {
  id?: string
  className?: string
  accent?: string // HEX цвет акцента (по умолчанию #22d3ee)
  email: string
  intervalMs?: number // Интервал анимации email (мс)
  navLinks?: NavLink[]
  socials?: {
    behance?: string
    linkedin?: string
    instagram?: string
    x?: string
    telegram?: string
    whatsapp?: string
  }
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
    { label: 'CONTACT', href: '#contact' },
  ],
  socials = {},
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

  const hasSocials = !!(
    socials?.behance ||
    socials?.linkedin ||
    socials?.instagram ||
    socials?.x ||
    socials?.telegram ||
    socials?.whatsapp
  )

  return (
    <section
      id={id}
      ref={rootRef}
      style={style}
      className={clsx(
        'relative isolate overflow-hidden',
        'mx-auto w-full max-w-[1920px]',
        'px-6 sm:px-8 md:px-12 lg:px-20',
        'py-24 sm:py-28 lg:py-32',
        'bg-black rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30',
        className
      )}
    >
      {/* Декоративный орнамент сверху */}
      <ContactOrnament variant={ornamentVariant} accent={accent} />

      {/* Заголовок секции */}
      <div data-heading className="text-center mb-6 sm:mb-8">
        <div className="text-xs sm:text-sm tracking-[0.2em] text-slate-300/80 uppercase">
          READY TO WORK?
        </div>
      </div>

      {/* Основной title с MagneticButton */}
      <div className="relative select-none mb-12 sm:mb-14">
        <h1
          data-title
          className={clsx(
            ptSansNarrow.className,
            'block w-full text-center font-extrabold whitespace-nowrap leading-[0.8]',
            'text-[color:var(--accent)] text-[clamp(4rem,21vw,24rem)]'
          )}
        >
          CONTACT ME
        </h1>
        <div data-button className="pointer-events-none absolute inset-0 grid place-items-center">
          <MagneticButton email={email} />
        </div>
      </div>

      {/* Навигация */}
      <ContactNavigation links={navLinks} accent={accent} />

      {/* Информация + Email */}
      <div
        data-info
        className="mb-2 grid grid-cols-1 md:grid-cols-2 border-y border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10"
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

      {/* Социальные ссылки */}
      {hasSocials && (
        <div data-socials className="mt-6 flex flex-wrap gap-3">
          {socials?.behance && <SocialChip href={socials.behance}>BEHANCE</SocialChip>}
          {socials?.linkedin && <SocialChip href={socials.linkedin}>LINKEDIN</SocialChip>}
          {socials?.instagram && <SocialChip href={socials.instagram}>INSTAGRAM</SocialChip>}
          {socials?.x && <SocialChip href={socials.x}>X</SocialChip>}
          {socials?.telegram && <SocialChip href={socials.telegram}>TELEGRAM</SocialChip>}
          {socials?.whatsapp && <SocialChip href={socials.whatsapp}>WHATSAPP</SocialChip>}
        </div>
      )}
    </section>
  )
}
