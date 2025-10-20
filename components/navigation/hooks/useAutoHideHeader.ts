'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function useAutoHideHeader(
  headerRef: React.RefObject<HTMLElement|null>,
  overlayOpen: boolean
): void {
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const dirDown = y > lastY && y > 10;
      lastY = y;
      if (!overlayOpen) {
        gsap.to(headerRef.current, { yPercent: dirDown ? -100 : 0, duration: 0.35, ease: 'power2.out' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headerRef, overlayOpen]);
}
