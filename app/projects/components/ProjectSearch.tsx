'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useDebounce } from '@/components/hooks/useDebounce'

interface ProjectSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function ProjectSearch({
  value,
  onChange,
  placeholder = 'Поиск проектов...',
}: ProjectSearchProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  // Локальный state для мгновенного отображения ввода
  const [localValue, setLocalValue] = useState(value)

  // Debounced значение (обновляется с задержкой 400ms)
  const debouncedValue = useDebounce(localValue, 400)

  // Синхронизация внешнего value с локальным (для кнопки очистки)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Вызов onChange только когда debounced значение изменилось
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    if (prefersReduced || !searchRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        searchRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
    }, searchRef)

    return () => ctx.revert()
  }, [])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        {/* Input - минималистичный */}
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-cyan-500/30 px-0 py-2 text-white placeholder-white/40 outline-none text-sm focus:border-cyan-500/60 transition-colors"
        />

        {/* Кнопка очистки */}
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-cyan-400 transition-colors"
            aria-label="Очистить поиск"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
