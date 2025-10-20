import { gsap } from 'gsap'

// Расширяем тип Window, чтобы хранить мастер-таймлайн
declare global {
  interface Window {
    __MASTER_TL?: gsap.core.Timeline
  }
}

/** Возвращает единственный master timeline (или null на сервере) */
export default function getMasterTl(): gsap.core.Timeline | null {
  if (typeof window === 'undefined') return null
  if (!window.__MASTER_TL) {
    window.__MASTER_TL = gsap.timeline({ paused: true })
  }
  return window.__MASTER_TL
}