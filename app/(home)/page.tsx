'use client'

import { useRef } from 'react'

import CinematicIntro from '@/app/(home)/components/CinematicIntro'
import AboutOrbit from '@/app/(home)/components/AboutOrbit'
import ProjectsBlock from '@/app/(home)/components/ProjectsBlock'
import ContactBlock from '@/app/(home)/components/ContactBlock'

export default function HeroPage() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="overflow-hidden w-full">
      <div ref={contentRef} id="smooth-content">
        <CinematicIntro />
        <AboutOrbit />
        <ProjectsBlock />
        <ContactBlock email='danii.zvorugin@gmail.com' />
      </div>
    </div>
  )
}
