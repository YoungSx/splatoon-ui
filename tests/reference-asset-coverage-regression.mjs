import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'packages', 'ui', 'public')
const legacyPublicImagesDir = path.join(publicDir, 'images')
const readmePath = path.join(root, 'README.md')
const readmeZhPath = path.join(root, 'README_ZH.md')
const componentSourceFiles = [
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'dialog.tsx'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'staple-card.tsx'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'media-decoration.tsx'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'paper-surface.tsx'),
]
const newsAssetsPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'news-assets.ts'
)
const paperTearEdgePath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'paper-tear-edge.tsx'
)
const tapeComponentPath = path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'tape.tsx')
const navSplatPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'splats',
  'nav-splat.tsx'
)
const sectionSideNavCssPath = path.join(
  root,
  'packages',
  'ui',
  'src',
  'components',
  'ui',
  'section-side-nav.module.css'
)
const staticSvgStylePaths = [
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'photo-frame.module.css'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'carousel-pagination.module.css'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'tape-title.module.css'),
  path.join(root, 'packages', 'ui', 'src', 'components', 'ui', 'black-tape-container.module.css'),
]

const requiredAssets = [
  'public/_images/events/big-run-callout.jpg',
  'public/_images/events/active-splat.webp',
  'public/_images/events/active-splat-2x.webp',
  'public/_images/events/golden-egg.png',
  'public/_images/events/splatnet-blade.jpg',
  'public/_images/events/splatnet-next-page.png',
  'public/_images/news/news-staple-left.png',
  'public/_images/news/news-staple-right.png',
  'public/_images/news/next-page.png',
  'public/_images/svg/styled-photo-background.svg',
  'public/_images/svg/icon-pagination.svg',
  'public/_images/svg/pagination-splat.svg',
  'public/_images/svg/left-tape.svg',
  'public/_images/svg/right-tape.svg',
  'public/_images/svg/left-black-tape-container.svg',
  'public/_images/svg/right-black-tape-container.svg',
  'public/_images/svg/left-yellow-tape-container.svg',
  'public/_images/svg/right-yellow-tape-container.svg',
  'public/_images/svg/paper-tear-up.svg',
  'public/_images/svg/paper-tear-down.svg',
]

const source = componentSourceFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n')
const readmes = [readmePath, readmeZhPath]
  .map((filePath) => fs.readFileSync(filePath, 'utf8'))
  .join('\n')
const newsAssets = fs.readFileSync(newsAssetsPath, 'utf8')
const paperTearEdge = fs.readFileSync(paperTearEdgePath, 'utf8')
const tapeComponent = fs.readFileSync(tapeComponentPath, 'utf8')
const navSplat = fs.readFileSync(navSplatPath, 'utf8')
const sectionSideNavCss = fs.readFileSync(sectionSideNavCssPath, 'utf8')
const staticSvgStyles = staticSvgStylePaths
  .map((filePath) => fs.readFileSync(filePath, 'utf8'))
  .join('\n')

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(entryPath)
    if (entry.isFile()) return [entryPath]
    return []
  })
}

const publicFiles = listFiles(publicDir)
const publicErrorPayloads = publicFiles.filter((filePath) => {
  const buffer = fs.readFileSync(filePath)
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8')
  return (
    sample.includes('<Error><Code>AccessDenied</Code>') ||
    sample.includes('<Message>Access Denied</Message>') ||
    sample.includes('<!DOCTYPE html>')
  )
})

const invalidFontFiles = publicFiles.filter((filePath) => {
  if (!/\.(woff2?|ttf|otf)$/i.test(filePath)) return false
  const header = fs.readFileSync(filePath).subarray(0, 4).toString('latin1')
  if (filePath.endsWith('.woff')) return header !== 'wOFF'
  if (filePath.endsWith('.woff2')) return header !== 'wOF2'
  return !['\x00\x01\x00\x00', 'OTTO'].includes(header)
})

const checks = [
  {
    name: 'interactive event, news pin, and static svg reference assets are available under public/_images',
    pass: requiredAssets.every((assetPath) =>
      fs.existsSync(path.join(root, 'packages', 'ui', assetPath))
    ),
  },
  {
    name: 'published public assets do not contain captured HTTP error payloads',
    pass: publicErrorPayloads.length === 0,
  },
  {
    name: 'published font files have valid font container signatures',
    pass: invalidFontFiles.length === 0,
  },
  {
    name: 'publishable assets stay in public/_images instead of the legacy public/images tree',
    pass:
      !fs.existsSync(legacyPublicImagesDir) &&
      readmes.includes('public/_images/') &&
      readmes.includes('public/svgs/') &&
      !readmes.includes('images/svg/'),
  },
  {
    name: 'dialog and StapleCard use the shared tape asset registry instead of legacy /images paths',
    pass:
      source.includes('MediaDecoration') &&
      source.includes('TapePicture') &&
      !source.includes('/images/tape-assets/') &&
      !source.includes('/images/news/'),
  },
  {
    name: 'news staple assets are centralized under the canonical _images path',
    pass:
      source.includes('newsStapleAssets') &&
      newsAssets.includes('/_images/news/news-staple-left.png') &&
      newsAssets.includes('/_images/news/news-staple-right.png'),
  },
  {
    name: 'Staple primitive renders official news staple images instead of hand-drawn metal SVGs',
    pass:
      tapeComponent.includes('newsStapleAssets') &&
      tapeComponent.includes('<img') &&
      !tapeComponent.includes('metal-grad') &&
      !tapeComponent.includes('Papery warning badge') &&
      !tapeComponent.includes('Metal Pin'),
  },
  {
    name: 'component CSS uses canonical _images svg paths instead of legacy /images/svg paths',
    pass:
      staticSvgStyles.includes('/_images/svg/styled-photo-background.svg') &&
      staticSvgStyles.includes('/_images/svg/icon-pagination.svg') &&
      staticSvgStyles.includes('/_images/svg/pagination-splat.svg') &&
      staticSvgStyles.includes('--image-pagination-accent: var(--color-world-purple, #a51ee1);') &&
      staticSvgStyles.includes("background-image: url('/_images/svg/pagination-splat.svg');") &&
      staticSvgStyles.includes('border-color: var(--image-pagination-accent);') &&
      staticSvgStyles.includes('/_images/svg/left-tape.svg') &&
      staticSvgStyles.includes('/_images/svg/right-tape.svg') &&
      staticSvgStyles.includes('/_images/svg/left-black-tape-container.svg') &&
      staticSvgStyles.includes('/_images/svg/right-black-tape-container.svg') &&
      staticSvgStyles.includes('/_images/svg/left-yellow-tape-container.svg') &&
      staticSvgStyles.includes('/_images/svg/right-yellow-tape-container.svg') &&
      staticSvgStyles.includes('--tape-left-width: 65px;') &&
      staticSvgStyles.includes('--tape-right-width: 74px;') &&
      staticSvgStyles.includes('background-size: 100% auto;') &&
      staticSvgStyles.includes('background-position: right top;') &&
      staticSvgStyles.includes('background-position: left top;') &&
      !staticSvgStyles.includes('background-position: calc(100% - 1px) top;') &&
      !staticSvgStyles.includes('background-position: 1px top;') &&
      !staticSvgStyles.includes('/images/svg/'),
  },
  {
    name: 'section side nav active splat keeps the official gallery nav symbol',
    pass:
      navSplat.includes('icon-gallery-nav-splat') &&
      navSplat.includes('viewBox="0 0 156 136"') &&
      navSplat.includes('<path') &&
      !navSplat.includes('/_images/events/active-splat-2x.webp') &&
      sectionSideNavCss.includes('--width: 62px;') &&
      sectionSideNavCss.includes('--height: 55px;') &&
      sectionSideNavCss.includes('left: 45%;') &&
      sectionSideNavCss.includes('top: 45%;'),
  },
  {
    name: 'dialog and StapleCard share PaperTearEdge inline SVG without duplicating paths in consumer sources',
    pass:
      source.includes('PaperSurface') &&
      source.includes('PaperTearEdge') &&
      paperTearEdge.includes('viewBox') &&
      paperTearEdge.includes('fillRule="evenodd"') &&
      paperTearEdge.includes('M253.96 23.774') &&
      paperTearEdge.includes('M0 .826c0 9.527') &&
      !source.includes('M253.96 23.774') &&
      !source.includes('M0 .826c0 9.527'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Reference asset coverage checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Reference asset coverage checks passed.')
