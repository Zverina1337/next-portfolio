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
  about/               # Отдельная страница /about
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

### Стиль кода

- **Отступы**: 2 пробела
- **Кавычки**: одинарные (в JSX/TSX)
- **Функциональные компоненты**: `export default function ComponentName()`
- **Хуки**: Префикс `use`, вынесены в отдельные файлы
- **Типизация**: TypeScript strict mode, избегать `any`