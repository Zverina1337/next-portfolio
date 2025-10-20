'use client';
import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import getMasterTl from '@/components/hooks/useMasterTl';
import { hasLabel } from '@/components/lib/utils';

export default function useNavIntro(
  rootRef: React.RefObject<HTMLElement|null>,
  headerRef: React.RefObject<HTMLElement|null>
): void {
  useLayoutEffect(() => {
    if (!rootRef.current || !headerRef.current) return;
    const tl = getMasterTl(); // типизируй его как GSAPTimeline в его файле
    const ctx = gsap.context(() => {
      const navIntro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(headerRef.current, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 });
      if (hasLabel(tl, 'hero')) tl!.add(navIntro, 'hero'); else navIntro.play(0);
    }, rootRef);
    return () => ctx.revert();
  }, [rootRef, headerRef]);
}
