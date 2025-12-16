# Portfolio Design System

Documentation of visual language and styles for a Next.js 15 project with GSAP animations and Tailwind CSS 4.

---

## 1. Color Scheme

### Color Format
The project uses **OKLCH** — a modern color format with more uniform lightness distribution.

### Dark Theme (default)
Dark theme is fixed in `className='dark'` on the `<html>` element ([layout.tsx:16](app/layout.tsx#L16)).

### Base Colors

| Purpose | OKLCH Value | Description |
|---------|-------------|-------------|
| **Background** | `oklch(0.141 0.005 285.823)` | Dark blue background |
| **Foreground** | `oklch(0.985 0 0)` | White text |
| **Primary** | `oklch(0.92 0.004 286.32)` | Light gray |
| **Card** | `oklch(0.21 0.006 285.885)` | Dark gray for cards |
| **Muted** | `oklch(0.274 0.006 286.033)` | Muted text |
| **Border** | `oklch(1 0 0 / 10%)` | Semi-transparent white |

### Accent Colors

| Color | RGBA | Usage |
|-------|------|-------|
| **Cyan (primary accent)** | `rgba(34, 211, 238, *)` | Accents, glow effects, borders |
| **Cyan/15** | `rgba(34, 211, 238, 0.15)` | Tags/badges background |
| **Cyan/30** | `rgba(34, 211, 238, 0.30)` | Element borders |
| **Cyan/50** | `rgba(34, 211, 238, 0.50)` | Hover states |

### CSS Variables
Defined in [globals.css:47-114](app/globals.css#L47-L114):
- `--background`, `--foreground`, `--primary`, `--secondary`
- `--muted`, `--accent`, `--border`, `--destructive`
- `--card`, `--popover`, `--input`, `--ring`

---

## 2. Typography

### Fonts

| Name | Variable | Purpose |
|------|----------|---------|
| **Geist Sans** | `var(--font-geist-sans)` | Primary font |
| **Geist Mono** | `var(--font-geist-mono)` | Monospace (code) |

Defined in [globals.css:10-11](app/globals.css#L10-L11).

### Text Sizes

| Tailwind Class | Size | Usage |
|----------------|------|-------|
| `text-xs` | 0.75rem | Small text |
| `text-[9px]` | 9px | Tags (collapsed) |
| `text-[10px]` | 10px | Technologies in cards |
| `text-sm` | 0.875rem | Descriptions |
| `text-base` | 1rem | Body text |
| `text-lg` | 1.125rem | Subheadings |
| `text-xl` | 1.25rem | Buttons |
| `text-2xl` | 1.5rem | Buttons (sm+) |
| `text-3xl` | 1.875rem | Headings |
| `text-4xl` | 2.25rem | Headings (sm+) |
| `text-5xl` | 3rem | Headings (md+) |

### Font Weights
- `font-medium`: 500 (body text)
- `font-semibold`: 600 (buttons)
- `font-bold`: 700 (headings)
- `font-extrabold`: 800 (large headings)

---

## 3. Spacing & Layout

### Container
Centered container with padding:
```css
container: { center: true, padding: '2rem' }
```

### Breakpoints (Tailwind)
| Prefix | Minimum Width |
|--------|---------------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

### Border Radius System
Defined in [globals.css:41-44](app/globals.css#L41-L44):

| Size | Value | Class |
|------|-------|-------|
| **Base** | `0.625rem` (10px) | `--radius` |
| **SM** | `calc(var(--radius) - 4px)` | `--radius-sm` |
| **MD** | `calc(var(--radius) - 2px)` | `--radius-md` |
| **LG** | `var(--radius)` | `--radius-lg` |
| **XL** | `calc(var(--radius) + 4px)` | `--radius-xl` |

---

## 4. UI Components

### 4.1 Buttons

#### MagneticButton
Magnetic button with cursor attraction ([MagneticButton.tsx](components/ui/custom/MagneticButton.tsx)).

**Styles:**
```tsx
bg-black
border-2 border-white/10
rounded-full
px-9 sm:px-12 py-4 sm:py-5
backdrop-blur-md
```

**Animation:**
- Duration: 0.7-0.9s
- Easing: `power2.out`, `power1.out`
- Effects: translation (max 120px), rotation (x 0.06), scale (1 → 1.06)

#### ContactMeButton
Vertical slide effect on hover ([ContactMeButton.tsx](components/ui/custom/ContactMeButton.tsx)).

**Styles:**
```tsx
border border-white/20
hover:border-white/40
rounded-full
px-5 py-1.5
transition-colors duration-300
```

**Animation:**
- Duration: 0.4s
- Easing: `power2.inOut`
- Effect: text slides up (-100%), new text appears from bottom (100% → 0)

---

### 4.2 Cards (TimelineCard)

Interactive cards with expand/collapse animation ([TimelineCard.tsx](app/about/components/TimelineCard.tsx)).

**Styles:**
```tsx
bg-gradient-to-br from-white/10 to-white/5
border border-cyan-500/30
hover:border-cyan-500/50
rounded-2xl (expanded) | rounded-lg (collapsed)
backdrop-blur-sm
```

**Shadows:**
- Default: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2)`
- Expanded: `box-shadow: 0 8px 32px rgba(34, 211, 238, 0.2)`

**Expand/collapse animation:**
- Duration: 0.6-0.8s
- Easing: `power2.out`, `power2.inOut`
- **IMPORTANT**: use `gsap.killTweensOf()` before animation
- **maxHeight** instead of height: `0px` ↔ `1000px`
- Sequence: content fades out → card shrinks (delay 0.1s)

---

### 4.3 Tags / Badges

**Styles:**
```tsx
bg-cyan-500/15
border border-cyan-500/30
rounded-full (or rounded-lg for technologies)
text-[9px] sm:text-xs
font-medium text-cyan-300
px-2 py-0.5 (small) | px-2 py-1 (large)
```

---

## 5. Effects

### 5.1 Shadows

| Type | CSS | Usage |
|------|-----|-------|
| **Cards** | `0 4px 12px rgba(0, 0, 0, 0.2)` | Default state |
| **Accent** | `0 8px 32px rgba(34, 211, 238, 0.2)` | Expanded cards |
| **Drop shadow** | `drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]` | Icons with glow |

### 5.2 Gradients

**Radial (custom utility):**
```css
.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}
```

**Text:**
```tsx
bg-gradient-to-r from-white to-cyan-200
bg-clip-text text-transparent
```

**Background:**
```tsx
bg-gradient-to-b from-slate-950 via-slate-900 to-black
bg-gradient-to-br from-white/10 to-white/5
```

### 5.3 Blur

| Class | Value | Usage |
|-------|-------|-------|
| `backdrop-blur-sm` | 4px | Cards |
| `backdrop-blur-md` | 12px | Buttons |
| `blur-xl` | 24px | Decorative glow effects |

### 5.4 Border Radius Patterns

| Element | Class | Size |
|---------|-------|------|
| **Cards** | `rounded-2xl` | 20px |
| **Cards (collapsed)** | `rounded-lg` | 16px |
| **Buttons** | `rounded-full` | 9999px |
| **Tags** | `rounded-full` or `rounded-lg` | 9999px / 16px |

---

## 6. Animations (GSAP)

### 6.1 Timing

| Speed | Duration | Usage |
|-------|----------|-------|
| **Fast** | 0.4-0.6s | Hover, clicks |
| **Medium** | 0.7-0.9s | Expand/collapse |
| **Slow** | 1.2s+ | Background movements |

### 6.2 Easing Functions

| Function | Character | Usage |
|----------|-----------|-------|
| `power1.out` | Soft deceleration | Smooth transitions |
| `power2.out` | Medium deceleration | Standard animations |
| `power2.inOut` | Smooth acceleration/deceleration | Expand/collapse |
| `back.out(1.2)` | Light bounce | Icons |
| `back.out(1.3)` | Medium bounce | Accent elements |
| `sine.inOut` | Very smooth | Looped animations |

### 6.3 Animation Patterns

#### Expand/Collapse ([TimelineCard.tsx:102-143](app/about/components/TimelineCard.tsx#L102-L143))

```typescript
const toggleExpand = () => {
  // 1. Remove conflicts
  gsap.killTweensOf([card, expanded])

  // 2. Timeline for synchronization
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // 3. Sequence
  tl.to(expanded, { opacity: 0, maxHeight: '0px', duration: 0.6 }, 0)
  tl.to(card, { borderRadius: '16px', duration: 0.5 }, 0.1) // 0.1s delay
}
```

**Key Points:**
- `gsap.killTweensOf()` before each animation
- `maxHeight` instead of `height` for smoothness
- Sequential delays via offset parameter

#### Hover Effects

```typescript
gsap.to(element, {
  scale: 1.05-1.1,
  rotation: 15-360,
  duration: 0.6-0.9,
  ease: 'back.out(1.2)'
})
```

#### ScrollTrigger ([TimelineCard.tsx:44-52](app/about/components/TimelineCard.tsx#L44-L52))

```typescript
ScrollTrigger.create({
  trigger: cardRef.current,
  start: 'top 90%', // Cards
  // start: 'top 85%', // Timeline dots
  toggleActions: 'play none none reverse',
  onEnter: () => { /* animation */ }
})
```

**Important Thresholds:**
- **90%** — cards (for early triggering on last elements)
- **85%** — timeline dots
- **70%** — auto-expand cards

---

## 7. 3D and Visual Effects

### 7.1 AnimatedBg (SVG)

Decorative animated background with geometric shapes ([AnimatedBg.tsx](components/ui/custom/animated/AnimatedBg.tsx)).

**Variants:**
- `rings` — concentric circles
- `grid` — grid + circles
- `orbits` — ellipses with orbits
- `aurora` — radial gradient
- `gooey` — "sticky" drops

**Parameters:**
```typescript
tint='rgba(255,255,255,0.10)'      // stroke color
accent='rgba(34,211,238,0.35)'     // accent color
particles={true}                    // fireflies
```

**Animations:**
- Ring rotation: 40-48s, `ease: 'none'`
- Stroke pulsing: 6-10s, `ease: 'sine.inOut'`
- Particle movement: 12-17s in orbit via sin/cos

**Optimization:**
- Pause on tab hide (`visibilitychange`)
- `memo()` to prevent re-renders

### 7.2 AnimatedStarsBg (Canvas)

Starry sky with connections ([AnimatedStarsBg.tsx](components/ui/custom/animated/AnimatedStarsBg.tsx)).

**Parameters:**
- 100 stars with random movement
- Connection of nearest stars with lines (distance < 150px)
- Radial gradient: `rgba(34,211,238,0.08)` → `rgba(0,0,0,0)`

**Canvas animation:**
- `requestAnimationFrame` for smoothness
- Responsive resize listener

### 7.3 Sphere (React Three Fiber)

3D sphere with distortions ([Sphere.tsx](components/ui/custom/3D/Sphere.tsx)).

**Technologies:**
- `@react-three/fiber` — Three.js for React
- `@react-three/drei` — helper components
- `MeshDistortMaterial` — surface distortion
- Wireframe mode with glow effect

**Parameters:**
- Automatic rotation
- Responsiveness to cursor movement (optional)

### 7.4 MouseTrail

Cursor trail ([MouseTrail.tsx](components/ui/custom/MouseTrail.tsx)).

**Effect:**
- Following with delay (easing)
- Radial gradient glow
- `pointer-events: none` for transparency

---

## 8. Accessibility

### Aria Attributes

**Interactive elements:**
```tsx
aria-label="Contact"
aria-label="Go to contacts"
```

**Decorative elements:**
```tsx
aria-hidden="true"
```

### Reduced Motion

Checking user preferences:
```typescript
const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
if (reduce) return // disable animations
```

Used in:
- [AnimatedBg.tsx:26-31](components/ui/custom/animated/AnimatedBg.tsx#L26-L31)
- All GSAP-animated components

---

## 9. Performance

### 9.1 Optimizations

**GPU Acceleration (GSAP):**
```typescript
gsap.set(element, { force3D: true })
```

**will-change for animations:**
```tsx
className="will-change-transform"
```

**Dynamic import for heavy components:**
```typescript
const SkillsPyramid = dynamic(() => import('@/components/ui/custom/3D/SkillsPyramid'), {
  loading: () => <Loader />,
  ssr: false, // Three.js doesn't work on server
})
```
Savings: ~214KB ([AboutSkills.tsx:8-18](app/about/components/AboutSkills.tsx#L8-L18))

**Pause animations on tab hide:**
```typescript
document.addEventListener('visibilitychange', () => {
  animations.forEach(anim =>
    document.hidden ? anim.pause() : anim.resume()
  )
})
```

### 9.2 Patterns

| Pattern | Purpose |
|---------|---------|
| `memo()` | Prevent re-renders of heavy components (AnimatedBg) |
| `ssr: false` | Disable SSR for Three.js components |
| `passive: true` | Non-blocking event listeners |
| Debounce | Optimize resize/scroll listeners |

---

## 10. Overall Visual Language

### 10.1 Theme: Cyber/Futuristic

**Characteristics:**
- Predominance of dark blue/black shades
- Cyan accents for contrast
- Transparent glass effects (glassmorphism)
- Geometric shapes: circles, grids, orbits, ellipses
- 3D elements and physics (SkillsPyramid with Rapier)

### 10.2 Design Principles

#### 1. Smoothness
All animations are soft, without abrupt transitions. Using easing functions `power2.out`, `sine.inOut`.

#### 2. Depth
Layering through:
- Shadows of varying intensity
- Backdrop blur
- Gradients with transparency
- z-index hierarchy

#### 3. Contrast
Bright cyan accents on dark background to draw attention to key elements.

#### 4. Breathing
Pulsing and subtle movements create a sense of "liveliness":
- Pulsing glow effects
- Slow ring rotation
- Star drift

#### 5. Spacing
Sufficient spacing between elements for airiness:
- Card padding: `p-6`
- Gap between elements: `gap-2`, `gap-3`, `gap-4`
- Margins between sections: `mb-8`, `mb-12`

---

## 11. References

Design inspired by:
1. **Primary**: [dumemearts.com/about](https://dumemearts.com/about)
2. **Secondary**: [billodesign.webflow.io](https://billodesign.webflow.io/#about-me)

---

## Key Files

| File | Purpose |
|------|---------|
| [globals.css](app/globals.css) | CSS variables, color scheme |
| [tailwind.config.ts](tailwind.config.ts) | Tailwind configuration |
| [MagneticButton.tsx](components/ui/custom/MagneticButton.tsx) | Magnetic button |
| [ContactMeButton.tsx](components/ui/custom/ContactMeButton.tsx) | Button with slide effect |
| [TimelineCard.tsx](app/about/components/TimelineCard.tsx) | Expand/collapse cards |
| [AnimatedBg.tsx](components/ui/custom/animated/AnimatedBg.tsx) | SVG background animations |
| [AnimatedStarsBg.tsx](components/ui/custom/animated/AnimatedStarsBg.tsx) | Canvas stars |
| [Sphere.tsx](components/ui/custom/3D/Sphere.tsx) | 3D sphere |
| [useMasterTl.ts](components/hooks/useMasterTl.ts) | Central GSAP timeline |

---

**Version:** 1.0
**Last Updated:** 2025-12-06
