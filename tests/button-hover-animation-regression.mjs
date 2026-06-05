import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cssPath = path.join(root, 'src', 'components', 'ui', 'button.module.css')
const buttonPath = path.join(root, 'src', 'components', 'ui', 'button.tsx')

const css = fs.readFileSync(cssPath, 'utf8')
const button = fs.readFileSync(buttonPath, 'utf8')

const checks = [
  {
    name: 'drip hover animation is controlled by durable state instead of the transient :hover pseudo-class',
    pass: !/\.dripRoot:hover\s+\.dripHoverContent/.test(css),
  },
  {
    name: 'enter animation keeps the original top-to-bottom path',
    pass: !css.includes('--drip-enter-start') && css.includes('clip-path: var(--drip-in-start);'),
  },
  {
    name: 'leave animation keeps the original top-to-bottom path',
    pass: !css.includes('--drip-leave-start') && css.includes('clip-path: var(--drip-out-start);'),
  },
  {
    name: 'button exposes a drip animation state attribute',
    pass: button.includes('data-drip-state'),
  },
  {
    name: 'button computes the early-leave trigger from the generated drip path instead of a fixed guessed delay',
    pass:
      button.includes('calculateDripVisualFillDelayMs') &&
      button.includes('pendingDripLeaveTimerRef') &&
      !button.includes('const dripVisualFillDelayMs = 600') &&
      !button.includes('return "leaving"'),
  },
  {
    name: 'entered state holds the hover terminal frame instead of inheriting the default leave animation',
    pass: /\.dripRoot\[data-drip-state='entered'\]\s+\.dripHoverContent\s*{[^}]*animation:\s*none;[^}]*clip-path:\s*var\(--drip-in-end\);/s.test(
      css
    ),
  },
  {
    name: 'button does not capture the live overlay clip-path and alter the original drip paths',
    pass: !button.includes('getComputedStyle') && !button.includes('clipPath'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Button hover animation regression check failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Button hover animation regression check passed.')
