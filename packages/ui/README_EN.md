# Splatoon UI

A React component library inspired by Splatoon's visual language, providing ready-to-use UI tools for fan creators.

> **This project is not affiliated with Nintendo in any way.** Splatoon is a registered trademark of Nintendo. This project is fan-made and intended for non-commercial fan community use only. If this project infringes on any rights, please contact us and we will address it immediately.

**[中文版 (Chinese Version)](./README.md) | [日本語版 (Japanese Version)](./README_JA.md)**

## About

Splatoon UI is a comprehensive React component library shaped around Splatoon's vivid, high-contrast, ink-heavy visual language. Build Splatoon-style fan sites, wikis, tournament pages, and more in minutes.

**Key features:**

- Buttons with liquid ink drip animations
- Card system with torn-paper, tape, and staple variants
- WebGL ink splash transition effects
- Physics-driven pendulum card stack carousel
- 12 ink splat decorative components
- 15 camouflage and pattern background textures (Retina support)
- Full accessibility support (`prefers-reduced-motion`, WCAG AA contrast)

## Quick Start

### Use the package

```bash
npm install splatoon-ui
```

Import the global stylesheet once in your app shell:

```tsx
import 'splatoon-ui/styles.css'
```

Use server-safe stable components from the default entrypoint, and import interactive components by component subpath:

```tsx
import { Alert, Badge, Input } from 'splatoon-ui'
import { Button } from 'splatoon-ui/button'
import { Dialog } from 'splatoon-ui/dialog'
```

Splatoon UI styles reference static assets from `/_images`, `/fonts`, and `/svgs`. Copy the package `public/_images`, `public/fonts`, and `public/svgs` directories into your app's public root before deploying.

The stylesheet is a Tailwind CSS v4 entrypoint. Your app needs a normal Tailwind v4/PostCSS pipeline that can process CSS imports from npm packages.

### Run the demo locally

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

| Layer           | Technology                                |
| --------------- | ----------------------------------------- |
| Framework       | Next.js 16 (App Router + Turbopack)       |
| UI Base         | shadcn/ui + Base UI                       |
| Styling         | Tailwind CSS v4                           |
| Animation       | framer-motion + CSS transitions/keyframes |
| WebGL           | Custom ink splash shaders                 |
| Icons           | lucide-react                              |
| Language        | TypeScript (strict mode)                  |
| Package Manager | pnpm                                      |

## Stable Public Components

The npm public API only includes stable components with full docs and examples:

| Component                   | Description                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| `Button`                    | 6 color variants + drip animation + ink splat decorations                                           |
| `Card`                      | 4 variants: paper (torn paper), staple (staple and tape), rugged (hanging label), torn (rough edge) |
| `Dialog`                    | Base UI wrapper with WaveButton close button + fullscreen ink splash mode                           |
| `Tabs`                      | Ink splat hover + color underline tabs (default / line variants)                                    |
| `Input / Checkbox / Switch` | Form controls                                                                                       |
| `Progress`                  | Ink-styled progress indicator                                                                       |
| `Alert`                     | Torn-paper status surface                                                                           |
| `Badge`                     | 7 color skewed labels + sticker variant                                                             |

## Design System

### Colors

| Name        | Value     | Usage                   |
| ----------- | --------- | ----------------------- |
| Neon Yellow | `#EAFF3D` | Primary brand, CTA      |
| Ink Blue    | `#603BFF` | Secondary brand, hover  |
| Ink Purple  | `#AF50FF` | Accent                  |
| Ink Green   | `#6AF7CE` | Play / special controls |
| Ink Orange  | `#FF9750` | Warm actions            |
| Ink Red     | `#FF505E` | Destructive actions     |
| Chaos Black | `#0D0D0D` | Text, shadows           |
| Desert Sand | `#F5F0E8` | Backgrounds             |

### Typography

| Role              | Font             | Usage                     |
| ----------------- | ---------------- | ------------------------- |
| Display / Heading | fooregular       | Hero and section headings |
| Alt               | obviously-narrow | Buttons, categories       |
| Body              | Montserrat       | Body text                 |

### Shadows

Primary shadows use soft blur for general UI elevation; hard-offset solid colors are reserved for special paper-cutout-style elements:

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
  components/ui/          # 86 components + 32 CSS Modules
    splats/               # 12 ink splat decorative components (TSX)
    stickers/             # Decorative stickers
  config/                 # Navigation config, etc.
  lib/
    utils.ts              # Utilities (cn, etc.)
    wobble-math.ts        # Pendulum physics math
    drip-math.ts          # Drip animation math
    ink-particle.ts       # Ink particle system
    physics/              # Card stack physics engine
    shaders/              # WebGL shaders
  hooks/                  # Custom hooks (useDripAnimation, etc.)
public/
  _images/                # Backgrounds, tape assets, screenshots
    tape-assets/          # Tape/sticker PNG assets (with @2x)
    svg/                  # Decorative SVG assets (torn-paper background, etc.)
  fonts/                  # Font files (fooregular, Montserrat self-hosted)
  svgs/                   # General SVG assets (paper tears, waves, etc.)
```

## Development Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
npx tsc --noEmit      # Type check
pnpm reference:crawl  # Generate a reference asset manifest from the sitemap (scratch/ output)
pnpm reference:crawl:all  # Crawl every English-locale sitemap page
pnpm reference:crawl:all-locales  # Crawl every sitemap page across locales (separate output)
pnpm reference:analyze    # Map the manifest into component asset candidates
pnpm reference:analyze:all-locales # Analyze the all-locale manifest
pnpm reference:analyze:videos # Deduplicate and catalog official remote mp4 candidates
```

To download the referenced assets, run `pnpm reference:crawl:download`. Downloads still land
in `scratch/`; curate, rename, and approve assets before moving anything into publishable
static directories.
The all-locale crawl writes to `scratch/splatoon-reference-all-locales/` so it does not
overwrite the default English reference report.
Video analysis only writes remote candidates into scratch; it does not copy mp4 binaries into
publishable static directories.

## Package Release

```bash
pnpm install
pnpm typecheck
pnpm build:package
pnpm pack:dry-run
pnpm test:package-consumer
pnpm changeset
pnpm version
pnpm publish --access public
git push --follow-tags
```

Use `pnpm pack:dry-run` before publishing and check that the tarball only contains `dist`, `public/_images`, `public/fonts`, `public/svgs`, README files, license, notice, and package metadata.

## License

MIT

## Copyright Notice

This project is **fan-made** and is not affiliated with, authorized by, or endorsed by Nintendo Co., Ltd.

- **Splatoon** is a registered trademark of Nintendo
- All Splatoon-related visual styles, design language, and artwork are copyright of Nintendo
- This project only uses publicly accessible web design as visual reference, and does not contain any game code, asset files, or unreleased materials
- This project is intended for non-commercial fan community use only

**If this project infringes on any rights, please contact us via GitHub Issues and we will address it immediately.**

---

---

See [CREDITS.md](./CREDITS.md) for full attribution of assets and tools.

_Built by Splatoon fans, dedicated to all Splatoon players._
