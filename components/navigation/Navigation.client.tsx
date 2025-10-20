'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import getMasterTl from '@/components/hooks/useMasterTl'
import { NAVIGATION_LINKS, PHRASES } from './constants'
import NavWrapper from './ui/NavWrapper'
import NavOverlay from './ui/NavOverlay'
import useOverlayMenu from './hooks/useOverlay'
import useAutoHideHeader from './hooks/useAutoHideHeader'
import useNavIntro from './hooks/useNavIntro'

const hasLabel = (tl: gsap.core.Timeline | null, name: string) =>
  !!tl && !!tl.labels && Object.prototype.hasOwnProperty.call(tl.labels, name)

export default function Navigation() {
  const root = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const overlayTl = useOverlayMenu(overlayRef);

  useAutoHideHeader(headerRef, open);
  useNavIntro(root, headerRef);

 // синхронизация TL с состоянием меню (эффектом, а не «в рендере»)
  useEffect(() => {
    const node = overlayRef.current;
    if (!overlayTl || !node) return;
    if (open) {
      node.classList.remove('pointer-events-none');
      overlayTl.play(0);
    } else {
      overlayTl.reverse().then(() => node.classList.add('pointer-events-none'));
    }
  }, [open, overlayTl]);


  return (
    <div ref={root} className="relative">
      <NavWrapper
        ref={headerRef}
        open={open}
        phrases={PHRASES}
        onToggle={() => setOpen(o => !o)}
      />

      <NavOverlay
        ref={overlayRef}
        nav={NAVIGATION_LINKS}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
