'use client'

import { useEffect, useState } from 'react'

/**
 * Хук для определения prefers-reduced-motion медиа-запроса
 * Возвращает true если пользователь предпочитает уменьшенное движение
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)

    // Установить начальное значение
    handleChange()

    // Слушать изменения
    mediaQuery.addEventListener?.('change', handleChange)

    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [])

  return prefersReducedMotion
}
