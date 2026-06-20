# Design System Inspired by Splatoon 3

## 1. Visual Theme & Atmosphere

The Splatoon 3 design system embodies vibrant chaos with youthful energy and playful rebellion. It blends bold, contrasting neon colors—electric yellows, cyans, and magentas—against deep blacks and pure whites, creating a high-contrast, dynamic visual language. The aesthetic is deliberately irreverent: splatter effects, angular geometric accents, and unconventional layouts mirror the ink-splatting core of the game. This system celebrates expressive color blocking, experimental typography mixing, and an almost chaotic-yet-intentional layout structure that feels native to youth culture and digital gaming. The atmosphere is forward-thinking, inclusive, and unapologetically bold—every element demands attention.

**Key Characteristics**
- High-contrast color palette (neons against deep neutrals)
- Playful splatter and organic shape motifs
- Angular and geometric accent elements
- Mix of bold, sans-serif typography with varying weights
- Energetic, youth-oriented visual language
- Dynamic depth through layering and perspective
- Intentionally unconventional layout and composition

## 2. Color Palette & Roles

### Primary
- **Neon Yellow** (`#EAFF3D`): Primary brand color, CTA buttons, badges, ring focus. Token: `--neon-yellow`, `--color-yellow`
- **Ink Blue** (`#603BFF`): Secondary brand, hover states, links. Token: `--ink-blue`, `--color-blue`

### Accent Colors
- **Ink Purple** (`#A51EE1`): Tertiary accent for highlights and featured content. Token: `--ink-purple`, `--color-purple`
- **Neon Cyan** (`#00C8B4`): Play buttons, special controls, positive feedback. Token: `--ink-green`, `--color-green`
- **Ink Orange** (`#FA5A00`): Warm accent for secondary actions. Token: `--ink-orange`, `--color-orange`
- **Ink Red** (`#FF585E`): Destructive actions, error states. Token: `--ink-red`, `--color-red`

### Neutral Scale
- **Pure White** (`#FFFFFF`): Primary text on dark, card backgrounds. Token: `--tape-white`, `--color-white`
- **Chaos Black** (`#0D0D0D`): Primary text, solid shadows, dark surfaces. Token: `--chaos-black`, `--color-black`
- **True Black** (`#000000`): Maximum contrast, shadow elements. Token: `--color-true-black`
- **Desert Sand** (`#F5F0E8`): Background accents. Token: `--desert-sand`
- **Grey 100** (`#CCCCCC`): Borders, disabled states. Token: `--color-grey-100`
- **Grey 200** (`#888888`): Secondary text. Token: `--color-grey-200`
- **Grey 300** (`#555555`): Muted foreground. Token: `--color-grey-300`
- **Grey 400** (`#222222`): Dark accents. Token: `--color-grey-400`

### Shadcn Semantic Mappings
| Token | Value | Role |
|-------|-------|------|
| `--primary` | `#EAFF3D` | Primary CTA |
| `--primary-foreground` | `#0D0D0D` | Text on primary |
| `--secondary` | `#603BFF` | Secondary actions |
| `--secondary-foreground` | `#FFFFFF` | Text on secondary |
| `--accent` | `#A51EE1` | Accent highlights |
| `--destructive` | `#FF585E` | Destructive actions |
| `--muted` | `#F5F5F5` | Muted surfaces |
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#0D0D0D` | Page text |

## 3. Typography Rules

### Font Family

**Display: social-gothic-rough**
Fallback: `fooregular, Montserrat, sans-serif`
Used for dramatic hero headings; boldest visual impact.

**Heading: fooregular**
Fallback: `sans-serif`
Used for section headings and page titles; Splatoon-authentic feel.

**Alternative: obviously-narrow**
Fallback: `sans-serif`
Used for buttons, category titles, prices; compressed geometric command.

**Body: Montserrat**
Fallback: `sans-serif`
Used for body text, labels, standard UI copy; clean and highly legible.

### Hierarchy

| Role | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| Display / H1 | fooregular | 80px | 500 | Hero titles |
| Heading / H2 | obviously-narrow | 37px | 600 | Section headings |
| Subheading / H3 | obviously-narrow | 24px | 600 | Content subsections |
| Body Large | Montserrat | 20px | 500 | Primary body text |
| Body Standard | Montserrat | 16px | 400 | Standard UI text |
| Label | Montserrat | 16px | 600 | Form labels, button text |
| Caption | Montserrat | 12px | 400 | Metadata, secondary info |

### Principles
- **Contrast Over Subtlety**: Bold weight and size variations create clear hierarchy
- **Compact Spacing**: Line heights track closely to type size for energetic rhythm
- **Weight Discipline**: Stick to 400, 500, and 600 weights; avoid lighter weights on small text

## 4. Component Stylings

### Buttons

The Button component uses `class-variance-authority` with two variant axes.

#### Variants
| Variant | Background | Hover | Text |
|---------|-----------|-------|------|
| `yellow` (default) | `--neon-yellow` | `--ink-blue` | `--chaos-black` |
| `blue` | `--ink-blue` | `--neon-yellow` | white |
| `green` | `--ink-green` | `--neon-yellow` | `--chaos-black` |
| `orange` | `--ink-orange` | `--neon-yellow` | `--chaos-black` |
| `purple` | `--ink-purple` | `--neon-yellow` | white |
| `destructive` | `--ink-red` | `--neon-yellow` | white |
| `outline` | transparent | `--neon-yellow` | current |
| `ghost` | transparent | `--neon-yellow` | current |

#### Sizes
| Size | Font Size | Height | Padding |
|------|-----------|--------|---------|
| `default` | 22px | auto | 12px 16px |
| `sm` | 16px | auto | 8px 12px |
| `lg` | 26px | auto | 16px 24px |
| `icon` | — | 44px | 0 |
| `icon-sm` | — | 32px | 0 |
| `icon-lg` | — | 56px | 0 |

#### Drip Animation
Buttons use a CSS `clip-path` drip fill animation with asymmetric enter/leave transitions:
- **Enter**: `opacity 0.05s`, quartic ease `cubic-bezier(0.77, 0, 0.175, 1)`
- **Leave**: `opacity 0.4s` (slower for liquid rebound effect)
- Each button mounts with a random spray tilt (`1.5deg–2.5deg`) via `--hover-rotate`
- Active state: `translate-x-[3px] translate-y-[3px]` with shadow collapse for 3D press feedback

#### Button Group
`ButtonGroup` is a low-level action layout primitive. It groups existing `Button` instances inside a compact ink-black shell while preserving each child button's drip animation, focus state, and native button semantics. It does not manage selection state.

Future todo: add a `SegmentedControl` for one-of-many selection. It may reuse ButtonGroup-like or Switch-like visual appearances, but the semantic contract should remain radio/segmented control rather than expanding `Switch` beyond boolean on/off.

#### Morph Blob Close Button
Modal close buttons use a 3-stop `border-radius` blob animation (`morph` keyframes, 3s linear infinite) with `#EAFF3D` background and `#603BFF` icon.

### Cards

#### Polaroid News Card (`data-variant="news"`)
- 3-layer DOM: top torn-paper SVG, content area, bottom torn-paper SVG
- `filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5))` follows SVG contour
- Metal staples (left/right) with physical highlight and shadow
- Adhesive tapes at `-10deg` / `10deg` with torn-edge clip
- Inner image rotated `-1deg` for scrapbook feel
- Hover: `rotate(2deg) scale(1.025)`

#### Hanging Tag Card
- SVG tag background with `fill="currentColor"` for theme binding
- Photo frame with transparent scotch tape overlay
- Supports `tagRotation` prop for irregular hanging angles

#### Styled Photo
- `--end-rotate` for photo tilt angle
- `--margin-offset` multiplied by `--base-space` (8px) for vertical offset
- Tape decorations via `<picture>` with responsive sources (1x/2x, webp/png)

### Tape Title
- Background: `--color-black`, `--color-red`, or `--color-yellow` variants
- `transform: rotate(-4deg)` for tilted scrapbook feel
- Left/right pseudo-elements with SVG tape graphics
- Padding: `8px 16px 16px` (mobile), `16px 40px 24px` (desktop)

### Tabs (Skewed)
- Outer trigger: `skew-x-[-12deg]`
- Inner content: `skew-x-[12deg]` (double-skew correction)
- Active: `border-2 border-chaos-black` + solid offset shadow
- `line` variant: no skew, purple bottom indicator

### Splatoon Modal
- CSS custom property-driven state: `--alpha`, `--scale`, `--duration`, `--content-delay`
- Backdrop: `rgba(0, 0, 0, 0.9)` scaled by `--alpha`
- Content: centered via `position: absolute; left: 50%; top: 50%; translate(-50%, -50%)`
- Close button: morph blob with slide-in via `translateX(calc(200% * (1 - var(--alpha))))`

### Ink Splash Canvas
- WebGL shader-driven ink splash transition
- Uses camo-black background texture
- States: `idle`, `in`, `out` with configurable `durationIn`/`durationOut`

## 5. Layout Principles

### Spacing System
**Base Unit**: `8px` (`--base-space`)

**Scale** (Tailwind 4px increments):
- `4px` — Micro gaps (icon margins, tight padding)
- `8px` — Compact spacing (small component padding)
- `12px` — Standard form padding
- `16px` — Default margins, navigation items
- `24px` — Card padding, gutter width (`--gutter-width`)
- `32px` — Section headers, generous padding
- `48px` — Major section dividers
- `64px` — Maximum spacing, hero section padding

### Grid & Container
**Max Width**: `1440px` (full container width)

**Column Strategy** (from official site):
- Desktop: 12-column grid with `24px` gutters
- Tablet: 8-column grid
- Mobile: Single column

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 2px | Subtle rounding |
| `--radius-md` | 3px | Menu items |
| `--radius-lg` | 4px | Small components |
| `--radius-xl` | 6px | Medium components |
| `--radius-2xl` | 8px | Default (`--radius`) |
| `--radius-3xl` | 12px | Large cards |
| `--radius-4xl` | 16px | Extra large |

## 6. Depth & Elevation

### Shadow Utilities
| Utility | Effect | Usage |
|---------|--------|-------|
| `shadow-solid` | `4px 4px 0px var(--chaos-black)` | Default solid shadow |
| `shadow-solid-sm` | `2px 2px 0px var(--chaos-black)` | Small solid offset |
| `shadow-solid-lg` | `6px 6px 0px var(--chaos-black)` | Large solid offset |
| `shadow-solid-xl` | `8px 8px 0px var(--chaos-black)` | Extra large offset |
| `shadow-soft-splat-sm` | `0 2px 8px rgba(0,0,0,0.15)` | Soft elevation |
| `shadow-soft-splat-md` | `0 4px 16px rgba(0,0,0,0.25)` | Medium elevation |
| `shadow-soft-splat-lg` | `0 8px 32px rgba(0,0,0,0.4)` | Heavy elevation |

**Philosophy**: Splatoon 3 prioritizes solid, hard-offset shadows over soft blurs. Depth comes from color layering and z-index stacking, not shadow rendering.

## 7. Motion & Easing

### Easing Tokens
| Token | Curve | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.35, 0.91, 0.3, 0.99)` | Standard exit |
| `--ease-in-out` | `cubic-bezier(0.75, 0, 0.21, 0.99)` | Standard in-out |
| `--ease-in-out-quart` | `cubic-bezier(0.77, 0, 0.175, 1)` | Button drip enter |
| `--ease-in` | `cubic-bezier(0.51, 0, 0.9, 0.43)` | Sharp entrance |
| `--ease-back-in` | `cubic-bezier(0.38, -0.37, 0.83, 0.23)` | Bounce back in |
| `--ease-back-out` | `cubic-bezier(0.21, 0.12, 0.35, 1.43)` | Bounce back out |

### Keyframe Animations
| Name | Duration | Usage |
|------|----------|-------|
| `morph` | 3s | Blob border-radius loop (3-stop) |
| `splat-in` | — | Scale+rotate entrance |
| `slide-up-tilt` | — | TranslateY + rotate entrance |
| `marquee` | — | Infinite horizontal scroll |
| `menu-drip-enter/leave` | 750ms | Full-screen menu clip-path |
| `peel-in` | — | Tape/sticker peel entrance |
| `tape-slide-in-left/right` | — | Tape slide entrance |

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` and the manual `.is-reduced-motion` class toggle. When active: `transition-duration: 0.01ms !important; animation-duration: 0.01ms !important`.

## 8. Background Patterns

13 pattern utility classes reference images in `public/_images/backgrounds/` with `image-set()` for retina (1x/2x):

| Pattern | Image | Usage |
|---------|-------|-------|
| `pattern-camo-black` | camo-black | Dark section backgrounds |
| `pattern-camo-green` | camo-green | Green themed sections |
| `pattern-camo-purple` | camo-purple | Purple themed sections |
| `pattern-camo-orange` | camo-orange | Orange themed sections |
| `pattern-camo-red` | camo-red | Red themed sections |
| `pattern-camo-white` | camo-white | Light section backgrounds |
| `pattern-octo-black` | octo-black | Octarian themed |
| `pattern-circles-green` | circles-green | Circular pattern |
| `pattern-chip-white` | chip-white | Chip texture |
| `pattern-monsters-black` | monsters-black | Monster pattern |
| `pattern-tapes-black` | tapes-black | Tape pattern |
| `pattern-tapes-green` | tapes-green | Green tape pattern |
| `pattern-tapes-purple` | tapes-purple | Purple tape pattern |

## 9. Panel Shapes (Clip-path)

| Class | Shape | Usage |
|-------|-------|-------|
| `scrap-panel` | Organic rounded corners + tape slot | Main content panels |
| `scrap-panel-tight` | Tighter rounded corners | Compact panels |
| `drawer-sheet` | Rounded on visible side | Drawer/sheet surfaces |
| `field-cut` | Organic rounded | Inline content |
| `field-cut-popup` | Organic rounded | Dropdown content |

## 10. Do's and Don'ts

### Do
- **Use high contrast**: Pair neon colors (`#EAFF3D`, `#00C8B4`) against deep blacks (`#0D0D0D`) for maximum legibility
- **Embrace solid shadows**: Use `shadow-solid` variants for the signature Splatoon hard-offset look
- **Mix typography boldly**: Combine `fooregular` headings with `Montserrat` body text
- **Apply drip animations**: Use the button drip system for interactive feedback
- **Respect reduced motion**: All animations must degrade gracefully
- **Use CSS custom properties**: Reference `--neon-yellow`, `--ink-blue`, etc. rather than hardcoded hex values

### Don't
- **Avoid soft shadows**: Do not use generic `box-shadow` with large blur; use the `shadow-solid` system
- **Do not soften corners excessively**: Default radius is `8px`; prefer `0px`–`4px` for buttons and cards
- **Avoid muted colors**: The palette is intentionally vibrant; do not desaturate
- **Do not skip responsive sources**: Tape and decorative images must use `<picture>` with 1x/2x webp+png sources
- **Avoid hardcoded colors**: Always use design tokens (`--neon-yellow` not `#EAFF3D`) for consistency

## 11. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: Neon Yellow (`#EAFF3D`) — `--neon-yellow`
- **Secondary**: Ink Blue (`#603BFF`) — `--ink-blue`
- **Accent**: Ink Purple (`#A51EE1`) — `--ink-purple`
- **Play/Special**: Neon Cyan (`#00C8B4`) — `--ink-green`
- **Warm**: Ink Orange (`#FA5A00`) — `--ink-orange`
- **Destructive**: Ink Red (`#FF585E`) — `--ink-red`
- **Background**: `#FFFFFF` (light) / `#0D0D0D` (dark)
- **Text**: `#0D0D0D` on light / `#FFFFFF` on dark

### Iteration Guide
1. **Tokens first**: Use `--neon-yellow`, `--ink-blue`, etc. from globals.css
2. **Solid shadows**: `shadow-solid-sm` for small, `shadow-solid` for default, `shadow-solid-lg` for large
3. **Font classes**: `font-heading` (fooregular), `font-alt` (obviously-narrow), `font-body` (Montserrat)
4. **Spacing in 4px steps**: All margins/padding align to 4px base unit
5. **Easing tokens**: `--ease-out`, `--ease-back-out`, `--ease-in-out-quart`
6. **Responsive images**: `<picture>` with webp+png, 1x+2x sources
7. **Panel shapes**: `scrap-panel`, `field-cut` for organic rounded containers
8. **Animation**: `morph` for blobs, `splat-in` for entrances, `marquee` for scrolling
