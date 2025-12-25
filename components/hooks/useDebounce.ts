import { useEffect, useState } from 'react'

/**
 * Хук для debounce значения
 * Обновляет возвращаемое значение только после задержки без изменений
 *
 * @param value - Значение для debounce
 * @param delay - Задержка в миллисекундах (по умолчанию 300ms)
 * @returns Debounced значение
 *
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 *
 * useEffect(() => {
 *   // Этот эффект сработает только через 500ms после последнего изменения search
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Устанавливаем таймер для обновления debounced значения
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Очищаем таймер при каждом изменении value или unmount
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
