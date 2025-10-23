// RadialAccent.tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type RadialAccentProps = {
  /** размер «пятна» в css-единицах */
  size?: string;          // по умолчанию '160vmin'
  /** максимальная прозрачность при дыхании */
  maxOpacity?: number;    // 0.18
  /** базовая прозрачность при вдохе-выдохе */
  baseOpacity?: number;   // 0.12
  /** длительность одного цикла */
  duration?: number;      // 6
  /** z-index слоя */
  zIndexClass?: string;   // 'z-[-1]'
  /** ослабленный blur (помогает перфу) */
  blurClass?: string;     // 'blur-2xl'
};

export default function AnimatedRadialAccent({
  size = '160vmin',
  maxOpacity = 0.65,
  baseOpacity = 0.30,
  duration = 6,
  zIndexClass = 'z-[-1]',
  blurClass = 'blur-2xl',
}: RadialAccentProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!blobRef.current || reduce) return;

    const ctx = gsap.context(() => {
      gsap.set(blobRef.current, {
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity',
        opacity: baseOpacity,
        force3D: true,
      });
      gsap.to(blobRef.current, {
        scale: 1.05,
        opacity: maxOpacity,
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [baseOpacity, maxOpacity, duration]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${zIndexClass}`}
      data-testid="radial-accent"
    >
      <div
        ref={blobRef}
        className={`rounded-full ${blurClass}`}
        style={{
          width: size,
          height: size,
          maxWidth: '2000px',
          maxHeight: '2000px',
          // Чуть более «лёгкий» градиент без резких краёв, можно добавить 2 слоя
          background:
            'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.10) 35%, rgba(34,211,238,0) 70%)',
        }}
      />
    </div>
  );
}
