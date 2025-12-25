'use client'
import clsx from 'clsx'

export type AvailableElementProps = {
  className?: string
  text?: string
}

/**
 * AvailableElement — индикатор доступности для работы
 * Голубой пульсирующий круг + текст
 */
export default function AvailableElement({
  className,
  text = 'Доступен для работы'
}: AvailableElementProps) {
  return (
    <div
      className={clsx(
        'items-center gap-2 rounded-full border border-foreground/15 px-3 py-1.5',
        className
      )}
      id="availability"
    >
      {/* Пульсирующий голубой круг */}
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
        <span className="relative inline-block h-2 w-2 rounded-full bg-cyan-500" />
      </span>

      {/* Текст */}
      <span className="text-xs sm:text-sm opacity-90 whitespace-nowrap">{text}</span>
    </div>
  )
}
