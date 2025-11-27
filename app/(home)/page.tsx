'use client'

import { useRef } from 'react'

import CinematicIntro from '@/app/(home)/components/BlockIntro'
import ProjectsBlock from '@/app/(home)/components/projects/ProjectsBlock'
import ContactBlock from '@/app/(home)/components/contact/ContactBlock'
import AboutSection from './components/about/AboutSection'

export default function HeroPage() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="overflow-hidden w-full">
      <div ref={contentRef} id="smooth-content">
        <CinematicIntro />
        <AboutSection />
        <ProjectsBlock />
        <ContactBlock email='danii.zvorugin@gmail.com' />
      </div>
    </div>
  )
}
