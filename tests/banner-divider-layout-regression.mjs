import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'ui', 'banner-divider.tsx')
const sectionPath = path.join(root, 'src', 'components', 'ui', 'section.tsx')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const cssPath = path.join(root, 'src', 'components', 'ui', 'banner-divider.module.css')

const component = fs.readFileSync(componentPath, 'utf8')
const section = fs.readFileSync(sectionPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')

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
    name: 'BannerDivider defaults to an overlay layout instead of reserving vertical page space',
    pass:
      component.includes("layout = 'overlay'") &&
      component.includes("layout?: 'overlay' | 'spacer'") &&
      component.includes('data-slot="banner-divider"') &&
      component.includes('data-layout={layout}') &&
      hasDeclaration('.bannerDividerGroup', 'block-size: 0;') &&
      !/^\s*height:\s*47px;/m.test(block('.bannerDividerGroup')),
  },
  {
    name: 'BannerDivider keeps a spacer opt-in for intentional occupied layouts',
    pass:
      component.includes("layout === 'spacer' && styles.bannerDividerGroupSpacer") &&
      hasDeclaration('.bannerDividerGroupSpacer', 'block-size: var(--banner-divider-height);'),
  },
  {
    name: 'BannerDivider visual layer remains absolutely positioned and animated independently',
    pass:
      component.includes('ref={animate ? ref : undefined}') &&
      component.includes('styles.bannerDividerViewport') &&
      hasDeclaration('.bannerDividerViewport', 'position: absolute;') &&
      hasDeclaration(
        '.bannerDividerViewport',
        'top: var(--banner-divider-anchor-y, calc(var(--banner-divider-height) * -0.5));'
      ) &&
      hasDeclaration('.bannerDividerViewport', 'overflow-x: clip;') &&
      hasDeclaration('.bannerDividerViewport', 'overflow-y: visible;'),
  },
  {
    name: 'BannerDivider decoration cannot intercept section interactions',
    pass:
      hasDeclaration('.bannerDividerGroup', 'pointer-events: none;') &&
      hasDeclaration('.bannerDividerViewport', 'pointer-events: none;'),
  },
  {
    name: 'Divider clearance is expressed through the Section overlay API instead of page padding patches',
    pass:
      section.includes("bottomOverlayClearance?: 'none' | 'banner-divider'") &&
      section.includes("bottomOverlayClearance === 'banner-divider'") &&
      section.includes('layoutTokens.bannerDividerClearance') &&
      !section.includes('bottomSafeArea') &&
      !section.includes('section-bottom-safe-area') &&
      !page.includes('BANNER_DIVIDER_BOTTOM_SAFE_AREA') &&
      !page.includes('bottomSafeArea=') &&
      !page.includes('pb-[clamp(8rem,10vw,11.5rem)]') &&
      (page.match(/bottomOverlayClearance="banner-divider"/g) ?? []).length === 8,
  },
  {
    name: 'Demo page places a divider at every section boundary that reserves divider clearance',
    pass:
      (page.match(/<BannerDivider/g) ?? []).length === 8 &&
      page.includes('Banner divider: Titles → Buttons & Badges') &&
      page.includes('<BannerDivider pattern="design2" color="blue" animate />') &&
      page.includes('Banner divider: Apparel Tags → Card Grid') &&
      page.includes('<BannerDivider pattern="design2" color="purple" animate />') &&
      page.includes('Banner divider: Card Grid → Carousels'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('BannerDivider layout checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('BannerDivider layout checks passed.')
