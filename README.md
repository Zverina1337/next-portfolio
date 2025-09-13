# 🚀 next-portfolio-anim-starter

Starter monorepo-like structure for a **single Next.js 14 App Router** app focused on **animations**: GSAP + ScrollTrigger, **react-three-fiber (Three.js)**, **shadcn/ui**, **Tailwind CSS**, custom cursor, magnetic buttons, and a sample scroll‑pinned 3D scene.

---

## 🗂️ Directory tree
```
next-portfolio-anim-starter/
├─ app/
│  ├─ api/
│  │  └─ contact/route.ts
│  ├─ (site)/
│  │  └─ page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ anim/HeroReveal.tsx
│  ├─ canvas/Scene.tsx
│  ├─ fx/Cursor.tsx
│  ├─ fx/MagneticButton.tsx
│  ├─ misc/SectionNav.tsx
│  └─ ui/  (shadcn copied components)
│     ├─ button.tsx
│     ├─ dialog.tsx
│     ├─ tooltip.tsx
│     └─ switch.tsx
├─ lib/
│  ├─ gsap.ts
│  ├─ media.ts
│  └─ three.ts
├─ public/
│  ├─ models/ (put .glb/.hdr)
│  └─ videos/ (loop previews)
├─ styles/
│  └─ globals.css  (aliased from app/globals.css)
├─ tailwind.config.ts
├─ tsconfig.json
├─ next.config.mjs
└─ README.md
```

---

# 📘 README.md 

---
```md
# next-portfolio-anim-starter

## Prerequisites
- Node 18+
- pnpm (recommended)

## Install
pnpm i

## Dev
pnpm dev

Open http://localhost:3000

## Where to edit first
- app/(site)/page.tsx – sections & layout
- components/canvas/Scene.tsx – your 3D scene (replace mesh with GLB)
- components/anim/HeroReveal.tsx – hero text reveal
- components/fx/Cursor.tsx – custom cursor
- components/fx/MagneticButton.tsx – magnetic CTA
- tailwind.config.ts – theme tokens

## Add your model
Put GLB into public/models and import via drei/useGLTF.

## Production
pnpm build && pnpm start
```