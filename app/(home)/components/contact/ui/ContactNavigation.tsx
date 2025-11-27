import React from 'react'
import clsx from 'clsx'

export type NavLink = {
  label: string
  href: string
}

export type ContactNavigationProps = {
  links: NavLink[]
  accent: string
}

/**
 * ContactNavigation — навигационные ссылки с разделителями
 * Анимированное подчеркивание при hover
 */
export default function ContactNavigation({ links, accent }: ContactNavigationProps) {
  const style = { ['--accent' as string]: accent } as React.CSSProperties

  return (
    <nav
      data-nav
      style={style}
      className="mb-8 sm:mb-10 flex items-center justify-center gap-4 sm:gap-6 text-sm text-slate-300/90"
    >
      {links.map((link, i) => (
        <React.Fragment key={link.href}>
          {i > 0 && <span className="text-[color:var(--accent)]/80">✦</span>}
          <a
            href={link.href}
            className={clsx(
              'relative px-1 py-0.5',
              'text-slate-300/90 hover:text-white transition-colors',
              'after:content-[""] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full',
              'after:bg-[color:var(--accent)] after:origin-left after:scale-x-0 after:transition-transform after:duration-300',
              'hover:after:scale-x-100 focus-visible:after:scale-x-100'
            )}
          >
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  )
}
