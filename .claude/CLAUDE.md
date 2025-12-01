# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Основная информация

Это портфолио-проект на **Next.js 15** с анимациями (GSAP + React Three Fiber) и использованием **Tailwind CSS 4** + shadcn/ui компонентов. Язык комментариев: русский. Пакетный менеджер: **pnpm**.

## Команды разработки

```bash
# Установка зависимостей
pnpm i

# Запуск dev-сервера с Turbopack (рекомендуется)
pnpm dev

# Линтинг
pnpm lint

# Production build с Turbopack
pnpm build

# Запуск production сервера
pnpm start
```

## Архитектура проекта

### Структура папок

```
app/
  (home)/              # Route group для главной страницы
    components/        # Компоненты только для главной
      about/           # Секция About
      projects/        # Секция Projects
      contact/         # Секция Contact
      BlockIntro.tsx   # Hero-секция с 3D
    page.tsx           # Главная страница (client component)
  about/               # Отдельная страница /about (roadmap timeline)
    components/        # Компоненты страницы About
      AboutHero.tsx    # Hero-блок с профессиональным описанием
      AboutTimeline.tsx # Timeline roadmap карьерного пути
      TimelineCard.tsx # Интерактивная карточка события с expand/collapse
      AboutSkills.tsx  # Сетка навыков и инструментов
    page.tsx           # Страница About (client component)
  layout.tsx           # Root layout с Preloader и Navigation
  globals.css          # Глобальные стили (Tailwind v4)

components/
  ui/                  # shadcn/ui базовые компоненты
    custom/            # Кастомные UI компоненты
      animated/        # Анимированные фоны (AnimatedBg, AnimatedStarsBg)
      3D/              # 3D компоненты (Sphere - r3f)
      preloader/       # Preloader с анимацией Eye
      stats/           # StatsGrid, StatCard
      skill/           # SkillBar, SkillList
  navigation/          # Навигация
    Navigation.client.tsx  # Главный навигационный компонент
    ui/                    # UI элементы навигации
    hooks/                 # Хуки для навигации
  hooks/             # Общие хуки
    useMasterTl.ts   # **Центральный GSAP timeline для синхронизации анимаций**
```

### Ключевые архитектурные паттерны

#### 1. Master Timeline (GSAP)
**Файл**: `components/hooks/useMasterTl.ts`

Синхронизирует анимации между Preloader и остальными секциями:
- Preloader создает master timeline с метками `'boot'` и `'hero'`
- Компоненты (например, BlockIntro) добавляют свои анимации к метке `'hero'`
- Это обеспечивает плавный переход от загрузки к контенту

**Важно**: При работе с анимациями проверяй, нужно ли интегрироваться с master timeline через `getMasterTl()`.

#### 2. Path Aliases (tsconfig.json)
```typescript
"@/components/*" → "components/*"
"@/lib/*"        → "lib/*"
"@/app/*"        → "app/*"
```

#### 3. Client Components Pattern
Большинство компонентов — client-side (`'use client'`) из-за GSAP анимаций и интерактивности.

#### 4. Intersection Observer для анимаций
**Хук**: `components/hooks/useIntersectionObserver.ts`

Используется для триггера анимаций при скролле (см. BlockIntro.tsx:17).

#### 5. Expand/Collapse анимации (Timeline Cards)
**Файл**: `app/about/components/TimelineCard.tsx`

Паттерн для плавного раскрытия/сворачивания карточек:
- **GSAP Timeline** для синхронизации нескольких анимаций
- **gsap.killTweensOf()** перед каждой анимацией для предотвращения конфликтов
- **maxHeight анимация** (0px ↔ 1000px) вместо height: auto для плавности
- **Последовательные задержки**: контент исчезает → карточка сжимается (0.1s delay)
- **Easing**: `power1.inOut` для мягких переходов, `back.out()` для bounce-эффектов
- **Durations**: 0.7-0.9s для естественной плавности

```typescript
// Пример из TimelineCard.tsx
const toggleExpand = () => {
  gsap.killTweensOf([card, glow, expanded]) // Убираем конфликты

  const tl = gsap.timeline({ defaults: { ease: 'power1.out' } })
  tl.to(card, { scaleX: 1.05, scaleY: 1.08, duration: 0.9 }, 0)
  tl.to(expanded, { opacity: 1, maxHeight: '1000px', duration: 0.7 }, 0.15)
}
```

#### 6. ScrollTrigger оптимизация
Для корректного срабатывания анимаций при скролле используются оптимизированные пороги:
- **Карточки**: `start: 'top 90%'` (раньше было 80%, что вызывало баг с последним элементом)
- **Точки timeline**: `start: 'top 85%'`
- **toggleActions**: `'play none none reverse'` для реверса при прокрутке вверх

### Технологический стек

- **Framework**: Next.js 15.5.3 (App Router, Turbopack)
- **React**: 19.1.0
- **Анимации**: GSAP 3.13.0
- **3D**: @react-three/fiber + @react-three/drei
- **UI**: Radix UI + shadcn/ui (Tailwind CSS 4)
- **Стилизация**: Tailwind CSS 4 (новый синтаксис в globals.css)
- **TypeScript**: Strict mode, typed routes enabled

### Конфигурация

#### next.config.ts
```typescript
reactStrictMode: true
experimental.typedRoutes: true  // Типизированные роуты
```

#### Tailwind CSS 4
Новый синтаксис импортов в `globals.css`:
```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
@custom-variant dark (&:is(.dark *));
```

Цветовая схема использует `oklch` и CSS-переменные.

### Важные детали

1. **Preloader**: Всегда показывается при загрузке (1500ms по умолчанию), управляет master timeline
2. **GSAP Context**: Используется `gsap.context()` для автоматической очистки при unmount
3. **Reduced Motion**: Компоненты проверяют `prefers-reduced-motion` и отключают анимации
4. **Dark Mode**: Зафиксирован в `className='dark'` на `<html>` (layout.tsx:14)

### Страница /about (Roadmap Timeline)

**Назначение**: Презентация профессионального опыта в формате интерактивного roadmap с timeline.

#### Структура компонентов:

1. **AboutHero.tsx**
   - Hero-блок с профессиональным описанием
   - Аватар-placeholder (заменить на реальное фото)
   - Ключевые факты (опыт, стек, локация)
   - Декоративная вертикальная линия с GSAP анимацией

2. **AboutTimeline.tsx**
   - Вертикальная timeline с карьерными событиями
   - ScrollTrigger анимация центральной линии (scaleY)
   - 3 события: Hpace.dev (2024-сейчас), ProfTeam (2023-2024), Начало (2022-2023)
   - Адаптивная сетка: мобильные - по центру, десктоп - зигзагом (left/right)
   - Пульсирующие точки-маркеры на timeline

3. **TimelineCard.tsx** (ключевой компонент)
   - **Свернутый режим**: год, иконка, название, краткое описание, первые 2 тега
   - **Развернутый режим**: полное описание, достижения, технологии
   - **Анимация**: "растекание водой" при клике на кнопку "Подробнее"
   - Props: `year`, `title`, `shortDescription`, `fullDescription`, `icon`, `tags`, `achievements`, `technologies`, `position`
   - Эффекты: glow растекание, увеличение карточки (scale), rotation иконки (180°)

4. **AboutSkills.tsx**
   - Сетка навыков (4 колонки на XL, адаптивно)
   - 14 навыков с категориями: frontend, backend, tools, ai
   - Hover-анимация: подъем карточки, rotation иконки (360°)
   - Прогресс-бары с процентами
   - Специальный AI-блок с подробным описанием интеграции

#### Ключевые технические решения:
- **Данные**: Реальные данные из резюме (1.5 года опыта, проекты Hpace.dev)
- **Анимации**: GSAP Timeline для синхронизации, killTweensOf для предотвращения багов
- **Responsive**: Mobile-first подход, скрытие timeline-точек на мобильных
- **Accessibility**: aria-label на секциях, aria-hidden на декоративных элементах

### Стиль кода

- **Отступы**: 2 пробела
- **Кавычки**: одинарные (в JSX/TSX)
- **Функциональные компоненты**: `export default function ComponentName()`
- **Хуки**: Префикс `use`, вынесены в отдельные файлы
- **Типизация**: TypeScript strict mode, избегать `any`

### Распространенные проблемы и решения

#### 1. GSAP анимации "прыгают" или не закрываются
**Проблема**: Конфликт одновременно выполняющихся анимаций на одном элементе.
**Решение**: Использовать `gsap.killTweensOf([element1, element2])` перед запуском новых анимаций.

#### 2. ScrollTrigger не срабатывает для последних элементов
**Проблема**: Порог срабатывания слишком низкий (например, `start: 'top 80%'`).
**Решение**: Увеличить порог до `start: 'top 90%'` для более раннего триггера.

#### 3. Анимации слишком резкие/агрессивные
**Проблема**: Короткие duration (< 0.5s), жесткие easing функции (elastic, power4).
**Решение**:
- Увеличить duration до 0.7-0.9s
- Использовать мягкие easing: `power1.inOut`, `power2.out`
- Добавить sequential delays в GSAP Timeline

#### 4. Height анимация не работает плавно
**Проблема**: `height: auto` нельзя анимировать с GSAP.
**Решение**: Использовать `maxHeight` с фиксированным значением (например, `maxHeight: '1000px'`).

#### 5. Декоративные элементы выходят за границы
**Проблема**: Отсутствие `overflow-hidden` на контейнере.
**Решение**: Добавить `overflow-hidden` на родительский элемент с `border-radius`.

### Референсы

1. **Основной**: https://dumemearts.com/about 
2. **Побочный**: https://billodesign.webflow.io/#about-me