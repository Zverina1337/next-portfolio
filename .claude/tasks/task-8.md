# Task 8: Параллакс-коллаж для ProjectImages.tsx

## Цель
Реализовать визуальный коллаж с параллакс-анимацией для компонента `ProjectImages.tsx`, где каждое изображение проекта "летает" в пространстве на разных глубинах.

---

## Ключевые решения

1. **Layout**: Absolute positioning (НЕ CSS Grid)
2. **Fallback**: Креативная заглушка с анимированным градиентом + иконкой камеры
3. **Mobile**: Два изображения РЯДОМ (desktop слева, mobile справа) - БЕЗ стека!
4. **Интенсивность**: Умеренная (-50px/-120px parallax, 1.05-1.08 scale)
5. **Subtitle**: Полностью убрать из компонента

---

## Детальный план реализации

Весь детальный план с примерами кода находится в основном файле плана:
**`C:\Users\Daniil\.claude\plans\vivid-tinkering-map.md`**

### Критические файлы для изменения:
1. `app/(home)/components/projects/ProjectImages.tsx` - полная переработка
2. `app/(home)/components/projects/ProjectsBlock.tsx` - импорт и использование

### Референсы для паттернов:
- `app/about/components/TimelineCard.tsx` - gsap.context, killTweensOf, декоративная сетка
- `app/(home)/components/contact/hooks/useContactAnimations.ts` - stagger, ScrollTrigger
- `components/hooks/useMagnet.ts` - hover паттерны

---

## Технические требования

✅ **Performance**: 60 FPS, `prefers-reduced-motion`, `gsap.context()` cleanup

✅ **Responsive**: Desktop (≥768px) - параллакс коллаж, Mobile (<768px) - side-by-side БЕЗ параллакса

✅ **Accessibility**: `aria-hidden`, alt текст, reduced motion

✅ **Optimization**: Next.js Image с `fill` + правильные `sizes`, aspect-video для CLS
