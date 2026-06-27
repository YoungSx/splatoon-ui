import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const componentRoot = path.join(root, 'src', 'components', 'ui')

const carousel = fs.readFileSync(path.join(componentRoot, 'carousel.tsx'), 'utf8')
const dialog = fs.readFileSync(path.join(componentRoot, 'dialog.tsx'), 'utf8')
const videoDialog = fs.readFileSync(path.join(componentRoot, 'video-dialog.tsx'), 'utf8')
const stapleCard = fs.readFileSync(path.join(componentRoot, 'staple-card.tsx'), 'utf8')
const stapleCardCss = fs.readFileSync(path.join(componentRoot, 'staple-card.module.css'), 'utf8')
const tornCard = fs.readFileSync(path.join(componentRoot, 'torn-card.tsx'), 'utf8')
const tornCardCss = fs.readFileSync(path.join(componentRoot, 'torn-card.module.css'), 'utf8')
const photoFrame = fs.readFileSync(path.join(componentRoot, 'photo-frame.tsx'), 'utf8')
const cardStackCarousel = fs.readFileSync(
  path.join(componentRoot, 'card-stack-carousel.tsx'),
  'utf8'
)
const feedCarousel = fs.readFileSync(path.join(componentRoot, 'feed-carousel.tsx'), 'utf8')
const section = fs.readFileSync(path.join(componentRoot, 'section.tsx'), 'utf8')
const assetImage = fs.readFileSync(path.join(componentRoot, 'asset-image.tsx'), 'utf8')
const triggerButton = fs.readFileSync(path.join(componentRoot, 'trigger-button.tsx'), 'utf8')
const tabs = fs.readFileSync(path.join(componentRoot, 'tabs.tsx'), 'utf8')
const tabsCss = fs.readFileSync(path.join(componentRoot, 'tabs.module.css'), 'utf8')
const demoPage = fs.readFileSync(path.join(root, 'src', 'app', 'page.tsx'), 'utf8')

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
      dialog.includes('createTriggerButton') &&
      triggerButton.includes('useRegisterRef') &&
      triggerButton.includes('mergeRefs(registerRef, triggerRef, ref)') &&
      !triggerButton.includes('no-explicit-any') &&
      !dialog.includes('querySelector<HTMLButtonElement>') &&
      !dialog.includes('[data-slot="dialog-trigger"]'),
  },
  {
    name: 'VideoDialogThumbnail uses the shared DialogTrigger registration path',
    pass:
      videoDialog.includes('import { Dialog, DialogContent, DialogTrigger }') &&
      videoDialog.includes('<DialogTrigger') &&
      !videoDialog.includes('DialogPrimitive.Trigger'),
  },
  {
    name: 'CardStackCarousel exposes semantic item layout presets for higher-level components',
    pass:
      cardStackCarousel.includes('itemLayout?: CardStackCarouselItemLayout') &&
      cardStackCarousel.includes('feed: layoutTokens.feedCarouselItemWidth') &&
      feedCarousel.includes('itemLayout="feed"') &&
      !feedCarousel.includes('shellStyle='),
  },
  {
    name: 'Section owns overlay clearance semantics used by BannerDivider boundaries',
    pass:
      section.includes('bottomOverlayClearance') &&
      section.includes("bottomOverlayClearance === 'banner-divider'") &&
      section.includes('pb-[var(--section-overlay-clearance)]') &&
      section.includes('layoutTokens.bannerDividerClearance'),
  },
  {
    name: 'Card decorations use the shared MediaDecoration abstraction',
    pass:
      stapleCard.includes('MediaDecoration') &&
      tornCard.includes('MediaDecoration') &&
      photoFrame.includes('MediaDecoration') &&
      videoDialog.includes('MediaDecoration'),
  },
  {
    name: 'TornCard keeps intrinsic rotation and shadow on an inner visual layer',
    pass:
      tornCard.includes('className={styles.visual}') &&
      tornCard.includes("'--torn-card-rotation': resolvedRotation") &&
      !tornCard.includes("filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,.3))'") &&
      tornCardCss.includes('.visual') &&
      tornCardCss.includes('filter: drop-shadow(2px 2px 2px rgb(0 0 0 / 0.3));') &&
      tornCardCss.includes('transform: rotate(var(--torn-card-rotation, 0deg));'),
  },
  {
    name: 'Paper-style surfaces share PaperSurface instead of rebuilding tear edges',
    pass:
      dialog.includes('PaperSurface') &&
      stapleCard.includes('PaperSurface') &&
      !stapleCard.includes('PaperTearEdge') &&
      !dialog.includes('PaperTearEdge'),
  },
  {
    name: 'StapleCard owns its responsive staple safe area inside the component surface',
    pass:
      stapleCard.includes('contentClassName={styles.cardSurface}') &&
      stapleCard.includes('styles.stapleLayer') &&
      !stapleCard.includes('<picture>') &&
      !stapleCard.includes('imgMobile') &&
      !stapleCard.includes('imgDesktop') &&
      stapleCardCss.includes('container-type: inline-size;') &&
      stapleCardCss.includes('.stapleLayer img') &&
      stapleCardCss.includes('--staple-card-staple-clearance') &&
      stapleCardCss.includes(
        'max(var(--staple-card-block-padding-end), var(--staple-card-staple-clearance))'
      ),
  },
  {
    name: 'Dialog danger surface owns title and description colors instead of demo overrides',
    pass:
      dialog.includes('DialogSurfaceContext') &&
      dialog.includes("const DANGER_SURFACE_TITLE_COLOR = 'var(--danger-surface-title)'") &&
      dialog.includes(
        "const DANGER_SURFACE_DESCRIPTION_COLOR = 'var(--danger-surface-description)'"
      ) &&
      dialog.includes("surface === 'danger' ? { color: DANGER_SURFACE_TITLE_COLOR }") &&
      dialog.includes("surface === 'danger' ? { color: DANGER_SURFACE_DESCRIPTION_COLOR }") &&
      demoPage.includes('<DialogContent surface="danger"') &&
      !demoPage.includes('<DialogTitle className="text-white">Destructive State</DialogTitle>') &&
      !demoPage.includes('<DialogDescription className="text-white/80">'),
  },
  {
    name: 'AssetImage exposes reusable fit/fill media props consumed by the demo feed',
    pass:
      assetImage.includes('fit?: React.CSSProperties') &&
      assetImage.includes('fill?: boolean') &&
      demoPage.includes('<AssetImage') &&
      demoPage.includes('fit="cover"') &&
      !demoPage.includes("style={{ objectFit: 'cover' }}"),
  },
  {
    name: 'Demo page uses demo layout primitives for repeated content groups',
    pass:
      demoPage.includes('DemoContent') &&
      demoPage.includes('DemoExampleGroup') &&
      !demoPage.includes("style={{ maxWidth: '64rem' }}") &&
      !demoPage.includes("style={{ maxWidth: '48rem' }}"),
  },
  {
    name: 'TabsList exposes decoration color API backed by Splatoon theme-pair tokens',
    pass:
      tabs.includes('decorationColor?: string') &&
      tabs.includes('const resolvedDecorationColor =') &&
      tabs.includes('decorationColor ?? getTabsDecorationColor(resolvedVariant, resolvedColor)') &&
      tabs.includes("'--tabs-decoration-color': resolvedDecorationColor") &&
      tabs.includes('tabsDecorationColorByColor') &&
      tabs.includes("yellow: 'var(--color-blue)'") &&
      tabs.includes("blue: 'var(--color-yellow)'") &&
      tabs.includes("if (variant === 'trapezoid')") &&
      tabs.includes("return 'var(--color-blue)'") &&
      tabsCss.includes('background-color: var(--tabs-decoration-color);') &&
      tabsCss.includes('fill: var(--tabs-decoration-color);') &&
      demoPage.includes('decorationColor="var(--color-blue)"'),
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
