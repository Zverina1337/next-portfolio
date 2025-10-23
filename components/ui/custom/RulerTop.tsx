import { useEffect, useRef, useState } from 'react'
export default function RulerTop() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [labels, setLabels] = useState<number[]>([])

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const update = () => {
      const w = el.clientWidth
      setWidth(w)
      const majorPx = 80
      const count = Math.max(1, Math.floor(w / majorPx))
      setLabels(Array.from({ length: count + 1 }, (_, i) => i))
    }

    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  const ticksStyle: React.CSSProperties = {
    background: [
      'repeating-linear-gradient(90deg, #06b6d4 0 1px, transparent 1px 8px) top/100% 6px no-repeat',
      'repeating-linear-gradient(90deg, #06b6d4 0 2px, transparent 2px 40px) top/100% 10px no-repeat',
      'repeating-linear-gradient(90deg, #06b6d4 0 3px, transparent 3px 80px) top/100% 14px no-repeat',
    ].join(', '),
  }

  return (
    <div
      id="rulerTop"
      ref={ref}
      className="relative h-8 opacity-90"
      aria-hidden
    >
      {/* штрихи у верхней кромки */}
      <div className="absolute inset-x-0 top-0 h-full" style={ticksStyle} />
      {/* цифры снизу */}
      <div className="absolute left-0 right-0 bottom-0 translate-y-[2px] h-[14px]">
        {width > 0 &&
          labels.map((n) => {
            const majorPx = 80
            const left = (n * majorPx * 100) / width
            return (
              <span
                key={n}
                className="absolute -translate-x-1/2 text-[10px] leading-none text-white/55"
                style={{ left: `${left}%` }}
              >
                {String(n).padStart(2, '0')}
              </span>
            )
          })}
      </div>
    </div>
  )
}