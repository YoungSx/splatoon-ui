import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pagePath = path.join(root, 'src', 'app', 'page.tsx')
const feedCarouselPath = path.join(root, 'src', 'components', 'ui', 'feed-carousel.tsx')

const page = fs.readFileSync(pagePath, 'utf8')
const feedCarousel = fs.readFileSync(feedCarouselPath, 'utf8')

const requiredPageAssetRefs = [
  'eventImageAssets.bigRunCallout',
  'eventImageAssets.splatnetBlade',
  'eventImageAssets.splatnetNextPage',
  'showcaseMediaAssets.turfWarLeft',
  'showcaseMediaAssets.ruggedMode',
  'showcaseMediaAssets.splatfestSecondary',
]

const requiredLocalAssets = [
  ['public/_images/events/big-run-callout.jpg', 'jpg'],
  ['public/_images/events/splatnet-blade.jpg', 'jpg'],
  ['public/_images/events/splatnet-next-page.png', 'png'],
  ['public/_images/gameplay/battle-online/gameplay-battle-online-turfwar-left-screen.jpg', 'jpg'],
  ['public/_images/gameplay/gameplay-salmonrun.jpg', 'jpg'],
  ['public/_images/gameplay/splatfest/gameplay-splatfest-2.jpg', 'jpg'],
]

function hasNoHttpErrorPayload(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('utf8')
  return (
    !sample.includes('<Error><Code>AccessDenied</Code>') &&
    !sample.includes('<Message>Access Denied</Message>') &&
    !sample.includes('<!DOCTYPE html>')
  )
}

function hasValidImageSignature([relativePath, type]) {
  const filePath = path.join(root, relativePath)
  if (!fs.existsSync(filePath)) return false
  const buffer = fs.readFileSync(filePath)
  if (!hasNoHttpErrorPayload(buffer)) return false

  if (type === 'png') {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }

  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
}

const checks = [
  {
    name: 'FeedCarousel component consumes the image field that the demo data provides',
    pass:
      feedCarousel.includes('"image"') &&
      feedCarousel.includes('image={item.image}') &&
      feedCarousel.includes('title={item.title}') &&
      feedCarousel.includes('subtitle={item.subtitle}'),
  },
  {
    name: 'feed carousel demo uses curated event and showcase images',
    pass:
      page.includes('function FeedCardImage') &&
      page.includes("const FEED_CARD_MEDIA_ASPECT_RATIO = '558 / 313'") &&
      page.includes('const homepageFeedCarouselItems = [') &&
      requiredPageAssetRefs.every((entry) => page.includes(entry)) &&
      page.includes('image: <FeedCardImage') &&
      page.includes('loading="eager"'),
  },
  {
    name: 'feed carousel demo no longer uses number tiles or non-consumed media fields',
    pass:
      !page.includes('SNAP 0') &&
      !page.includes('Battle Record #') &&
      !page.includes('Demo feed card') &&
      !page.includes('mediaClassName') &&
      !page.includes('paperLabel') &&
      !page.includes('media: <span'),
  },
  {
    name: 'feed carousel item CTAs keep the reference-style arrow treatment consistently',
    pass:
      page.includes('<Button size="sm" variant="arrow">Read</Button>') &&
      !page.includes('index % 2') &&
      !page.includes("variant={index % 2 === 0 ? 'arrow' : 'blue'}"),
  },
  {
    name: 'feed carousel item media keeps a stable shared aspect ratio',
    pass:
      page.includes('aspectRatio: FEED_CARD_MEDIA_ASPECT_RATIO') &&
      page.includes("style={{ objectFit: 'cover' }}") &&
      page.includes('className="block w-full overflow-hidden"'),
  },
  {
    name: 'feed carousel local media files are valid images',
    pass: requiredLocalAssets.every(hasValidImageSignature),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Feed carousel asset checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Feed carousel asset checks passed.')
