---
name: optimization-review
description: Комплексная проверка производительности приложения с фокусом на работу на слабых устройствах. Использовать перед production deploy, при жалобах на медленную работу, или для оптимизации под бюджетные смартфоны и старые ПК.
allowed-tools: Read, Glob, Grep
---

# Optimization Review

Автоматическая проверка производительности Next.js приложения с приоритетом на работу на слабых устройствах (< 2GB RAM, медленный CPU, 3G соединение).

## Цель
Приложение должно быть **быстрым и отзывчивым** даже на:
- Бюджетных смартфонах (Xiaomi Redmi, Samsung A-series)
- Старых ПК (dual-core CPU, 4GB RAM)
- Медленном интернете (3G, нестабильный WiFi)

## Что проверяется

### 1. Bundle Size (критично для загрузки)

#### 1.1 JavaScript Bundle
- **Цель**: < 200KB gzipped для initial bundle, < 500KB для всего приложения
- **Проблема**: Большие бандлы долго парсятся на слабых CPU
- **Проверки**:
  - Наличие code splitting (dynamic imports)
  - Отсутствие неиспользуемых библиотек в dependencies
  - Tree shaking для UI библиотек (import только нужных компонентов)
  - Lazy loading для страниц и компонентов

**Паттерны**:
```typescript
// ❌ Плохо: импорт всей библиотеки
import _ from 'lodash'

// ✅ Хорошо: импорт только нужной функции
import debounce from 'lodash/debounce'

// ❌ Плохо: все компоненты в initial bundle
import { HeavyChart } from './HeavyChart'

// ✅ Хорошо: lazy loading
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

#### 1.2 CSS Bundle
- **Цель**: < 50KB gzipped
- **Проверки**:
  - Tailwind purge работает корректно
  - Нет дублирующихся стилей
  - Критичный CSS инлайнится в `<head>`

#### 1.3 Third-Party Scripts
- **Проблема**: Analytics, метрики блокируют main thread
- **Решение**: Next.js `<Script strategy="lazyOnload">`

### 2. React Оптимизация

#### 2.1 Избыточные Re-renders
- **Проверки**:
  - `React.memo()` для дорогих компонентов
  - `useMemo()` для вычислений
  - `useCallback()` для функций в props

#### 2.2 Virtualization
- **Когда**: Списки > 50 элементов
- **Решение**: `react-window`

### 3. Images

#### 3.1 Next/Image
- **Обязательно**: Все через `<Image />`
- **Проверки**: width/height, priority для LCP

### 4. Core Web Vitals

- **LCP**: < 2.5s
- **FID/INP**: < 100ms
- **CLS**: < 0.1

### 5. Mobile (слабые устройства)

- Touch targets >= 48px
- Battery-friendly: pause анимаций в фоне
- `prefers-reduced-motion`

### 6. Memory

- Event listeners cleanup
- GSAP `context()`
- Virtualization для больших данных

## Инструкции

### Шаг 1: Bundle size
```bash
pnpm build
```
Проверить First Load JS < 200KB

### Шаг 2: React оптимизации
Grep для:
- Вычислений без `useMemo`
- Функций без `useCallback`

### Шаг 3: Images
```bash
**/*.{jpg,jpeg,png,webp}
```
Проверить размеры > 200KB

### Шаг 4: Memory leaks
Grep для:
- `addEventListener` без `removeEventListener`
- `setInterval` без `clearInterval`

### Шаг 5: Отчет

```
## Optimization Review Results

### 📦 Bundle Size: ✓ / ⚠ / ✗
### ⚛️ React: оценка
### 🖼️ Images: оценка
### 📱 Mobile: оценка
### 🧠 Memory: оценка

### Overall: X/10

### 🎯 Priority Fixes
1. [Critical] ...
2. [High] ...
```

## Метрики успеха

### Отлично (9-10/10)
- Bundle < 150KB, LCP < 2s
- Работает плавно на Snapdragon 450

### Хорошо (7-8/10)
- Bundle < 250KB, LCP < 3s
- Приемлемо на бюджетных устройствах

### Требуется оптимизация (< 5/10)
- Bundle > 400KB, LCP > 4s
- Непригодно для слабых устройств

## Примеры

### ❌ Плохо: Импорт всей библиотеки
```typescript
import _ from 'lodash' // +70KB
```

### ✅ Хорошо: Tree-shaking
```typescript
import debounce from 'lodash/debounce' // +2KB
```

### ❌ Плохо: Все в bundle
```typescript
import { HeavyChart } from './HeavyChart'
```

### ✅ Хорошо: Dynamic import
```typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  ssr: false
})
```

### ❌ Плохо: Вычисления на каждый render
```typescript
function List({ items }) {
  const sorted = items.sort(...) // Каждый render!
}
```

### ✅ Хорошо: Мемоизация
```typescript
function List({ items }) {
  const sorted = useMemo(() => items.sort(...), [items])
}
```

### ❌ Плохо: Анимации в фоне
```typescript
useEffect(() => {
  gsap.to(el, { rotation: 360, repeat: -1 })
}, [])
```

### ✅ Хорошо: Pause в фоне
```typescript
useEffect(() => {
  const anim = gsap.to(el, { rotation: 360, repeat: -1 })
  
  const handleVisibility = () => {
    document.hidden ? anim.pause() : anim.resume()
  }
  
  document.addEventListener('visibilitychange', handleVisibility)
  return () => {
    anim.kill()
    document.removeEventListener('visibilitychange', handleVisibility)
  }
}, [])
```

## Когда использовать

1. Перед production deploy
2. При жалобах на медленную работу
3. После добавления зависимостей
4. Code review PR

## Целевые устройства

**Low-End**: Snapdragon 450, 2GB RAM, 3G
**Mid-Range**: Core i3, 4GB RAM, медленный WiFi
