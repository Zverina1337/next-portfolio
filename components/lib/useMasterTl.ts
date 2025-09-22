import { gsap } from 'gsap'
export default function getMasterTl() {
  if (typeof window === 'undefined') return null
  const w = window as any
  if (!w.__MASTER_TL) {
    w.__MASTER_TL = gsap.timeline({ paused: true })
  }
  return w.__MASTER_TL as gsap.core.Timeline
}
