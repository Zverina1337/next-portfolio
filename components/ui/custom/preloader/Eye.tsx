'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Eye() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ===== PRELOADER (dumemearts-style) =====
      const svg = svgRef.current!
      const ring = svg.querySelector('#ringCyan') as SVGCircleElement | null

      // начальные состояния элементов прелоадера
      if (ring) {
        const r = parseFloat(ring.getAttribute('r') || '37')
        const len = 2 * Math.PI * r
        gsap.set(ring, { strokeDasharray: `${len}`, strokeDashoffset: len })
      }
      gsap.set('#pupil', { scale: 0, transformOrigin: 'center center' })
      gsap.set(['#plusH', '#plusV'], { scaleX: 0, scaleY: 0, transformOrigin: 'center center' })
      gsap.set('#preloadOverlay', { scaleY: 1, transformOrigin: '50% 50%' })

      // основной таймлайн прелоадера
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (!prefersReduced) {
        tl
          // 1) шторка основным цветом уходит вверх/вниз (вертикальный reveal)
          .to('#preloadOverlay', { scaleY: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
          // 2) «рисуем» бирюзовое кольцо
          .to('#ringCyan', { strokeDashoffset: 0, duration: 1.0 }, 0.05)
          // 3) проявляем зрачок
          .to('#pupil', { scale: 1, duration: 0.45 }, 0.35)
          // 4) выводим плюс
          .to(['#plusH', '#plusV'], { scaleX: 1, scaleY: 1, duration: 0.35, stagger: 0.05 }, 0.55)
      } else {
        // reduced-motion: мгновенно скрываем шторку
        tl.to('#preloadOverlay', { scaleY: 0, duration: 0.01 }, 0)
          .set('#ringCyan', { strokeDashoffset: 0 })
          .set('#pupil', { scale: 1 })
          .set(['#plusH', '#plusV'], { scale: 1 })
      }

      // ===== ТВОЯ базовая вступительная анимация сцены =====
      gsap.fromTo(
        '#stage',
        { scale: 1, opacity: 0, transformOrigin: 'center center' },
        { scale: 0.55, opacity: 1, duration: prefersReduced ? 0.01 : 0.75, ease: 'power3.out' }
      )

      // ===== Моргание (после прелоадера) =====
      gsap.set('#lidTop', { yPercent: -100 })
      gsap.set('#lidBot', { yPercent: 100 })
      if (!prefersReduced) {
        tl.add(() => {
          gsap.timeline({ repeat: -1, repeatDelay: 4 })
            .to(['#lidTop', '#lidBot'], { yPercent: 0, duration: 0.9, ease: 'power2.in' })
        }, '>-0.1') // стартуем сразу после прелоадера
      }
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 360 220"
      className="w-[660px] h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img" aria-label="eye"
    >
      <defs>
        <mask id="blink" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
          <rect x="0" y="0" width="360" height="220" fill="white" />
          <rect id="lidTop" x="0" y="0"   width="360" height="110" fill="black" />
          <rect id="lidBot" x="0" y="110" width="360" height="110" fill="black" />
        </mask>
      </defs>

      <g
        id="stage"
        mask="url(#blink)"
        className="[transform-box:view-box] origin-center will-change-transform"
      >
        {/* полноэкранная шторка прелоадера — основной цвет (Tailwind cyan-500) */}
        <rect id="preloadOverlay" x="0" y="0" width="360" height="220" fill="#06b6d4" />

        {/* форма века */}
        <path
          d="M10,110 C90,25 270,25 350,110 C270,195 90,195 10,110 Z"
          className="fill-black"
        />

        {/* ирис/кольца/зрачок */}
        <g transform="translate(180,110)">
          <circle r="55" className="fill-none stroke-white" strokeWidth={16} />
          <circle id="ringCyan" r="37" className="fill-none stroke-cyan-500" strokeWidth={16} />
          <circle id="pupil" r="21" className="fill-black" />

          {/* плюс в центре */}
          <g fill="#fff">
            <rect id="plusH" x={-14} y={-3.5} width={28} height={7} rx={3.5} />
            <rect id="plusV" x={-3.5} y={-14} width={7} height={28} rx={3.5} />
          </g>
        </g>
      </g>
    </svg>
  )
}
