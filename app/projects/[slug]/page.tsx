import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProjectSlugs, getProjectBySlug, getAdjacentProjects } from '@/lib/projects'
import AnimatedGrid from '@/app/projects/components/AnimatedGrid'
import ProjectHero from './components/ProjectHero'
import ProjectStickyNav from './components/ProjectStickyNav'
import ProjectContent from './components/ProjectContent'
import ProjectGallery from './components/ProjectGallery'
import ProjectNavigation from './components/ProjectNavigation'
import Footer from '@/components/ui/custom/Footer'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Генерация статических параметров для всех проектов (SSG)
export function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Проект не найден',
    }
  }

  return {
    title: `${project.title} | Портфолио`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: 'website',
      images: project.image ? [{ url: project.image }] : [],
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)

  // 404 если проект не найден
  if (!project) {
    notFound()
  }

  // Получаем соседние проекты для навигации (по умолчанию по дате)
  const { prev, next } = getAdjacentProjects(params.slug, 'date')

  return (
    <main className='relative min-h-screen bg-gradient-to-b from-black via-gray-950 to-black'>
      {/* Анимированный фон */}
      <div className='fixed inset-0 -z-10'>
        <AnimatedGrid />
      </div>

      {/* Sticky Navigation */}
      <ProjectStickyNav />

      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Content Sections */}
      <ProjectContent project={project} />

      {/* Gallery */}
      <ProjectGallery screenshots={project.screenshots} projectTitle={project.title} />

      {/* Navigation */}
      <ProjectNavigation prev={prev} next={next} />

      {/* Footer */}
      <Footer />
    </main>
  )
}
