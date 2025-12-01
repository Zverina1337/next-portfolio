'use client'

import React, { useRef } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'
import { usePathname } from 'next/navigation'

export type NavLink = {
  label: string
  href: string
}

export type NavigationLinksProps = {
  links: NavLink[]
  accent?: string
  showDivider?: boolean
  className?: string
}

/**
 * NavigationLinks — переиспользуемый компонент навигационных ссылок
 * - Анимированное подчеркивание при hover
 * - Индикатор активной страницы
 * - Микро-анимации при клике
 */
export default function NavigationLinks({
  links,
  accent = '#22d3ee',
  showDivider = false,
  className
}: NavigationLinksProps) {
  const pathname = usePathname()
  const linksRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const style = { ['--accent' as string]: accent } as React.CSSProperties

  // Микро-анимация при клике
  const handleClick = (_e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const link = linksRefs.current[index]
    if (!link) return

    gsap.killTweensOf(link)
    gsap.to(link, {
      scale: 0.92,
      duration: 0.15,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }

  // Проверка активности ссылки
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      data-nav
      style={style}
      className={clsx(
        'flex items-center gap-4 sm:gap-6 text-sm text-slate-300/90',
        className
      )}
    >
      {links.map((link, i) => {
        const active = isActive(link.href)
        return (
          <React.Fragment key={link.href}>
            {showDivider && i > 0 && <span className="text-[color:var(--accent)]/80">✦</span>}
            <a
              ref={(el) => {
                linksRefs.current[i] = el
              }}
              href={link.href}
              onClick={(e) => handleClick(e, i)}
              className={clsx(
                'relative px-1 py-0.5',
                'transition-colors duration-200',
                active ? 'text-[color:var(--accent)]' : 'text-slate-300/90 hover:text-white',
                'after:content-[""] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full',
                'after:bg-[color:var(--accent)] after:origin-left after:transition-transform after:duration-300',
                active
                  ? 'after:scale-x-100'
                  : 'after:scale-x-0 hover:after:scale-x-100 focus-visible:after:scale-x-100'
              )}
            >
              {link.label}
            </a>
          </React.Fragment>
        )
      })}
    </nav>
  )
}
