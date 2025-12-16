'use client'

import { useEffect, useState, useRef } from 'react'
import { Book, Code, Trophy, Images, LucideIcon } from 'lucide-react'
import gsap from 'gsap'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Обзор', icon: Book },
  { id: 'process', label: 'Процесс', icon: Code },
  { id: 'achievements', label: 'Результаты', icon: Trophy },
  { id: 'gallery', label: 'Галерея', icon: Images },
]

export default function ProjectStickyNav() {
  const [activeSection, setActiveSection] = useState('overview')
  const [isVisible, setIsVisible] = useState(false)
  const [availableItems, setAvailableItems] = useState<NavItem[]>([])
  const navRef = useRef<HTMLDivElement>(null)

  // Проверяем, какие секции реально существуют в DOM
  useEffect(() => {
    const checkAvailableSections = () => {
      const items = ALL_NAV_ITEMS.filter(({ id }) => {
        const section = document.getElementById(id)
        return section !== null
      })
      setAvailableItems(items)

      // Устанавливаем первую доступную секцию как активную
      if (items.length > 0) {
        setActiveSection(items[0].id)
      }
    }

    // Проверяем сразу и с небольшой задержкой (для SSR)
    checkAvailableSections()
    const timer = setTimeout(checkAvailableSections, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (availableItems.length === 0) return

    // Показываем навигацию после прокрутки hero
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY

      setIsVisible(scrollY > heroHeight * 0.7)

      // Определяем активную секцию с учетом высоты sticky nav
      const navHeight = 100 // Высота основной навигации + отступ

      availableItems.forEach(({ id }) => {
        const section = document.getElementById(id)
        if (section) {
          const rect = section.getBoundingClientRect()
          // Секция считается активной, если её верх находится в верхней трети экрана
          if (rect.top <= navHeight + 50 && rect.bottom >= navHeight) {
            setActiveSection(id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [availableItems])

  // Анимация появления
  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      if (isVisible) {
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        })
      } else {
        gsap.to(navRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    }, navRef)

    return () => ctx.revert()
  }, [isVisible])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      // Учитываем высоту основной навигации (56px) + высоту ProjectStickyNav (~60px) + отступ
      const headerHeight = 56 // h-14 из Navigation
      const stickyNavHeight = 60 // Примерная высота ProjectStickyNav
      const offset = headerHeight + stickyNavHeight + 20 // +20px дополнительный отступ

      const elementPosition = section.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Не рендерим навигацию, если секций меньше 2
  if (availableItems.length < 2) {
    return null
  }

  return (
    <nav
      ref={navRef}
      className='fixed left-1/2 top-16 z-50 -translate-x-1/2 opacity-0 md:top-20'
      style={{ willChange: 'transform, opacity' }}
    >
      <div className='flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1.5 backdrop-blur-xl md:gap-2 md:p-2'>
        {availableItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id

          return (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              aria-label={label}
              className={`group relative flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-300 md:px-4 md:py-2 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className='absolute inset-0 rounded-full border border-cyan-500/50 bg-cyan-500/10' />
              )}

              {/* Icon */}
              <Icon
                className={`relative h-4 w-4 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />

              {/* Label - скрываем на мобильных */}
              <span className='relative hidden md:inline'>{label}</span>

              {/* Hover glow */}
              {!isActive && (
                <div className='absolute inset-0 -z-10 rounded-full bg-cyan-500/0 transition-colors duration-300 group-hover:bg-cyan-500/10' />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}