import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const globalsPath = path.join(root, 'packages', 'ui', 'src', 'styles', 'globals.css')
const globals = fs.readFileSync(globalsPath, 'utf8')

// Official site source of truth for theme combinations:
// https://splatoon.nintendo.com/_next/static/css/05abab1042f3408f.css
// Each entry: theme class -> { primary, accent, accentAlt? } as raw palette token names.
const officialThemes = {
  'theme--yellow': { primary: 'color-yellow', accent: 'color-black' },
  'theme--dark-blue': { primary: 'color-blue', accent: 'color-yellow', accentAlt: 'color-black' },
  'theme--light-blue': { primary: 'color-blue', accent: 'color-yellow', accentAlt: 'color-black' },
  'theme--dark-green': { primary: 'color-green', accent: 'color-red' },
  'theme--light-green': { primary: 'color-green', accent: 'color-red', accentAlt: 'color-black' },
  'theme--dark-orange': { primary: 'color-orange', accent: 'color-purple' },
  'theme--dark-purple': { primary: 'color-purple', accent: 'color-blue', accentAlt: 'color-white' },
  'theme--light-purple': { primary: 'color-purple', accent: 'color-yellow' },
  'theme--dark-purpleOrange': {
    primary: 'color-purple',
    accent: 'color-orange',
    accentAlt: 'color-black',
  },
  'theme--dark-red': { primary: 'color-red', accent: 'color-green', accentAlt: 'color-white' },
  'theme--light-red': { primary: 'color-red', accent: 'color-green' },
  'theme--dark-yellow': { primary: 'color-yellow', accent: 'color-blue', accentAlt: 'color-white' },
  'theme--light-brown': { primary: 'color-brown', accent: 'color-red' },
  'theme--side-order': {
    primary: 'color-side-order-red',
    accent: 'color-side-order-green',
    accentAlt: 'color-side-order-black',
  },
}

const failures = []

function classBlock(cls) {
  // Match `.theme--xxx { ... }` or grouped selectors that include this class.
  const escaped = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(?:^|,\\s*|\\s)\\.${escaped}[\\s,{][^}]*}`, 'gm')
  const matches = globals.match(regex)
  return matches ? matches.join('\n') : null
}

function cssBlockAt(marker) {
  const start = globals.indexOf(marker)
  if (start === -1) return null
  const open = globals.indexOf('{', start)
  if (open === -1) return null

  let depth = 0
  for (let index = open; index < globals.length; index += 1) {
    if (globals[index] === '{') depth += 1
    if (globals[index] === '}') depth -= 1
    if (depth === 0) return globals.slice(start, index + 1)
  }

  return null
}

for (const [cls, spec] of Object.entries(officialThemes)) {
  const block = classBlock(cls)
  if (!block) {
    failures.push(`missing theme class: .${cls}`)
    continue
  }
  if (!block.includes(`--theme-primary: var(--${spec.primary})`)) {
    failures.push(`.${cls} should set --theme-primary to var(--${spec.primary})`)
  }
  if (!block.includes(`--theme-accent: var(--${spec.accent})`)) {
    failures.push(`.${cls} should set --theme-accent to var(--${spec.accent})`)
  }
  if (spec.accentAlt && !block.includes(`--theme-accent-alt: var(--${spec.accentAlt})`)) {
    failures.push(`.${cls} should set --theme-accent-alt to var(--${spec.accentAlt})`)
  }
}

const firstBaseLayer = cssBlockAt('@layer base')
if (!firstBaseLayer) {
  failures.push('@layer base block not found in globals.css')
} else {
  for (const cls of Object.keys(officialThemes)) {
    if (!firstBaseLayer.includes(`.${cls}`)) {
      failures.push(`.${cls} must stay inside @layer base so Tailwind emits it`)
    }
  }
  for (const utility of [
    '.color-primary',
    '.color-accent',
    '.bg-color-primary',
    '.border-color-accent',
  ]) {
    if (!firstBaseLayer.includes(utility)) {
      failures.push(`${utility} must stay inside @layer base so Tailwind emits it`)
    }
  }
}

// Dark/light-named brand presets are fixed color recipes, not page color-scheme selectors.
// Keep them exact so consumer classes like `my-theme--dark-mode` are not styled accidentally.
if (/\[class\*=['"]theme--(?:dark|light)['"]\]/.test(globals)) {
  failures.push('theme fallback selectors must not use substring class matching')
}

const darkFallbackSelector =
  /\.theme--dark-blue,\s*\.theme--dark-green,\s*\.theme--dark-orange,\s*\.theme--dark-purple,\s*\.theme--dark-purpleOrange,\s*\.theme--dark-red,\s*\.theme--dark-yellow\s*{[^}]*--theme-primary-alt:\s*var\(--color-black\)[^}]*--theme-accent-alt:\s*var\(--color-black\)[^}]*color:\s*var\(--color-white\)/m
if (!darkFallbackSelector.test(globals)) {
  failures.push('dark-named theme presets should set exact black alt tokens and white text')
}

const lightFallbackSelector =
  /\.theme--light-blue,\s*\.theme--light-green,\s*\.theme--light-purple,\s*\.theme--light-red,\s*\.theme--light-brown\s*{[^}]*--theme-primary-alt:\s*var\(--color-white\)[^}]*--theme-accent-alt:\s*var\(--color-white\)[^}]*color:\s*var\(--color-black\)/m
if (!lightFallbackSelector.test(globals)) {
  failures.push('light-named theme presets should set exact white alt tokens and black text')
}

// Theme tokens have safe fallbacks on :root.
const rootBlock = globals.match(/:root\s*{[\s\S]*?\n}/)
if (!rootBlock) {
  failures.push(':root block not found in globals.css')
} else {
  const rb = rootBlock[0]
  const rootFallbacks = {
    '--theme-primary': 'color-yellow',
    '--theme-primary-alt': 'color-black',
    '--theme-accent': 'color-black',
    '--theme-accent-alt': 'color-white',
  }

  for (const [token, colorToken] of Object.entries(rootFallbacks)) {
    if (!rb.includes(`${token}: var(--${colorToken})`)) {
      failures.push(`:root must define ${token} as var(--${colorToken})`)
    }
  }
}

// Consumers must point at --theme-* (not --color-primary/accent which Tailwind binds to shadcn semantic tokens).
const consumers = [
  'src/components/ui/button-drip.module.css',
  'src/components/ui/icon-button.module.css',
  'src/components/ui/carousel-pagination.module.css',
]
for (const rel of consumers) {
  const file = fs.readFileSync(path.join(root, 'packages', 'ui', rel), 'utf8')
  if (/var\(--color-primary(?!-foreground)/.test(file) || /var\(--color-primary-alt/.test(file)) {
    failures.push(`${rel} must use --theme-primary[/-alt] instead of --color-primary[/-alt]`)
  }
  if (/var\(--color-accent(?!-foreground)/.test(file) || /var\(--color-accent-alt/.test(file)) {
    failures.push(`${rel} must use --theme-accent[/-alt] instead of --color-accent[/-alt]`)
  }
}

if (failures.length > 0) {
  console.error('Theme role-token regression checks failed:')
  for (const f of failures) console.error(`- ${f}`)
  process.exit(1)
}

console.log('Theme role-token regression checks passed.')
