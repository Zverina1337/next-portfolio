'use client';

import { useRef, memo, useEffect } from 'react';
import { gsap } from 'gsap';

type Variant = 'rings' | 'grid' | 'orbits' | 'aurora' | 'gooey';

type AnimatedBGProps = {
  variant?: Variant;
  tint?: string;          // цвет обводок, например 'rgba(255,255,255,0.10)'
  accent?: string;        // для подсветок
  particles?: boolean;    // включить светлячков
  className?: string;     // для позиционирования
};

const AnimatedBG = memo(function AnimatedBG({
  variant = 'rings',
  tint = 'rgba(255,255,255,0.10)',
  accent = 'rgba(34,211,238,0.35)', // cyan-400
  particles = true,
  className = 'pointer-events-none absolute inset-0 z-0',
}: AnimatedBGProps) {
  const rootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const svg = rootRef.current;
    if (!svg || reduce) return;

    const ctx = gsap.context(() => {
      // Общие лёгкие движения
      gsap.set(svg, { transformOrigin: '50% 50%' });
      gsap.to(svg, { x: 10, y: -20, scale: 1.03, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      const rings = svg.querySelectorAll<SVGPathElement>('[data-ring]');
      if (rings.length) {
        rings.forEach((el, i) => {
          const r = 30 + i * 110;
          gsap.set(el, { rotation: i % 2 ? 0.3 : -0.2, transformOrigin: '50% 50%' });
          // мягкое вращение
          gsap.to(el, { rotation: `+=${i % 2 ? 8 : -6}`, duration: 40 + i * 8, repeat: -1, ease: 'none' });
          // дыхание штриха
          gsap.fromTo(
            el,
            { strokeDashoffset: 0 },
            { strokeDashoffset: 180 + i * 40, duration: 10 + i * 2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
          );
          // еле заметный pulsing ширины
          gsap.fromTo(
            el,
            { strokeWidth: 1.1 },
            { strokeWidth: 1.4, duration: 6 + i, repeat: -1, yoyo: true, ease: 'sine.inOut' }
          );
        });
      }

      // Частицы по орбитам
      const dots = svg.querySelectorAll<SVGCircleElement>('[data-dot]');
      if (dots.length) {
        dots.forEach((dot, i) => {
          const radius = Number(dot.getAttribute('data-r')) || 220 + i * 60;
          // движение по окружности через син/кос
          gsap.to(dot, {
            // кастомная анимация позиции
            duration: 12 + (i % 5),
            repeat: -1,
            ease: 'none',
            onUpdate(this: gsap.core.Tween) {
              const t = (this.time() / this.duration()) * Math.PI * 2;
              const cx = 500 + Math.cos(t + i) * radius;
              const cy = 660 + Math.sin(t + i) * (radius * 0.35);
              dot.setAttribute('cx', String(cx));
              dot.setAttribute('cy', String(cy));
            },
          });
          gsap.fromTo(dot, { opacity: 0.2 }, { opacity: 0.6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.13 });
        });
      }

    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  // SVG разметка под разные варианты
  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={className}
      data-testid="bgfx"
    >
      {/* Фильтры */}
      <defs>
        {/* Gooey для варианта gooey */}
        <filter id="bgfx-gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        {/* Радиа̀льная заливка для aurora */}
        <radialGradient id="bgfx-aur" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="65%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Вариант: AURORA — чисто заливка + мягкая маска */}
      {variant === 'aurora' && (
        <g>
          <rect x="0" y="0" width="1000" height="700" fill="url(#bgfx-aur)" />
        </g>
      )}

      {/* Вариант: RINGS — круговые штрих-кольца */}
      {variant === 'rings' && (
        <g fill="none" strokeLinecap="round">
          {[140, 250, 360, 470].map((r, i) => (
            <circle
              key={r}
              data-ring
              cx="500"
              cy="660"
              r={r}
              stroke={i % 2 ? tint : accent}
              strokeOpacity={i % 2 ? 0.12 : 0.25}
              strokeWidth={1.2}
              strokeDasharray={i % 2 ? '6 18' : '10 26'}
            />
          ))}
          {/* светлячки */}
          {particles &&
            Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={`dot-${i}`}
                data-dot
                data-r={200 + (i % 8) * 45}
                cx="500"
                cy="660"
                r="2"
                fill={accent}
                opacity="0.4"
              />
            ))}
        </g>
      )}

      {/* Вариант: GRID — тонкая сетка + концентрические окружности */}
      {variant === 'grid' && (
        <g >
          {/* сетка */}
          <g stroke={tint} strokeOpacity="0.07" strokeWidth="1">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="700" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 60} x2="1000" y2={i * 60} />
            ))}
          </g>
          {/* окружности */}
          <g fill="none" stroke={tint} strokeOpacity="0.12" strokeWidth="1.2">
            {[140, 250, 360].map((r) => <circle key={r} cx="500" cy="660" r={r} />)}
          </g>
        </g>
      )}

      {/* Вариант: ORBITS — эллипсы + узлы на орбитах */}
      {variant === 'orbits' && (
        <g>
          {[180, 260, 340, 420].map((r, i) => (
            <ellipse
              key={r}
              data-ring
              cx="500"
              cy="580"
              rx={r}
              ry={r * 0.38}
              fill="none"
              stroke={i % 2 ? tint : accent}
              strokeOpacity={i % 2 ? 0.12 : 0.25}
              strokeWidth="1.2"
              strokeDasharray={i % 2 ? '8 22' : '10 30'}
            />
          ))}
          {particles &&
            Array.from({ length: 24 }).map((_, i) => (
              <circle key={`dot2-${i}`} data-dot data-r={180 + (i % 12) * 28} cx="500" cy="660" r="1.8" fill={accent} opacity="0.5" />
            ))}
        </g>
      )}

      {/* Вариант: GOOEY — капли, сливающиеся в пятна */}
      {variant === 'gooey' && (
        <g filter="url(#bgfx-gooey)">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={`g-${i}`} cx={420 + i * 40} cy={540 + (i % 3) * 28} r={14 + (i % 4) * 4} fill={accent} opacity="0.35" />
          ))}
        </g>
      )}
    </svg>
  );
});

export default AnimatedBG;
