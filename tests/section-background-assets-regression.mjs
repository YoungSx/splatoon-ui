import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'section-background.tsx'
)
const cssPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'section-background.module.css'
)
const pagePath = path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx')
const backgroundDir = path.join(root, 'packages', 'ui', 'public', '_images', 'backgrounds')

const component = fs.readFileSync(componentPath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')

const newPatternAssets = [
  'base-bg-pattern.jpg',
  'base-bg-pattern-2x.jpg',
  'camo-purple-revised.png',
  'camo-purple-revised-2x.png',
  'camo-white-outline.png',
  'camo-white-outline-2x.png',
  'hardware-background.png',
  'hardware-background-2x.png',
  'hardware-background-medium-up.png',
  'hardware-background-medium-up-2x.png',
  'octo-red.png',
  'octo-red-2x.png',
  'octoarrow-green.png',
  'octoarrow-green-2x.png',
  'octoarrow-orange.png',
  'octoarrow-orange-2x.png',
  'squid-black.png',
  'squid-black-2x.png',
]

const newPatterns = [
  ['base-bg-pattern', 'patternBaseBgPattern'],
  ['camo-purple-revised', 'patternCamoPurpleRevised'],
  ['camo-white-outline', 'patternCamoWhiteOutline'],
  ['hardware-background', 'patternHardwareBackground'],
  ['octo-red', 'patternOctoRed'],
  ['octoarrow-green', 'patternOctoarrowGreen'],
  ['octoarrow-orange', 'patternOctoarrowOrange'],
  ['squid-black', 'patternSquidBlack'],
]

const tapeBackgroundSets = {
  black: ['jpg', 'webp'],
  green: ['jpg', 'webp'],
  purple: ['jpg', 'webp'],
  pattern: ['jpg'],
}

const tapeBackgroundAssets = Object.entries(tapeBackgroundSets).flatMap(([name, extensions]) =>
  extensions.flatMap((extension) => [`tapes-${name}.${extension}`, `tapes-${name}-2x.${extension}`])
)

const checks = [
  {
    name: 'curated official SectionBackground assets are available under public/_images',
    pass: newPatternAssets.every((asset) => fs.existsSync(path.join(backgroundDir, asset))),
  },
  {
    name: 'SectionBackground exposes the newly crawled background patterns through its public type',
    pass: newPatterns.every(
      ([pattern, styleName]) =>
        new RegExp(`\\|\\s*['"]${pattern}['"]`).test(component) &&
        component.includes(`styles.${styleName}`)
    ),
  },
  {
    name: 'SectionBackground CSS references each new pattern with 1x and 2x image-set assets',
    pass: newPatternAssets.every((asset) => css.includes(`/_images/backgrounds/${asset}`)),
  },
  {
    name: 'official tape backgrounds include every available 1x and 2x JPG/WebP asset',
    pass:
      tapeBackgroundAssets.every((asset) => fs.existsSync(path.join(backgroundDir, asset))) &&
      !fs.existsSync(path.join(backgroundDir, 'tapes-pattern.webp')) &&
      !fs.existsSync(path.join(backgroundDir, 'tapes-pattern-2x.webp')),
  },
  {
    name: 'SectionBackground CSS prefers WebP tape backgrounds with JPG fallback where official assets exist',
    pass:
      ['black', 'green', 'purple'].every(
        (name) =>
          css.includes(`tapes-${name}.webp') type('image/webp') 1x`) &&
          css.includes(`tapes-${name}.jpg') 1x`) &&
          css.includes(`tapes-${name}-2x.webp') type('image/webp') 2x`) &&
          css.includes(`tapes-${name}-2x.jpg') 2x`)
      ) &&
      css.includes("tapes-pattern.jpg') 1x") &&
      css.includes("tapes-pattern-2x.jpg') 2x") &&
      !css.includes('tapes-pattern.webp'),
  },
  {
    name: 'hardware background keeps the official contain/no-repeat responsive treatment',
    pass:
      css.includes('.patternHardwareBackground') &&
      css.includes('background-repeat: no-repeat;') &&
      css.includes('background-size: contain;') &&
      /@media screen and \(min-width:\s*640px\)\s*{[^}]*\.patternHardwareBackground/s.test(css) &&
      css.includes('hardware-background-medium-up.png') &&
      css.includes('hardware-background-medium-up-2x.png'),
  },
  {
    name: 'Demo page pairs busy tape and camo backgrounds with readable text contrast',
    pass:
      /id="trailer"[\s\S]*?backgroundClassName="bg-black"[\s\S]*?textClassName="text-white"[\s\S]*?pattern="tapes-black"/.test(
        page
      ) &&
      /id="cards-surfaces"[\s\S]*?backgroundClassName="bg-white"[\s\S]*?textClassName="text-chaos-black"[\s\S]*?pattern="camo-white-outline"/.test(
        page
      ) &&
      !/id="trailer"[\s\S]*?backgroundClassName="bg-white"[\s\S]*?textClassName="text-chaos-black"[\s\S]*?pattern="tapes-black"/.test(
        page
      ) &&
      !/id="cards-surfaces"[\s\S]*?pattern="camo-purple"/.test(page),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('SectionBackground asset regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('SectionBackground asset regression checks passed.')
