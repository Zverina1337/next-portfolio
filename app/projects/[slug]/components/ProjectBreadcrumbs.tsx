'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ProjectBreadcrumbsProps {
  projectTitle: string
}

export default function ProjectBreadcrumbs({ projectTitle }: ProjectBreadcrumbsProps) {
  return (
    <nav aria-label='Breadcrumbs' className='mb-8'>
      <ol className='flex items-center gap-2 text-sm text-white/60'>
        <li>
          <Link
            href='/'
            className='transition-colors hover:text-cyan-400'
          >
            Home
          </Link>
        </li>
        <li>
          <ChevronRight className='h-4 w-4' />
        </li>
        <li>
          <Link
            href='/projects'
            className='transition-colors hover:text-cyan-400'
          >
            Projects
          </Link>
        </li>
        <li>
          <ChevronRight className='h-4 w-4' />
        </li>
        <li className='text-white' aria-current='page'>
          {projectTitle}
        </li>
      </ol>
    </nav>
  )
}
