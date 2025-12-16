export type Project = { 
  title: string; 
  subtitle: string;
  images?: { src: string, name: string }[];
  description: string
  stats: { label: string, value: number }[]
 }

export const projects: Project[] = [
  {
    title: 'Агрегатор вакансий',
    subtitle: 'Агрегатор вакансий и фриланс-платформа',
    images: [
      { src: '/projects/project-4/main-page.png', name: 'Project image 1' },
      { src: '/projects/project-4/mobile-page.png', name: 'Project image 2' },
      { src: '/projects/project-4/micro-frame-1.png', name: 'Project image 3' },
      { src: '/projects/project-4/micro-frame-2.png', name: 'Project image 4' },
      { src: '/projects/project-4/micro-frame-3.png', name: 'Project image 4' },
    ],
    description:
      'Платформа для поиска IT-специалистов. Разработал фронтенд на Nuxt.js с системой фильтрации, профилями специалистов и системой откликов.',
    stats: [
      { label: 'Nuxt.js / Vue 3', value: 80 },
      { label: 'TypeScript', value: 60 },
      { label: 'Perf / A11y', value: 69 },
    ]  
  },
  {
    title: 'AI genius',
    subtitle: 'Интеграция с OpenAI API',
    images: [
      { src: '/projects/project-1/main-page.png', name: 'Project image 1' },
      { src: '/projects/project-1/mobile-page.png', name: 'Project image 2' },
      { src: '/projects/project-1/micro-frame-1.png', name: 'Project image 3' },
      { src: '/projects/project-1/micro-frame-2.png', name: 'Project image 4' },
    ],
    description:
      'Система интеллектуальных подсказок и генерации контента на базе Grok + Openrouter API, позволяющая автоматически создавать тексты, рекомендации и ответы на вопросы пользователей.',
    stats: [
      { label: 'Next.js / React', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Perf / A11y', value: 88 },
    ]  
  },
  {
    title: 'IT Cluster',
    subtitle: 'Агрегатор вакансий и фриланс-платформа с валидацией через ВУЗы и техникумы',
    images: [
      { src: '/projects/project-3/main-page.png', name: 'Project image 1' },
      { src: '/projects/project-3/mobile-page.png', name: 'Project image 2' },
      { src: '/projects/project-3/micro-frame-1.png', name: 'Project image 3' },
      { src: '/projects/project-3/micro-frame-2.png', name: 'Project image 4' },
      { src: '/projects/project-3/micro-frame-3.png', name: 'Project image 4' },
    ],
    description:
      'Образовательная платформа для объединения компаний и студентов. Разработал пользовательские интерфейсы и систему взаимодействия.',
    stats: [
      { label: 'Vue 3', value: 40 },
      { label: 'Pinia', value: 50 },
      { label: 'Perf / A11y', value: 38 },
    ]  
  },
  {
    title: 'Mpb.TOP',
    subtitle: 'Сервис для продавцов маркетплейсов с модулем техподдержки',
    images: [
      { src: '/projects/project-2/main-page.png', name: 'Project image 1' },
      { src: '/projects/project-2/mobile-page.png', name: 'Project image 2' },
      { src: '/projects/project-2/micro-frame-1.png', name: 'Project image 3' },
      { src: '/projects/project-2/micro-frame-2.png', name: 'Project image 4' },
    ],
    description:
      'Разработал модуль техподдержки с мессенджером для Mpb.TOP. Реализовал real-time чат, систему тикетов и админ-панель для управления обращениями.',
    stats: [
      { label: 'Vue 3', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Laravel', value: 40 },
    ]  
  },
]