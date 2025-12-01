'use client'
import Link from 'next/link'
import { forwardRef, useRef } from 'react'
import AvailableElement from '@/components/ui/custom/AvailableElement'
import ContactMeButton from '@/components/ui/custom/ContactMeButton'
import NavigationLinks from '@/components/navigation/ui/NavigationLinks'
import AnimatedSlogan from '@/components/ui/custom/animated/AnimatedSlogan'
import { Button } from '@/components/ui/button'
import useMagnet from '@/components/hooks/useMagnet'
import { NAVIGATION_LINKS } from '../constants'

type Props = {
  phrases: string[]
  open: boolean
  onToggle: () => void
}

const NavWrapper = forwardRef<HTMLElement, Props>(function NavWrapper({ phrases, open, onToggle }, ref) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const magnetRef = useRef<HTMLSpanElement>(null)
  useMagnet(btnRef, magnetRef)

  // Конвертируем NAVIGATION_LINKS в формат для NavigationLinks
  const navLinks = NAVIGATION_LINKS.map(item => ({
    label: item.label,
    href: item.href
  }))

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-[60] backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-foreground/10"
    >
      <div className="max-w-[1920px] mx-auto flex h-14 items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="font-medium">Zverinacode</Link>
          <AvailableElement className="sm:inline-flex hidden" />
          {/* Фиксированная ширина для слогана, чтобы не двигались ссылки */}
          <div className="hidden xl:block w-80">
            <AnimatedSlogan
              phrases={phrases}
              variant="fade-up"
              holdMs={1500}
              inStagger={0.045}
              className="text-md opacity-90 italic font-thin"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Десктоп: навигационные ссылки + Contact Me */}
          <NavigationLinks
            links={navLinks}
            accent="#22d3ee"
            showDivider={false}
            className="hidden lg:flex"
          />
          <ContactMeButton className="hidden md:inline-flex" />

          {/* Мобильный/планшеты: кнопка Меню */}
          <Button
            ref={btnRef}
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="overlayMenu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            variant="outline"
            className="rounded-full lg:hidden"
          >
            <span ref={magnetRef} className="relative inline-flex items-center justify-center">
              <span className="relative block h-[1.25rem] w-[3.5rem] overflow-hidden">
                <span className={'absolute inset-0 flex items-center justify-center transition-opacity duration-150 ' + (open ? 'opacity-0' : 'opacity-100')}>Меню</span>
                <span className={'absolute inset-0 flex items-center justify-center transition-opacity duration-150 ' + (open ? 'opacity-100' : 'opacity-0')}>Закрыть</span>
              </span>
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
})

export default NavWrapper
