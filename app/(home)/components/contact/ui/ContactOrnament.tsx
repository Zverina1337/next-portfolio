export type OrnamentVariant = 'tech' | 'chevron'

export type ContactOrnamentProps = {
  variant: OrnamentVariant
  accent: string
}

/**
 * ContactOrnament — декоративный SVG орнамент сверху блока контактов
 * Два варианта: 'tech' (сегменты) и 'chevron' (стрелки)
 */
export default function ContactOrnament({ variant, accent }: ContactOrnamentProps) {
  const style = { ['--accent' as string]: accent } as React.CSSProperties

  if (variant === 'tech') {
    return (
      <div
        aria-hidden="true"
        style={style}
        className="pointer-events-none absolute inset-x-0 -top-1 text-[color:var(--accent)]"
      >
        <div className="mx-4">
          <svg
            className="w-full h-10 [filter:drop-shadow(0_0_12px_color-mix(in_oklab,var(--accent),transparent_70%))]"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="segGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="transparent" />
                <stop offset="0.2" stopColor="currentColor" />
                <stop offset="0.8" stopColor="currentColor" />
                <stop offset="1" stopColor="transparent" />
              </linearGradient>
            </defs>
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M0 20 H140 l12-8 h56 l12 8 H340 l16-10 h84 l16 10 h120 l22-12 h40 l22 12 H900 l16-8 h64 l16 8 H1200"
                pathLength="1200"
                strokeDasharray="120 1080"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-1200" dur="7s" repeatCount="indefinite" />
              </path>
              <path
                d="M0 20 H140 l12-8 h56 l12 8 H340 l16-10 h84 l16 10 h120 l22-12 h40 l22 12 H900 l16-8 h64 l16 8 H1200"
                stroke="url(#segGrad)"
                opacity="0.9"
              />
              <circle cx="180" cy="20" r="1.8" />
              <circle cx="520" cy="20" r="1.8" />
              <circle cx="880" cy="20" r="1.8" />
            </g>
          </svg>
        </div>
      </div>
    )
  }

  // variant === 'chevron'
  return (
    <div
      aria-hidden
      style={style}
      className="pointer-events-none absolute inset-x-0 -top-1 text-[color:var(--accent)]"
    >
      <div className="mx-4">
        <svg
          className="w-full h-10 [filter:drop-shadow(0_0_10px_color-mix(in_oklab,var(--accent),transparent_70%))]"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="transparent" />
              <stop offset="0.15" stopColor="currentColor" />
              <stop offset="0.85" stopColor="currentColor" />
              <stop offset="1" stopColor="transparent" />
            </linearGradient>
            <pattern id="chevPat" width="40" height="12" patternUnits="userSpaceOnUse">
              <g>
                <path
                  d="M4 2 L14 6 L4 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 2 L34 6 L24 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <animateTransform
                  attributeName="patternTransform"
                  type="translate"
                  from="0 0"
                  to="40 0"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </g>
            </pattern>
          </defs>
          {/* Базовая линия */}
          <rect x="0" y="19" width="1200" height="2" fill="url(#beamGrad)" />
          {/* Оверлей с chevrons */}
          <rect x="0" y="13" width="1200" height="14" fill="url(#chevPat)" fillOpacity="0.9" />
          {/* Концевые точки */}
          <circle cx="12" cy="20" r="1.6" fill="currentColor" />
          <circle cx="1188" cy="20" r="1.6" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
