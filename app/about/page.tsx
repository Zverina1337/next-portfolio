'use client'

import { useRef } from 'react'
import AboutHero from './components/AboutHero'
import AboutTimeline from './components/AboutTimeline'
import AboutSkills from './components/AboutSkills'

export default function AboutPage() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="overflow-hidden w-full bg-black">
      <div ref={contentRef} id="smooth-content">
        <AboutHero />
        <AboutTimeline />
        <AboutSkills />
      </div>
    </div>
  )
}
