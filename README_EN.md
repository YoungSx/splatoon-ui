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
- 13 camo / pattern background textures
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

Open http://localhost:3000 to see it in action.

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
| `Card` | 3 variants: news (torn paper + staples + tape), tag (hanging label), plain |
| `Dialog` | Base UI wrapper with morph blob close button |
| `Splatoon Modal` | CSS custom property-driven modal system |
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
| `Background Patterns` | 13 camo / pattern textures (Retina support) |

### Advanced Components

| Component | Description |
|-----------|-------------|
| `Trailer Video` | YouTube modal + WebGL ink splash transition |
| `Ink Splash Canvas` | WebGL shader-driven ink transition effect |
| `Card Stack Carousel` | Physics-based pendulum model card carousel |
| `Gallery System` | Unified carousel + squid icon pagination |
| `InView` | IntersectionObserver scroll-triggered animations |
| `Page Transition` | WebGL ink splash page transitions |
| `Character Showcase` | 3D character display + ink effects |
| `Wave Canvas` | Interactive wave canvas |

## Design System

### Colors

| Name | Value | Usage |
|------|-------|-------|
| Neon Yellow | `#EAFF3D` | Primary brand, CTA |
| Ink Blue | `#603BFF` | Secondary brand, hover |
| Ink Purple | `#A51EE1` | Accent |
| Neon Cyan | `#00C8B4` | Play / special controls |
| Ink Orange | `#FA5A00` | Warm actions |
| Ink Red | `#FF585E` | Destructive actions |
| Chaos Black | `#0D0D0D` | Text, shadows |
| Desert Sand | `#F5F0E8` | Backgrounds |

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display | social-gothic-rough | Hero headings |
| Heading | fooregular | Section headings |
| Alt | obviously-narrow | Buttons, categories |
| Body | Montserrat | Body text |

### Shadows

All shadows use hard-offset solid colors (`shadow-solid`), never blur:

```
shadow-solid-sm   →  2px 2px 0px
shadow-solid      →  4px 4px 0px
shadow-solid-lg   →  6px 6px 0px
```

## Project Structure

```
src/
  app/                    # Next.js pages
  components/ui/          # 90+ component files
    splats/               # 12 ink splat SVGs
    stickers/             # Decorative stickers
  lib/                    # Utilities (cn, wobble-math, drip-math, etc.)
  hooks/                  # Custom hooks (useDripAnimation, etc.)
public/
  _images/                # Backgrounds, tape assets, screenshots
  fonts/                  # Self-hosted font files
  images/svg/             # Decorative SVG assets
```

## Development Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
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
