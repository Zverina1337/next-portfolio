export type ProjectType = 'commercial' | 'education' | 'pet'
export type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'deprecated' | 'incomplete'
export type SortBy = 'date' | 'complexity' | 'hours'

export interface Project {
  id: string
  slug: string // URL-friendly identifier для динамических роутов
  title: string
  shortDescription: string
  fullDescription: string
  detailedDescription: string // 2.1 Подробное описание приложения
  developmentExperience: string // 2.2 Опыт разработки этого приложения
  careerAchievements: string[] // 2.3 Карьерные достижения
  personalGrowth: string[] // 2.4 Личностный рост
  technologies: string[]
  type: ProjectType
  year: number
  status: ProjectStatus
  image: string | null
  link: string | null
  features: string[]
  screenshots: string[] // Скриншоты/фотографии проекта
  hoursSpent: number // Количество часов (для сортировки)
  complexity: number // Сложность 1-10 (для сортировки)
  team?: string // Размер команды (опционально)
  duration?: string // Длительность работы (опционально)
}

export interface ProjectsData {
  projects: Project[]
}

export interface ProjectFiltersState {
  search: string
  technologies: string[]
  types: ProjectType[]
  years: number[]
  statuses: ProjectStatus[]
}
