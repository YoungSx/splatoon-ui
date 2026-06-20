import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentRoot = path.join(root, 'src', 'components', 'ui')

const carousel = fs.readFileSync(path.join(componentRoot, 'carousel.tsx'), 'utf8')
const dialog = fs.readFileSync(path.join(componentRoot, 'dialog.tsx'), 'utf8')
const videoDialog = fs.readFileSync(path.join(componentRoot, 'video-dialog.tsx'), 'utf8')
const cardStackCarousel = fs.readFileSync(
  path.join(componentRoot, 'card-stack-carousel.tsx'),
  'utf8'
)
const feedCarousel = fs.readFileSync(path.join(componentRoot, 'feed-carousel.tsx'), 'utf8')
const section = fs.readFileSync(path.join(componentRoot, 'section.tsx'), 'utf8')

const checks = [
  {
    name: 'Carousel supports controlled and uncontrolled index APIs',
    pass:
      carousel.includes('index?: number') &&
      carousel.includes('defaultIndex?: number') &&
      carousel.includes('@deprecated Use defaultIndex') &&
      carousel.includes('const isControlled = index !== undefined') &&
      carousel.includes('onIndexChange?.(next)'),
  },
  {
    name: 'Carousel provides item indexes through context instead of cloneElement prop injection',
    pass:
      carousel.includes('CarouselItemIndexContext') &&
      carousel.includes('<CarouselItemIndexContext.Provider') &&
      !carousel.includes('React.cloneElement(child'),
  },
  {
    name: 'Dialog trigger registration is ref-based and does not query the DOM tree',
    pass:
      dialog.includes('registerTrigger') &&
      dialog.includes('mergeRefs(registerTrigger') &&
      !dialog.includes('querySelector<HTMLButtonElement>') &&
      !dialog.includes('[data-slot="dialog-trigger"]'),
  },
  {
    name: 'VideoDialogThumbnail uses the shared DialogTrigger registration path',
    pass:
      videoDialog.includes("import { Dialog, DialogContent, DialogTrigger }") &&
      videoDialog.includes('<DialogTrigger') &&
      !videoDialog.includes('DialogPrimitive.Trigger'),
  },
  {
    name: 'CardStackCarousel exposes semantic item layout presets for higher-level components',
    pass:
      cardStackCarousel.includes('itemLayout?: CardStackCarouselItemLayout') &&
      cardStackCarousel.includes('feed: "clamp(16.5rem, 19vw, 23rem)"') &&
      feedCarousel.includes('itemLayout="feed"') &&
      !feedCarousel.includes('shellStyle='),
  },
  {
    name: 'Section owns overlay clearance semantics used by BannerDivider boundaries',
    pass:
      section.includes('bottomOverlayClearance') &&
      section.includes("bottomOverlayClearance === 'banner-divider'") &&
      section.includes('pb-[clamp(8rem,10vw,11.5rem)]'),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Component API encapsulation checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Component API encapsulation checks passed.')
