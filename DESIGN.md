---
name: Celestial Intelligence
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  sidebar-width: 17.5rem
  content-max-width: 84rem
---

## Brand & Style

This design system establishes an academic yet hyper-modern institutional intelligence platform. It merges deep cosmic tranquility with the crisp, deterministic rigor required by high-performing academic operations. The system avoids noisy neon cyberpunk clichés, instead favoring a restrained "deep-space observatory" atmosphere: deep charcoal canvases, crystalline optical overlays, finely tuned atmospheric light bleeds, and precise structural metadata.

### Target Audience & Core Feeling
- **Audience:** Forward-thinking university students, academic advisors, campus facility coordinators, and faculty researchers.
- **Emotional Resonance:** Quiet confidence, mental clarity, high cognitive control, and dependable academic truth. The user should feel as though they possess an omniscient, clutter-free situational lens over their entire campus experience.

### Aesthetic Foundation
- **Celestial Dark Glass:** Low-opacity layered surfaces (1–8% white tinting) settled over deep cold-charcoal voids, softened with precision backdrop blurs.
- **Spectral Workflow Accents:** Purposeful chromatic signatures reserved strictly for intent domains (curriculum, campus logistics, time-sensitive schedules).
- **Sub-Pixel Micro-Borders:** Ultra-crisp 1px boundary lines with directional ambient light highlights that create real structural boundaries without visual heaviness.

## Colors

The system is constructed natively for dark environments. Color is used sparingly to differentiate workflows, distinguish institutional provenance, and indicate immediate operational states.

### Spatial Foundation
- **Canvas Deep (Space):** `#080C14` — Base application foundation and full-bleed layout canvas.
- **Surface Void (Layer 0):** `#0B0F19` — Default pane and page backing.
- **Surface Layer 1 (Base Panel):** `#111827` (or `rgba(17, 24, 39, 0.7)` with blur).
- **Surface Layer 2 (Elevated Card):** `#1E293B` (or `rgba(30, 41, 59, 0.65)`).
- **Surface Layer 3 (Floating Overlay / Popover):** `#243247` (or `rgba(36, 50, 71, 0.85)`).

### Workflow Accent Ensembles
1. **Syllabus & Coursework (Knowledge RAG):**
   - Base: Violet `#8B5CF6` / Indigo `#6366F1`
   - Background Glow/Tint: `rgba(139, 92, 246, 0.12)`
   - Border Ambient: `rgba(139, 92, 246, 0.35)`
2. **Campus Information & Directory (Live FAQ):**
   - Base: Sky `#0EA5E9` / Vivid Cyan `#06B6D4`
   - Background Glow/Tint: `rgba(6, 182, 212, 0.12)`
   - Border Ambient: `rgba(6, 182, 212, 0.35)`
3. **Schedules, Conflicts & Timetables:**
   - Active/Normal: Emerald `#10B981` | Conflict/Urgent: Amber `#F59E0B`
   - Background Glow/Tint: `rgba(16, 185, 129, 0.12)` or `rgba(245, 158, 11, 0.12)`
   - Border Ambient: `rgba(16, 185, 129, 0.35)` or `rgba(245, 158, 11, 0.4)`

### Source Provenance Hierarchy
- **Official Campus Authority:** Emerald-Cyan dual-gradient accents (`#10B981` to `#06B6D4`) paired with an authoritative shield badge. This indicates validated registrar, departmental, or institutional feeds.
- **Community / User Uploaded Material:** Violet-Indigo accents (`#8B5CF6` to `#6366F1`) signifying peer-contributed notes, syllabus scrapes, or personal documents.

### Text & Contrast Hierarchy
- **High Emphasis:** `#F9FAFB` (98% contrast against canvas)
- **Medium Emphasis:** `#94A3B8` (Slate 400, for body reading and sub-headers)
- **Muted / Metadata:** `#64748B` (Slate 500, timestamps, breadcrumbs, table footers)
- **Ghost Line / Subtle Border:** `rgba(255, 255, 255, 0.08)`

## Typography

The typography couples the forward-facing, sculptured geometry of Plus Jakarta Sans for titles and system anchors with the industrial neutrality of Inter for reading efficiency, dense queries, and parsed citations.

### Principles
- **Title Tracking:** Tighten tracking progressively as scale increases (-0.03em at display sizes) to unify cosmic-scale letterforms and preserve editorial polish.
- **Reading Comfort:** Body text runs on Inter at 14px and 16px with comfortable line height multipliers (1.55–1.6x) to reduce strain during extended study sessions.
- **System Labels & Badges:** Upper-micro labels (`label-sm`) feature expanded tracking (+0.04em) and medium weights to ensure immediate scanability at small scales.
- **Monospace Integration:** Monospaced elements (`JetBrains Mono`) are reserved for course registration numbers (CRNs), section codes, room coordinate coordinates, and timestamp logs.

## Layout & Spacing

The layout is built on an adaptable 12-column responsive fluid grid structured inside a constrained viewport maximum (`84rem` / 1344px) to retain visual focus and prevent cognitive scattering on ultra-wide monitors.

### Breakpoints & Flow
- **Mobile (0 – 639px):** 4 columns, `1rem` margins, `1rem` gutters. Persistent bottom utility bar, collapse side-rail navigation to full-screen drawers.
- **Tablet (640px – 1023px):** 8 columns, `2rem` margins, `1.25rem` gutters. Collapsed icon-rail navigation (`4.5rem`).
- **Desktop (1024px+):** 12 columns, `3rem` margins, `1.5rem` gutters. Persistent left intelligence navigation (`17.5rem`) alongside contextual, split-pane workflow views (e.g., chat/RAG on the left, interactive calendar/syllabus viewer on the right).

### Rhythmic Discipline
Use strict multiples of 4px (`0.25rem`). Component internals leverage `space-xs` (8px) and `space-sm` (12px), while cards and glass modules use `space-lg` (24px) internal padding to maintain breathing room amidst dense data visualizations.

## Elevation & Depth

Visual depth is achieved through translucent material tiers and radial luminescence rather than traditional opaque shadows.

### Atmospheric Glass Architecture
- **Tier 0 (Deep Ground):** Flat `#080C14` background with ambient cosmic radial gradients placed strategically behind active panels (`radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.07) 0%, transparent 70%)`).
- **Tier 1 (Panels & Grouping Containers):**
  - Background: `rgba(17, 24, 39, 0.65)`
  - Filter: `backdrop-blur-md` (12px to 16px blur)
  - Border: 1px solid `rgba(255, 255, 255, 0.07)`
  - Shadow: None or `0 4px 20px -2px rgba(0, 0, 0, 0.5)`
- **Tier 2 (Cards & Actionable Units):**
  - Background: `rgba(30, 41, 59, 0.55)`
  - Filter: `backdrop-blur-lg` (16px to 20px blur)
  - Border: 1px solid `rgba(255, 255, 255, 0.1)`
  - Top Border Accent: Optional 1px gradient sheen (`rgba(255, 255, 255, 0.18)` fading to `rgba(255, 255, 255, 0.02)`)
  - Shadow: `0 10px 30px -10px rgba(0, 0, 0, 0.6)`
- **Tier 3 (Floating Overlays, Modals, Menus):**
  - Background: `rgba(24, 33, 47, 0.92)`
  - Filter: `backdrop-blur-xl` (24px blur)
  - Border: 1px solid `rgba(255, 255, 255, 0.14)`
  - Shadow: `0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)`

### Glow Focus System
Interactive components earn glow halos when active or focused:
- Primary Actions: `box-shadow: 0 0 20px -3px rgba(59, 130, 246, 0.45)`
- Syllabus/RAG: `box-shadow: 0 0 20px -3px rgba(139, 92, 246, 0.45)`
- Campus FAQ: `box-shadow: 0 0 20px -3px rgba(6, 182, 212, 0.45)`
- Conflict/Alert: `box-shadow: 0 0 20px -3px rgba(245, 158, 11, 0.45)`

## Shapes

The design system maintains a balanced `roundedness: 2` scale, pairing technical precision with approachable curvature.

- **Base Radius (`rounded-md`, 0.5rem / 8px):** Applied to internal micro-elements, input controls, table row selections, workflow tags, and dropdown items.
- **Card Radius (`rounded-lg`, 1rem / 16px):** Applied to primary content cards, analytics widgets, timetable blocks, and floating chat prompts.
- **Container Radius (`rounded-xl`, 1.5rem / 24px):** Applied to main workspace viewports, conversational glass panels, and modal shells.
- **Pill Geometry (`rounded-full`):** Reserved exclusively for dynamic status chips, source verification shields, avatar markers, and floating search query pills.

## Components

### Buttons
- **Primary Action:** Solid gradient (`linear-gradient(135deg, #3B82F6, #2563EB)`), high-contrast white text, subtle upper inner light stroke (`inset 0 1px 0 rgba(255, 255, 255, 0.25)`), `0.5rem` radius, hover glow `rgba(59, 130, 246, 0.4)`.
- **Secondary (Glass):** `rgba(255, 255, 255, 0.05)` surface, 1px border `rgba(255, 255, 255, 0.1)`. Hover shifts background to `rgba(255, 255, 255, 0.09)` and border to `rgba(255, 255, 255, 0.2)`.
- **Ghost:** Transparent canvas, text in `#94A3B8`, hover states elevate to `#F9FAFB` with `rgba(255, 255, 255, 0.05)` backing.

### Workflow & Provenance Badges
- **General Workflow Badges:** Height 24px, pill-shaped, `0.75rem` text (`label-sm`), uppercase with +0.04em tracking. Includes a 6px saturated indicator dot:
  - *Syllabus & Notes:* Background `rgba(139, 92, 246, 0.12)`, text `#C4B5FD`, dot `#8B5CF6`.
  - *Campus FAQ:* Background `rgba(6, 182, 212, 0.12)`, text `#67E8F9`, dot `#06B6D4`.
  - *Timetable / Exams:* Background `rgba(16, 185, 129, 0.12)`, text `#6EE7B7`, dot `#10B981`.
- **Provenance Shields:**
  - *Official Campus Source:* Pill badge with left-anchored SVG shield; border `rgba(16, 185, 129, 0.3)`; background `rgba(16, 185, 129, 0.08)`; text `#34D399`.
  - *Uploaded Study Material:* Pill badge with document indicator; border `rgba(139, 92, 246, 0.3)`; background `rgba(139, 92, 246, 0.08)`; text `#A78BFA`.

### Input Fields & Prompt Bars
- **Campus Intelligence Search / Prompt Bar:** Large floating glass bar (`3.25rem` height), `rounded-xl`, background `rgba(17, 24, 39, 0.85)`, border `rgba(255, 255, 255, 0.12)`, backdrop-blur-lg. Left-hand dynamic icon that shifts color according to active query mode (Violet for syllabus search, Cyan for general campus info).
- **Standard Inputs:** Height `2.5rem`, `rounded-md`, background `rgba(15, 23, 42, 0.6)`, border `rgba(255, 255, 255, 0.08)`. Focus shifts border to `#3B82F6` with ring `rgba(59, 130, 246, 0.2)`.

### Cards & Modules
- Structured on Tier 2 Glass. Headers feature 14px bold section labels with subtle right-aligned source or freshness indicators. Includes a top-edge 1px specular line highlighting the celestial light source from above.

### Checkboxes & Radio Controls
- **Checkboxes:** `1rem` x `1rem`, `rounded-sm` (4px), dark border `rgba(255, 255, 255, 0.2)`. Checked state transitions to full `#3B82F6` fill with an optical white checkmark icon and subtle blue glow.
- **Radio Buttons:** Circular, nested white dot inside a vibrant primary circle when selected.

### Timetable Conflict & Schedule Tiles
- Compact card tiles positioned on calendar grids:
  - *Standard Session:* Deep slate background, left 3px indicator border in `#3B82F6` or `#06B6D4`.
  - *Collision / Exam Warning:* Background `rgba(245, 158, 11, 0.08)`, border `rgba(245, 158, 11, 0.4)`, text warning `#FBBF24` with pulse icon.