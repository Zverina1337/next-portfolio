---
name: threejs-review
description: Проверка ThreeJS моделей на конфликты, производительность и accessibility. Использовать при ошибках с ThreeJS, падении FPS, или перед production deploy 3D сцен.
allowed-tools: Read, Glob, Grep
---

# ThreeJS Review

Автоматическая проверка Three.js и React Three Fiber кода на производительность, memory leaks и accessibility.

## Цель

3D сцены должны работать **плавно и стабильно** даже на:
- Интегрированных GPU (Intel HD Graphics, AMD Radeon Vega)
- Мобильных GPU (Adreno 5xx, Mali-G series)
- Старых десктопах (GTX 750, AMD R7 series)

**Target**: 30+ FPS на low-end, 60 FPS на mid-range устройствах.

## Что проверяется

### 1. Производительность рендеринга

#### 1.1 Полигоны (Polygon Count)
- **Low-end mobile**: < 50,000 полигонов
- **Mid-range mobile**: < 100,000 полигонов
- **Desktop**: < 200,000 полигонов
- **Проблема**: Высокий polygon count убивает FPS на слабых GPU
- **Решение**: LOD (Level of Detail), simplified geometry

**Как проверить**:
```typescript
// В коде искать new THREE.SphereGeometry(radius, widthSegments, heightSegments)
// widthSegments * heightSegments = примерное количество полигонов
```

#### 1.2 Draw Calls
- **Цель**: < 100 draw calls
- **Проблема**: Каждый mesh = 1 draw call, много объектов = падение FPS
- **Решение**:
  - `InstancedMesh` для повторяющихся объектов
  - Merge geometry для статичных объектов

#### 1.3 Frame Rate Optimization
- **Проверки**:
  - `useFrame` не содержит тяжелых вычислений
  - Нет создания новых объектов внутри render loop
  - Избегать `.clone()` в каждом фрейме

**Паттерны**:
```typescript
// ❌ Плохо: Вычисления в каждом фрейме
useFrame(() => {
  const newPosition = calculateComplexPhysics() // Дорого!
  meshRef.current.position.copy(newPosition)
})

// ✅ Хорошо: Кэшируем вычисления
const positionCache = useMemo(() => calculateComplexPhysics(), [deps])
useFrame(() => {
  meshRef.current.position.lerp(positionCache, 0.1)
})
```

### 2. Memory Management (критично!)

#### 2.1 Geometry Disposal
- **Проблема**: Three.js НЕ автоматически очищает memory
- **Решение**: Вызывать `.dispose()` в cleanup

**Проверки**:
- Все `new THREE.*Geometry()` должны иметь соответствующий `.dispose()`
- В React: cleanup в `useEffect` return

```typescript
// ❌ Плохо: Memory leak
useEffect(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  // Нет dispose — утечка памяти!
}, [])

// ✅ Хорошо: С cleanup
useEffect(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial()

  return () => {
    geometry.dispose()
    material.dispose()
  }
}, [])
```

#### 2.2 Texture Disposal
- **Проблема**: Текстуры занимают VRAM (особенно критично на мобильных)
- **Решение**: `.dispose()` для texture, проверка размера

**Проверки**:
- Размер текстур: power-of-2 (512, 1024, 2048)
- Формат: WebP или AVIF для compression
- Dispose при unmount

```typescript
// ❌ Плохо: Огромная текстура
const texture = useTexture('/texture-4096x4096.png') // 64MB VRAM!

// ✅ Хорошо: Оптимизированная текстура
const texture = useTexture('/texture-1024x1024.webp') // ~4MB VRAM
useEffect(() => {
  return () => texture.dispose()
}, [texture])
```

#### 2.3 React Three Fiber Cleanup
- **Паттерн**: R3F автоматически dispose базовых объектов, НО:
  - Custom loaders требуют ручного dispose
  - Textures нужно dispose вручную
  - Event listeners нужно cleanup

### 3. Материалы и Шейдеры

#### 3.1 Material Complexity
- **MeshBasicMaterial**: Самый быстрый (no lighting calculations)
- **MeshStandardMaterial**: Средний (PBR lighting)
- **MeshPhysicalMaterial**: Самый медленный (advanced PBR)

**Рекомендации**:
- Статичные объекты → `MeshBasicMaterial`
- Интерактивные объекты → `MeshStandardMaterial`
- Избегать `MeshPhysicalMaterial` на мобильных

#### 3.2 Custom Shaders
- **Проверки**:
  - Нет сложных вычислений в fragment shader
  - Используется `#ifdef` для conditional features
  - Uniforms обновляются только при изменении (не в каждом фрейме)

### 4. Освещение (Lighting)

#### 4.1 Light Count
- **Low-end**: 1-2 lights (ambient + directional)
- **Mid-range**: 3-4 lights
- **Desktop**: до 6 lights

**Проблема**: Каждый light = дополнительные вычисления на GPU

**Решение**:
- Использовать `AmbientLight` + `DirectionalLight` (базовая комбинация)
- Избегать множества `PointLight` и `SpotLight`
- Baked lighting для статичных сцен

```typescript
// ❌ Плохо: Слишком много lights
<pointLight position={[1, 0, 0]} />
<pointLight position={[-1, 0, 0]} />
<pointLight position={[0, 1, 0]} />
<pointLight position={[0, -1, 0]} />
<spotLight position={[0, 0, 5]} />

// ✅ Хорошо: Минимальное освещение
<ambientLight intensity={0.5} />
<directionalLight position={[5, 5, 5]} intensity={0.8} />
```

#### 4.2 Shadows
- **Проблема**: Тени ОЧЕНЬ дорогие для GPU
- **Рекомендации**:
  - Отключить shadows на мобильных
  - Использовать `shadowMap.type: PCFSoftShadowMap` (быстрее чем PCF)
  - Ограничить `shadow.mapSize` (512x512 на мобильных, 1024x1024 на десктопе)

### 5. React Three Fiber Best Practices

#### 5.1 Suspense & Lazy Loading
```typescript
// ✅ Хорошо: Lazy loading моделей
<Suspense fallback={<Loader />}>
  <Model />
</Suspense>
```

#### 5.2 useFrame Optimization
```typescript
// ❌ Плохо: Всегда работает
useFrame(() => {
  meshRef.current.rotation.y += 0.01
})

// ✅ Хорошо: С условием
const [isActive, setIsActive] = useState(true)
useFrame(() => {
  if (isActive && meshRef.current) {
    meshRef.current.rotation.y += 0.01
  }
})
```

#### 5.3 State Management
- Избегать frequent state updates (вызывают re-render)
- Использовать `useRef` для данных, не влияющих на UI
- Для сложной логики: `zustand` или `jotai`

### 6. Accessibility

#### 6.1 Prefers Reduced Motion
- **Обязательно**: Pause или simplify анимации

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

useFrame(() => {
  if (!prefersReducedMotion && meshRef.current) {
    meshRef.current.rotation.x += 0.01
  }
})
```

#### 6.2 WebGL Fallback
- **Проблема**: Старые браузеры/устройства не поддерживают WebGL
- **Решение**: Fallback UI

```typescript
import { Canvas } from '@react-three/fiber'

function Scene() {
  return (
    <Canvas fallback={<div>WebGL не поддерживается</div>}>
      {/* 3D content */}
    </Canvas>
  )
}
```

#### 6.3 Performance Monitoring
- Показывать FPS counter в dev mode
- Автоматически снижать качество при FPS < 30

### 7. Mobile Optimization

#### 7.1 Device Detection
```typescript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Снизить качество на мобильных
<Canvas dpr={isMobile ? 1 : window.devicePixelRatio}>
```

#### 7.2 Battery Friendly
- **Проблема**: Постоянный рендеринг убивает батарею
- **Решение**: `frameloop="demand"` когда возможно

```typescript
<Canvas frameloop="demand"> {/* Render только при изменениях */}
  <OrbitControls makeDefault /> {/* Trigger render on interaction */}
</Canvas>
```

#### 7.3 Pause в Background
```typescript
useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      // Pause анимации, снизить FPS
    } else {
      // Resume
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)
  return () => document.removeEventListener('visibilitychange', handleVisibility)
}, [])
```

## Инструкции по проверке

### Шаг 1: Найти все Three.js файлы
```bash
# Glob паттерны
**/*3D*/**/*.{ts,tsx}
**/components/ui/custom/3D/**
```

```bash
# Grep паттерны
"@react-three/fiber"
"@react-three/drei"
"import.*THREE.*from"
```

### Шаг 2: Проверка Memory Leaks

Для каждого файла проверить:

1. **Geometry creation**:
   - Grep: `new THREE.*Geometry`
   - Проверить наличие `.dispose()` в cleanup

2. **Material creation**:
   - Grep: `new THREE.*Material`
   - Проверить наличие `.dispose()` в cleanup

3. **Texture loading**:
   - Grep: `useTexture|TextureLoader`
   - Проверить cleanup

4. **Event listeners**:
   - Grep: `addEventListener`
   - Проверить `removeEventListener` в cleanup

### Шаг 3: Проверка Performance

1. **useFrame usage**:
   - Grep: `useFrame`
   - Флаг если есть:
     - Создание объектов (`new`, `.clone()`)
     - Тяжелые вычисления (без `useMemo`)
     - Отсутствие conditions для pause

2. **Polygon count**:
   - Grep: `SphereGeometry|BoxGeometry|PlaneGeometry`
   - Проверить параметры segments
   - Флаг если segments > 64 (для Sphere)

3. **Lights count**:
   - Grep: `<.*Light`
   - Подсчитать количество
   - Флаг если > 3 без device detection

### Шаг 4: Проверка Accessibility

1. **Reduced motion**:
   - Grep: `prefers-reduced-motion`
   - Флаг если анимаций много, а проверки нет

2. **WebGL fallback**:
   - Grep: `<Canvas.*fallback`
   - Флаг если нет fallback prop

### Шаг 5: Проверка Mobile Optimization

1. **DPR (Device Pixel Ratio)**:
   - Grep: `<Canvas.*dpr`
   - Рекомендация: `dpr={isMobile ? 1 : 2}`

2. **Frameloop**:
   - Grep: `frameloop`
   - Рекомендация для статичных сцен: `frameloop="demand"`

### Шаг 6: Генерация отчета

Формат вывода:

```
## ThreeJS Review Results

### ✓ Passed Checks
- [Filename]: Корректный memory cleanup (dispose)
- [Filename]: Оптимальный polygon count (< 50k)
- [Filename]: WebGL fallback реализован

### ⚠ Warnings
- [Filename:line]: useFrame содержит вычисления без useMemo
- [Filename:line]: Polygon count высокий (80k), рекомендуется LOD
- [Filename:line]: Texture size 2048x2048, рекомендуется 1024x1024 для мобильных

### ✗ Critical Issues
- [Filename:line]: Memory leak — нет dispose для geometry
- [Filename:line]: Memory leak — нет dispose для material
- [Filename:line]: Memory leak — нет cleanup для texture
- [Filename:line]: Слишком много lights (5), target: 2-3
- [Filename:line]: Отсутствует prefers-reduced-motion check
- [Filename:line]: Создание объектов в useFrame loop

### 📊 Summary
- Files checked: X
- 3D components: Y
- Memory leaks found: Z
- Performance score: A/10
- Mobile-ready: Yes/No

### 🎯 Priority Fixes
1. [Critical] Fix memory leaks (dispose geometry/materials)
2. [High] Reduce polygon count или add LOD
3. [Medium] Add prefers-reduced-motion support
4. [Low] Optimize texture sizes
```

## Примеры проблемного кода

### ❌ Плохо: Memory leak (geometry)
```typescript
function Cube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

  return <primitive object={new THREE.Mesh(geometry, material)} />
  // Memory leak — никогда не очищается!
}
```

### ✅ Хорошо: С cleanup
```typescript
function Cube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

    if (meshRef.current) {
      meshRef.current.geometry = geometry
      meshRef.current.material = material
    }

    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <mesh ref={meshRef} />
}
```

### ❌ Плохо: Тяжелые вычисления в useFrame
```typescript
useFrame(() => {
  // Вычисляется КАЖДЫЙ ФРЕЙМ (60 раз в секунду!)
  const complexResult = doHeavyCalculation()
  meshRef.current.position.x = complexResult
})
```

### ✅ Хорошо: Мемоизация вычислений
```typescript
const complexResult = useMemo(() => doHeavyCalculation(), [deps])

useFrame(() => {
  meshRef.current.position.x = complexResult
})
```

### ❌ Плохо: Слишком много полигонов
```typescript
// 128 * 128 = ~16,000 полигонов для одной сферы!
<sphereGeometry args={[1, 128, 128]} />
```

### ✅ Хорошо: Оптимизированная геометрия
```typescript
// 32 * 32 = ~1,000 полигонов (достаточно для большинства случаев)
<sphereGeometry args={[1, 32, 32]} />

// Или с LOD для детальных моделей
const lod = useMemo(() => {
  const lod = new THREE.LOD()
  lod.addLevel(highPolyMesh, 0)    // Вблизи
  lod.addLevel(mediumPolyMesh, 50) // Средняя дистанция
  lod.addLevel(lowPolyMesh, 100)   // Далеко
  return lod
}, [])
```

### ❌ Плохо: Множество lights
```typescript
<pointLight position={[1, 0, 0]} />
<pointLight position={[-1, 0, 0]} />
<pointLight position={[0, 1, 0]} />
<spotLight position={[0, 0, 5]} angle={0.5} />
<spotLight position={[0, 0, -5]} angle={0.5} />
// 5 lights — убивает FPS на мобильных!
```

### ✅ Хорошо: Минимальное освещение
```typescript
<ambientLight intensity={0.5} />
<directionalLight position={[5, 5, 5]} intensity={0.8} />
// 2 lights — оптимально для большинства сцен
```

### ❌ Плохо: Нет reduced motion
```typescript
useFrame(() => {
  meshRef.current.rotation.y += 0.01
  // Всегда крутится, даже если пользователь отключил анимации!
})
```

### ✅ Хорошо: С проверкой reduced motion
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

useFrame(() => {
  if (!prefersReducedMotion && meshRef.current) {
    meshRef.current.rotation.y += 0.01
  }
})
```

### ❌ Плохо: Нет fallback для WebGL
```typescript
<Canvas>
  <Scene />
</Canvas>
// Белый экран на старых устройствах!
```

### ✅ Хорошо: С fallback
```typescript
<Canvas fallback={
  <div className="flex items-center justify-center h-full">
    <p>WebGL не поддерживается вашим браузером</p>
  </div>
}>
  <Scene />
</Canvas>
```

### ❌ Плохо: Полный DPR на мобильных
```typescript
<Canvas dpr={window.devicePixelRatio}>
  {/* На iPhone 13 Pro это 3x — убивает GPU! */}
</Canvas>
```

### ✅ Хорошо: Ограничение DPR
```typescript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

<Canvas dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}>
  {/* Max 2x на десктопе, 1x на мобильных */}
</Canvas>
```

## Референсы из проекта

### Существующие компоненты
- **[components/ui/custom/3D/Sphere.tsx](components/ui/custom/3D/Sphere.tsx)**: Пример правильной интеграции React Three Fiber
  - Проверить на: memory cleanup, reduced motion, polygon count

### Интеграция с проектом
- **[app/(home)/components/BlockIntro.tsx](app/(home)/components/BlockIntro.tsx)**: Использование 3D компонента в hero секции
  - Проверить на: GSAP конфликты, performance impact на initial load

### Связанные навыки
- **gsap-review**: Проверить конфликты между GSAP анимациями и Three.js рендером
- **optimization-review**: Bundle size (three.js может быть тяжелым)

## Метрики качества

После проверки оцениваю 3D код по шкале:

### 10/10 — Идеально
- ✅ Все geometry/materials/textures имеют dispose
- ✅ Polygon count < 50k
- ✅ Lights count ≤ 2
- ✅ useFrame оптимизирован (нет вычислений)
- ✅ prefers-reduced-motion реализован
- ✅ WebGL fallback есть
- ✅ Mobile optimization (DPR, frameloop)

### 8-9/10 — Отлично
- ✅ Memory cleanup корректный
- ✅ Polygon count < 100k
- ⚠ Минорные warnings (например, texture size)

### 6-7/10 — Хорошо
- ✅ Базовый cleanup есть
- ⚠ Polygon count высокий (но < 200k)
- ⚠ Нет некоторых accessibility фич

### 4-5/10 — Удовлетворительно
- ✗ Есть memory leaks
- ✗ Performance проблемы (polygon count > 200k, много lights)
- ⚠ Accessibility отсутствует

### < 4/10 — Требуется рефакторинг
- ✗ Множественные memory leaks
- ✗ Критичные performance issues
- ✗ Не работает на мобильных/low-end

## Когда использовать этот навык

1. **Перед коммитом**: Проверка новых 3D компонентов
2. **При багах**:
   - Падение FPS
   - WebGL context lost
   - Зависание браузера
   - Рост memory usage
3. **Code review**: Проверка PR с Three.js кодом
4. **Production deploy**: Финальная проверка перед релизом
5. **Performance debugging**: Поиск узких мест в 3D сцене
6. **Mobile testing**: Проверка работы на слабых устройствах

## Ограничения

- Не могу запустить WebGL в браузере (нужен ваш фидбек по FPS)
- Не имею доступа к GPU metrics (VRAM usage, draw calls)
- Проверяю только статический код, не runtime профилирование
- Для точного polygon count нужен actual 3D model file (.glb, .gltf)

## Дополнительные рекомендации

### Инструменты для мониторинга
```typescript
// Добавить в dev mode
import { Stats } from '@react-three/drei'

<Canvas>
  <Stats /> {/* FPS, memory, draw calls */}
  <Scene />
</Canvas>
```

### Chrome DevTools
- **Performance tab**: Записать render loop, искать long tasks
- **Memory tab**: Heap snapshots для поиска утечек
- **Rendering tab**: FPS meter, paint flashing

### Lighthouse
- Проверить Performance score с 3D сценой
- Mobile simulation (4x CPU slowdown)
- Low-end device emulation
