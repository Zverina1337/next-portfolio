'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import GSAPTween from 'gsap';

export default function useCarousel(
  containerRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>
): void {
  const tweenRef = useRef<GSAPTween | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      if (!track.dataset.duped) { track.innerHTML += track.innerHTML; track.dataset.duped = '1'; }
      const setup = () => {
        const w = track.scrollWidth / 2;
        tweenRef.current?.kill();
        gsap.set(track, { x: 0 });
        const duration = Math.max(10, w / 40);
        tweenRef.current = gsap.to(track, {
          x: -w,
          duration,
          ease: 'none',
          repeat: -1,
          onRepeat() { gsap.set(track, { x: 0 }); },
        });
      };
      const ro = new ResizeObserver(setup);
      ro.observe(container);
      window.addEventListener('resize', setup);
      setup();

      return () => { tweenRef.current?.kill(); ro.disconnect(); window.removeEventListener('resize', setup); };
    }, container);

    return () => ctx.revert();
  }, [containerRef, trackRef]);
}
