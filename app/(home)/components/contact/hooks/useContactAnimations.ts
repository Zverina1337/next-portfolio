'use client'

import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Хук для GSAP анимаций появления элементов ContactBlock
 * Анимирует heading, title, button, navigation и info блоки при скролле
 */
export function useContactAnimations(
  rootRef: RefObject<HTMLElement | null>,
  prefersReduced: boolean
) {
  useLayoutEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      const base = { duration: prefersReduced ? 0.2 : 0.9, ease: 'power3.out' as const }

      // Установить начальное состояние
      gsap.set('[data-heading]', { autoAlpha: 0, y: 24 })
      gsap.set('[data-title]', { autoAlpha: 0, y: 24 })
      gsap.set('[data-button]', { autoAlpha: 0, y: 10 })
      gsap.set('[data-nav] a', { autoAlpha: 0, y: 16 })
      gsap.set('[data-info] > *', { autoAlpha: 0, y: 24 })

      // Timeline с ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      tl.to('[data-heading]', { autoAlpha: 1, y: 0, ...base })
        .to('[data-title]', { autoAlpha: 1, y: 0, ...base }, '-=0.6')
        .to('[data-button]', { autoAlpha: 1, y: 0, ...base }, '-=0.6')
        .to('[data-nav] a', { autoAlpha: 1, y: 0, stagger: prefersReduced ? 0.02 : 0.06, ...base }, '-=0.6')
        .to('[data-info] > *', { autoAlpha: 1, y: 0, stagger: prefersReduced ? 0.02 : 0.06, ...base }, '-=0.6')
    }, rootRef)

    return () => ctx.revert()
  }, [rootRef, prefersReduced])
}
