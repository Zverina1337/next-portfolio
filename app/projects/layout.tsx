import { promises as fs } from 'fs'
import path from 'path'
import type { ProjectsData } from '@/types/project'

// SSR: загружаем данные проектов из JSON
async function getProjects(): Promise<ProjectsData> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error loading projects:', error)
    return { projects: [] }
  }
}

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projectsData = await getProjects()

  return (
    <div className="min-h-screen bg-black">
      {/* Передаем данные через data-attribute для клиентских компонентов */}
      <div id="projects-data" data-projects={JSON.stringify(projectsData)} style={{ display: 'none' }} />
      {children}
    </div>
  )
}
