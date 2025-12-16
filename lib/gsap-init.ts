/**
 * Централизованная инициализация GSAP плагинов
 *
 * Этот файл обеспечивает:
 * - Одноразовую регистрацию плагинов (избегаем дублирования)
 * - SSR-безопасную инициализацию (только на клиенте)
 * - Единую точку входа для всех GSAP импортов в проекте
 *
 * @usage
 * import { gsap, ScrollTrigger } from '@/lib/gsap-init'
 */

'use client'

import { gsap as gsapCore } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Регистрация плагинов только один раз при инициализации модуля
if (typeof window !== 'undefined') {
  gsapCore.registerPlugin(ScrollTrigger)
}

// Экспортируем для использования в компонентах
export { gsapCore as gsap, ScrollTrigger }
export default gsapCore