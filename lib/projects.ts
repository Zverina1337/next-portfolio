import { Project, ProjectsData, SortBy } from '@/types/project'
import projectsData from '@/data/projects.json'

// Получить все проекты
export function getAllProjects(): Project[] {
  return (projectsData as ProjectsData).projects
}

// Получить проект по slug
export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects()
  return projects.find((project) => project.slug === slug) || null
}

// Сортировка проектов
export function sortProjects(projects: Project[], sortBy: SortBy = 'date'): Project[] {
  const sorted = [...projects]

  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => b.year - a.year)
    case 'complexity':
      return sorted.sort((a, b) => b.complexity - a.complexity)
    case 'hours':
      return sorted.sort((a, b) => b.hoursSpent - a.hoursSpent)
    default:
      return sorted
  }
}

// Получить соседние проекты (prev/next) с учетом сортировки
export function getAdjacentProjects(
  slug: string,
  sortBy: SortBy = 'date'
): {
  prev: Project | null
  next: Project | null
} {
  const projects = getAllProjects()
  const sortedProjects = sortProjects(projects, sortBy)
  const currentIndex = sortedProjects.findIndex((project) => project.slug === slug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  const prev = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null
  const next = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null

  return { prev, next }
}

// Получить все уникальные slug для generateStaticParams
export function getAllProjectSlugs(): string[] {
  const projects = getAllProjects()
  return projects.map((project) => project.slug)
}

// Получить все теги/технологии
export function getAllTechnologies(): string[] {
  const projects = getAllProjects()
  const technologies = new Set<string>()

  projects.forEach((project) => {
    project.technologies.forEach((tech) => technologies.add(tech))
  })

  return Array.from(technologies).sort()
}
