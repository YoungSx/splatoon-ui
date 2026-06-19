import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentPath = path.join(root, 'src', 'components', 'ui', 'video-dialog.tsx')
const pagePath = path.join(root, 'src', 'app', 'page.tsx')

const component = fs.readFileSync(componentPath, 'utf8')
const page = fs.readFileSync(pagePath, 'utf8')

const checks = [
  {
    name: 'VideoDialog thumbnail supports stable image dimensions and responsive sources',
    pass:
      component.includes('width?: number') &&
      component.includes('height?: number') &&
      component.includes('srcSet?: string') &&
      component.includes('sizes?: string') &&
      component.includes('loading?: React.ComponentProps'),
  },
  {
    name: 'VideoDialog thumbnail trigger exposes an accessible name by default',
    pass:
      component.includes("'aria-label': ariaLabel") &&
      component.includes("'aria-labelledby': ariaLabelledBy") &&
      component.includes('Open video: ${alt}') &&
      component.includes('aria-label={resolvedAriaLabel}') &&
      component.includes('aria-labelledby={ariaLabelledBy}'),
  },
  {
    name: 'VideoDialog decorative thumbnail tapes come from the shared official asset registry',
    pass:
      component.includes("import { TapePicture } from './tape-picture'") &&
      component.includes('asset="tape-2"') &&
      component.includes('asset="tape-3"') &&
      !component.includes('/_images/tape-assets/tape-2') &&
      !component.includes('/_images/tape-assets/tape-3'),
  },
  {
    name: 'VideoDialogContent supports native mp4/webm playback without forcing iframe embeds',
    pass:
      component.includes("type VideoDialogContentMode = 'iframe' | 'video'") &&
      component.includes("mode = 'iframe'") &&
      component.includes('<video') &&
      component.includes("preload = 'none'") &&
      component.includes('sources?: VideoDialogVideoSource[]') &&
      component.includes('tracks?: VideoDialogTrack[]') &&
      component.includes('<source') &&
      component.includes('<track') &&
      component.includes('poster={poster}') &&
      component.includes('playsInline={playsInline}'),
  },
  {
    name: 'demo VideoDialog thumbnail declares curated dimensions to avoid layout shift',
    pass:
      page.includes('<VideoDialogThumbnail') &&
      page.includes('showcaseMediaAssets.trailerThumbnail.src') &&
      page.includes('width={showcaseMediaAssets.trailerThumbnail.width}') &&
      page.includes('height={showcaseMediaAssets.trailerThumbnail.height}') &&
      page.includes('aria-label="Open Splatoon UI demo reel"') &&
      page.includes('loading="eager"'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('VideoDialog media checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('VideoDialog media checks passed.')
