'use client'
import { useRef } from 'react'
import useCarousel from '@/components/hooks/useCarousel'

type CarouselProps<T = unknown> = {
  items?: readonly T[]
  renderItem?: (item: T, index: number) => React.ReactNode
  children?: React.ReactNode
  className?: string
  trackClassName?: string
  'aria-label'?: string
  ariaHiddenTrack?: boolean
}

/**
 * Универсальный горизонтальный карусель-трек.
 * Вся анимация — в useCarousel(containerRef, trackRef).
 */
export default function Carousel<T = unknown>({
  items,
  renderItem,
  children,
  className,
  trackClassName,
  'aria-label': ariaLabel,
  ariaHiddenTrack = true,
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useCarousel(containerRef, trackRef)

  return (
    <div
      ref={containerRef}
      className={className ?? 'relative overflow-hidden'}
      aria-label={ariaLabel}
      role={ariaLabel ? 'group' : undefined}
    >
      <div
        ref={trackRef}
        className={trackClassName ?? 'flex whitespace-nowrap will-change-transform'}
        aria-hidden={ariaHiddenTrack || undefined}
      >
        {children ??
          items?.map((item, i) => (renderItem ? renderItem(item, i) : <span key={i}>{String(item)}</span>))}
      </div>
    </div>
  )
}
