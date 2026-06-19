import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'ui', 'heading-tape.tsx')
const cssPath = path.join(root, 'src', 'components', 'ui', 'heading-tape.module.css')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')

const component = fs.readFileSync(componentPath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')

function block(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`, 's'))
  return match?.groups?.body ?? ''
}

function hasDeclaration(selector, declaration) {
  return block(selector).includes(declaration)
}

function hasObjectPair(name, value) {
  return new RegExp(`${name}:\\s*['"]${value}['"]`).test(component)
}

const checks = [
  {
    name: 'HeadingTape default container keeps reference fit-content rotated box model',
    pass:
      hasDeclaration('.headingTapeContainer', 'width: fit-content;') &&
      hasDeclaration('.headingTapeContainer', 'transform: rotate(-3deg);'),
  },
  {
    name: 'HeadingTape default text keeps reference inline-block white tape shell',
    pass:
      hasDeclaration('.headingTapeText', 'display: inline-block;') &&
      hasDeclaration('.headingTapeText', 'background: var(--color-white, #ffffff);') &&
      hasDeclaration('.headingTapeText', 'padding: calc(var(--base-space, 8px) * 2) 40px;') &&
      /@container \(min-width:\s*640px\)\s*{[^}]*\.headingTapeText\s*{[^}]*padding:\s*calc\(var\(--base-space,\s*8px\) \* 2\) 60px;/s.test(
        css
      ),
  },
  {
    name: 'HeadingTape default typography keeps reference scale and no added tracking',
    pass:
      hasDeclaration('.headingTapeText', 'font-size: 1.875rem;') &&
      hasDeclaration('.headingTapeText', 'letter-spacing: 0;') &&
      /@container \(min-width:\s*1024px\)\s*{[^}]*\.headingTapeText\s*{[^}]*font-size:\s*3\.125rem;/s.test(
        css
      ),
  },
  {
    name: 'HeadingTape default sticker offsets match the reference left-bottom and right-top placement',
    pass:
      hasObjectPair('id', 'sticker-8') &&
      hasObjectPair('position', 'bottom-left') &&
      hasObjectPair('inlineOffset', '-19px') &&
      hasObjectPair('blockOffset', '-17px') &&
      hasObjectPair('id', 'sticker-12') &&
      hasObjectPair('position', 'top-right') &&
      hasObjectPair('inlineOffset', '-17px') &&
      hasObjectPair('blockOffset', '-15px'),
  },
  {
    name: 'HeadingTape decoration slot is constrained to the text box and keeps browser default rotation origin',
    pass:
      hasDeclaration(
        '.headingTapeDecoration',
        'inline-size: var(--heading-tape-decoration-inline-size, 100%);'
      ) &&
      hasDeclaration(
        '.headingTapeDecoration',
        'max-inline-size: var(--heading-tape-decoration-max-inline-size, 100%);'
      ) &&
      !css.includes('transform-origin'),
  },
  {
    name: 'HeadingTape compact size is opt-in and cannot alter the default path',
    pass:
      /type\s+HeadingTapeSize\s*=\s*['"]default['"]\s*\|\s*['"]compact['"]/.test(component) &&
      /size\s*=\s*['"]default['"]/.test(component) &&
      /size\s*===\s*['"]compact['"]\s*&&\s*styles\.compact/.test(component) &&
      css.includes('.compact .headingTapeText'),
  },
  {
    name: 'demo preview iframe does not expose rough placeholder copy',
    pass: !page.includes('Embedded media placeholder') && page.includes('Component motion reel'),
  },
  {
    name: 'demo copy avoids official-affiliation wording in fan-made examples',
    pass: [
      'Official media-backed',
      'Official animated squid glyph',
      'official scene artwork',
      'official image-backed loader',
    ].every((copy) => !page.includes(copy)),
  },
  {
    name: 'demo copy avoids fake live-ops announcements',
    pass: [
      'Theme Vote Incoming',
      'Select your side',
      'Team Water',
      'Team Fire',
      'Launch Window Ending Soon',
      '30 minutes',
      'Disconnected from battle lobby',
      'server maintenance',
    ].every((copy) => !page.includes(copy)),
  },
  {
    name: 'IconButton custom demo uses the shared icon library instead of an inline play SVG',
    pass:
      page.includes("import { Play, Zap } from 'lucide-react'") &&
      page.includes('icon={<Play') &&
      !page.includes('<path d="M8 5v14l11-7z"'),
  },
  {
    name: 'public folder does not ship unused Next starter SVG assets',
    pass: ['file.svg', 'globe.svg', 'next.svg', 'vercel.svg', 'window.svg'].every(
      (asset) => !fs.existsSync(path.join(root, 'public', asset))
    ),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Release readiness checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Release readiness checks passed.')
