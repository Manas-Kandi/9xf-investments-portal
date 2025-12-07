# 9xf Capital Design System

## Typography

### Font Families

| Token | Font | Usage |
|-------|------|-------|
| `--font-manrope` | Manrope | Primary font for all UI text |
| `--font-marck` | Marck Script | Logo "f" character only |
| `--font-mono` | JetBrains Mono | Code, version numbers, technical data |

### Logo Typography

The "9xf Capital" logo uses a custom typographic treatment:

| Character | Font | Weight | Size |
|-----------|------|--------|------|
| **9** | Manrope | Bold (700) | Base size |
| **x** | Manrope | Light (300) | 0.67x base size |
| **f** | Marck Script | Medium (500) | Same as 9 |
| **Capital** | Manrope | Semibold (600) | Same as 9 |

- Letter spacing for "9xf": `-0.02em` (-2%)
- Alignment: baseline

### Type Scale

| Element | Size (Mobile) | Size (Desktop) | Weight | Line Height |
|---------|---------------|----------------|--------|-------------|
| H1 (Hero) | 36px (`text-4xl`) | 60px (`text-6xl`) | Bold (700) | 1.1 |
| H2 | 30px (`text-3xl`) | 48px (`text-5xl`) | Bold (700) | 1.2 |
| H3 | 24px (`text-2xl`) | 30px (`text-3xl`) | Semibold (600) | 1.3 |
| Body Large | 16px (`text-base`) | 18px (`text-lg`) | Normal (400) | 1.6 |
| Body | 14px (`text-sm`) | 16px (`text-base`) | Normal (400) | 1.5 |
| Caption | 12px (`text-xs`) | 12px (`text-xs`) | Normal (400) | 1.4 |
| Button | 14px (`text-sm`) | 14px (`text-sm`) | Semibold (600) | 1 |
| Eyebrow | 12px (`text-xs`) | 12px (`text-xs`) | Normal (400) | 1 |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Light | 300 | Logo "x" character |
| Normal | 400 | Body text, captions, labels |
| Medium | 500 | Logo "f" character |
| Semibold | 600 | Buttons, subheadings, logo "Capital" |
| Bold | 700 | Headlines, stats, logo "9" |

---

## Colors

### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `bg-neutral-950` | `#0a0a0a` | Primary background |
| `bg-neutral-900` | `#171717` | Secondary/elevated surfaces |
| `bg-white` | `#ffffff` | Primary buttons |

### Text Colors

| Token | Opacity | Usage |
|-------|---------|-------|
| `text-white` | 100% | Headlines, primary text |
| `text-white/70` | 70% | Secondary headlines |
| `text-white/60` | 60% | Body text, nav links |
| `text-white/50` | 50% | Eyebrows, labels |
| `text-white/40` | 40% | Captions, muted text |
| `text-white/30` | 30% | Footer text, disabled |
| `text-neutral-900` | 100% | Text on white buttons |

### Border Colors

| Token | Usage |
|-------|-------|
| `border-white/10` | Primary borders, dividers |
| `border-white/20` | Hover states, emphasis |
| `border-white/30` | Active states |

### Overlay Colors

| Token | Usage |
|-------|-------|
| `bg-neutral-950/60` | Background animation overlay |
| `bg-white/5` | Button hover states |

---

## Spacing

### Container

- Horizontal padding: `px-6` (mobile), `px-12` (desktop)
- Max width: Container default

### Component Spacing

| Element | Value |
|---------|-------|
| Section gap | `mt-12` / `pt-8` |
| Element gap | `mb-6` / `mb-8` |
| Button gap | `gap-4` |
| Nav gap | `gap-8` |
| Stats gap | `gap-8` |

### Header/Footer

- Header padding: `py-4` (mobile), `py-5` (desktop)
- Footer padding: `py-4`

---

## Components

### Buttons

**Primary Button**
```
px-6 py-3 bg-white text-neutral-900 font-semibold text-sm rounded
hover:bg-white/90 transition-colors
```

**Secondary Button**
```
px-6 py-3 bg-transparent border border-white/20 text-white font-semibold text-sm rounded
hover:bg-white/5 hover:border-white/30 transition-colors
```

### Eyebrow

```
flex items-center gap-3
<div className="w-12 h-px bg-white/30" />
<span className="text-white/50 text-xs font-normal tracking-widest uppercase">
```

### Stats

```
<div className="text-2xl font-bold text-white">{value}</div>
<div className="text-xs font-normal text-white/40 mt-1">{label}</div>
```

### Dividers

- Horizontal: `h-px bg-white/10` or `border-t border-white/10`
- Vertical: `w-px bg-white/10` or `h-8 w-px bg-white/10`

---

## Responsive Breakpoints

| Breakpoint | Width | Prefix |
|------------|-------|--------|
| Mobile | < 640px | (default) |
| Small | ≥ 640px | `sm:` |
| Large | ≥ 1024px | `lg:` |

---

## Animation & Transitions

| Property | Duration | Easing |
|----------|----------|--------|
| Color transitions | 150ms | Default (ease) |
| Hover states | 150ms | Default (ease) |

```
transition-colors
```

---

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Background | 0 | Animation, patterns |
| Content | 10 | Main content |
| Header/Footer | 20 | Fixed navigation |
| Overlays | 30 | Modals, dropdowns |

---

## Usage Examples

### Applying the font system

```tsx
// Root element
<main className="font-[family-name:var(--font-manrope)]">

// Headlines
<h1 className="text-4xl lg:text-6xl font-bold text-white">

// Body text
<p className="text-base lg:text-lg text-white/60 font-normal">

// Buttons
<button className="font-semibold text-sm">

// Captions
<span className="text-xs font-normal text-white/40">
```

### Logo component

```tsx
<div className="flex items-baseline text-white" style={{ letterSpacing: '-0.02em' }}>
  <span className="font-[family-name:var(--font-manrope)] text-2xl lg:text-3xl font-bold leading-none">9</span>
  <span className="font-[family-name:var(--font-manrope)] text-base lg:text-xl font-light leading-none">x</span>
  <span className="font-[family-name:var(--font-marck)] text-2xl lg:text-3xl font-medium leading-none">f</span>
  <span className="font-[family-name:var(--font-manrope)] text-2xl lg:text-3xl font-semibold tracking-tight ml-2">Capital</span>
</div>
```
