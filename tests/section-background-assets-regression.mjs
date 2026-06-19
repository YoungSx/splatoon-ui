import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'ui', 'section-background.tsx')
const cssPath = path.join(root, 'src', 'components', 'ui', 'section-background.module.css')
const backgroundDir = path.join(root, 'public', '_images', 'backgrounds')

const component = fs.readFileSync(componentPath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')

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
    name: 'hardware background keeps the official contain/no-repeat responsive treatment',
    pass:
      css.includes('.patternHardwareBackground') &&
      css.includes('background-repeat: no-repeat;') &&
      css.includes('background-size: contain;') &&
      /@media screen and \(min-width:\s*640px\)\s*{[^}]*\.patternHardwareBackground/s.test(css) &&
      css.includes('hardware-background-medium-up.png') &&
      css.includes('hardware-background-medium-up-2x.png'),
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
