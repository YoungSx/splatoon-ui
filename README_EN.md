# Splatoon UI

A React component library built on Splatoon's visual language, providing ready-to-use UI tools for fan creators.

> **This project is not affiliated with Nintendo in any way.** Splatoon is a registered trademark of Nintendo. This project is fan-made and intended for non-commercial fan community use only. If this project infringes upon your rights, please contact us and we will address it immediately.

**[中文版 (Chinese Version)](./README.md)**

## What is this

Splatoon UI is a comprehensive React component library that replicates the visual language of [splatoon.nintendo.com](https://splatoon.nintendo.com). Use it to quickly build Splatoon-style fan sites, wikis, tournament pages, fan communities, and more.

**Key features:**

- Liquid ink drip animation buttons
- Torn paper / tape / staple card system
- WebGL ink splash transition effects
- Physics-driven card stack carousel
- 12 ink splat SVG decorations
- 15 camo / pattern background textures
- Full accessibility support (`prefers-reduced-motion`, WCAG AA contrast)

## Quick Start

```bash
# Clone the project
git clone https://github.com/YoungSx/splatoon-ui.git
cd splatoon-ui

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open http://localhost:4317 to see it in action.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router + Turbopack) |
| UI Base | shadcn/ui + Base UI |
| Styling | Tailwind CSS v4 |
| Animation | CSS transitions + keyframes, requestAnimationFrame |
| WebGL | Custom ink splash shaders |
| Language | TypeScript (strict mode) |
| Package Manager | pnpm |

## Component Inventory

### Core Components

| Component | Description |
|-----------|-------------|
| `Button` | 6 color variants + drip animation + morph blob close button |
| `Card` | 4 variants: paper (torn paper), staple (staples + tape), rugged (hanging label), torn (rough edge) |
| `PhotoFrame` | Unified photo frame: torn-paper SVG + tape/sticker decoration, mask-image clipping, responsive |
| `Dialog` | Base UI wrapper with morph blob close button |
| `Tabs` | Skewed parallelogram tabs |
| `Input / Select / Checkbox / Radio` | Form controls |
| `Badge` | Sticker-style labels |
| `Navigation` | Sticky header + fullscreen overlay menu |

### Decorative Components

| Component | Description |
|-----------|-------------|
| `Tape Title` | Red / yellow / black background + SVG tape decoration heading |
| `Banner Divider` | Wavy section transitions |
| `Marquee` | Infinite scrolling text strip |
| `Ink Splat` | 12 inline SVG ink splats + interactive spawner |
| `Sticker` | Decorative sticker elements |
| `Background Patterns` | 15 camo / pattern textures (Retina support) |

### Advanced Components

| Component | Description |
|-----------|-------------|
| `Trailer Video` | YouTube modal + WebGL ink splash transition |
| `Ink Splash Canvas` | WebGL shader-driven ink transition effect |
| `Card Stack Carousel` | Physics-based pendulum model card carousel |
| `Gallery System` | Unified carousel (Marquee / Weapons / Shops) + squid icon pagination |
| `InView` | IntersectionObserver scroll-triggered animations |
| `Page Transition` | WebGL ink splash page transitions |
| `Wave Canvas` | Interactive wave canvas |

## Design System

### Colors

| Name | Value | Usage |
|------|-------|-------|
| Neon Yellow | `#EAFF3D` | Primary brand, CTA |
| Ink Blue | `#603BFF` | Secondary brand, hover |
| Ink Purple | `#AF50FF` | Accent |
| Ink Green | `#6AF7CE` | Play / special controls |
| Ink Orange | `#FF9750` | Warm actions |
| Ink Red | `#FF505E` | Destructive actions |
| Chaos Black | `#0D0D0D` | Text, shadows |
| Desert Sand | `#F5F0E8` | Backgrounds |

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / Heading | fooregular | Hero and section headings |
| Alt | obviously-narrow | Buttons, categories |
| Body | Montserrat | Body text |

### Shadows

Primary shadows use soft blur for general UI elevation; hard-offset solid colors are reserved for special cutout-style elements:

```
# Soft blur (primary)
shadow-soft-splat-sm  →  0 4px 10px rgba(0,0,0,0.14)
shadow-soft-splat-md  →  0 8px 18px rgba(0,0,0,0.16)
shadow-soft-splat-lg  →  0 14px 30px rgba(0,0,0,0.18)

# Hard offset (legacy / special cases)
shadow-solid-sm  →  2px 2px 0px
shadow-solid     →  4px 4px 0px
shadow-solid-lg  →  6px 6px 0px
shadow-solid-xl  →  8px 8px 0px
```

## Project Structure

```
src/
  app/                    # Next.js pages
  components/ui/          # 110+ component files
    splats/               # 12 ink splat SVGs
    stickers/             # Decorative stickers
  config/                 # Navigation config, etc.
  lib/                    # Utilities (cn, wobble-math, drip-math, etc.)
  hooks/                  # Custom hooks (useDripAnimation, etc.)
public/
  _images/                # Backgrounds, tape assets, screenshots
    tape-assets/          # Tape/sticker PNG assets (with @2x)
  fonts/                  # Self-hosted font files
  images/svg/             # Decorative SVG assets (torn-paper background, etc.)
```

## Development Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
npx tsc --noEmit      # Type check
```

## License

MIT

## Copyright Notice

This project is **fan-made** and is not affiliated with, authorized by, or endorsed by Nintendo Co., Ltd.

- **Splatoon** is a registered trademark of Nintendo
- All Splatoon-related visual styles, design language, and artwork are copyright of Nintendo
- This project only uses publicly accessible web design as visual reference, and does not contain any game code, asset files, or unreleased materials
- This project is intended for non-commercial fan community use only

**If Nintendo or its authorized representatives believe this project infringes upon any rights, please contact us via GitHub Issues and we will address it immediately upon notification.**

---

*This project was made by Splatoon fan community enthusiasts, dedicated to all Splatoon players.*
