# Task-5 - to make a more pleasant UI/UX on the projects page (/projects)

Your task is to implement a more interesting UI/UX design. The problem with the current solution is that it turned out to be too minimalistic, but very productive. Right now, your task mainly depends on your creativity, so you need to achieve the best wow effect, just like on other pages.

## Key Features
1. ** It is necessary that the current performance remains the same**
2. **It is important that the UI/UX is pleasing to the eye and consistent with the overall style of the site.**
3. **Remove the details from the list, there will be separate pages for each project.**
4. **Leave the most important and relevant information about each project.**
5. **Also, leave room for the image of the project, people like to evaluate it based on pictures first of all.**

---

## ✅ Done

### What was done:

####1. **New card-based design**
- Transition from a minimalistic list with `border-left` to full-fledged cards
- Glassmorphism style: `bg-white/5 backdoor-blur-sm`
- Adaptive grid: `grid-cols-1 md:grid-cols-[200px_1fr]`
- Image on the left (200 pixels on the desktop), content on the right

#### 2. **Project Images**
- Using Next. js `<Image>` for optimization
- Automatic deferred loading and size optimization
- Beautiful placeholder with animated icon for projects without image
- Gradient background: `from-cyan-500/20 via-purple-500/20 to-cyan-500/20`

#### 3. **Animated GSAP effects and guidance**
- **Scroll appearance**: smooth appearance from `y: 30 → 0`, in increments of `0.08 s`
- **Hover lift effect**: The card rises by `-8 pixels` when hovered over
- **Glow effect**: spreading gradient glow with `blur-xl` and `scale: 1.05`
- **Smoothness**: duration `0.3 s', deceleration `power2.out`
- **Accessibility**: checking `preferences-reduced-motion`

####4. **Improved typography and user interface elements**
- **Status icons**: color indicators with rounded-full style
  - Completed: green `green-500`
  - In progress: blue `CYAN-500`
  - Planned: Purple `purple-500`
- **Technologies**: graphic tags with rounded-full icons when hovering the mouse cursor
- **linear clamp-3** for a restrictive description (3 lines)
- **Animated arrow** on the "Open Project" link

#### 5. **Deleted items**
- The "Add" button (expand/collapse the file)
- ❌ Expanded content (full description, functions, full text)
- ❌ Expanded usage status

#### 6. **Efficiency**
- ✅ Component memoization has been saved (`memo`)
- ✅ The Next image has been used. js for load optimization
- ✅ GSAP context for automatic animation cleaning
- ✅ Checking `preferences-reduced-motion`
- ✅ No unnecessary re-renders (optimized index delay)

### Technical Details:

**File**: `app/projects/components/ProjectItem.tsx`

**Key changes**:
- Import `Image` from `next/image`
- Two `userefs': `cardRef', `glowRef`
- 'handleMouseEnter`/`handleMouseLeave' for pointing GSAP animations
- `getStatusBadge()` instead of `getStatusLabel()` for visual badges
- Grid layout for image and content
- Adaptive: on mobile devices — image on top (h-48), on desktops — on the left (full height)

**Styles**:
— Glassmorphism: `bg-white/5 backdoor-blur-sm border border-white/10`
— Hover: `hover:border-cyan-500/30`
— Glow: `bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-xl`

 ### Result:
✅ The task is completed completely. The UI/UX has become much more attractive, performance has been preserved, unnecessary details have been removed, images and spectacular animations have been added.

---

## ✅ Фоновые UI эффекты (дополнение)

### Что было добавлено:

#### 1. **AnimatedGrid** (интерактивная сетка точек с подсветкой при наведении)
**Файл**: `app/projects/components/AnimatedGrid.tsx`

- **Canvas-based решение** для максимальной производительности
- Сетка точек 24x24px (аналогично BlockIntro: `12px * 2`)
- Базовая opacity: `0.15` (улучшена видимость)
- **Интерактивность**: точки подсвечиваются при наведении мыши
- Радиус влияния курсора: `150px`
- Плавная интерполяция opacity от `0.15` до `0.65`
- Cyan glow для точек в радиусе `75px` от курсора
- Проверка `prefers-reduced-motion`

**Технические детали**:
- requestAnimationFrame для плавной анимации (~60 FPS)
- Динамический расчет расстояния до курсора для каждой точки
- Плавное возвращение к базовой opacity (`lerp * 0.1`)
- Canvas адаптируется к размеру окна и scrollHeight документа
- `rgba(255, 255, 255, opacity)` для базовых точек
- `rgba(34, 211, 238, intensity * 0.3)` для cyan glow
- Автоматическая очистка при unmount

#### 2. **Центральное свечение с анимацией дыхания**
**Реализация**: Встроено в `app/projects/page.tsx`

- Градиентное свечение в центре страницы
- Размер: `600x600px`
- Цвета: `from-cyan-500/20 via-purple-500/10 to-transparent`
- **Анимация дыхания**: `pulse` с длительностью `4s`
- Easing: `ease-in-out` для плавности
- Бесконечный цикл (`infinite`)
- `blur-3xl` для мягкого рассеивания света

**Назначение**:
- Подсветка сетки точек для лучшей видимости
- Создание атмосферы "живого" фона
- Мягкий акцент на центральной части страницы

#### 3. **MouseTrail** (глобальный след от курсора)
**Файл**: `components/ui/custom/MouseTrail.tsx`

- **Глобальный эффект** для всего приложения (добавлен в `layout.tsx`)
- Тонкий и ненавязчивый - 8 частиц максимум
- Интервал между частицами: 80ms
- Затухающие частицы с уменьшением размера

**Технические детали**:
- Пул частиц (particle pooling) для производительности
- GSAP анимация: `scale: 1 → 0`, `opacity: 0.6 → 0`, 0.8s duration
- Частицы 4x4px с cyan цветом и glow
- `z-index: 9999` для отображения поверх всего
- Автоматическая очистка при unmount

**Оптимизация**:
- Повторное использование DOM элементов (пул)
- Throttling эмиссии частиц (80ms)
- `killTweensOf` для предотвращения конфликтов
- Проверка `prefers-reduced-motion`

### Интеграция:

**projects/page.tsx**:
```tsx
<AnimatedGrid />
{/* Центральное свечение с анимацией дыхания */}
<div className="...animate-[pulse_4s_ease-in-out_infinite]" />
```

**layout.tsx** (глобально):
```tsx
<MouseTrail />
```

### Производительность:

✅ Все эффекты работают в `fixed` позиции с `pointer-events-none`
✅ GSAP context для автоматической очистки
✅ Throttling и debouncing где необходимо
✅ Проверка `prefers-reduced-motion` во всех компонентах
✅ Particle pooling в MouseTrail
✅ Никаких лишних re-renders
✅ ESLint проверки пройдены

### Визуальный результат:
- Киберпанк/tech атмосфера
- Динамичные, но ненавязчивые эффекты
- Гармония с общим стилем сайта (cyan/purple палитра)
- Интерактивность без отвлечения от контента