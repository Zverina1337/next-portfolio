'use client'

import { useSmoothScroll } from '@/components/hooks/useSmoothScroll'

/**
 * Provider для инициализации Lenis smooth scroll
 * Должен быть обернут вокруг всего контента приложения
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll()

  return <>{children}</>
}
