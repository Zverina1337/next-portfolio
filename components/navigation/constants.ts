export type NavItem = Readonly<{
  href: string;
  label: string;
  idx: `${number}${number}`; // "01" | "02" ...
}>;

export const NAVIGATION_LINKS: readonly NavItem[] = [
  { href: '/',     label: 'Домой',      idx: '01' },
  { href: '/about',    label: 'Обо мне',    idx: '02' },
  { href: '/projects', label: 'Проекты',    idx: '03' },
] as const;


export const PHRASES: string[]= [
  'Делаю интерфейсы, которые двигаются',
  'Смысл → Дизайн → Движение',
  'Ритм. Контраст. Инерция.',
  'Мягкие переходы, чёткая логика',
  'UI, который хочется трогать'
] as const