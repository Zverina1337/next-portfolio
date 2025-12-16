import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Хук для инициализации Lenis smooth scroll
 * Интегрируется с GSAP ScrollTrigger для плавных анимаций
 *
 * @example
 * useSmoothScroll()
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Проверка на наличие window и prefers-reduced-motion
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) return // Отключаем smooth scroll для пользователей с prefers-reduced-motion

    // Регистрируем ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Инициализация Lenis
    const lenis = new Lenis({
      duration: 1.2, // Длительность скролла (в секундах)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical', // Вертикальный скролл
      gestureOrientation: 'vertical', // Жесты только вертикальные
      smoothWheel: true, // Плавный скролл колесиком мыши
      wheelMultiplier: 1, // Множитель скорости колесика
      touchMultiplier: 2, // Множитель скорости для touch
      infinite: false, // Бесконечный скролл выключен
      autoResize: true, // Автоматически пересчитывать высоту при изменении контента
      syncTouch: true, // Синхронизация touch событий
      prevent: (node) => node.classList.contains('no-smooth-scroll'), // Исключения из smooth scroll
    })

    // Интеграция с GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Синхронизация с GSAP ticker для плавности
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000) // Lenis использует миллисекунды
    })

    // Отключаем lag smoothing для корректной работы
    gsap.ticker.lagSmoothing(0)

    // Принудительное обновление размеров Lenis после загрузки страницы
    // Это необходимо для корректного расчета высоты скролла
    const handleResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }

    // Обновляем размеры при загрузке контента и изменении размера окна
    window.addEventListener('resize', handleResize)
    window.addEventListener('load', handleResize)

    // Дополнительное обновление через небольшую задержку (для динамического контента)
    const resizeTimeout = setTimeout(handleResize, 100)

    // Наблюдатель за изменениями DOM (для динамически подгружаемого контента)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize()
      ScrollTrigger.refresh()
    })

    resizeObserver.observe(document.body)

    // Cleanup
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('load', handleResize)
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
    }
  }, [])
}
