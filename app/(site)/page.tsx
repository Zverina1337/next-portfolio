'use client'

import { useRef } from 'react'

import SiteNav from '@/components/system/SiteNav'
import CinematicIntro from '@/components/sections/CinematicIntro'
import AboutOrbit from '@/components/sections/AboutOrbit'
import ProjectsBlock from '@/components/sections/ProjectsBlock'
import ContactBlock from '@/components/sections/ContactBlock'

export default function HeroPage() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="overflow-hidden w-full">
      <div ref={contentRef} id="smooth-content">
        <SiteNav />
        <CinematicIntro />
        <AboutOrbit />
        <ProjectsBlock />
        <ContactBlock email='danii.zvorugin@gmail.com' />
      </div>
    </div>
  )
}
