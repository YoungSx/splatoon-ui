import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const componentRoot = path.join(root, 'packages', 'ui', 'src', 'components', 'ui')
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, 'packages', 'ui', 'package.json'), 'utf8')
)
const docsApi = JSON.parse(
  fs.readFileSync(path.join(root, 'apps', 'docs', 'src', 'docs', 'generated', 'api.json'), 'utf8')
)

const alert = fs.readFileSync(path.join(componentRoot, 'alert.tsx'), 'utf8')
const carousel = fs.readFileSync(path.join(componentRoot, 'carousel.tsx'), 'utf8')
const carouselCore = fs.readFileSync(path.join(componentRoot, 'carousel-core.tsx'), 'utf8')
const dialog = fs.readFileSync(path.join(componentRoot, 'dialog.tsx'), 'utf8')
const popover = fs.readFileSync(path.join(componentRoot, 'popover.tsx'), 'utf8')
const sheet = fs.readFileSync(path.join(componentRoot, 'sheet.tsx'), 'utf8')
const videoDialog = fs.readFileSync(path.join(componentRoot, 'video-dialog.tsx'), 'utf8')
const button = fs.readFileSync(path.join(componentRoot, 'button.tsx'), 'utf8')
const buttonArrow = fs.readFileSync(path.join(componentRoot, 'button-arrow.tsx'), 'utf8')
const buttonDrip = fs.readFileSync(path.join(componentRoot, 'button-drip.tsx'), 'utf8')
const buttonGroup = fs.readFileSync(path.join(componentRoot, 'button-group.tsx'), 'utf8')
const card = fs.readFileSync(path.join(componentRoot, 'card.tsx'), 'utf8')
const cardSlot = fs.readFileSync(path.join(componentRoot, 'card-slot.tsx'), 'utf8')
const stapleCard = fs.readFileSync(path.join(componentRoot, 'staple-card.tsx'), 'utf8')
const stapleCardCss = fs.readFileSync(path.join(componentRoot, 'staple-card.module.css'), 'utf8')
const tornCard = fs.readFileSync(path.join(componentRoot, 'torn-card.tsx'), 'utf8')
const tornCardCss = fs.readFileSync(path.join(componentRoot, 'torn-card.module.css'), 'utf8')
const photoFrame = fs.readFileSync(path.join(componentRoot, 'photo-frame.tsx'), 'utf8')
const photoFrameCss = fs.readFileSync(path.join(componentRoot, 'photo-frame.module.css'), 'utf8')
const galleryBaseCss = fs.readFileSync(path.join(componentRoot, 'gallery-base.module.css'), 'utf8')
const cardImage = fs.readFileSync(path.join(componentRoot, 'card-image.tsx'), 'utf8')
const ruggedCard = fs.readFileSync(path.join(componentRoot, 'rugged-card.tsx'), 'utf8')
const ruggedCardCss = fs.readFileSync(path.join(componentRoot, 'rugged-card.module.css'), 'utf8')
const cardStackCarousel = fs.readFileSync(
  path.join(componentRoot, 'card-stack-carousel.tsx'),
  'utf8'
)
const bannerDivider = fs.readFileSync(path.join(componentRoot, 'banner-divider.tsx'), 'utf8')
const dottedDivider = fs.readFileSync(path.join(componentRoot, 'dotted-divider.tsx'), 'utf8')
const dottedDividerCss = fs.readFileSync(
  path.join(componentRoot, 'dotted-divider.module.css'),
  'utf8'
)
const galleryControls = fs.readFileSync(path.join(componentRoot, 'gallery-controls.tsx'), 'utf8')
const checkbox = fs.readFileSync(path.join(componentRoot, 'checkbox.tsx'), 'utf8')
const input = fs.readFileSync(path.join(componentRoot, 'input.tsx'), 'utf8')
const label = fs.readFileSync(path.join(componentRoot, 'label.tsx'), 'utf8')
const blackTapeContainer = fs.readFileSync(
  path.join(componentRoot, 'black-tape-container.tsx'),
  'utf8'
)
const list = fs.readFileSync(path.join(componentRoot, 'list.tsx'), 'utf8')
const listCss = fs.readFileSync(path.join(componentRoot, 'list.module.css'), 'utf8')
const loader = fs.readFileSync(path.join(componentRoot, 'loader.tsx'), 'utf8')
const mediaDecoration = fs.readFileSync(path.join(componentRoot, 'media-decoration.tsx'), 'utf8')
const feedCarousel = fs.readFileSync(path.join(componentRoot, 'feed-carousel.tsx'), 'utf8')
const marqueeCarousel = fs.readFileSync(path.join(componentRoot, 'marquee-carousel.tsx'), 'utf8')
const weaponsGalleryCarousel = fs.readFileSync(
  path.join(componentRoot, 'weapons-gallery-carousel.tsx'),
  'utf8'
)
const weaponsGalleryCarouselCss = fs.readFileSync(
  path.join(componentRoot, 'weapons-gallery-carousel.module.css'),
  'utf8'
)
const iconPaginatedCarousel = fs.readFileSync(
  path.join(componentRoot, 'icon-paginated-carousel.tsx'),
  'utf8'
)
const section = fs.readFileSync(path.join(componentRoot, 'section.tsx'), 'utf8')
const sectionBackground = fs.readFileSync(
  path.join(componentRoot, 'section-background.tsx'),
  'utf8'
)
const sectionSideNav = fs.readFileSync(path.join(componentRoot, 'section-side-nav.tsx'), 'utf8')
const footer = fs.readFileSync(path.join(componentRoot, 'footer.tsx'), 'utf8')
const assetImage = fs.readFileSync(path.join(componentRoot, 'asset-image.tsx'), 'utf8')
const tapePicture = fs.readFileSync(path.join(componentRoot, 'tape-picture.tsx'), 'utf8')
const tapeResponsivePicturesPropsSource =
  tapePicture.match(
    /export interface TapeResponsivePicturesProps extends ImageProps \{([\s\S]*?)\n}/
  )?.[1] ?? ''
const stickerRoot = path.join(componentRoot, 'stickers')
const stickerImage = fs.readFileSync(path.join(stickerRoot, 'sticker-image.tsx'), 'utf8')
const stickerSources = ['sticker-2-red.tsx', 'sticker-10.tsx', 'sticker-5.tsx'].map((fileName) =>
  fs.readFileSync(path.join(stickerRoot, fileName), 'utf8')
)
const triggerButton = fs.readFileSync(path.join(componentRoot, 'trigger-button.tsx'), 'utf8')
const tabs = fs.readFileSync(path.join(componentRoot, 'tabs.tsx'), 'utf8')
const tabsCss = fs.readFileSync(path.join(componentRoot, 'tabs.module.css'), 'utf8')
const badgeEntry = fs.readFileSync(path.join(componentRoot, 'badge.tsx'), 'utf8')
const tornBadge = fs.readFileSync(path.join(componentRoot, 'torn-badge.tsx'), 'utf8')
const headingTape = fs.readFileSync(path.join(componentRoot, 'heading-tape.tsx'), 'utf8')
const eventCallout = fs.readFileSync(path.join(componentRoot, 'event-callout.tsx'), 'utf8')
const iconButton = fs.readFileSync(path.join(componentRoot, 'icon-button.tsx'), 'utf8')
const navMenuButton = fs.readFileSync(path.join(componentRoot, 'nav-menu-button.tsx'), 'utf8')
const blobPlayButton = fs.readFileSync(path.join(componentRoot, 'blob-play-button.tsx'), 'utf8')
const splatoonTitle = fs.readFileSync(path.join(componentRoot, 'splatoon-title.tsx'), 'utf8')
const navChevron = fs.readFileSync(path.join(componentRoot, 'nav-chevron.tsx'), 'utf8')
const paperTearEdge = fs.readFileSync(path.join(componentRoot, 'paper-tear-edge.tsx'), 'utf8')
const wideTornPaper = fs.readFileSync(path.join(componentRoot, 'wide-torn-paper.tsx'), 'utf8')
const tagHanger = fs.readFileSync(path.join(componentRoot, 'tag-hanger.tsx'), 'utf8')
const navArrowDown = fs.readFileSync(
  path.join(componentRoot, 'icons', 'nav-arrow-down.tsx'),
  'utf8'
)
const splatRoot = path.join(componentRoot, 'splats')
const splatRouter = fs.readFileSync(path.join(splatRoot, 'splat.tsx'), 'utf8')
const interactiveSplatter = fs.readFileSync(
  path.join(splatRoot, 'interactive-splatter.tsx'),
  'utf8'
)
const splatShapeSources = Array.from({ length: 12 }, (_, index) => {
  const componentName = `Splat${index + 1}`
  return [componentName, fs.readFileSync(path.join(splatRoot, `splat-${index + 1}.tsx`), 'utf8')]
})
const navSplat = fs.readFileSync(path.join(splatRoot, 'nav-splat.tsx'), 'utf8')
const inkSplashCanvas = fs.readFileSync(path.join(componentRoot, 'ink-splash-canvas.tsx'), 'utf8')
const inkTrail = fs.readFileSync(path.join(componentRoot, 'ink-trail.tsx'), 'utf8')
const inView = fs.readFileSync(path.join(componentRoot, 'in-view.tsx'), 'utf8')
const pageTransition = fs.readFileSync(path.join(componentRoot, 'page-transition.tsx'), 'utf8')
const squidMaskTransition = fs.readFileSync(
  path.join(componentRoot, 'squid-mask-transition.tsx'),
  'utf8'
)
const switchComponent = fs.readFileSync(path.join(componentRoot, 'switch.tsx'), 'utf8')
const switchCss = fs.readFileSync(path.join(componentRoot, 'switch.module.css'), 'utf8')
const segmentedControl = fs.readFileSync(path.join(componentRoot, 'segmented-control.tsx'), 'utf8')
const segmentedControlCss = fs.readFileSync(
  path.join(componentRoot, 'segmented-control.module.css'),
  'utf8'
)
const progress = fs.readFileSync(path.join(componentRoot, 'progress.tsx'), 'utf8')
const radioGroup = fs.readFileSync(path.join(componentRoot, 'radio-group.tsx'), 'utf8')
const select = fs.readFileSync(path.join(componentRoot, 'select.tsx'), 'utf8')
const buttonColorResolver = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'src', 'lib', 'resolve-button-colors.ts'),
  'utf8'
)
const reactRefs = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'src', 'lib', 'react-refs.ts'),
  'utf8'
)
const splatoonColorTokens = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'src', 'lib', 'splatoon-color-tokens.ts'),
  'utf8'
)
const tokens = fs.readFileSync(path.join(componentRoot, 'tokens.ts'), 'utf8')
const tape = fs.readFileSync(path.join(componentRoot, 'tape.tsx'), 'utf8')
const tapeTitle = fs.readFileSync(path.join(componentRoot, 'tape-title.tsx'), 'utf8')
const marquee = fs.readFileSync(path.join(componentRoot, 'marquee.tsx'), 'utf8')
const paperSurface = fs.readFileSync(path.join(componentRoot, 'paper-surface.tsx'), 'utf8')
const waveCanvas = fs.readFileSync(path.join(componentRoot, 'wave-canvas.tsx'), 'utf8')
const waveButton = fs.readFileSync(path.join(componentRoot, 'wave-button.tsx'), 'utf8')
const globals = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'src', 'styles', 'globals.css'),
  'utf8'
)
const packageStyleBuilder = fs.readFileSync(
  path.join(root, 'packages', 'ui', 'scripts', 'build-package-styles.mjs'),
  'utf8'
)
const carouselPaginationCss = fs.readFileSync(
  path.join(componentRoot, 'carousel-pagination.module.css'),
  'utf8'
)
const docsAppGlobals = fs.readFileSync(
  path.join(root, 'apps', 'docs', 'src', 'app', 'globals.css'),
  'utf8'
)
const demoPage = fs.readFileSync(path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx'), 'utf8')

function readFilesRecursive(directory, predicate) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return readFilesRecursive(entryPath, predicate)
    }

    return predicate(entryPath) ? [entryPath] : []
  })
}

const forcedUppercaseSources = [
  ...readFilesRecursive(componentRoot, (filePath) => /\.(css|tsx?)$/.test(filePath)),
  path.join(root, 'apps', 'docs', 'src', 'app', 'page.tsx'),
  path.join(root, 'packages', 'ui', 'src', 'styles', 'globals.css'),
]

const forcedUppercaseMatches = forcedUppercaseSources.flatMap((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  const matches = [
    ...source.matchAll(
      /(?:\bplaceholder:uppercase\b|\buppercase\b|text-transform:\s*uppercase\s*;)/g
    ),
  ]

  return matches.map((match) => `${path.relative(root, filePath)}:${match[0]}`)
})

const componentApiSourceFiles = readFilesRecursive(componentRoot, (filePath) =>
  /\.(tsx?)$/.test(filePath)
)

const reactForwardRefMatches = componentApiSourceFiles.flatMap((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  return [...source.matchAll(/\b(?:React\.)?forwardRef\b/g)].map(
    (match) => `${path.relative(root, filePath)}:${match[0]}`
  )
})

const broadUnknownPropMatches = componentApiSourceFiles.flatMap((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  return [
    ...source.matchAll(/\b(?:ComponentType<)?Record<string,\s*unknown>\b/g),
    ...source.matchAll(/\[\s*key:\s*string\s*\]:\s*unknown\b/g),
    ...source.matchAll(/\bas unknown as\b/g),
  ].map((match) => `${path.relative(root, filePath)}:${match[0]}`)
})

const deprecatedCompatibilityMatches = componentApiSourceFiles.flatMap((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  return [...source.matchAll(/@deprecated|forward-compatibility|future dispatch point/g)].map(
    (match) => `${path.relative(root, filePath)}:${match[0]}`
  )
})

const docsApiEntries = Array.isArray(docsApi) ? docsApi : Object.values(docsApi.entries ?? docsApi)
const suspiciousGeneratedApiRows = docsApiEntries.flatMap((entry) =>
  (entry.exports ?? []).flatMap((apiExport) => {
    const type = apiExport.type ?? ''
    return /forwardRef|HTMLMotionProps|Record<string, unknown>|VariantProps<typeof|createTriggerButton\(/.test(
      type
    )
      ? [`${entry.slug}:${apiExport.name}:${type}`]
      : []
  })
)

const fixedSvgPrimitiveSources = [
  ['NavChevron', navChevron],
  ['PaperTearEdge', paperTearEdge],
  ['WideTornPaper', wideTornPaper],
  ['TagHanger', tagHanger],
  ['NavArrowDown', navArrowDown],
  ['NavSplat', navSplat],
]

const checks = [
  {
    name: 'Carousel supports controlled and uncontrolled index APIs',
    pass:
      carouselCore.includes('index?: number') &&
      carouselCore.includes('defaultIndex?: number') &&
      !carouselCore.includes('initialIndex') &&
      carouselCore.includes('const isControlled = index !== undefined') &&
      carouselCore.includes('onIndexChange?.(next)'),
  },
  {
    name: 'Carousel provides item indexes through context instead of cloneElement prop injection',
    pass:
      carouselCore.includes('CarouselItemIndexContext') &&
      carouselCore.includes('<CarouselItemIndexContext.Provider') &&
      !carouselCore.includes('React.cloneElement(child'),
  },
  {
    name: 'Carousel pagination styles stay scoped through CSS Modules and package styles',
    pass:
      carouselCore.includes('data-slot="carousel-pagination"') &&
      carouselCore.includes('data-slot="carousel-pagination-icon"') &&
      carouselCore.includes('data-active={currentIndex === index ?') &&
      carouselCore.includes("import paginationStyles from './carousel-pagination.module.css'") &&
      carouselCore.includes('paginationStyles.pagination') &&
      carouselCore.includes('paginationStyles.paginationIcon') &&
      !carouselPaginationCss.includes('[data-slot=') &&
      packageStyleBuilder.includes('walkCssModuleFiles(componentRoot)') &&
      docsAppGlobals.includes("@import '../../../../packages/ui/dist/styles.css';"),
  },
  {
    name: 'Carousel frame motion composes with PhotoFrame rotation without cascade-order overrides',
    pass:
      photoFrameCss.includes(
        'transform: var(--photo-frame-transform, rotate(var(--end-rotate, 0deg)));'
      ) &&
      galleryBaseCss.includes(
        '--photo-frame-transform: translateX(calc(50% * var(--photo-offset)))'
      ) &&
      galleryBaseCss.includes('transition-property: transform;') &&
      weaponsGalleryCarouselCss.includes(
        '--photo-frame-transform: translateX(calc(100% * var(--photo-offset)))'
      ) &&
      !/^\s*transform:\s*translateX\(calc\(50% \* var\(--photo-offset\)\)\)/m.test(
        galleryBaseCss
      ) &&
      !/^\s*transform:\s*translateX\(calc\(100% \* var\(--photo-offset\)\)\)/m.test(
        weaponsGalleryCarouselCss
      ),
  },
  {
    name: 'Carousel composition components expose named props types',
    pass:
      carouselCore.includes('ref?: React.Ref<HTMLDivElement>') &&
      carouselCore.includes('}: CarouselProps)') &&
      carouselCore.includes('export interface CarouselViewportProps') &&
      carouselCore.includes('}: CarouselViewportProps)') &&
      carouselCore.includes('export interface CarouselBleedBoundaryProps') &&
      carouselCore.includes('}: CarouselBleedBoundaryProps)') &&
      carouselCore.includes('export interface CarouselContentProps') &&
      carouselCore.includes('}: CarouselContentProps)') &&
      carouselCore.includes('}: CarouselItemProps)') &&
      carouselCore.includes('}: FadeCarouselItemProps)') &&
      carouselCore.includes('ref?: React.Ref<HTMLUListElement>') &&
      /export interface CarouselPaginationProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLUListElement>,\s*'children'\s*>/.test(
        carouselCore
      ) &&
      /export interface CarouselImagePaginationProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLUListElement>,\s*'children'\s*>/.test(
        carouselCore
      ) &&
      carouselCore.includes('}: CarouselPaginationProps)') &&
      carouselCore.includes('}: CarouselImagePaginationProps)') &&
      carouselCore.includes(
        'export interface CarouselSwipeAreaProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      carouselCore.includes('function CarouselSwipeArea({') &&
      carouselCore.includes('data-slot="carousel-swipe-area"') &&
      !carouselCore.includes('SwipeableGallery') &&
      !carouselCore.includes('}: CarouselProps & { ref?:') &&
      !carouselCore.includes('}: CarouselItemProps & { ref?:') &&
      !carouselCore.includes('}: FadeCarouselItemProps & { ref?:') &&
      !carouselCore.includes('}: CarouselPaginationProps & { ref?:') &&
      !carouselCore.includes('}: CarouselImagePaginationProps & { ref?:') &&
      !carouselCore.includes(
        '}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }'
      ) &&
      !carouselCore.includes('className?: string\n})'),
  },
  {
    name: 'CarouselSwipeArea composes consumer touch handlers before internal navigation',
    pass:
      carouselCore.includes('ref?: React.Ref<HTMLDivElement>') &&
      carouselCore.includes('onTouchStart?.(event)') &&
      carouselCore.includes('onTouchMove?.(event)') &&
      carouselCore.includes('onTouchEnd?.(event)') &&
      carouselCore.includes('if (event.defaultPrevented) return') &&
      carouselCore.includes('const shouldNavigate = !event.defaultPrevented') &&
      carouselCore.includes('ref={setWrapperRef}') &&
      carouselCore.includes('onTouchStart={handleTouchStart}') &&
      carouselCore.includes('onTouchMove={handleTouchMove}') &&
      carouselCore.includes('onTouchEnd={handleTouchEnd}'),
  },
  {
    name: 'Gallery animation wrappers expose normal div props and refs',
    pass:
      /export interface GalleryControlsProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children'\s*>/.test(
        galleryControls
      ) &&
      /export interface GalleryBounceProps\s+extends Omit<\s*HTMLMotionProps<'div'>,\s*'animate' \| 'children'\s*>/.test(
        galleryControls
      ) &&
      galleryControls.includes('ref?: React.Ref<HTMLDivElement>') &&
      galleryControls.includes(
        'export function GalleryBounce({ ref, children, className, ...props }: GalleryBounceProps)'
      ) &&
      galleryControls.includes(
        '<motion.div ref={ref} className={className} {...props} animate={controls}>'
      ),
  },
  {
    name: 'Simple visual single-root exported props include forwarded refs',
    pass:
      /export interface BlobPlayButtonProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children'\s*>/.test(
        blobPlayButton
      ) &&
      blobPlayButton.includes('ref?: React.Ref<HTMLDivElement>') &&
      blobPlayButton.includes('}: BlobPlayButtonProps)') &&
      !blobPlayButton.includes('}: BlobPlayButtonProps & { ref?:') &&
      splatoonTitle.includes(
        "export interface SplatoonTitleProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      splatoonTitle.includes('ref?: React.Ref<HTMLDivElement>') &&
      splatoonTitle.includes('}: SplatoonTitleProps)') &&
      galleryControls.includes('ref?: React.Ref<HTMLDivElement>') &&
      galleryControls.includes('}: GalleryControlsProps)') &&
      !galleryControls.includes('}: GalleryControlsProps & { ref?:') &&
      inkTrail.includes(
        "export interface InkTrailCanvasProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      inkTrail.includes('ref?: React.Ref<HTMLDivElement>') &&
      inkTrail.includes('initialOpacity = 0.55,\n  zIndex,\n  className,') &&
      inkTrail.includes('}: InkTrailCanvasProps)') &&
      ruggedCard.includes(
        "export interface RuggedCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      ruggedCard.includes('ref?: React.Ref<HTMLDivElement>') &&
      ruggedCard.includes('}: RuggedCardProps)'),
  },
  {
    name: 'Components with behavior-critical inline styles compose consumer style props',
    pass:
      button.includes('onMouseLeave,\n  style,\n  color,') &&
      button.includes('...colorStyle,\n          ...dripStyle,\n          ...style,') &&
      blobPlayButton.includes('blobSize = 120,\n  style,\n  onMouseEnter,') &&
      blobPlayButton.includes("'--blob-scale': '1',\n          ...style,") &&
      inkTrail.includes('style={{ ...(zIndex != null ? { zIndex } : {}), ...style }}') &&
      progress.includes('splattered = true,\n  style,\n  ...props') &&
      progress.includes('borderColor:') &&
      progress.includes('...style,\n      }}') &&
      ruggedCard.includes('background,\n  children,\n  style,\n  ...props') &&
      ruggedCard.includes('style={style}') &&
      !ruggedCard.includes('style={{ transform:') &&
      carouselCore.includes("'data-index': index,\n  style,\n  ...props") &&
      carouselCore.includes('rotateAmount,\n  style,\n  ...props') &&
      carouselCore.includes("'--index-offset': String(offset),\n          ...style,") &&
      carouselCore.includes(
        "'--rotateAmount': `${randomValues.rotateAmount}deg`,\n          ...style,"
      ),
  },
  {
    name: 'Card surface exported props include stable outer refs',
    pass:
      card.includes(
        "export interface CardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      card.includes('ref?: React.Ref<HTMLDivElement>') &&
      card.includes('function Card({\n  ref,') &&
      card.includes('<TornCard\n          ref={ref}') &&
      card.includes('<RuggedCard\n          ref={ref}') &&
      card.includes('<StapleCard\n        ref={ref}') &&
      tornCard.includes(
        "export interface TornCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      tornCard.includes('ref?: React.Ref<HTMLDivElement>') &&
      tornCard.includes('}: TornCardProps)') &&
      !tornCard.includes('}: TornCardProps & { ref?:') &&
      photoFrame.includes(
        "export interface PhotoFrameProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      photoFrame.includes('ref?: React.Ref<HTMLDivElement>') &&
      photoFrame.includes('}: PhotoFrameProps)') &&
      !photoFrame.includes('}: PhotoFrameProps & { ref?:') &&
      cardImage.includes(
        "export interface CardImageProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      cardImage.includes('ref?: React.Ref<HTMLDivElement>') &&
      cardImage.includes('}: CardImageProps)') &&
      cardImage.includes('data-slot="card-image"') &&
      cardImage.includes("className={cn('relative flex w-full justify-center py-4', className)}") &&
      cardImage.includes('assetBasePath={resolvedAssetBasePath}') &&
      !cardImage.includes('}: CardImageProps & { ref?:'),
  },
  {
    name: 'Card family slot components expose explicit root refs',
    pass:
      card.includes(
        "export interface CardHeaderProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      card.includes(
        "export interface CardFooterProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      (card.match(/ref\?: React\.Ref<HTMLDivElement>/g) ?? []).length >= 7 &&
      card.includes('function CardHeader({ ref,') &&
      card.includes('function CardTitle({ ref,') &&
      card.includes('function CardDescription({ ref,') &&
      card.includes('function CardAction({ ref,') &&
      card.includes('function CardContent({ ref,') &&
      card.includes('function CardFooter({ ref,') &&
      (card.match(/<div\n      ref=\{ref\}/g) ?? []).length >= 6 &&
      stapleCard.includes(
        "export interface StapleCardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      stapleCard.includes('function StapleCard({\n  ref,') &&
      stapleCard.includes('<div\n      ref={ref}') &&
      stapleCard.includes('export interface StapleCardTitleProps') &&
      stapleCard.includes('ref?: React.Ref<HTMLParagraphElement>') &&
      stapleCard.includes('function StapleCardTitle({ ref,') &&
      stapleCard.includes('function StapleCardDescription({ ref,') &&
      cardSlot.includes(
        "export interface CardSlotProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      cardSlot.includes('ref?: React.Ref<HTMLDivElement>') &&
      cardSlot.includes('export function CardSlot({ ref,') &&
      tornCard.includes(
        "export interface TornCardSlotProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      tornCard.includes('export function TornCardSlot({ ref,') &&
      tornCard.includes('<CardSlot ref={ref}'),
  },
  {
    name: 'Simple decorative single-root components expose explicit root refs',
    pass:
      badgeEntry.includes(
        "export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'>"
      ) &&
      badgeEntry.includes('ref?: React.Ref<HTMLSpanElement>') &&
      badgeEntry.includes('function Badge({ ref, color =') &&
      badgeEntry.includes('<TornBadge ref={ref}') &&
      tornBadge.includes("type TornBadgeColor = 'yellow'") &&
      !tornBadge.includes('export type TornBadgeColor') &&
      tornBadge.includes(
        "interface TornBadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'>"
      ) &&
      !tornBadge.includes('export interface TornBadgeProps') &&
      tornBadge.includes('ref?: React.Ref<HTMLSpanElement>') &&
      tornBadge.includes('export function TornBadge({\n  ref,') &&
      tornBadge.includes('<span\n      ref={ref}') &&
      tape.includes(
        "export interface TapeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      tape.includes('function Tape({\n  ref,') &&
      tape.includes('function Staple({ ref,') &&
      tape.includes('<div\n      ref={ref}') &&
      marquee.includes(
        "export interface MarqueeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      marquee.includes('ref?: React.Ref<HTMLDivElement>') &&
      marquee.includes('export type MarqueeItemProps = Omit<React.ComponentProps') &&
      marquee.includes('ref?: React.Ref<HTMLSpanElement>') &&
      marquee.includes('function Marquee({\n  ref,') &&
      marquee.includes('function MarqueeItem({ ref,') &&
      paperSurface.includes(
        "export interface PaperSurfaceProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      paperSurface.includes('ref?: React.Ref<HTMLDivElement>') &&
      paperSurface.includes('export function PaperSurface({\n  ref,') &&
      paperSurface.includes('<div ref={ref}') &&
      tapeTitle.includes('ref?: React.Ref<HTMLDivElement>') &&
      tapeTitle.includes('export function TapeTitle({\n  ref,') &&
      tapeTitle.includes('<div\n      ref={ref}') &&
      blackTapeContainer.includes('ref?: React.Ref<HTMLDivElement>') &&
      blackTapeContainer.includes('export function BlackTapeContainer({\n  ref,') &&
      blackTapeContainer.includes('<div\n      ref={ref}'),
  },
  {
    name: 'Polymorphic button-like components preserve element-specific refs',
    pass:
      buttonArrow.includes('ref?: React.Ref<HTMLAnchorElement>') &&
      buttonArrow.includes('ref?: React.Ref<HTMLButtonElement>') &&
      buttonArrow.includes(
        'const { ref, href, className, children, ...anchorProps } = omitIconProp(props)'
      ) &&
      buttonArrow.includes(
        "const { ref, className, children, type = 'button', ...buttonProps } = omitButtonOnlyProps(props)"
      ) &&
      buttonArrow.includes(
        '<a ref={ref} className={cn(styles.buttonArrow, className)} href={href} {...anchorProps}>'
      ) &&
      buttonArrow.includes(
        '<button ref={ref} className={cn(styles.buttonArrow, className)} type={type} {...buttonProps}>'
      ) &&
      buttonDrip.includes('ref?: React.Ref<HTMLButtonElement>') &&
      buttonDrip.includes('export function ButtonDrip({\n  ref,') &&
      buttonDrip.includes('<button\n      ref={ref}'),
  },
  {
    name: 'Button-like exported props include forwarded refs',
    pass:
      button.includes('ref?: React.Ref<HTMLElement>') &&
      button.includes('}: ButtonProps)') &&
      !button.includes('}: ButtonProps & { ref?:') &&
      buttonGroup.includes('ref?: React.Ref<HTMLDivElement>') &&
      buttonGroup.includes('}: ButtonGroupProps)') &&
      buttonGroup.includes('}: ButtonGroupItemProps)') &&
      !buttonGroup.includes('}: ButtonGroupProps & { ref?:') &&
      !buttonGroup.includes('}: ButtonGroupItemProps & { ref?:') &&
      iconButton.includes('ref?: React.Ref<HTMLButtonElement>') &&
      iconButton.includes('type IconButtonAccessibleName =') &&
      iconButton.includes("| { 'aria-label': string; 'aria-labelledby'?: never }") &&
      iconButton.includes("| { 'aria-label'?: never; 'aria-labelledby': string }") &&
      iconButton.includes('export type IconButtonProps = Omit<') &&
      iconButton.includes("'aria-label' | 'aria-labelledby' | 'children'") &&
      iconButton.includes('}: IconButtonProps)') &&
      !iconButton.includes('}: IconButtonProps & { ref?:') &&
      /export interface NavMenuButtonProps\s+extends Omit<\s*React\.ComponentProps<'button'>,\s*'children' \| 'ref'\s*>/.test(
        navMenuButton
      ) &&
      navMenuButton.includes('ref?: React.Ref<HTMLButtonElement>') &&
      navMenuButton.includes('}: NavMenuButtonProps)') &&
      waveButton.includes('ref?: React.Ref<HTMLButtonElement>') &&
      waveButton.includes('type WaveButtonAccessibleName =') &&
      waveButton.includes("| { 'aria-label': string; 'aria-labelledby'?: never }") &&
      waveButton.includes("| { 'aria-label'?: never; 'aria-labelledby': string }") &&
      waveButton.includes('export type WaveButtonProps = Omit<') &&
      waveButton.includes("'aria-label' | 'aria-labelledby' | 'children'") &&
      waveButton.includes('}: WaveButtonProps)') &&
      waveButton.includes('data-slot="wave-button"'),
  },
  {
    name: 'Fixed SVG primitives expose refs and do not accept ignored children',
    pass:
      fixedSvgPrimitiveSources.every(
        ([componentName, source]) =>
          new RegExp(
            `export interface ${componentName}Props[\\s\\S]*?extends Omit<\\s*React\\.(?:SVGProps<SVGSVGElement>|ComponentProps<'svg'>),\\s*'children' \\| (?:'color' \\| )?'ref'\\s*>`
          ).test(source) &&
          source.includes('ref?: React.Ref<SVGSVGElement>') &&
          new RegExp(`export function ${componentName}\\(\\{[\\s\\S]*?ref,`).test(source) &&
          source.includes('ref={ref}') &&
          source.includes('{...props}')
      ) && navChevron.includes('...style'),
  },
  {
    name: 'Bundled splat SVGs expose constrained ids and do not accept ignored children',
    pass:
      splatRouter.includes(
        'export type SplatId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12'
      ) &&
      /export interface SplatProps\s+extends Omit<\s*React\.SVGProps<SVGSVGElement>,\s*'children' \| 'color' \| 'id' \| 'ref'\s*>/.test(
        splatRouter
      ) &&
      splatRouter.includes('id: SplatId') &&
      splatRouter.includes('ref?: React.Ref<SVGSVGElement>') &&
      splatRouter.includes('export function Splat({ ref, id, ...props }: SplatProps)') &&
      (splatRouter.match(/return <Splat\d+ ref=\{ref\} \{\.\.\.props\} \/>/g) ?? []).length ===
        12 &&
      interactiveSplatter.includes("import { Splat, type SplatId } from './splat'") &&
      interactiveSplatter.includes('splatId: SplatId') &&
      interactiveSplatter.includes('splatIds?: readonly SplatId[]') &&
      interactiveSplatter.includes('satisfies readonly SplatId[]') &&
      interactiveSplatter.includes(
        'const splatId = splatIds[Math.floor(Math.random() * splatIds.length)] ?? DEFAULT_SPLAT_IDS[0]'
      ) &&
      splatShapeSources.every(
        ([componentName, source]) =>
          new RegExp(
            `export interface ${componentName}Props[\\s\\S]*?extends Omit<\\s*React\\.SVGProps<SVGSVGElement>,\\s*'children' \\| 'color' \\| 'ref'\\s*>`
          ).test(source) &&
          source.includes('ref?: React.Ref<SVGSVGElement>') &&
          new RegExp(`export function ${componentName}\\(\\{[\\s\\S]*?ref,`).test(source) &&
          source.includes('ref={ref}') &&
          source.includes('{...props}')
      ),
  },
  {
    name: 'Canvas effect containers expose normal div props and refs without accepting children',
    pass:
      /export interface InkSplashCanvasProps extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children' \| 'color'\s*>/.test(
        inkSplashCanvas
      ) &&
      inkSplashCanvas.includes('ref?: React.Ref<HTMLDivElement>') &&
      inkSplashCanvas.includes('export function InkSplashCanvas({') &&
      inkSplashCanvas.includes('ref,') &&
      inkSplashCanvas.includes('const setContainerRef = React.useCallback') &&
      inkSplashCanvas.includes('ref={setContainerRef}') &&
      inkSplashCanvas.includes('{...props}'),
  },
  {
    name: 'Void and canvas primitives reject ignored children and expose explicit refs',
    pass:
      input.includes(
        "export interface InputProps extends Omit<React.ComponentProps<'input'>, 'children' | 'ref'>"
      ) &&
      input.includes('ref?: React.Ref<HTMLInputElement>') &&
      input.includes('function Input({ ref, className, type, ...props }: InputProps)') &&
      input.includes('<InputPrimitive') &&
      input.includes('ref={ref}') &&
      /export interface WaveCanvasProps\s+extends Omit<\s*React\.ComponentProps<'canvas'>,\s*'children' \| 'color' \| 'height' \| 'ref' \| 'width'\s*>/.test(
        waveCanvas
      ) &&
      waveCanvas.includes('ref?: React.Ref<HTMLCanvasElement>') &&
      waveCanvas.includes('}: WaveCanvasProps)') &&
      waveCanvas.includes('width={Math.max(1, canvasWidth)}') &&
      waveCanvas.includes('height={height}') &&
      waveCanvas.includes('ref={setCanvasRef}'),
  },
  {
    name: 'Form and selection control exported props include forwarded refs',
    pass:
      label.includes(
        "export interface LabelProps extends Omit<React.ComponentProps<'label'>, 'ref'>"
      ) &&
      label.includes('ref?: React.Ref<HTMLLabelElement>') &&
      label.includes('function Label({ ref, className, ...props }: LabelProps)') &&
      checkbox.includes("'checked' | 'children' | 'defaultChecked' | 'onChange' | 'value'") &&
      checkbox.includes('ref?: React.Ref<HTMLElement>') &&
      checkbox.includes('function Checkbox({ ref, className, ...props }: CheckboxProps)') &&
      radioGroup.includes("'defaultValue' | 'onChange' | 'value'") &&
      radioGroup.includes('ref?: React.Ref<HTMLDivElement>') &&
      radioGroup.includes('function RadioGroup({ ref, className, ...props }: RadioGroupProps)') &&
      radioGroup.includes("'children' | 'onChange' | 'value'") &&
      radioGroup.includes('ref?: React.Ref<HTMLElement>') &&
      radioGroup.includes(
        'function RadioGroupItem({ ref, className, ...props }: RadioGroupItemProps)'
      ) &&
      switchComponent.includes(
        "'checked' | 'children' | 'color' | 'defaultChecked' | 'onChange' | 'value'"
      ) &&
      switchComponent.includes('ref?: React.Ref<HTMLElement>') &&
      switchComponent.includes('}: SwitchProps)') &&
      segmentedControl.includes("'color' | 'defaultValue' | 'onChange' | 'value'") &&
      segmentedControl.includes('ref?: React.Ref<HTMLDivElement>') &&
      segmentedControl.includes('}: SegmentedControlProps)') &&
      segmentedControl.includes('ref?: React.Ref<HTMLElement>') &&
      segmentedControl.includes('}: SegmentedControlItemProps)') &&
      progress.includes('ref?: React.Ref<HTMLDivElement>') &&
      progress.includes('}: ProgressProps)'),
  },
  {
    name: 'InView helpers expose refs to the observed child element',
    pass:
      inView.includes('export interface InViewProps') &&
      inView.includes('export interface InViewStaggerProps') &&
      (inView.match(/ref\?: React\.Ref<HTMLElement>/g) ?? []).length >= 3 &&
      (inView.match(/ref: forwardedRef,/g) ?? []).length === 2 &&
      (inView.match(/setRef\(forwardedRef, node\)/g) ?? []).length === 2 &&
      (inView.match(/ref: mergedRef/g) ?? []).length === 2,
  },
  {
    name: 'InView helpers compose common child and owner event handlers',
    pass:
      inView.includes('function composeEventHandlers') &&
      inView.includes('function mergeChildEventHandlers') &&
      (inView.match(/const composedEventProps = mergeChildEventHandlers/g) ?? []).length === 2 &&
      (inView.match(/\.\.\.composedEventProps/g) ?? []).length === 2 &&
      inView.includes('onClick') &&
      inView.includes('onPointerDown') &&
      inView.includes('onTouchStart'),
  },
  {
    name: 'Imperative and navigation helpers expose refs through exported props',
    pass:
      pageTransition.includes('ref?: React.Ref<PageTransitionHandle>') &&
      pageTransition.includes(
        "export interface PageTransitionProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'>"
      ) &&
      pageTransition.includes('}: PageTransitionProps)') &&
      !pageTransition.includes('}: PageTransitionProps & { ref?:') &&
      squidMaskTransition.includes('ref?: React.Ref<SquidMaskTransitionHandle>') &&
      squidMaskTransition.includes('}: SquidMaskTransitionProps)') &&
      !squidMaskTransition.includes('}: SquidMaskTransitionProps & { ref?:') &&
      /export interface SectionSideNavProps\s+extends Omit<\s*React\.ComponentProps<'nav'>,\s*'children' \| 'ref'\s*>/.test(
        sectionSideNav
      ) &&
      sectionSideNav.includes('ref?: React.Ref<HTMLElement>') &&
      sectionSideNav.includes('}: SectionSideNavProps)') &&
      !sectionSideNav.includes('}: SectionSideNavProps & { ref?:'),
  },
  {
    name: 'Published component API does not expose private implementation helpers',
    pass:
      packageJson.exports?.['./trigger-button'] === undefined &&
      packageJson.exports?.['./tape-divider'] === undefined &&
      packageJson.exports?.['./torn-badge'] === undefined &&
      !publicUiEntries.includes('trigger-button') &&
      !publicUiEntries.includes('tape-divider') &&
      !publicUiEntries.includes('torn-badge') &&
      badgeEntry.includes('export type BadgeColor =') &&
      !badgeEntry.includes('export type { TornBadgeColor }') &&
      !/export\s+const\s+buttonVariants\b/.test(button) &&
      !button.includes('VariantProps<typeof buttonVariants>') &&
      !/export\s+(const|type|interface)\s+CardContext\b/.test(card) &&
      !/export\s+const\s+tabsListVariants\b/.test(tabs) &&
      !tabs.includes('VariantProps<typeof tabsListVariants>'),
  },
  {
    name: 'Trigger APIs do not expose primitive payload plumbing',
    pass:
      !dialog.includes('payload?: unknown') &&
      !popover.includes('payload?: unknown') &&
      !sheet.includes('payload?: unknown'),
  },
  {
    name: 'Overlay and tabs content refs live on exported props',
    pass:
      popover.includes('function PopoverContent({') &&
      popover.includes('}: PopoverContentProps)') &&
      !popover.includes('}: PopoverContentProps & { ref?:') &&
      dialog.includes('}: DialogContentFullScreenProps)') &&
      !dialog.includes('}: DialogContentFullScreenProps & { ref?:') &&
      sheet.includes('}: SheetPopupProps)') &&
      sheet.includes('}: SheetContentProps)') &&
      !sheet.includes('}: SheetPopupProps & { ref?:') &&
      !sheet.includes('}: SheetContentProps & { ref?:') &&
      tabs.includes("'defaultValue' | 'onChange' | 'value'") &&
      tabs.includes('ref?: React.Ref<HTMLDivElement>') &&
      tabs.includes('}: TabsPanelsProps)') &&
      !tabs.includes('}: TabsPanelsProps & { ref?:'),
  },
  {
    name: 'Dialog open-change cancellation is honored before internal state updates',
    pass:
      dialog.includes('setOpen: (open: boolean) => boolean') &&
      /onOpenChange\?\.\(newOpen, details\)[\s\S]*?if \(details\.isCanceled\) return false[\s\S]*?setUncontrolledOpen\(newOpen\)[\s\S]*?return true/.test(
        dialog
      ) &&
      /const didClose = setOpen\(false\)[\s\S]*?if \(!didClose\) \{[\s\S]*?setModalHeadingOut\(false\)[\s\S]*?setSplatState\('in'\)[\s\S]*?return[\s\S]*?\}[\s\S]*?setModalActive\(false\)/.test(
        dialog
      ),
  },
  {
    name: 'React 19-only components use ref props instead of forwardRef wrappers',
    pass: reactForwardRefMatches.length === 0,
  },
  {
    name: 'Component APIs avoid broad unknown props and double assertions',
    pass: broadUnknownPropMatches.length === 0,
  },
  {
    name: 'Hover-driven visual components compose consumer mouse handlers',
    pass:
      blobPlayButton.includes("event.currentTarget.style.setProperty('--blob-scale', '1.1')") &&
      blobPlayButton.includes("event.currentTarget.style.setProperty('--blob-scale', '1')") &&
      blobPlayButton.includes('onMouseEnter?.(event)') &&
      blobPlayButton.includes('onMouseLeave?.(event)') &&
      splatoonTitle.includes('setIsHovered(true)') &&
      splatoonTitle.includes('setIsHovered(false)') &&
      splatoonTitle.includes('onMouseEnter?.(event)') &&
      splatoonTitle.includes('onMouseLeave?.(event)') &&
      splatoonTitle.includes('onMouseEnter={onMouseEnter}') &&
      splatoonTitle.includes('onMouseLeave={onMouseLeave}'),
  },
  {
    name: 'Public component APIs do not retain deprecated compatibility props',
    pass:
      deprecatedCompatibilityMatches.length === 0 &&
      !badgeEntry.includes("variant?: 'torn'") &&
      !cardStackCarousel.includes('shellClassName') &&
      !cardStackCarousel.includes('shellStyle') &&
      !carouselCore.includes('initialIndex') &&
      !headingTape.includes('color?: HeadingTapeColor') &&
      !headingTape.includes('void color'),
  },
  {
    name: 'Generated docs API does not expose implementation helper signatures',
    pass: suspiciousGeneratedApiRows.length === 0,
  },
  {
    name: 'Dialog trigger registration is ref-based and does not query the DOM tree',
    pass:
      dialog.includes('registerTrigger') &&
      dialog.includes('createTriggerButton') &&
      dialog.includes("import { composeRefs } from '@/lib/react-refs'") &&
      triggerButton.includes('useRegisterRef') &&
      triggerButton.includes("import { composeRefs } from '@/lib/react-refs'") &&
      triggerButton.includes('composeRefs(registerRef, triggerRef, ref)') &&
      reactRefs.includes('export function composeRefs') &&
      !triggerButton.includes('export function mergeRefs') &&
      !triggerButton.includes('no-explicit-any') &&
      !dialog.includes('querySelector<HTMLButtonElement>') &&
      !dialog.includes('[data-slot="dialog-trigger"]'),
  },
  {
    name: 'VideoDialogThumbnail uses the shared DialogTrigger registration path',
    pass:
      videoDialog.includes('DialogTrigger') &&
      videoDialog.includes('type DialogProps') &&
      videoDialog.includes('<DialogTrigger') &&
      !videoDialog.includes('DialogPrimitive.Trigger'),
  },
  {
    name: 'CardStackCarousel exposes semantic item layout presets for higher-level components',
    pass:
      cardStackCarousel.includes(
        'export interface CardStackCarouselContentProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      cardStackCarousel.includes('}: CardStackCarouselContentProps)') &&
      cardStackCarousel.includes("export type CardStackCarouselItemLayout = 'default' | 'feed'") &&
      cardStackCarousel.includes('itemLayout?: CardStackCarouselItemLayout') &&
      cardStackCarousel.includes('}: CardStackCarouselItemProps)') &&
      /export interface CardStackCarouselButtonProps\s+extends Omit<\s*React\.ButtonHTMLAttributes<HTMLButtonElement>,\s*'children'\s*>/.test(
        cardStackCarousel
      ) &&
      cardStackCarousel.includes('}: CardStackCarouselButtonProps)') &&
      cardStackCarousel.includes('ref?: React.Ref<HTMLDivElement>') &&
      cardStackCarousel.includes('ref?: React.Ref<HTMLButtonElement>') &&
      cardStackCarousel.includes('feed: layoutTokens.feedCarouselItemWidth') &&
      /export interface CardStackCarouselItemProps\s+extends Omit<\s*HTMLMotionProps<'div'>,\s*'children' \| 'onClick' \| 'onDrag' \| 'onDragStart' \| 'onDragEnd' \| 'style'\s*>/.test(
        cardStackCarousel
      ) &&
      !cardStackCarousel.includes('}: CardStackCarouselContentProps & { ref?:') &&
      !cardStackCarousel.includes('}: CardStackCarouselItemProps & { ref?:') &&
      !cardStackCarousel.includes('}: CardStackCarouselButtonProps & { ref?:') &&
      !cardStackCarousel.includes('shellClassName') &&
      !cardStackCarousel.includes('shellStyle') &&
      feedCarousel.includes('itemLayout="feed"') &&
      !feedCarousel.includes('shellStyle='),
  },
  {
    name: 'CardStackCarousel arrow buttons compose consumer events without overriding navigation guards',
    pass:
      cardStackCarousel.includes('onClick?.(event)') &&
      cardStackCarousel.includes('if (event.defaultPrevented) return') &&
      cardStackCarousel.includes(
        'const isDisabled = disabled || (isPrev ? !canGoPrev : !canGoNext)'
      ) &&
      cardStackCarousel.includes(
        "| 'aria-label'\n          | 'aria-labelledby'\n          | 'variant'\n          | 'direction'\n          | 'animation'\n          | 'disabled'\n          | 'onClick'"
      ) &&
      !cardStackCarousel.includes('onClick={isPrev ? goToPrev : goToNext}') &&
      !cardStackCarousel.includes('disabled={isPrev ? !canGoPrev : !canGoNext}'),
  },
  {
    name: 'High-level carousel wrappers use stable props types and own reserved slots',
    pass:
      carousel.includes("export * from './carousel-core'") &&
      carousel.includes("export * from './feed-carousel'") &&
      carousel.includes("export * from './marquee-carousel'") &&
      carousel.includes("export * from './weapons-gallery-carousel'") &&
      carousel.includes("export * from './icon-paginated-carousel'") &&
      feedCarousel.includes('type CarouselProps') &&
      feedCarousel.includes("extends Omit<CarouselProps, 'children'>") &&
      !feedCarousel.includes('ComponentPropsWithoutRef<typeof Carousel>') &&
      marqueeCarousel.includes('type CarouselProps') &&
      marqueeCarousel.includes("extends Omit<CarouselProps, 'children'>") &&
      marqueeCarousel.includes('ref?: React.Ref<HTMLDivElement>') &&
      marqueeCarousel.includes('}: MarqueeGalleryItemProps)') &&
      !marqueeCarousel.includes('}: MarqueeGalleryItemProps & { ref?:') &&
      !marqueeCarousel.includes('ComponentPropsWithoutRef<typeof Carousel>') &&
      weaponsGalleryCarousel.includes('type CarouselProps') &&
      weaponsGalleryCarousel.includes("extends Omit<CarouselProps, 'children'>") &&
      weaponsGalleryCarousel.includes('ref?: React.Ref<HTMLDivElement>') &&
      weaponsGalleryCarousel.includes('}: WeaponsGalleryItemProps)') &&
      !weaponsGalleryCarousel.includes('}: WeaponsGalleryItemProps & { ref?:') &&
      !weaponsGalleryCarousel.includes('ComponentPropsWithoutRef<typeof Carousel>') &&
      iconPaginatedCarousel.includes('MarqueeCarouselProps') &&
      /extends\s+Omit<\s*MarqueeCarouselProps,\s*'items'\s*\|\s*'pagination'\s*\|\s*'renderItem'\s*>/.test(
        iconPaginatedCarousel
      ) &&
      iconPaginatedCarousel.includes('ref?: React.Ref<HTMLDivElement>') &&
      iconPaginatedCarousel.includes('}: IconPaginatedGalleryItemProps)') &&
      !iconPaginatedCarousel.includes('}: IconPaginatedGalleryItemProps & { ref?:') &&
      !iconPaginatedCarousel.includes('ComponentPropsWithoutRef<') &&
      /<MarqueeCarousel\s+{\.\.\.props}\s+items={items}\s+className={className}\s+assetBasePath={assetBasePath}\s+pagination=/.test(
        iconPaginatedCarousel
      ),
  },
  {
    name: 'High-level wrapper props avoid private implementation prop aliases',
    pass:
      alert.includes('export type AlertVariant') &&
      alert.includes(
        "export interface AlertProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      alert.includes("tapePosition?: 'top-right' | 'bottom-center'") &&
      alert.includes('export function Alert({\n  ref,') &&
      alert.includes('<TornCard\n        ref={ref}') &&
      alert.includes('export interface AlertTitleProps') &&
      alert.includes('ref?: React.Ref<HTMLHeadingElement>') &&
      alert.includes('function AlertTitle({ ref,') &&
      alert.includes('export interface AlertDescriptionProps') &&
      alert.includes('ref?: React.Ref<HTMLParagraphElement>') &&
      alert.includes('function AlertDescription({ ref,') &&
      !alert.includes('type TornCardProps') &&
      !alert.includes("extends Omit<TornCardProps, 'variant'>") &&
      !alert.includes('ComponentProps<typeof TornCard>') &&
      videoDialog.includes('type DialogProps') &&
      videoDialog.includes("extends Omit<DialogProps, 'children'>") &&
      /export interface VideoDialogThumbnailProps\s+extends Omit<\s*React\.ButtonHTMLAttributes<HTMLButtonElement>,\s*'children' \| 'type'\s*>/.test(
        videoDialog
      ) &&
      videoDialog.includes('ref?: React.Ref<HTMLButtonElement>') &&
      videoDialog.includes(
        'const { ref: triggerRefCb, onClick: triggerOnClick, ...rest } = triggerProps'
      ) &&
      videoDialog.includes('onClick?.(event)') &&
      videoDialog.includes('if (event.defaultPrevented) return') &&
      videoDialog.includes('triggerOnClick?.(event)') &&
      videoDialog.includes('}: VideoDialogThumbnailProps)') &&
      !videoDialog.includes('}: VideoDialogThumbnailProps & { ref?:') &&
      !videoDialog.includes('ComponentProps<typeof Dialog>'),
  },
  {
    name: 'Text-color subcomponents expose named props types',
    pass:
      tornCard.includes('export type TornCardVariant') &&
      tornCard.includes('export interface TornCardTitleProps') &&
      tornCard.includes('ref?: React.Ref<HTMLHeadingElement>') &&
      tornCard.includes('}: TornCardTitleProps)') &&
      tornCard.includes('export interface TornCardDescriptionProps') &&
      tornCard.includes('ref?: React.Ref<HTMLParagraphElement>') &&
      tornCard.includes('}: TornCardDescriptionProps)') &&
      tornCard.includes('<h2\n      ref={ref}') &&
      tornCard.includes('<p\n      ref={ref}') &&
      alert.includes('export interface AlertTitleProps') &&
      alert.includes('export interface AlertDescriptionProps') &&
      !tornCard.includes("React.ComponentProps<'h2'> & { textColor?: string }") &&
      !tornCard.includes("React.ComponentProps<'p'> & { textColor?: string }") &&
      !alert.includes("React.ComponentProps<'h2'> & { textColor?: string }") &&
      !alert.includes("React.ComponentProps<'p'> & { textColor?: string }"),
  },
  {
    name: 'Public props option types are importable by consumers',
    pass:
      buttonGroup.includes('export type ButtonGroupOrientation') &&
      buttonGroup.includes('export type ButtonGroupDensity') &&
      headingTape.includes('export type HeadingTapeDecorationPosition') &&
      headingTape.includes('export type HeadingTapeDecorationSet') &&
      headingTape.includes('export type HeadingTapeSafeAreaEdge') &&
      headingTape.includes('export type HeadingTapeSize') &&
      headingTape.includes('export type HeadingTapeDecorationSafeArea') &&
      photoFrame.includes('export type PhotoFrameVariant') &&
      stapleCard.includes('export type StapleCardVariant') &&
      inView.includes('export type InViewElement') &&
      tabs.includes('export type TabsSwipeMode'),
  },
  {
    name: 'Content wrappers expose accurate root element refs',
    pass:
      headingTape.includes('export interface HeadingTapeProps extends Omit<') &&
      headingTape.includes("React.ComponentProps<'div'>") &&
      headingTape.includes("'ref'") &&
      headingTape.includes('ref?: React.Ref<HTMLDivElement>') &&
      headingTape.includes('export function HeadingTape({\n  ref,') &&
      headingTape.includes('<div\n      ref={ref}') &&
      eventCallout.includes('export interface EventCalloutProps') &&
      eventCallout.includes("React.ComponentProps<'article'>") &&
      eventCallout.includes("'children' | 'ref' | 'title'") &&
      eventCallout.includes('ref?: React.Ref<HTMLElement>') &&
      eventCallout.includes('export function EventCallout({\n  ref,') &&
      eventCallout.includes('<article ref={ref}'),
  },
  {
    name: 'Section owns overlay clearance semantics used by BannerDivider boundaries',
    pass:
      section.includes('ref?: React.Ref<HTMLElement>') &&
      section.includes('export function Section({\n  ref,') &&
      section.includes('<SectionBackground\n      ref={ref}') &&
      sectionBackground.includes('ref?: React.Ref<HTMLElement>') &&
      sectionBackground.includes('export function SectionBackground({\n  ref,') &&
      sectionBackground.includes('if (Tag ===') &&
      sectionBackground.includes('<section\n        ref={ref}') &&
      sectionBackground.includes('<div\n      ref={ref as React.Ref<HTMLDivElement>}') &&
      footer.includes('ref?: React.Ref<HTMLElement>') &&
      footer.includes(
        "export interface FooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>"
      ) &&
      footer.includes('export function Footer({\n  ref,') &&
      footer.includes('<footer ref={ref}') &&
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
      videoDialog.includes('MediaDecoration') &&
      mediaDecoration.includes('export interface MediaDecorationProps extends Omit<') &&
      mediaDecoration.includes("React.ComponentProps<'div'>") &&
      mediaDecoration.includes("'children' | 'ref'") &&
      mediaDecoration.includes('ref?: React.Ref<HTMLDivElement>') &&
      mediaDecoration.includes('export function MediaDecoration({\n  ref,') &&
      mediaDecoration.includes('export type MediaDecorationPosition') &&
      !mediaDecoration.includes('CardSlotProps') &&
      tornCard.includes('export function TornCardSlot({ ref,') &&
      tornCard.includes('export type TornCardSlotPosition') &&
      !tornCard.includes('export { CardSlot as TornCardSlot }'),
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
    name: 'RuggedCard keeps intrinsic rotation on an inner visual layer',
    pass:
      ruggedCard.includes('className={cn(\n          styles.visual,') &&
      ruggedCard.includes("'--rugged-card-rotation': rotation") &&
      ruggedCardCss.includes('.visual') &&
      ruggedCardCss.includes('transform: rotate(var(--rugged-card-rotation, 0deg));'),
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
    name: 'Card section dividers use the shared round dotted divider primitive',
    pass:
      card.includes("import { DottedDivider } from './dotted-divider'") &&
      card.includes('{showDivider ? <DottedDivider') &&
      !card.includes('border-b border-dashed border-current/30') &&
      !card.includes('border-t border-dashed border-current/30') &&
      dottedDivider.includes('export interface DottedDividerProps') &&
      dottedDividerCss.includes('--dotted-divider-color: var(--color-grey-100);') &&
      dottedDividerCss.includes('radial-gradient') &&
      dottedDividerCss.includes("data-orientation='horizontal'"),
  },
  {
    name: 'StapleCard owns its responsive staple safe area inside the component surface',
    pass:
      stapleCard.includes('contentClassName={styles.cardSurface}') &&
      stapleCard.includes('styles.stapleLayer') &&
      stapleCard.includes('<div className={styles.action}>{action}</div>') &&
      !stapleCard.includes('<picture>') &&
      !stapleCard.includes('imgMobile') &&
      !stapleCard.includes('imgDesktop') &&
      stapleCardCss.includes('container-type: inline-size;') &&
      stapleCardCss.includes('align-items: stretch;') &&
      stapleCardCss.includes('.action') &&
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
      assetImage.includes("'alt' | 'children' | 'height' | 'ref' | 'src' | 'width'") &&
      assetImage.includes('ref?: React.Ref<HTMLImageElement>') &&
      assetImage.includes('export function AssetImage({\n  ref,') &&
      assetImage.includes('<img\n      ref={ref}') &&
      demoPage.includes('<AssetImage') &&
      demoPage.includes('fit="cover"') &&
      !demoPage.includes("style={{ objectFit: 'cover' }}"),
  },
  {
    name: 'TapePicture exposes a single image ref while responsive pictures avoid ambiguous refs',
    pass:
      tapePicture.includes("'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'") &&
      tapePicture.includes('export interface TapePictureProps extends ImageProps') &&
      tapePicture.includes('ref?: React.Ref<HTMLImageElement>') &&
      tapePicture.includes('export interface TapeResponsivePicturesProps extends ImageProps') &&
      !tapeResponsivePicturesPropsSource.includes('ref?:') &&
      tapePicture.includes('export function TapePicture({\n  ref,') &&
      tapePicture.includes('<TapeImage\n        ref={ref}') &&
      tapePicture.includes('<img\n      ref={ref}'),
  },
  {
    name: 'Sticker image wrappers expose explicit image refs through TapePicture',
    pass:
      stickerImage.includes(
        "React.ComponentProps<'img'>,\n  'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'"
      ) &&
      stickerImage.includes('ref?: React.Ref<HTMLImageElement>') &&
      stickerImage.includes('export function StickerImage({\n  ref,') &&
      stickerImage.includes('<TapePicture\n      ref={ref}') &&
      stickerSources.every(
        (source) =>
          source.includes("'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'") &&
          source.includes('ref?: React.Ref<HTMLImageElement>') &&
          source.includes('({ ref, className, ...props }') &&
          source.includes('<StickerImage ref={ref}')
      ),
  },
  {
    name: 'Single-root fixed-content components expose refs and reject ignored children',
    pass:
      loader.includes(
        "export interface LoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>"
      ) &&
      loader.includes('ref?: React.Ref<HTMLSpanElement>') &&
      loader.includes('export function Loader({\n  ref,') &&
      loader.includes('<span\n      ref={ref}') &&
      loader.includes('role="status"') &&
      bannerDivider.includes(
        "export interface BannerDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      bannerDivider.includes('ref?: React.Ref<HTMLDivElement>') &&
      bannerDivider.includes('export function BannerDivider({\n  ref,') &&
      bannerDivider.includes('const [isInView, inViewRef] = useInView<HTMLDivElement>') &&
      bannerDivider.includes('<div\n      ref={ref}') &&
      bannerDivider.includes('ref={animate ? inViewRef : undefined}') &&
      dottedDivider.includes('export interface DottedDividerProps extends Omit<') &&
      dottedDivider.includes("React.ComponentProps<'div'>") &&
      dottedDivider.includes("'children' | 'color' | 'ref'") &&
      dottedDivider.includes('ref?: React.Ref<HTMLDivElement>') &&
      dottedDivider.includes('export function DottedDivider({\n  ref,') &&
      dottedDivider.includes('<div\n      ref={ref}'),
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
  {
    name: 'Reusable color APIs derive from shared Splatoon color tokens instead of legacy aliases',
    pass:
      splatoonColorTokens.includes('export const splatoonColorVars') &&
      tokens.includes('SplatoonColorValue') &&
      tokens.includes('SplatoonControlTrackColor') &&
      dottedDivider.includes("from './tokens'") &&
      list.includes("from './tokens'") &&
      switchComponent.includes("from './tokens'") &&
      segmentedControl.includes("from './tokens'") &&
      splatoonColorTokens.includes("yellow: 'var(--color-yellow)'") &&
      splatoonColorTokens.includes("worldPurple: 'var(--color-world-purple)'") &&
      splatoonColorTokens.includes("salmonRunGreen: 'var(--color-salmon-run-green)'") &&
      buttonColorResolver.includes('splatoonColorVars') &&
      tornBadge.includes('splatoonColorVars') &&
      iconButton.includes('ICON_BUTTON_COLOR_PRESETS') &&
      !buttonColorResolver.includes('var(--neon-yellow)') &&
      !buttonColorResolver.includes('var(--ink-blue)') &&
      !tornBadge.includes('var(--neon-yellow)') &&
      !tornBadge.includes('var(--ink-blue)') &&
      !tornBadge.includes("'#fff'"),
  },
  {
    name: 'Switch and SegmentedControl share the same track color token mapping',
    pass:
      splatoonColorTokens.includes('splatoonControlTrackColorConfig') &&
      switchComponent.includes('splatoonControlTrackColorConfig[color]') &&
      /['"]--switch-accent['"]:\s*colorConfig\.accentColor/.test(switchComponent) &&
      segmentedControl.includes('splatoonControlTrackColorConfig[color]') &&
      segmentedControl.includes("'--segmented-control-active-bg': colorConfig.accentColor") &&
      segmentedControl.includes("'--segmented-control-active-text': colorConfig.activeTextColor") &&
      !switchCss.includes(".root[data-color='green']") &&
      !segmentedControlCss.includes(".root[data-color='blue']"),
  },
  {
    name: 'Select keeps popup height content-driven and selected splat within the item row',
    pass:
      select.includes('alignItemWithTrigger = false') &&
      select.includes('showScrollButtons?: boolean') &&
      select.includes('showScrollButtons = false') &&
      select.includes('<SelectPrimitive.List>{children}</SelectPrimitive.List>') &&
      select.includes('showScrollButtons ? <SelectScrollUpButton /> : null') &&
      select.includes('showScrollButtons ? <SelectScrollDownButton /> : null') &&
      /export interface SelectScrollUpButtonProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children'\s*>/.test(
        select
      ) &&
      /export interface SelectScrollDownButtonProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children'\s*>/.test(
        select
      ) &&
      /export interface SelectSeparatorProps\s+extends Omit<\s*React\.HTMLAttributes<HTMLDivElement>,\s*'children'\s*>/.test(
        select
      ) &&
      select.includes('absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2') &&
      select.includes('viewBox="20 20 280 280"') &&
      select.includes('onOpenChange?: (open: boolean, eventDetails: PrimitiveChangeDetails)') &&
      !select.includes('PrimitiveOpenChangeDetails'),
  },
  {
    name: 'List keeps ordered-list semantics while owning Splatoon marker styling',
    pass:
      list.includes("export type ListVariant = 'ordered'") &&
      list.includes('<ol') &&
      list.includes('<li') &&
      list.includes('className={styles.marker}') &&
      list.includes('DottedDivider') &&
      list.includes('padStart(digits,') &&
      list.includes('Math.max(\n    2,') &&
      list.includes("'data-list-marker': formatListMarker(markerValue, markerDigits)") &&
      list.includes('markerHoverColor = splatoonColorVars.green') &&
      list.includes(
        "...(dividerColor ? { '--list-divider-color': resolveSplatoonColorValue(dividerColor) } : null)"
      ) &&
      listCss.includes('--list-row-gap: 0.125rem;') &&
      listCss.includes('--list-divider-color: var(--color-grey-100);') &&
      listCss.includes('--list-content-divider-gap: 0.125rem;') &&
      listCss.includes('.marker') &&
      listCss.includes('align-items: stretch;') &&
      listCss.includes('aspect-ratio: 1;') &&
      listCss.includes("font-family: 'SpAlterna', var(--font-sp-alterna)") &&
      listCss.includes('font-synthesis: none;') &&
      listCss.includes('font-family: var(--font-blitz-main)') &&
      listCss.includes('line-height: 1.05;') &&
      listCss.includes('padding: 0.25rem 0.5rem 0.3rem;') &&
      listCss.includes('text-align: left;') &&
      listCss.includes('.item:hover .content') &&
      listCss.includes('background: var(--color-black);') &&
      listCss.includes('.item:hover .marker') &&
      !listCss.includes('transform: scale(') &&
      !listCss.includes('::before') &&
      !listCss.includes('counter(') &&
      !listCss.includes('.item:last-child .divider'),
  },
  {
    name: 'Runtime font tokens used by CSS modules are defined on :root',
    pass:
      globals.includes("--font-blitz-main: 'BlitzMain', var(--font-heading);") &&
      globals.includes("--font-sp-alterna: 'SpAlterna', var(--font-heading);"),
  },
  {
    name: 'Components and the demo page preserve caller text casing by default',
    pass: forcedUppercaseMatches.length === 0,
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
