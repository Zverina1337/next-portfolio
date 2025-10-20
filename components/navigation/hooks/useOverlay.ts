'use client';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function useOverlayMenu(
  ref: React.RefObject<HTMLDivElement | null>
): GSAPTimeline | null {
  const tlRef = useRef<GSAPTimeline | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctx = gsap.context(() => {
      gsap.set('#overlayClip', { clipPath: 'circle(0% at 100% 0%)' });
      gsap.set('.ov-item', { y: 20, opacity: 0 });
      tlRef.current = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to('#overlayClip', { clipPath: 'circle(150% at 50% 50%)', duration: 0.5 }, 0)
        .to('.ov-item', { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, 0.1);
    }, node);
    return () => { ctx.revert(); tlRef.current = null; };
  }, [ref]);

  return tlRef.current;
}
