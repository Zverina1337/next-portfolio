# Task-7 - Оптимизация Skills Section для мобильных устройств

Твоя задача: Заменить тяжеловесную 3D пирамиду навыков (Three.js + Cannon.js, ~1MB зависимостей) на легковесную 2D Canvas версию с изометрической проекцией для мобильных и слабых устройств.

---

## Цели проекта

**Основная проблема**: Текущая 3D пирамида навыков использует ~1MB JavaScript зависимостей (Three.js, react-three/fiber, cannon.js), которые загружаются даже на слабых мобильных устройствах, что приводит к:
- ❌ Медленной загрузке (bundle +800KB)
- ❌ Низкому FPS на бюджетных устройствах (< 30 FPS на Snapdragon 450)
- ❌ Высокому потреблению CPU/RAM

**Решение**: Создать 2D Canvas версию с изометрической проекцией, которая:
- ✅ Загружается только на мобильных/слабых устройствах
- ✅ Работает на чистом Canvas 2D (без Three.js)
- ✅ Сохраняет визуальную идентичность (пирамида из 17 кубов + анимация падения)
- ✅ Обеспечивает 60 FPS даже на слабых устройствах

---

## Ожидаемые результаты

### Bundle Size
- **До**: 194 KB (about page) + ~800KB Three.js зависимости для всех
- **После**:
  - Mobile: **~150 KB** (без Three.js, экономия -800KB)
  - Desktop: **~950 KB** (с Three.js, только для desktop)

### Performance
- **Mobile (2D версия)**: 55-60 FPS во время анимации
- **Desktop (3D версия)**: стабильные 60 FPS (без изменений)

### Совместимость
- ✅ Все современные браузеры (Chrome, Firefox, Safari, Edge)
- ✅ Мобильные устройства (iOS Safari, Chrome Mobile)
- ✅ Graceful degradation для IE9- (CSS Grid fallback)

---

## Ключевые особенности

1. **Device Detection**: Умная система определения устройства (экран, RAM, CPU, WebGL, соединение)
2. **Изометрическая проекция**: Псевдо-3D кубы через Canvas 2D (без Three.js)
3. **Анимация падения**: GSAP timeline с bounce эффектом (как в 3D версии)
4. **Adaptive Loading**: Three.js загружается только на desktop/сильных устройствах
5. **Fallback**: CSS Grid версия для древних браузеров (IE9-)

---

## Архитектура решения

### Структура файлов

```
components/
  ui/custom/3D/
    SkillsPyramid.tsx              # Существующий (БЕЗ изменений)
    SkillsPyramid2D.tsx            # НОВЫЙ - 2D canvas версия
    SkillsPyramidWrapper.tsx       # НОВЫЙ - умный выбор 3D/2D
    SkillsPyramidFallback.tsx      # НОВЫЙ - CSS Grid fallback
    PyramidLoadingSpinner.tsx      # НОВЫЙ - общий спиннер

  hooks/
    useDeviceCapabilities.ts       # НОВЫЙ - device detection

  types/
    skills.ts                      # НОВЫЙ - shared типы

app/about/components/
  AboutSkills.tsx                  # МОДИФИЦИРОВАТЬ - использовать Wrapper
```

**Всего**: 6 новых файлов + 1 изменение

---

## Детальное описание компонентов

### 1. Device Detection (`useDeviceCapabilities.ts`)

**Назначение**: Определить, нужна ли 2D версия для конкретного устройства.

**Критерии для 2D**:
- ✅ Ширина экрана < 768px (мобильные)
- ✅ RAM < 4GB (`navigator.deviceMemory`)
- ✅ CPU < 4 ядра (`navigator.hardwareConcurrency`)
- ✅ Медленное соединение (`connection.effectiveType === '3g'`)
- ✅ WebGL не поддерживается или software renderer (SwiftShader)

**Логика решения**:
```typescript
shouldUse2D =
  (isMobile && (noWebGL || lowMemory || lowCPU)) ||
  slow3G
```

**SSR Handling**:
- `isChecking: true` по умолчанию
- Определение происходит только на клиенте (после mount)
- Wrapper показывает loading state во время проверки

**Ключевые функции**:
```typescript
export function useDeviceCapabilities(): {
  shouldUse2D: boolean
  isChecking: boolean
  reason?: string // Для дебага
}
```

---

### 2. Wrapper компонент (`SkillsPyramidWrapper.tsx`)

**Назначение**: Единая точка входа для выбора оптимальной версии.

**Логика**:
```typescript
if (isChecking) return <LoadingSpinner />
if (!canvasSupported && shouldUse2D) return <Fallback />
if (shouldUse2D) return <SkillsPyramid2D />
return <SkillsPyramid3D />
```

**Dynamic imports**:
- ✅ Three.js загружается только для 3D версии
- ✅ `ssr: false` для обоих компонентов (WebGL/Canvas только client-side)

**Props**:
```typescript
interface Props {
  skills: Skill[]
  isVisible: boolean
}
```

---

### 3. 2D Canvas компонент (`SkillsPyramid2D.tsx`)

#### 3.1 Изометрическая проекция

**Математика преобразования 3D → 2D**:
```typescript
const SCALE = 40 // px на единицу 3D
const ISO_COS = Math.cos(Math.PI / 6) // ≈ 0.866
const ISO_SIN = Math.sin(Math.PI / 6) // 0.5

function to2D(x3d, y3d, z3d, canvasWidth, canvasHeight) {
  const canvasX = (x3d - z3d) * ISO_COS * SCALE + canvasWidth / 2
  const canvasY = (x3d + z3d) * ISO_SIN * SCALE - y3d * SCALE + canvasHeight / 2
  return { x: canvasX, y: canvasY }
}
```

**Размеры куба**:
- Ширина грани: **60px** (1.5 * 40)
- Высота граней: **60px**
- 3 видимых грани: **top** (параллелограмм), **left** (темнее), **right** (фронтальная с иконкой)

#### 3.2 Painter's Algorithm

**Проблема**: В 2D canvas нет Z-buffering, нужна сортировка.

**Решение**: Сортировка по изометрической глубине:
```typescript
function sortByDepth(cubes) {
  return cubes.sort((a, b) => {
    const depthA = a.x3d + a.z3d - a.currentY
    const depthB = b.x3d + b.z3d - b.currentY
    return depthA - depthB // Дальние первыми
  })
}
```

#### 3.3 Анимация падения (GSAP)

**Стратегия**:
- Кубы стартуют с Y = 12-16.5 (высоко над пирамидой)
- Падают на финальные позиции Y = 0.75-5.25
- **Stagger по рядам**: ряд 1 → ряд 2 (delay 0.15s) → ряд 3 → ряд 4
- **Stagger внутри ряда**: каждый куб +0.05s delay
- **Easing**: `bounce.out` (как в 3D версии)
- **Duration**: 1.2s на куб

**GSAP Timeline структура**:
```typescript
const tl = gsap.timeline({ delay: 0.3 })

rows.forEach((row, rowIndex) => {
  row.forEach((cube, cubeIndex) => {
    tl.to(cube, {
      currentY: cube.targetY,
      duration: 1.2,
      ease: 'bounce.out',
    }, rowIndex * 0.15 + cubeIndex * 0.05)
  })
})
```

**Оптимизация**:
- RAF loop останавливается после завершения анимации
- `prefers-reduced-motion`: кубы рендерятся сразу в финальных позициях

#### 3.4 Рендеринг

**Ключевые шаги**:
1. **Setup canvas** с учетом Retina (devicePixelRatio)
2. **Загрузка иконок** навыков (async, с кэшированием)
3. **Render loop**:
   - Очистка canvas
   - Сортировка кубов (painter's algorithm)
   - Отрисовка каждого куба (3 грани)
   - requestAnimationFrame (только во время анимации)

**Оптимизации**:
- ✅ Retina поддержка: `canvas.width = width * dpr`
- ✅ Условный RAF: останавливается после завершения анимации
- ✅ Cleanup: `cancelAnimationFrame`, `gsap.killTweensOf` при unmount

**Структура CubeState**:
```typescript
interface CubeState {
  skill: Skill
  x3d: number      // 3D позиция X
  y3d: number      // 3D позиция Y (начальная)
  z3d: number      // 3D позиция Z
  currentY: number // Анимационная Y позиция
  targetY: number  // Финальная Y позиция
}
```

---

### 4. Fallback компонент (`SkillsPyramidFallback.tsx`)

**Когда используется**: Canvas 2D не поддерживается (< 0.1% браузеров, IE9-)

**Реализация**: CSS Grid сетка с пирамидальной раскладкой (4 ряда)

**Структура**:
```tsx
<div className="space-y-4">
  {/* Ряд 1: 8 кубов */}
  <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
    {skills.slice(0, 8).map(...)}
  </div>
  {/* Ряд 2: 5 кубов */}
  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-3xl mx-auto">
    {skills.slice(8, 13).map(...)}
  </div>
  {/* ... */}
</div>
```

**Особенности**:
- Статичные карточки (без анимаций)
- Градиентные бордеры через CSS
- Hover эффект: `scale(1.05)`

---

### 5. Loading Spinner (`PyramidLoadingSpinner.tsx`)

**Назначение**: Общий спиннер для загрузки 3D/2D версий.

**Дизайн**: Анимированный кольцевой спиннер с градиентным glow (cyan-500).

**Размеры**: 32x32px (w-32 h-32), центрированный в контейнере 900px высотой.

---

### 6. Shared типы (`components/types/skills.ts`)

```typescript
export type Skill = {
  name: string
  icon: string
}
```

---

## Responsive адаптация

### Масштабирование кубов

```typescript
function getScaleFactor(viewportWidth) {
  if (viewportWidth < 480) return 25      // Mobile portrait (кубы 37.5px)
  if (viewportWidth < 768) return 30      // Mobile landscape (кубы 45px)
  return 40                               // Desktop (кубы 60px)
}
```

### Высота контейнера

**Адаптивная через Tailwind**:
```tsx
className="h-[600px] sm:h-[750px] lg:h-[900px]"
```

---

## Performance оптимизации

### 1. Условный RAF
```typescript
const isAnimatingRef = useRef(false)

// GSAP timeline:
onStart: () => { isAnimatingRef.current = true }
onComplete: () => {
  isAnimatingRef.current = false
  renderOnce() // Финальный кадр
}

// RAF loop:
if (isAnimatingRef.current) {
  rafRef.current = requestAnimationFrame(render)
}
```

**Результат**: После ~3 секунд анимации RAF останавливается, CPU idle.

### 2. Cleanup при unmount
```typescript
useEffect(() => {
  // ... setup ...

  return () => {
    cancelAnimationFrame(rafRef.current)
    gsap.killTweensOf(cubesRef.current)
    // ... canvas cleanup ...
  }
}, [])
```

### 3. Lazy loading иконок
- Загрузка только при `isVisible === true`
- Кэширование в `Map<string, HTMLImageElement>`
- Fallback на "?" при ошибке загрузки

### 4. Prefers-reduced-motion
- Хук `usePrefersReducedMotion()`
- Кубы рендерятся сразу в финальных позициях
- GSAP timeline не запускается

---

## Изменения в существующих файлах

### [app/about/components/AboutSkills.tsx](d:\projects\next-portfolio-anim-starter\app\about\components\AboutSkills.tsx)

**До** (строки 8-18):
```typescript
const SkillsPyramid = dynamic(() => import('@/components/ui/custom/3D/SkillsPyramid'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

// ...JSX:
<SkillsPyramid skills={SKILLS} isVisible={isVisible} />
```

**После**:
```typescript
const SkillsPyramidWrapper = dynamic(() => import('@/components/ui/custom/3D/SkillsPyramidWrapper'), {
  loading: () => <PyramidLoadingSpinner />,
  ssr: false,
})

// ...JSX:
<SkillsPyramidWrapper skills={SKILLS} isVisible={isVisible} />
```

**Изменения**: 2 строки (import + JSX)

---

## Testing план

### Device Testing

**Реальные устройства** (рекомендуется):
- Samsung Galaxy A10 (Snapdragon 450, 2GB RAM)
- iPhone SE 2020
- Desktop с WebGL

**Chrome DevTools emulation**:
- Mobile S (320px)
- Mobile M (375px)
- Tablet (768px)
- Desktop (1920px)

**Network throttling**:
- Fast 3G (750ms latency)
- Slow 3G (2000ms latency)

**CPU throttling**:
- 4x slowdown (симуляция бюджетного процессора)

### Метрики производительности

**Chrome Performance Tab**:
- ✅ **FPS**: 60 FPS во время анимации (допустимо 55+ на mobile)
- ✅ **Scripting**: < 16ms на фрейм
- ✅ **Memory**: Не растет после завершения анимации

**Lighthouse**:
- Performance score: > 90 (desktop)
- Performance score: > 70 (mobile, 4G)

### Проверка Device Detection

**Тест-кейсы**:
1. Desktop (1920px, 8GB RAM, WebGL) → 3D версия
2. Mobile (375px, 4GB RAM) → 2D версия
3. Mobile (375px, 2GB RAM, SwiftShader) → 2D версия
4. Desktop (1920px, Slow 3G) → 2D версия

**Консоль лог** (dev mode):
```
[DeviceCapabilities] {
  shouldUse2D: true,
  reasons: 'mobile, low-memory',
  checks: { isMobile: true, hasLowMemory: true, ... }
}
```

---

## Потенциальные проблемы и решения

### 1. Мерцание canvas при resize
**Симптом**: Canvas становится белым на мгновение при ресайзе окна.
**Решение**: Добавить `bg-slate-950` на контейнер

### 2. Иконки размыты на Retina
**Симптом**: SVG иконки выглядят нечетко на iPhone/MacBook.
**Решение**: Масштабирование canvas через `devicePixelRatio`

### 3. Кубы в неправильном порядке (перекрытия)
**Симптом**: Задние кубы рисуются поверх передних.
**Решение**: Painter's algorithm — сортировка по глубине перед каждым рендером

### 4. Имена навыков не помещаются в грань
**Симптом**: Длинные названия (например, "ChatGPT 4/5") обрезаются.
**Решение**: Адаптивный размер шрифта в зависимости от длины названия

### 5. Three.js все еще загружается на мобильных
**Симптом**: Bundle size не уменьшился.
**Решение**: Проверить в Chrome DevTools → Network. Dynamic import должен работать корректно.

### 6. GSAP timeline не синхронизирован с canvas render
**Симптом**: Кубы "прыгают" или позиции не совпадают.
**Решение**: GSAP автоматически использует RAF, достаточно читать `cube.currentY` в каждом кадре.

---

## Оценка сложности

| Компонент | Сложность | Время |
|-----------|-----------|-------|
| `useDeviceCapabilities.ts` | ★★★☆☆ | 2ч |
| `SkillsPyramidWrapper.tsx` | ★★☆☆☆ | 1ч |
| `SkillsPyramid2D.tsx` (изометрия + canvas) | ★★★★☆ | 8ч |
| `SkillsPyramidFallback.tsx` | ★★☆☆☆ | 1.5ч |
| `PyramidLoadingSpinner.tsx` | ★☆☆☆☆ | 0.5ч |
| Shared types | ★☆☆☆☆ | 0.5ч |
| Модификация AboutSkills.tsx | ★☆☆☆☆ | 0.5ч |
| Testing + bug fixes | ★★★☆☆ | 5ч |
| **ИТОГО** | **★★★☆☆** | **~19ч** |

**Критический путь**:
1. SkillsPyramid2D.tsx (изометрическая математика + рендеринг) — 8 часов
2. Testing и оптимизация — 5 часов

---

## Этапы реализации

### Этап 1: Подготовка (30 минут)
- [ ] Создать shared типы (`components/types/skills.ts`)
- [ ] Создать loading spinner (`PyramidLoadingSpinner.tsx`)

### Этап 2: Device Detection (2 часа)
- [ ] Реализовать `useDeviceCapabilities.ts`
- [ ] Тестирование на разных устройствах (DevTools emulation)

### Этап 3: Wrapper компонент (1 час)
- [ ] Реализовать `SkillsPyramidWrapper.tsx`
- [ ] Dynamic imports для 3D/2D версий
- [ ] Интеграция в `AboutSkills.tsx`

### Этап 4: 2D Canvas компонент (8 часов)
- [ ] Изометрическая математика (формулы, тестирование)
- [ ] Canvas setup (Retina, resize handlers)
- [ ] Рисование изометрического куба (3 грани)
- [ ] Загрузка иконок (async, кэширование)
- [ ] GSAP анимация падения (timeline, stagger)
- [ ] Painter's algorithm (сортировка)
- [ ] Performance оптимизации (RAF stop, cleanup)

### Этап 5: Fallback компонент (1.5 часа)
- [ ] Реализовать `SkillsPyramidFallback.tsx` (CSS Grid)
- [ ] Интеграция в wrapper

### Этап 6: Testing и оптимизация (5 часов)
- [ ] Device emulation testing
- [ ] Performance profiling (Chrome DevTools)
- [ ] Visual regression testing (скриншоты 3D vs 2D)
- [ ] Bug fixes
- [ ] Launch `/optimization-review`

### Этап 7: Production build проверка (30 минут)
- [ ] `pnpm build`
- [ ] Проверка bundle sizes (Three.js должен отсутствовать в mobile bundle)
- [ ] Lighthouse audit

---

## Reuse компонентов

**Паттерны из существующих компонентов**:
- **SkillsPyramid.tsx** → Копирование позиций пирамиды, понимание физики
- **TimelineCard.tsx** → GSAP animations, ScrollTrigger patterns
- **Sphere.tsx** → Mobile device detection паттерн
- **AnimatedGrid.tsx** → Canvas optimization patterns
- **usePrefersReducedMotion** → Accessibility паттерн

---

## Completion Checklist

### Файлы
- [ ] `components/types/skills.ts` создан
- [ ] `components/hooks/useDeviceCapabilities.ts` реализован
- [ ] `components/ui/custom/3D/SkillsPyramidWrapper.tsx` реализован
- [ ] `components/ui/custom/3D/SkillsPyramid2D.tsx` реализован
- [ ] `components/ui/custom/3D/SkillsPyramidFallback.tsx` реализован
- [ ] `components/ui/custom/3D/PyramidLoadingSpinner.tsx` реализован
- [ ] `app/about/components/AboutSkills.tsx` модифицирован (2 строки)

### Функциональность
- [ ] Device detection работает корректно (логи в консоли)
- [ ] 3D версия загружается на desktop (> 768px, WebGL OK)
- [ ] 2D версия загружается на mobile (< 768px или low specs)
- [ ] Fallback версия показывается при отсутствии Canvas 2D
- [ ] Изометрические кубы рендерятся корректно (3 грани)
- [ ] Painter's algorithm работает (нет перекрытий)
- [ ] GSAP анимация падения плавная (bounce effect)
- [ ] RAF останавливается после завершения анимации

### Performance
- [ ] FPS 55-60 на мобильных (2D версия)
- [ ] FPS 60 на desktop (3D версия)
- [ ] Bundle size на mobile: ~150KB (без Three.js)
- [ ] Bundle size на desktop: ~950KB (с Three.js)
- [ ] Memory не растет после завершения анимации

### Accessibility
- [ ] `prefers-reduced-motion` поддерживается
- [ ] Loading state показывается корректно
- [ ] Нет FOUC (flash of unstyled content)

### Testing
- [ ] Проверено на Chrome DevTools emulation (Mobile S/M/L, Tablet, Desktop)
- [ ] Проверено на реальных устройствах (если доступно)
- [ ] Network throttling (Fast 3G, Slow 3G)
- [ ] CPU throttling (4x slowdown)
- [ ] Visual regression (скриншоты 3D vs 2D)
- [ ] `/optimization-review` пройден
- [ ] Lighthouse score > 90 (desktop), > 70 (mobile)

---

**Status**: План готов к реализации
**Detailed plan**: [virtual-tinkering-flame.md](../../.claude/plans/virtual-tinkering-flame.md)