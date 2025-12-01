'use client'

import { useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'

export type ContactMeButtonProps = {
  className?: string
  href?: string
}

/**
 * ContactMeButton — кнопка "Contact" с vertical slide эффектом
 * При hover текст улетает вверх и прилетает снизу
 */
export default function ContactMeButton({
  className,
  href = '#contact'
}: ContactMeButtonProps) {
  const textTopRef = useRef<HTMLSpanElement | null>(null)
  const textBottomRef = useRef<HTMLSpanElement | null>(null)

  useLayoutEffect(() => {
    const textTop = textTopRef.current
    const textBottom = textBottomRef.current
    if (!textTop || !textBottom) return

    // Инициализация позиций
    gsap.set(textTop, { y: 0 })
    gsap.set(textBottom, { y: '100%' })

    const onEnter = () => {
      gsap.to(textTop, {
        y: '-100%',
        duration: 0.4,
        ease: 'power2.inOut'
      })
      gsap.to(textBottom, {
        y: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      })
    }

    const onLeave = () => {
      gsap.to(textTop, {
        y: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      gsap.to(textBottom, {
        y: '100%',
        duration: 0.4,
        ease: 'power2.inOut'
      })
    }

    const parent = textTop.parentElement?.parentElement
    if (!parent) return

    parent.addEventListener('mouseenter', onEnter)
    parent.addEventListener('mouseleave', onLeave)

    return () => {
      parent.removeEventListener('mouseenter', onEnter)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <a
      href={href}
      className={clsx(
        'md:inline-flex items-center justify-center rounded-full',
        'px-5 py-1.5',
        'border border-white/20',
        'hover:border-white/40',
        'transition-colors duration-300',
        'select-none',
        className
      )}
      aria-label="Перейти к контактам"
    >
      {/* Контейнер для vertical slide анимации */}
      <div className="relative h-5 w-auto overflow-hidden">
        <span
          ref={textTopRef}
          className="block text-sm font-medium text-white whitespace-nowrap"
        >
          Contact
        </span>
        <span
          ref={textBottomRef}
          className="absolute left-0 top-0 block text-sm font-medium text-white whitespace-nowrap"
        >
          Contact
        </span>
      </div>
    </a>
  )
}
