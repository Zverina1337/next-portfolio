export type ProjectType = 'commercial' | 'education' | 'pet'
export type ProjectStatus = 'completed' | 'in-progress' | 'planned'

export interface Project {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  technologies: string[]
  type: ProjectType
  year: number
  status: ProjectStatus
  image: string | null
  link: string | null
  features: string[]
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
