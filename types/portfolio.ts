// Типы для showcase проектов (главная страница)
export type ShowcaseProject = {
  title: string
  subtitle: string
  images?: { src: string; name: string }[]
  description: string
  stats: { label: string; value: number }[]
}

// Типы для timeline событий (страница About)
export type TimelineEvent = {
  year: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: string
  position: 'left' | 'right'
  tags: string[]
  achievements: string[]
  technologies: string[]
}

// Типы для полных данных проектов
export type Project = {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  detailedDescription: string
  developmentExperience: string
  careerAchievements: string[]
  personalGrowth: string[]
  technologies: string[]
  type: 'commercial' | 'education' | 'pet'
  year: number
  status: 'completed' | 'in-progress' | 'deprecated' | 'incomplete'
  image: string
  link: string | null
  features: string[]
  screenshots: string[]
  hoursSpent: number | null
  complexity: number
  team?: string
  duration: string
}

// Корневой тип для всего JSON
export type PortfolioData = {
  projects: Project[]
  timeline: TimelineEvent[]
  showcaseProjects: ShowcaseProject[]
}
