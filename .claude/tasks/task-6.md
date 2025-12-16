# Task-6 - implementation of individual project pages

Your task is to implement a separate page for each project along the route `/projects/[slug]`.

---

## Page structure
It is important to read from top to bottom, as the elements are described, they should be located on the page.

1. **Hero Section**: A large header that contains the name of the project. And to the right of the project name there will be a short description or even the type of the project. For example, an E-commerce app is an online store
2. **Full description of the project**: It includes:
   - 2.1 **The exact description of the application**
   - 2.2 **Description of my experience in developing this application or a module of this application**
   - 2.3 **Career achievements**
   - 2.4 **Personal growth achievements**
   - 2.5 **Technologies**
3. **Screenshots, collages, photos**

---

## Key Features
1. **Full description**: Each project must contain complete information about the project
2. **Breadcrumbs**: Needed for a good UX
3. **UX/UI**: The page must combine the style of the site - [DesignSystem](../project/DESIGN_SYSTEM.md)
4. **Optimization**: Everything should work very fast, launch /optimization-review
5. **Animations**: Beautiful animations are needed, as in [ProjectsPage](../../app/projects/page.tsx)

---

## Clarification-based solutions

✅ **Screenshots**: Use placeholders to get started
✅ **Lightbox**: Custom solution based on GSAP (stylization for the design system)
✅ **Expand/Collapse**: NOT required - all sections are always expanded
✅ **Navigation**: Supports sorting by date/complexity/hours (default: by date)
✅ **Project data**: Fill in the extended fields with realistic content based on the existing structure

---

## Implementation plan

### 1. Extending data types

#### 1.1 Update `types/project.ts`
Add new fields:
- `slug: string` - URL-friendly identifier
- `detailedDescription: string` - 2.1 Exact description of the application
- `developmentExperience: string` - 2.2 Development Experience
- `careerAchievements: string[]` - 2.3 Career Achievements
- `personalGrowth: string[]` - 2.4 Personal Growth Achievements
- `screenshots: string[]` - 2.5 Screenshots/photos
- `hoursSpent: number` - The number of hours (for sorting)
- `complexity: number` - Complexity 1-10 (for sorting)

#### 1.2 Update `data/projects.json`
Fill in all new fields for 10 projects with realistic content.

---

### 2. File Architecture

```
app/projects/[slug]/
  ├── page.tsx                    # Dynamic route (SSG)
  └── components/
      ├── ProjectHero.tsx         # Hero-section with breadcrumbs
      ├── ProjectBreadcrumbs.tsx  # Navigation Crumbs
      ├── ProjectContent.tsx      # Container for 5 sections
      ├── ProjectSection.tsx      # Reusable section
      ├── ProjectTechStack.tsx    # Technology Visualization
      ├── ProjectGallery.tsx      # Screenshot Gallery
      ├── ProjectLightbox.tsx     # Custom lightbox on GSAP
      └── ProjectNavigation.tsx   # Navigation prev/next

lib/
  └── projects.ts                 # Data Management Utilities
```

---

### 3. Components

#### ProjectHero.tsx
- Breadcrumbs (Home > Projects > [Title])
- Gradient header (text-5xl–7xl)
- On the right: project type + badge status
- Short description
- Metadata: year, team, duration, link
- **Animations**: fade in + slide up (GSAP)

#### ProjectContent.tsx
Container for 5 sections:
1. About the project (`detailedDescription')
2. Development Experience (`developmentExperience')
3. Career achievements (`careerAchievements[]`)
4. Personal growth (`personalGrowth[]`)
5. Technologies (`technologies[]` + `features[]`)

#### ProjectSection.tsx
- Always expanded (without expand/collapse)
- Two options: text or list
- **Styles**: `bg-gradient-to-br from-white/10 to-white/5`, `border-cyan-500/30`, `rounded-2xl`
- **Animations**: ScrollTrigger `start: 'top 90%'`, fade + slide up

#### ProjectGallery.tsx + ProjectLightbox.tsx
- Grid: 2 md columns, 3 xl
- Custom GSAP lightbox with animations
- Keyboard navigation: Escape, ArrowLeft, ArrowRight
- Next.js Image with lazy loading

#### ProjectNavigation.tsx
- Magnetic buttons (pattern from MagneticButton.tsx)
- Sort: `'date' | 'complexity' | 'hours'`
- Getting prev/next via `getAdjacentProjects(slug, sortBy)`

---

### 4. Utilities (lib/projects.ts)

```typescript
getAllProjects() → Project[]
getProjectBySlug(slug: string) → Project | null
getAdjacentProjects(slug: string, sortBy?: SortBy) → { prev, next }
```

Sort by date (default), complexity, or hours.

---

### 5. Project detail page (app/projects/[slug]/page.tsx)

- **SSG**: `generateStaticParams()` for all 10 projects
- **SEO**: `generateMetadata()` with dynamic meta tags
- **Structure**:
```tsx
<AnimatedGrid />
<ProjectHero project={project} />
<ProjectContent project={project} />
<ProjectGallery screenshots={project.screenshots} />
<ProjectNavigation prev={prev} next={next} />
```

---

### 6. Animations (GSAP)

- **Hero**: `y: -30 → 0, opacity: 0 → 1` (duration 0.8s)
- **Sections**: ScrollTrigger `start: 'top 90%'`, stagger 0.1s
- **Gallery**: stagger appearance of images
- **Lightbox**: scale + fade animations
- **Hover**: raising the cards (y: -8) + glow effect
- Checking `prefers-reduced-motion` in all components

---

### 7. Optimization

- ✅ Next.js Image with lazy loading
- ✅ Component memoization (memo)
- ✅ GPU acceleration (`force3D: true`, `will-change-transform`)
- ✅ SSG for all pages
- ✅ Responsive images (sizes attribute)
- ✅ After implementation: run `/optimization-review`

---

### 8. Accessibility

- `aria-label` on navigation and sections
- `aria-hidden` on decorative elements
- Keyboard navigation in lightbox
- Checking `prefers-reduced-motion`

---

### 9. Implementation procedure

**Step 1**: Data
- [ ] Update `types/project.ts`
- [ ] Update `data/projects.json` (10 projects)

**Step 2**: Utilities
- [ ] Create `lib/projects.ts`
- [ ] Implement getAllProjects, getProjectBySlug, getAdjacentProjects

**Step 3**: Basic Components
- [ ] ProjectBreadcrumbs.tsx
- [ ] ProjectHero.tsx
- [ ] ProjectSection.tsx

**Step 4**: Content
- [ ] ProjectContent.tsx
- [ ] ProjectTechStack.tsx

**Step 5**: Gallery
- [ ] ProjectGallery.tsx
- [ ] ProjectLightbox.tsx

**Step 6**: Navigation
- [ ] ProjectNavigation.tsx

**Step 7**: Project detail page
- [ ] `app/projects/[slug]/page.tsx`
- [ ] generateStaticParams + generateMetadata

**Step 8**: Animations
- [ ] GSAP animations in Hero
- [ ] ScrollTrigger in sections
- [ ] Hover effects

**Step 9**: Testing and Optimization
- [ ] Checking all 10 projects
- [ ] Checking adaptability
- [ ] Checking accessibility
- [ ] Launch of `/optimization-review`

---

## Reuse of components

- **ProjectItem.tsx** → Badges for statuses, technology tags
- **TimelineCard.tsx** → GSAP animations, ScrollTrigger patterns
- **MagneticButton.tsx** → Magnetism for navigation
- **AnimatedGrid.tsx** → Background effect
- **AboutHero.tsx** → Gradient text for headings

---

## Completion Checklist

- [ ] All 10 projects have a slug in data/projects.json
- [ ] All projects have extended fields
- [ ] generateStaticParams generates all slugs
- [ ] Breadcrumbs are displayed correctly
- [ ] The prev/next navigation works
- [ ] The gallery displays screenshots
- [ ] Lightbox works (opening/closing/navigation)
- [ ] GSAP animations work smoothly
- [ ] prefers-reduced-motion is checked
- [ ] Adaptability on all breakpoints
- [ ] Accessibility: aria-labels, keyboard navigation
- [ ] Next.js Image optimizes images
- [ ] /optimization-review passed
- [ ] Lighthouse score > 90

---

**Status**: The plan is ready for implementation
**Detailed plan**: [validated-gliding-metcalfe.md](../../.claude/plans/validated-gliding-metcalfe.md)