export type Project = { 
  title: string; 
  subtitle: string;
  video?: string; 
  description: string
  stats: { label: string, value: number }[]

 }

export const projects: Project[] = [
  {
    title: 'Dashboard',
    subtitle: 'Дашборд интернет-магазина',
    video: '/video/project-demo1.mp4',
    description:
      'Интерактивный дашборд с аналитикой продаж, визуализацией KPI и динамическими графиками, который позволяет отслеживать ключевые показатели бизнеса в режиме реального времени.',
    stats: [
      { label: 'Next.js / React', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Perf / A11y', value: 88 },
    ]  
  },
  {
    title: 'AI genius',
    subtitle: 'Интеграция с OpenAI API',
    video: '/video/project-demo2.mp4',
    description:
      'Система интеллектуальных подсказок и генерации контента на базе OpenAI API, позволяющая автоматически создавать тексты, рекомендации и ответы на вопросы пользователей.',
    stats: [
      { label: 'Next.js / React', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Perf / A11y', value: 88 },
    ]  
  },
  {
    title: 'Messanger',
    subtitle: 'Просто мессенджер',
    video: '/video/project-demo3.mp4',
    description:
      'Современный мессенджер с модульной архитектурой, обеспечивающий стабильную работу, поддержку UI-компонентов через Storybook и соблюдение стандартов кода через ESLint/Prettier.',
    stats: [
      { label: 'Next.js / React', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Perf / A11y', value: 88 },
    ]  
  },
  {
    title: 'Some project',
    subtitle: 'Акценты на Three.js',
    video: '/video/project-demo.mp4',
    description:
      'Проект с 3D-визуализацией на базе Three.js, плавной анимацией и минималистичным интерфейсом, который демонстрирует интерактивные элементы без перегрузки пользовательского интерфейса.',
    stats: [
      { label: 'Next.js / React', value: 70 },
      { label: 'TypeScript', value: 80 },
      { label: 'Perf / A11y', value: 88 },
    ]  
  },
]