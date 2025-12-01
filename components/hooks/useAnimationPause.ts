import { useEffect, useRef } from 'react'

/**
 * Хук для автоматической паузы GSAP анимаций при скрытии вкладки
 * Экономит батарею на мобильных устройствах
 *
 * @example
 * const anim = useAnimationPause(() =>
 *   gsap.to(el, { rotation: 360, repeat: -1 })
 * )
 */
export function useAnimationPause<T extends gsap.core.Animation>(
  createAnimation: () => T
): React.MutableRefObject<T | null> {
  const animRef = useRef<T | null>(null)

  useEffect(() => {
    // Создаем анимацию
    animRef.current = createAnimation()

    // Обработчик изменения видимости
    const handleVisibilityChange = () => {
      if (!animRef.current) return

      if (document.hidden) {
        animRef.current.pause()
      } else {
        animRef.current.resume()
      }
    }

    // Подписываемся на события
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Очищаем анимацию и отписываемся
      if (animRef.current) {
        animRef.current.kill()
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return animRef
}
