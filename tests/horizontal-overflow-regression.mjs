import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cssPath = path.join(root, 'src', 'components', 'ui', 'heading-tape.module.css')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const sectionPath = path.join(root, 'src', 'components', 'ui', 'section.tsx')
const sectionSideNavPath = path.join(root, 'src', 'components', 'ui', 'section-side-nav.tsx')
const sectionSideNavCssPath = path.join(
  root,
  'src',
  'components',
  'ui',
  'section-side-nav.module.css'
)
const css = fs.readFileSync(cssPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const section = fs.readFileSync(sectionPath, 'utf8')
const sectionSideNav = fs.readFileSync(sectionSideNavPath, 'utf8')
const sectionSideNavCss = fs.readFileSync(sectionSideNavCssPath, 'utf8')

function block(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`, 's'))
  return match?.groups?.body ?? ''
}

function hasDeclaration(selector, declaration) {
  return block(selector).includes(declaration)
}

function sideNavBlock(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = sectionSideNavCss.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`, 's'))
  return match?.groups?.body ?? ''
}

function sideNavHasDeclaration(selector, declaration) {
  return sideNavBlock(selector).includes(declaration)
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
    name: 'SectionSideNav remains visible on mobile like the reference gallery sidebar',
    pass:
      sideNavHasDeclaration('.sidebar', 'position: fixed;') &&
      sideNavHasDeclaration('.sidebar', 'right: var(--base-space, 8px);') &&
      !/@media \(max-width:\s*1023\.98px\)\s*{[^}]*\.sidebar\s*{[^}]*display:\s*none;/s.test(
        sectionSideNavCss
      ),
  },
  {
    name: 'SectionSideNav scales to the reference tablet and desktop dimensions',
    pass:
      /@media \(min-width:\s*640px\)\s*{[^]*?\.item\s*{[^}]*--dimension:\s*60px;[^}]*--border:\s*6px;/s.test(
        sectionSideNavCss
      ) &&
      /@media \(min-width:\s*640px\)\s*{[^]*?\.itemSplat\s*{[^}]*--width:\s*81px;[^}]*--height:\s*72px;/s.test(
        sectionSideNavCss
      ) &&
      /@media \(min-width:\s*1024px\)\s*{[^}]*\.sidebar\s*{[^}]*right:\s*calc\(var\(--base-space,\s*8px\) \* 5\);/s.test(
        sectionSideNavCss
      ),
  },
  {
    name: 'SectionSideNav fits dense menus inside short viewport heights',
    pass:
      sectionSideNav.includes('ResizeObserver') &&
      sectionSideNav.includes('SIDE_NAV_VIEWPORT_MARGIN') &&
      sectionSideNav.includes('SIDE_NAV_MIN_SCALE') &&
      sectionSideNavCss.includes('--section-side-nav-fit-scale') &&
      sectionSideNavCss.includes('--section-side-nav-center-y') &&
      sideNavHasDeclaration('.sidebar', 'transform-origin: right center;') &&
      sideNavHasDeclaration('.sidebar', 'top: var(--section-side-nav-center-y);') &&
      sideNavHasDeclaration(
        '.sidebar',
        'transform: translateY(-50%) scale(var(--section-side-nav-fit-scale));'
      ) &&
      sideNavHasDeclaration(
        ".sidebar[data-overflow='scroll']",
        'max-block-size: var(--section-side-nav-max-block-size);'
      ),
  },
  {
    name: 'Demo sections reserve a mobile safe area for the fixed reference-style sidebar',
    pass:
      section.includes('var(--section-side-nav-safe-area,0px)') &&
      page.includes('topInset={40}') &&
      page.includes('[--section-side-nav-safe-area:3.5rem]') &&
      page.includes('sm:[--section-side-nav-safe-area:5.5rem]') &&
      page.includes('lg:[--section-side-nav-safe-area:0px]'),
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
