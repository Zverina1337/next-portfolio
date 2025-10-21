import { useEffect, useState } from 'react'

export function useIntersectionObserver(target: React.RefObject<Element|null>, options?: IntersectionObserverInit) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = target.current
    if (!el || visible) return

    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
          break
        }
      }
    }, options)

    obs.observe(el)
    return () => obs.disconnect()
  }, [target, options, visible])

  return visible
}
