import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cssPath = path.join(root, 'src', 'components', 'ui', 'heading-tape.module.css')
const sectionSideNavCssPath = path.join(
  root,
  'src',
  'components',
  'ui',
  'section-side-nav.module.css'
)
const css = fs.readFileSync(cssPath, 'utf8')
const sectionSideNavCss = fs.readFileSync(sectionSideNavCssPath, 'utf8')

function block(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`, 's'))
  return match?.groups?.body ?? ''
}

function hasDeclaration(selector, declaration) {
  return block(selector).includes(declaration)
}

const checks = [
  {
    name: 'HeadingTape section can shrink inside narrow parents',
    pass:
      hasDeclaration('.headingTapeSection', 'min-inline-size: 0;') &&
      hasDeclaration('.headingTapeSection', 'width: 100%;'),
  },
  {
    name: 'HeadingTape text wraps long titles instead of forcing horizontal overflow',
    pass:
      hasDeclaration('.headingTapeText', 'max-inline-size: 100%;') &&
      hasDeclaration('.headingTapeText', 'overflow-wrap: break-word;'),
  },
  {
    name: 'HeadingTape decoration layer stays inside the measured text width',
    pass:
      hasDeclaration('.headingTapeDecorations', 'width: 100%;') &&
      hasDeclaration(
        '.headingTapeDecoration',
        'max-inline-size: var(--heading-tape-decoration-max-inline-size, 100%);'
      ) &&
      hasDeclaration('.headingTapeDecorationImage', 'max-inline-size: 100%;'),
  },
  {
    name: 'HeadingTape compact size keeps long labels denser without disabling wrapping',
    pass:
      css.includes('.compact .headingTapeText') &&
      !/\.compact\s+\.headingTapeText\s*{[^}]*white-space:\s*nowrap/s.test(css),
  },
  {
    name: 'SectionSideNav hides below desktop width so it cannot cover mobile content',
    pass:
      /@media \(max-width:\s*1023\.98px\)\s*{[^}]*\.sidebar\s*{[^}]*display:\s*none;/s.test(
        sectionSideNavCss
      ) && sectionSideNavCss.includes('pointer-events: none;'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Horizontal overflow regression check failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Horizontal overflow regression check passed.')
