'use client';

import { forwardRef } from 'react';
import type { NavItem } from '../constants';

type OverlayProps = {
  nav: readonly NavItem[];
  open: boolean;
  onClose: () => void;
};

const NavOverlay = forwardRef<HTMLDivElement, OverlayProps>(function OverlayMenu(
  { nav, onClose }, ref
) {
  return (
    <div ref={ref} id="overlayMenu" className="pointer-events-none fixed inset-0 z-[50] grid place-items-center">
      <div id="overlayClip" className="absolute inset-0 bg-background" style={{ clipPath: 'circle(0% at 100% 0%)' }} />
      <div className="relative z-10 grid place-items-center">
        <ul className="space-y-3 text-center">
          {nav.map(n => (
            <li key={`ov-${n.idx}`} className="ov-item cursor-pointer">
              <a href={n.href} onClick={onClose} className="text-3xl font-bold md:text-5xl">
                <span className="inline-flex items-center gap-3">
                  <span className="text-cyan-500/90">{n.idx}</span>
                  <span>{n.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default NavOverlay;
