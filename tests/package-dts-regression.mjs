import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
const distRoot = path.join(packageRoot, 'dist')
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))

const publicDeclarationFiles = ['server.d.ts', ...publicUiEntries.map((entry) => `${entry}.d.ts`)]
const missingDeclarationFiles = publicDeclarationFiles.filter(
  (fileName) => !fs.existsSync(path.join(distRoot, fileName))
)

const publicDeclarations = publicDeclarationFiles
  .filter((fileName) => fs.existsSync(path.join(distRoot, fileName)))
  .map((fileName) => ({
    fileName,
    source: fs.readFileSync(path.join(distRoot, fileName), 'utf8'),
  }))
const declarationByFileName = new Map(
  publicDeclarations.map(({ fileName, source }) => [fileName, source])
)
const tapeResponsivePicturesPropsDeclaration =
  declarationByFileName
    .get('tape-picture.d.ts')
    ?.match(/interface TapeResponsivePicturesProps extends ImageProps \{([\s\S]*?)\n}/)?.[1] ?? ''
const stickerComponentNames = ['Sticker10', 'Sticker2Red', 'Sticker5']
const splatShapeComponentNames = Array.from({ length: 12 }, (_, index) => `Splat${index + 1}`)
const fixedSvgPrimitiveDeclarations = [
  {
    fileName: 'nav-chevron.d.ts',
    componentName: 'NavChevron',
    propsBase: "Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'>",
    signature:
      'declare function NavChevron({ ref, isHighlighted, className, style, ...props }: NavChevronProps)',
  },
  {
    fileName: 'paper-tear-edge.d.ts',
    componentName: 'PaperTearEdge',
    propsBase: "Omit<React.ComponentProps<'svg'>, 'children' | 'color' | 'ref'>",
    signature:
      'declare function PaperTearEdge({ ref, edge, color, className, style, ...props }: PaperTearEdgeProps)',
  },
  {
    fileName: 'wide-torn-paper.d.ts',
    componentName: 'WideTornPaper',
    propsBase: "Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'>",
    signature:
      'declare function WideTornPaper({ ref, backgroundColor, className, ...props }: WideTornPaperProps)',
  },
  {
    fileName: 'tag-hanger.d.ts',
    componentName: 'TagHanger',
    propsBase: "Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'>",
    signature: 'declare function TagHanger({ ref, className, ...props }: TagHangerProps)',
  },
  {
    fileName: 'icons.d.ts',
    componentName: 'NavArrowDown',
    propsBase: "Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'>",
    signature: 'declare function NavArrowDown({ ref, className, ...props }: NavArrowDownProps)',
  },
  {
    fileName: 'splats.d.ts',
    componentName: 'NavSplat',
    propsBase: "Omit<React.SVGProps<SVGSVGElement>, 'children' | 'ref'>",
    signature: 'declare function NavSplat({ ref, className, ...props }: NavSplatProps)',
  },
]

function declarationIncludes(fileName, fragment) {
  return declarationByFileName.get(fileName)?.includes(fragment) === true
}

function declarationExports(fileName, name) {
  const source = declarationByFileName.get(fileName) ?? ''
  return [...source.matchAll(/export \{[^}]*\}/g)].some((match) =>
    match[0].includes(`type ${name}`)
  )
}

const forbiddenPublicDeclarationPatterns = [
  /from ['"]@base-ui\//g,
  /from ['"]@radix-ui\//g,
  /import\(['"]@base-ui\//g,
  /import\(['"]@radix-ui\//g,
  /from ['"]\.\/(?:chunk|card-slot|splatoon-color-tokens|trigger-button)-[^'"]+\.js['"]/g,
  /ForwardRefExoticComponent/g,
  /JSXElementConstructor<any>/g,
  /Record<string, unknown>/g,
  /\[\s*key:\s*string\s*\]:\s*unknown\b/g,
  /HTMLMotionProps/g,
  /VariantProps<typeof/g,
  /ComponentPropsWithoutRef<typeof (?:Carousel|MarqueeCarousel)>/g,
  /React\.ComponentProps<typeof (?:Dialog|TornCard)>/g,
  /createTriggerButton\(/g,
]

const forbiddenPublicDeclarationMatches = publicDeclarations.flatMap(({ fileName, source }) =>
  forbiddenPublicDeclarationPatterns.flatMap((pattern) =>
    [...source.matchAll(pattern)].map((match) => `${fileName}: ${match[0]}`)
  )
)

const inlineObjectPropsDeclarationMatches = publicDeclarations.flatMap(({ fileName, source }) =>
  [...source.matchAll(/declare function\s+([A-Z][A-Za-z0-9]+)\(([\s\S]*?)\):/g)]
    .filter(([, , params]) => /}\s*:\s*\{/.test(params) || /props:\s*\{/.test(params))
    .map(([, componentName]) => `${fileName}: ${componentName}`)
)

const implicitRefComponentPropsDeclarationMatches = publicDeclarations.flatMap(
  ({ fileName, source }) => {
    const directComponentPropsMatches = [
      ...source.matchAll(
        /(?:interface\s+[A-Z][A-Za-z0-9]+Props\s+extends|type\s+[A-Z][A-Za-z0-9]+Props\s*=)\s+React\.ComponentProps<'[^']+'>/g
      ),
    ]

    const omitComponentPropsMatches = [
      ...source.matchAll(
        /(?:interface\s+[A-Z][A-Za-z0-9]+Props\s+extends|type\s+[A-Z][A-Za-z0-9]+Props\s*=)\s+Omit<React\.ComponentProps<'[^']+'>,\s*([^>]+)>/g
      ),
    ].filter((match) => !match[1].includes("'ref'"))

    return [...directComponentPropsMatches, ...omitComponentPropsMatches].map(
      (match) => `${fileName}: ${match[0]}`
    )
  }
)

const nativePropOverrideDeclarationMatches = publicDeclarations.flatMap(({ fileName, source }) => {
  const matches = []

  function checkPropsShape(propsName, rawBase, body) {
    const base = rawBase.replace(/\s+/g, ' ').trim()
    const usesDomAttributeBase =
      /React\.(?:HTMLAttributes|ButtonHTMLAttributes|AnchorHTMLAttributes)/.test(base) ||
      /React\.SVGProps<SVGSVGElement>/.test(base) ||
      /React\.ComponentProps<'[^']+'>/.test(base)

    if (!usesDomAttributeBase) return

    const requiredOmittedKeys = new Set()

    if (/\n\s+color\?:/.test(body)) {
      requiredOmittedKeys.add('color')
    }

    if (/\n\s+title\??:/.test(body)) {
      requiredOmittedKeys.add('title')
    }

    if (/\n\s+defaultChecked\?:/.test(body)) {
      requiredOmittedKeys.add('defaultChecked')
    }

    if (/\n\s+defaultValue\?:/.test(body)) {
      requiredOmittedKeys.add('defaultValue')
    }

    if (/\n\s+on(?:Checked|Value)Change\?:/.test(body)) {
      requiredOmittedKeys.add('onChange')
    }

    for (const key of requiredOmittedKeys) {
      if (!base.includes(`'${key}'`)) {
        matches.push(`${fileName}: ${propsName} overrides ${key} without omitting native prop`)
      }
    }
  }

  for (const match of source.matchAll(
    /interface\s+([A-Z][A-Za-z0-9]+Props)\s+extends\s+([^{]+)\{([\s\S]*?)\n\}/g
  )) {
    checkPropsShape(match[1], match[2], match[3])
  }

  for (const match of source.matchAll(
    /type\s+([A-Z][A-Za-z0-9]+Props)\s*=\s*([\s\S]*?)&\s*\{([\s\S]*?)\n\};/g
  )) {
    checkPropsShape(match[1], match[2], match[3])
  }

  return matches
})

const missingNamedPropsDeclarationMatches = publicDeclarations.flatMap(({ fileName, source }) => {
  const exportedNames = new Set(
    [...source.matchAll(/export \{([^}]+)\}/g)].flatMap((match) =>
      match[1].split(',').map(
        (name) =>
          name
            .trim()
            .replace(/^type\s+/, '')
            .split(/\s+as\s+/)[0]
      )
    )
  )

  return [...source.matchAll(/declare function\s+([A-Z][A-Za-z0-9]+)\(([\s\S]*?)\):/g)]
    .filter(([, , params]) => params.trim() !== '')
    .filter(([, , params]) => {
      const propsName = params.match(/:\s*([A-Z][A-Za-z0-9]+Props)\b/)?.[1]
      return !propsName || !exportedNames.has(propsName)
    })
    .map(([, componentName]) => `${fileName}: ${componentName}`)
})

const checks = [
  {
    name: 'public declaration files are generated for every package entrypoint',
    pass: missingDeclarationFiles.length === 0,
  },
  {
    name: 'public declarations do not import hashed implementation chunks or helper signatures',
    pass: forbiddenPublicDeclarationMatches.length === 0,
  },
  {
    name: 'public component declarations use named props types instead of inline object signatures',
    pass: inlineObjectPropsDeclarationMatches.length === 0,
  },
  {
    name: 'public DOM ComponentProps declarations omit ref before exposing explicit root refs',
    pass: implicitRefComponentPropsDeclarationMatches.length === 0,
  },
  {
    name: 'public declarations omit native props replaced by semantic component props',
    pass: nativePropOverrideDeclarationMatches.length === 0,
  },
  {
    name: 'public component declarations use exported named props types',
    pass: missingNamedPropsDeclarationMatches.length === 0,
  },
  {
    name: 'shared public prop types resolve through stable declaration files',
    pass:
      fs.existsSync(path.join(distRoot, 'theme-tokens.d.ts')) &&
      fs.existsSync(path.join(distRoot, 'primitive-types.d.ts')) &&
      publicDeclarations.some(
        ({ fileName, source }) =>
          fileName !== 'theme-tokens.d.ts' && source.includes('./theme-tokens.js')
      ) &&
      publicDeclarations.some(
        ({ fileName, source }) =>
          fileName !== 'primitive-types.d.ts' && source.includes('./primitive-types.js')
      ) &&
      packageJson.exports?.['./theme-tokens'] === undefined &&
      packageJson.exports?.['./primitive-types'] === undefined,
  },
  {
    name: 'card slot stays an implementation detail of public decorations',
    pass:
      packageJson.exports?.['./card-slot'] === undefined &&
      publicDeclarations.every(({ source }) => !/\bCardSlotProps\b/.test(source)) &&
      publicDeclarations.every(({ source }) => !source.includes('./card-slot.js')),
  },
  {
    name: 'trigger declarations do not expose primitive payload plumbing',
    pass: ['dialog.d.ts', 'popover.d.ts', 'sheet.d.ts'].every(
      (fileName) => declarationByFileName.get(fileName)?.includes('payload?: unknown') === false
    ),
  },
  {
    name: 'overlay trigger declarations expose React 19 ref props consistently',
    pass:
      declarationIncludes(
        'dialog.d.ts',
        'declare function DialogTrigger({ ref, ...props }: DialogTriggerProps)'
      ) &&
      declarationIncludes(
        'popover.d.ts',
        'declare function PopoverTrigger({ ref, ...props }: PopoverTriggerProps)'
      ) &&
      declarationIncludes(
        'sheet.d.ts',
        'declare function SheetTrigger({ ref, ...props }: SheetTriggerProps)'
      ),
  },
  {
    name: 'overlay root open-change declarations expose required event details consistently',
    pass:
      declarationByFileName
        .get('dialog.d.ts')
        ?.includes('onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails)') ===
        true &&
      declarationByFileName
        .get('popover.d.ts')
        ?.includes('onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails)') ===
        true &&
      declarationByFileName
        .get('sheet.d.ts')
        ?.includes('onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails)') ===
        true &&
      declarationByFileName.get('dialog.d.ts')?.includes('eventDetails?:') === false,
  },
  {
    name: 'select open event details do not expose dialog-only unmount controls',
    pass:
      declarationByFileName
        .get('select.d.ts')
        ?.includes('onOpenChange?: (open: boolean, eventDetails: PrimitiveChangeDetails)') ===
        true &&
      declarationByFileName.get('select.d.ts')?.includes('PrimitiveOpenChangeDetails') === false &&
      declarationByFileName.get('select.d.ts')?.includes('preventUnmountOnClose') === false,
  },
  {
    name: 'select value and trigger render props preserve consumer value generics',
    pass:
      declarationExports('select.d.ts', 'SelectCurrentValue') &&
      declarationIncludes(
        'select.d.ts',
        'type SelectCurrentValue<Value, Multiple extends boolean | undefined = false> = SelectValueType<Value, Multiple> | null'
      ) &&
      declarationIncludes(
        'select.d.ts',
        "interface SelectValueProps<Value = string, Multiple extends boolean | undefined = false> extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>"
      ) &&
      declarationIncludes(
        'select.d.ts',
        'children?: React.ReactNode | ((value: SelectCurrentValue<Value, Multiple>) => React.ReactNode)'
      ) &&
      declarationIncludes('select.d.ts', 'value: SelectCurrentValue<Value, Multiple>') &&
      declarationIncludes(
        'select.d.ts',
        'interface SelectTriggerProps<Value = string, Multiple extends boolean | undefined = false> extends React.ButtonHTMLAttributes<HTMLButtonElement>'
      ) &&
      declarationIncludes(
        'select.d.ts',
        "interface SelectScrollUpButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes(
        'select.d.ts',
        "interface SelectScrollDownButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes(
        'select.d.ts',
        "interface SelectSeparatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationByFileName.get('select.d.ts')?.includes('value: unknown') === false &&
      declarationByFileName.get('select.d.ts')?.includes('(value: unknown)') === false,
  },
  {
    name: 'carousel wrapper declarations use stable exported props types',
    pass:
      declarationByFileName
        .get('feed-carousel.d.ts')
        ?.includes("interface FeedCarouselProps extends Omit<CarouselProps, 'children'>") ===
        true &&
      declarationByFileName
        .get('marquee-carousel.d.ts')
        ?.includes("interface MarqueeCarouselProps extends Omit<CarouselProps, 'children'>") ===
        true &&
      declarationByFileName
        .get('weapons-gallery-carousel.d.ts')
        ?.includes(
          "interface WeaponsGalleryCarouselProps extends Omit<CarouselProps, 'children'>"
        ) === true &&
      declarationByFileName
        .get('icon-paginated-carousel.d.ts')
        ?.includes(
          "interface IconPaginatedCarouselProps extends Omit<MarqueeCarouselProps, 'items' | 'pagination' | 'renderItem'>"
        ) === true,
  },
  {
    name: 'high-level wrapper declarations use stable exported props types',
    pass:
      declarationByFileName
        .get('alert.d.ts')
        ?.includes("interface AlertProps extends Omit<TornCardProps, 'variant'>") === true &&
      declarationIncludes(
        'alert.d.ts',
        'declare function Alert({ ref, variant, showTape, background, className, children, ...props }: AlertProps)'
      ) &&
      declarationByFileName
        .get('video-dialog.d.ts')
        ?.includes("interface VideoDialogProps extends Omit<DialogProps, 'children'>") === true &&
      declarationIncludes(
        'video-dialog.d.ts',
        "interface VideoDialogThumbnailProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>"
      ) &&
      declarationIncludes('video-dialog.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'video-dialog.d.ts',
        "declare function VideoDialogThumbnail({ ref, src, alt, width, height, srcSet, sizes, className, blobColor, blobSize, imageClassName, loading, onClick, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }: VideoDialogThumbnailProps)"
      ),
  },
  {
    name: 'text-color subcomponent declarations expose named props types',
    pass:
      declarationByFileName
        .get('alert.d.ts')
        ?.includes("type AlertVariant = 'default' | 'destructive'") === true &&
      declarationByFileName.get('alert.d.ts')?.includes('interface AlertTitleProps') === true &&
      declarationByFileName.get('alert.d.ts')?.includes('AlertTitleProps') === true &&
      declarationByFileName
        .get('alert.d.ts')
        ?.includes("interface AlertTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'>") ===
        true &&
      declarationIncludes('alert.d.ts', 'ref?: React.Ref<HTMLHeadingElement>;') &&
      declarationByFileName.get('alert.d.ts')?.includes('interface AlertDescriptionProps') ===
        true &&
      declarationByFileName
        .get('alert.d.ts')
        ?.includes(
          "interface AlertDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'>"
        ) === true &&
      declarationIncludes('alert.d.ts', 'ref?: React.Ref<HTMLParagraphElement>;') &&
      declarationByFileName.get('alert.d.ts')?.includes('AlertDescriptionProps') === true &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes("type TornCardVariant = 'a' | 'b' | 'c'") === true &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes(
          "interface TornCardSlotProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
        ) === true &&
      declarationIncludes('torn-card.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'torn-card.d.ts',
        'declare function TornCardSlot({ ref, ...props }: TornCardSlotProps)'
      ) &&
      declarationByFileName.get('torn-card.d.ts')?.includes('interface TornCardTitleProps') ===
        true &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes(
          "interface TornCardTitleProps extends Omit<React.ComponentProps<'h2'>, 'ref'>"
        ) === true &&
      declarationIncludes('torn-card.d.ts', 'ref?: React.Ref<HTMLHeadingElement>;') &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes('interface TornCardDescriptionProps') === true &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes(
          "interface TornCardDescriptionProps extends Omit<React.ComponentProps<'p'>, 'ref'>"
        ) === true &&
      declarationIncludes('torn-card.d.ts', 'ref?: React.Ref<HTMLParagraphElement>;') &&
      declarationByFileName
        .get('alert.d.ts')
        ?.includes("React.ComponentProps<'h2'> & {\n    textColor?: string;") === false &&
      declarationByFileName
        .get('torn-card.d.ts')
        ?.includes("React.ComponentProps<'h2'> & {\n    textColor?: string;") === false,
  },
  {
    name: 'core card slot declarations expose named props types',
    pass:
      declarationIncludes(
        'card.d.ts',
        "interface CardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      declarationIncludes('card.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'card.d.ts',
        'declare function Card({ ref, className, variant, surface, ruggedTheme, rotation, ruggedBackground, image, title, subtitle, action, showTape, hoverTilt, children, ...props }: CardProps)'
      ) &&
      declarationExports('card.d.ts', 'CardHeaderProps') &&
      declarationExports('card.d.ts', 'CardFooterProps') &&
      declarationExports('card.d.ts', 'CardTitleProps') &&
      declarationExports('card.d.ts', 'CardDescriptionProps') &&
      declarationExports('card.d.ts', 'CardActionProps') &&
      declarationExports('card.d.ts', 'CardContentProps') &&
      declarationIncludes(
        'card.d.ts',
        "interface CardHeaderProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        "interface CardFooterProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        "interface CardTitleProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        "interface CardDescriptionProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        "interface CardActionProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        "interface CardContentProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardHeader({ ref, className, children, showDivider, ...props }: CardHeaderProps)'
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardFooter({ ref, className, children, showDivider, ...props }: CardFooterProps)'
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardTitle({ ref, className, ...props }: CardTitleProps)'
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardDescription({ ref, className, ...props }: CardDescriptionProps)'
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardAction({ ref, className, ...props }: CardActionProps)'
      ) &&
      declarationIncludes(
        'card.d.ts',
        'declare function CardContent({ ref, className, ...props }: CardContentProps)'
      ),
  },
  {
    name: 'public gallery item and staple card slot declarations expose named props types',
    pass:
      declarationExports('gallery-controls.d.ts', 'GalleryBounceProps') &&
      declarationIncludes(
        'gallery-controls.d.ts',
        'interface GalleryBounceProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      declarationIncludes(
        'gallery-controls.d.ts',
        "interface GalleryControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes('gallery-controls.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'gallery-controls.d.ts',
        'declare function GalleryBounce({ ref, children, className, ...props }: GalleryBounceProps)'
      ) &&
      declarationExports('marquee-carousel.d.ts', 'MarqueeGalleryItemProps') &&
      declarationIncludes('marquee-carousel.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'marquee-carousel.d.ts',
        "declare function MarqueeGalleryItem({ ref, className, item, 'data-index': index, ...props }: MarqueeGalleryItemProps)"
      ) &&
      declarationExports('staple-card.d.ts', 'StapleCardTitleProps') &&
      declarationExports('staple-card.d.ts', 'StapleCardDescriptionProps') &&
      declarationIncludes(
        'staple-card.d.ts',
        "interface StapleCardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      declarationIncludes('staple-card.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'staple-card.d.ts',
        'declare function StapleCard({ ref, variant, image, title, subtitle, action, surface, showTape, hoverTilt, className, children, ...props }: StapleCardProps)'
      ) &&
      declarationIncludes(
        'staple-card.d.ts',
        "interface StapleCardTitleProps extends Omit<React.ComponentProps<'p'>, 'ref'>"
      ) &&
      declarationIncludes('staple-card.d.ts', 'ref?: React.Ref<HTMLParagraphElement>;') &&
      declarationIncludes(
        'staple-card.d.ts',
        'declare function StapleCardTitle({ ref, className, ...props }: StapleCardTitleProps)'
      ) &&
      declarationIncludes(
        'staple-card.d.ts',
        'declare function StapleCardDescription({ ref, className, ...props }: StapleCardDescriptionProps)'
      ) &&
      declarationIncludes('staple-card.d.ts', 'StapleCardTitleProps') &&
      declarationIncludes('staple-card.d.ts', 'StapleCardDescriptionProps'),
  },
  {
    name: 'simple visual single-root declarations expose refs through exported props',
    pass:
      declarationIncludes(
        'blob-play-button.d.ts',
        "interface BlobPlayButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes('blob-play-button.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'blob-play-button.d.ts',
        'declare function BlobPlayButton({ ref, className, idleWobbleAmount, hexColor, blobSize, style, onMouseEnter, onMouseLeave, ...props }: BlobPlayButtonProps)'
      ) &&
      declarationIncludes(
        'splatoon-title.d.ts',
        "interface SplatoonTitleProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('splatoon-title.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'splatoon-title.d.ts',
        'declare function SplatoonTitle({ ref, variant, section, size, animate, image, imageHover, children, className, onMouseEnter, onMouseLeave, ...props }: SplatoonTitleProps)'
      ) &&
      declarationIncludes('gallery-controls.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'gallery-controls.d.ts',
        'declare function GalleryControls({ ref, className, prevLabel, nextLabel, wrapButton, ...props }: GalleryControlsProps)'
      ) &&
      declarationIncludes(
        'ink-trail.d.ts',
        "interface InkTrailCanvasProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('ink-trail.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'ink-trail.d.ts',
        'declare function InkTrailCanvas({ ref, enabled, colors, blobSize, sizeVariance, spawnInterval, particleLifetime, spawnRadius, initialOpacity, zIndex, className, style, children, ...props }: InkTrailCanvasProps)'
      ) &&
      declarationIncludes(
        'rugged-card.d.ts',
        "interface RuggedCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('rugged-card.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'rugged-card.d.ts',
        'declare function RuggedCard({ ref, className, ruggedTheme, ruggedRotation, ruggedBackground, children, style, ...props }: RuggedCardProps)'
      ) &&
      declarationIncludes(
        'badge.d.ts',
        "interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'>"
      ) &&
      declarationIncludes('badge.d.ts', 'ref?: React.Ref<HTMLSpanElement>;') &&
      declarationIncludes(
        'badge.d.ts',
        'declare function Badge({ ref, color, ...props }: BadgeProps)'
      ) &&
      declarationIncludes(
        'tape.d.ts',
        "interface TapeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('tape.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'tape.d.ts',
        'declare function Tape({ ref, className, variant, position, children, ...props }: TapeProps)'
      ) &&
      declarationIncludes(
        'tape.d.ts',
        'declare function Staple({ ref, className, position, ...props }: StapleProps)'
      ) &&
      declarationIncludes(
        'marquee.d.ts',
        "interface MarqueeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('marquee.d.ts', 'ref?: React.Ref<HTMLSpanElement>;') &&
      declarationIncludes(
        'marquee.d.ts',
        'declare function Marquee({ ref, className, speed, direction, pauseOnHover, variant, showEdgeTape, tapeVariant, children, ...props }: MarqueeProps)'
      ) &&
      declarationIncludes(
        'marquee.d.ts',
        'declare function MarqueeItem({ ref, className, ...props }: MarqueeItemProps)'
      ) &&
      declarationIncludes(
        'paper-surface.d.ts',
        "interface PaperSurfaceProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('paper-surface.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'paper-surface.d.ts',
        'declare function PaperSurface({ ref, tone, className, topEdgeClassName, bottomEdgeClassName, contentClassName, showTopEdge, showBottomEdge, children, ...props }: PaperSurfaceProps)'
      ) &&
      declarationIncludes('tape-title.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'tape-title.d.ts',
        "interface TapeTitleProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'>"
      ) &&
      declarationIncludes(
        'tape-title.d.ts',
        'declare function TapeTitle({ ref, color, className, children, ...props }: TapeTitleProps)'
      ) &&
      declarationIncludes('black-tape-container.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'black-tape-container.d.ts',
        'declare function BlackTapeContainer({ ref, className, children, tapeVariant, noVerticalPadding, ...props }: BlackTapeContainerProps)'
      ),
  },
  {
    name: 'card surface declarations expose stable outer refs through exported props',
    pass:
      declarationIncludes(
        'torn-card.d.ts',
        "interface TornCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('torn-card.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'torn-card.d.ts',
        'declare function TornCard({ ref, className, variant, rotation, background, showTape, showSticker, tapePosition, children, ...props }: TornCardProps)'
      ) &&
      declarationIncludes(
        'photo-frame.d.ts',
        "interface PhotoFrameProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('photo-frame.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'photo-frame.d.ts',
        'declare function PhotoFrame({ ref, src, alt, border, variant, showTape, showSticker, tapePosition, rotation, marginOffset, nested, fillWidth, className, children, style, ...props }: PhotoFrameProps)'
      ) &&
      declarationIncludes(
        'card-image.d.ts',
        "interface CardImageProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('card-image.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'card-image.d.ts',
        'declare function CardImage({ ref, className, src, alt, children, ...props }: CardImageProps)'
      ),
  },
  {
    name: 'form controls expose React 19 ref props',
    pass:
      declarationIncludes(
        'input.d.ts',
        "interface InputProps extends Omit<React.ComponentProps<'input'>, 'children' | 'ref'>"
      ) &&
      declarationIncludes('input.d.ts', 'ref?: React.Ref<HTMLInputElement>;') &&
      declarationIncludes(
        'input.d.ts',
        'declare function Input({ ref, className, type, ...props }: InputProps)'
      ) &&
      declarationIncludes(
        'label.d.ts',
        "interface LabelProps extends Omit<React.ComponentProps<'label'>, 'ref'>"
      ) &&
      declarationIncludes('label.d.ts', 'ref?: React.Ref<HTMLLabelElement>;') &&
      declarationIncludes(
        'label.d.ts',
        'declare function Label({ ref, className, ...props }: LabelProps)'
      ) &&
      declarationIncludes(
        'checkbox.d.ts',
        "interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'checked' | 'children' | 'defaultChecked' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('checkbox.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'checkbox.d.ts',
        'declare function Checkbox({ ref, className, ...props }: CheckboxProps)'
      ) &&
      declarationIncludes(
        'radio-group.d.ts',
        "interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('radio-group.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'radio-group.d.ts',
        'declare function RadioGroup({ ref, className, ...props }: RadioGroupProps)'
      ) &&
      declarationIncludes(
        'radio-group.d.ts',
        "interface RadioGroupItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('radio-group.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'radio-group.d.ts',
        'declare function RadioGroupItem({ ref, className, ...props }: RadioGroupItemProps)'
      ) &&
      declarationIncludes(
        'switch.d.ts',
        "interface SwitchProps extends Omit<React.HTMLAttributes<HTMLElement>, 'checked' | 'children' | 'color' | 'defaultChecked' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('switch.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'switch.d.ts',
        'declare function Switch({ ref, className, color, fillImageHref, offLabel, onLabel, size, style, ...props }: SwitchProps)'
      ) &&
      declarationIncludes(
        'segmented-control.d.ts',
        "interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('segmented-control.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'segmented-control.d.ts',
        'declare function SegmentedControl({ ref, appearance, className, color, density, fillImageHref, fullWidth, orientation, style, children, ...props }: SegmentedControlProps)'
      ) &&
      declarationIncludes('segmented-control.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'segmented-control.d.ts',
        'declare function SegmentedControlItem({ ref, buttonProps, className, children, ...props }: SegmentedControlItemProps)'
      ) &&
      declarationIncludes('progress.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'progress.d.ts',
        'declare function Progress({ ref, className, value, max, variant, trackVariant, size, skewed, splattered, style, ...props }: ProgressProps)'
      ),
  },
  {
    name: 'polymorphic button-like declarations preserve element-specific refs',
    pass:
      declarationIncludes('button.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'button.d.ts',
        'declare function Button({ ref, className, variant, size, children, hasChevron, leftIcon, onClick, onMouseEnter, onMouseLeave, style, color, hoverColor, textColor, textHoverColor, theme, render, nativeButton, ...props }: ButtonProps)'
      ) &&
      declarationIncludes('button-arrow.d.ts', 'ref?: React.Ref<HTMLAnchorElement>;') &&
      declarationIncludes('button-arrow.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'button-arrow.d.ts',
        'type ButtonArrowProps = ButtonArrowAnchorProps | ButtonArrowButtonProps'
      ) &&
      declarationIncludes(
        'button-arrow.d.ts',
        'declare function ButtonArrow(props: ButtonArrowProps)'
      ) &&
      declarationIncludes('button-drip.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'button-drip.d.ts',
        'declare function ButtonDrip({ ref, icon, hoverText, accentColors, className, children, type, ...props }: ButtonDripProps)'
      ) &&
      declarationIncludes('button-group.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'button-group.d.ts',
        'declare function ButtonGroup({ ref, className, density, fullWidth, orientation, role, ...props }: ButtonGroupProps)'
      ) &&
      declarationIncludes(
        'button-group.d.ts',
        'declare function ButtonGroupItem({ ref, className, hasChevron, ...props }: ButtonGroupItemProps)'
      ) &&
      declarationIncludes('icon-button.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'icon-button.d.ts',
        'declare function IconButton({ ref, variant, size, animation, direction, icon, className, style, disabled, ...props }: IconButtonProps)'
      ) &&
      declarationIncludes(
        'nav-menu-button.d.ts',
        "interface NavMenuButtonProps extends Omit<React.ComponentProps<'button'>, 'children' | 'ref'>"
      ) &&
      declarationIncludes('nav-menu-button.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'nav-menu-button.d.ts',
        'declare function NavMenuButton({ ref, className, pressed, type, ...props }: NavMenuButtonProps)'
      ) &&
      declarationIncludes('wave-button.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationIncludes(
        'wave-button.d.ts',
        'declare function WaveButton({ ref, variant, size, icon, animation, className, type, ...props }: WaveButtonProps)'
      ),
  },
  {
    name: 'media element declarations expose element refs',
    pass:
      declarationIncludes(
        'asset-image.d.ts',
        "interface AssetImageProps extends Omit<React.ComponentProps<'img'>, 'alt' | 'children' | 'height' | 'ref' | 'src' | 'width'>"
      ) &&
      declarationIncludes('asset-image.d.ts', 'ref?: React.Ref<HTMLImageElement>;') &&
      declarationIncludes(
        'asset-image.d.ts',
        'declare function AssetImage({ ref, asset, alt, className, decorative, decoding, draggable, loading, fit, aspectRatio, fill, style, ...props }: AssetImageProps)'
      ),
  },
  {
    name: 'tape picture declarations expose only unambiguous image refs',
    pass:
      declarationIncludes(
        'tape-picture.d.ts',
        "type ImageProps = Omit<React.ComponentProps<'img'>, 'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'>"
      ) &&
      declarationIncludes('tape-picture.d.ts', 'interface TapePictureProps extends ImageProps') &&
      declarationIncludes('tape-picture.d.ts', 'ref?: React.Ref<HTMLImageElement>;') &&
      declarationIncludes(
        'tape-picture.d.ts',
        'declare function TapePicture({ ref, asset, alt, className, draggable, media, pictureClassName, fill, ...props }: TapePictureProps)'
      ) &&
      !tapeResponsivePicturesPropsDeclaration.includes('ref?:'),
  },
  {
    name: 'sticker declarations expose explicit image refs through public props',
    pass:
      stickerComponentNames.every((componentName) =>
        declarationExports('stickers.d.ts', `${componentName}Props`)
      ) &&
      stickerComponentNames.every((componentName) =>
        declarationIncludes(
          'stickers.d.ts',
          `interface ${componentName}Props extends Omit<React.ComponentProps<'img'>, 'children' | 'height' | 'ref' | 'src' | 'srcSet' | 'width'>`
        )
      ) &&
      stickerComponentNames.every((componentName) =>
        declarationIncludes(
          'stickers.d.ts',
          `declare function ${componentName}({ ref, className, ...props }: ${componentName}Props)`
        )
      ) &&
      (declarationByFileName.get('stickers.d.ts')?.match(/ref\?: React\.Ref<HTMLImageElement>;/g)
        ?.length ?? 0) === stickerComponentNames.length,
  },
  {
    name: 'single-root fixed-content declarations expose refs and reject ignored children',
    pass:
      declarationIncludes(
        'loader.d.ts',
        "interface LoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>"
      ) &&
      declarationIncludes('loader.d.ts', 'ref?: React.Ref<HTMLSpanElement>;') &&
      declarationIncludes(
        'loader.d.ts',
        "declare function Loader({ ref, variant, animation, size, label, className, style, 'aria-label': ariaLabel, ...props }: LoaderProps)"
      ) &&
      declarationIncludes(
        'tape-divider.d.ts',
        "interface TapeDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes('tape-divider.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'tape-divider.d.ts',
        'declare function TapeDivider({ ref, variant, rotate, overlap, className, ...props }: TapeDividerProps)'
      ) &&
      declarationIncludes(
        'banner-divider.d.ts',
        "interface BannerDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes('banner-divider.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'banner-divider.d.ts',
        'declare function BannerDivider({ ref, tapes, animate, rootMargin, layout, className, style: styleProp, ...props }: BannerDividerProps)'
      ) &&
      declarationIncludes(
        'dotted-divider.d.ts',
        "interface DottedDividerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'color' | 'ref'>"
      ) &&
      declarationIncludes('dotted-divider.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'dotted-divider.d.ts',
        'declare function DottedDivider({ ref, orientation, color, className, style, ...props }: DottedDividerProps)'
      ),
  },
  {
    name: 'content wrapper declarations expose root refs and match their rendered element',
    pass:
      declarationIncludes(
        'heading-tape.d.ts',
        "interface HeadingTapeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('heading-tape.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'heading-tape.d.ts',
        'declare function HeadingTape({ ref, children, className, decorationSet, decorations, overlapTop, marginOffset, size, style, ...props }: HeadingTapeProps)'
      ) &&
      declarationIncludes(
        'event-callout.d.ts',
        "interface EventCalloutProps extends Omit<React.ComponentProps<'article'>, 'children' | 'ref' | 'title'>"
      ) &&
      declarationIncludes('event-callout.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'event-callout.d.ts',
        'declare function EventCallout({ ref, className, eyebrow, title, description, media, background, icon, action, mediaPriority, ...props }: EventCalloutProps)'
      ),
  },
  {
    name: 'in-view declarations expose refs to observed child elements',
    pass:
      declarationIncludes('in-view.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'in-view.d.ts',
        'declare function InView({ ref: forwardedRef, direction, delay, rootMargin, once, drop, className, children, style, ...props }: InViewProps)'
      ) &&
      declarationIncludes(
        'in-view.d.ts',
        'declare function InViewStagger({ ref: forwardedRef, variant, rootMargin, once, active, className, children, style, ...props }: InViewStaggerProps)'
      ),
  },
  {
    name: 'public props option declarations export reusable types',
    pass:
      declarationExports('button-group.d.ts', 'ButtonGroupOrientation') &&
      declarationExports('button-group.d.ts', 'ButtonGroupDensity') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeDecorationPosition') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeDecorationSet') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeSafeAreaEdge') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeSize') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeDecorationSafeArea') &&
      declarationExports('photo-frame.d.ts', 'PhotoFrameVariant') &&
      declarationExports('staple-card.d.ts', 'StapleCardVariant') &&
      declarationExports('in-view.d.ts', 'InViewElement') &&
      declarationExports('tabs.d.ts', 'TabsSwipeMode'),
  },
  {
    name: 'carousel composition declarations expose named props types',
    pass:
      declarationExports('carousel.d.ts', 'CarouselProps') &&
      declarationExports('carousel.d.ts', 'CarouselViewportProps') &&
      declarationExports('carousel.d.ts', 'CarouselBleedBoundaryProps') &&
      declarationExports('carousel.d.ts', 'CarouselContentProps') &&
      declarationExports('carousel.d.ts', 'CarouselItemProps') &&
      declarationExports('carousel.d.ts', 'FadeCarouselItemProps') &&
      declarationExports('carousel.d.ts', 'CarouselPaginationProps') &&
      declarationExports('carousel.d.ts', 'CarouselImagePaginationProps') &&
      declarationExports('carousel.d.ts', 'SwipeableGalleryProps') &&
      declarationIncludes('carousel.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes('carousel.d.ts', 'ref?: React.Ref<HTMLUListElement>;') &&
      declarationIncludes(
        'carousel.d.ts',
        "interface CarouselPaginationProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>"
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        "interface CarouselImagePaginationProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>"
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function Carousel({ ref, children, className, index, defaultIndex, itemCount: itemCountProp, onIndexChange, onKeyDown, role, tabIndex, ...props }: CarouselProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function CarouselViewport({ ref, className, ...props }: CarouselViewportProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function CarouselBleedBoundary({ ref, className, ...props }: CarouselBleedBoundaryProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function CarouselContent({ ref, className, children, ...props }: CarouselContentProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        "declare function CarouselItem({ ref, className, children, 'data-index': index, style, ...props }: CarouselItemProps)"
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        "declare function FadeCarouselItem({ ref, className, children, 'data-index': index, rotateAmount, style, ...props }: FadeCarouselItemProps)"
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function CarouselPagination({ ref, className, labels, getSlideLabel, ...props }: CarouselPaginationProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function CarouselImagePagination({ ref, className, images, getImageLabel, getSlideLabel, ...props }: CarouselImagePaginationProps)'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'interface SwipeableGalleryProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      declarationIncludes(
        'carousel.d.ts',
        'declare function SwipeableGallery({ ref, children, className, onTouchStart, onTouchMove, onTouchEnd, ...props }: SwipeableGalleryProps)'
      ),
  },
  {
    name: 'complex public declarations expose supported refs through exported props',
    pass:
      declarationIncludes(
        'card-stack-carousel.d.ts',
        'interface CardStackCarouselContentProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      declarationIncludes(
        'card-stack-carousel.d.ts',
        'declare function CardStackCarouselContent({ ref, className, style, ...props }: CardStackCarouselContentProps)'
      ) &&
      declarationIncludes(
        'card-stack-carousel.d.ts',
        "declare function CardStackCarouselItem({ ref, className, children, itemLayout, itemWidth, style, 'data-index': index, ...props }: CardStackCarouselItemProps)"
      ) &&
      declarationIncludes(
        'card-stack-carousel.d.ts',
        "interface CardStackCarouselButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>"
      ) &&
      declarationIncludes(
        'card-stack-carousel.d.ts',
        'declare function CardStackCarouselPrevious({ ref, ...props }: CardStackCarouselButtonProps)'
      ) &&
      declarationIncludes(
        'card-stack-carousel.d.ts',
        'declare function CardStackCarouselNext({ ref, ...props }: CardStackCarouselButtonProps)'
      ) &&
      declarationIncludes('popover.d.ts', 'declare function PopoverContent') &&
      declarationIncludes('popover.d.ts', '}: PopoverContentProps):') &&
      declarationIncludes('sheet.d.ts', '}: SheetPopupProps):') &&
      declarationIncludes('sheet.d.ts', '}: SheetContentProps):') &&
      declarationIncludes(
        'tabs.d.ts',
        "interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('tabs.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes('tabs.d.ts', 'interface TabsListProps') &&
      declarationIncludes('tabs.d.ts', 'render?: PrimitiveRender<HTMLDivElement>;') &&
      declarationIncludes('tabs.d.ts', 'interface TabsTriggerProps') &&
      declarationIncludes('tabs.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes('tabs.d.ts', 'interface TabsContentProps') &&
      declarationIncludes('tabs.d.ts', 'render?: PrimitiveRender<HTMLDivElement, {') &&
      declarationIncludes('tabs.d.ts', '}: TabsPanelsProps):') &&
      declarationIncludes('tabs.d.ts', '}: TabsContentProps):') &&
      declarationIncludes(
        'section-side-nav.d.ts',
        "interface SectionSideNavProps extends Omit<React.ComponentProps<'nav'>, 'children' | 'ref'>"
      ) &&
      declarationIncludes('section-side-nav.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes('section-side-nav.d.ts', '}: SectionSideNavProps):') &&
      declarationIncludes('section.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'section.d.ts',
        'declare function Section({ ref, size, headingTape, pattern, backgroundClassName, textClassName, as, bottomOverlayClearance, className, children, style, ...props }: SectionProps)'
      ) &&
      declarationIncludes('section-background.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'section-background.d.ts',
        'declare function SectionBackground({ ref, backgroundClassName, darkBackgroundClassName, pattern, as: Tag, className, children, ...props }: SectionBackgroundProps)'
      ) &&
      declarationIncludes(
        'footer.d.ts',
        "interface FooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>"
      ) &&
      declarationIncludes('footer.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'footer.d.ts',
        'declare function Footer({ ref, waveColor, waveHeight, className, ...props }: FooterProps)'
      ) &&
      declarationIncludes('page-transition.d.ts', 'ref?: React.Ref<PageTransitionHandle>;') &&
      declarationIncludes(
        'page-transition.d.ts',
        "interface PageTransitionProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'>"
      ) &&
      declarationIncludes('page-transition.d.ts', '}: PageTransitionProps):') &&
      declarationIncludes(
        'squid-mask-transition.d.ts',
        'ref?: React.Ref<SquidMaskTransitionHandle>;'
      ) &&
      declarationIncludes('squid-mask-transition.d.ts', '}: SquidMaskTransitionProps):'),
  },
  {
    name: 'visual primitive declarations expose refs and reject ignored children',
    pass:
      fixedSvgPrimitiveDeclarations.every(({ fileName, componentName, propsBase, signature }) =>
        declarationExports(fileName, `${componentName}Props`)
          ? declarationIncludes(fileName, `interface ${componentName}Props extends ${propsBase}`) &&
            declarationIncludes(fileName, 'ref?: React.Ref<SVGSVGElement>;') &&
            declarationIncludes(fileName, signature)
          : false
      ) &&
      declarationExports('splats.d.ts', 'SplatId') &&
      declarationIncludes(
        'splats.d.ts',
        'type SplatId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12'
      ) &&
      declarationIncludes(
        'splats.d.ts',
        "interface SplatProps extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'color' | 'id' | 'ref'>"
      ) &&
      declarationIncludes('splats.d.ts', 'id: SplatId;') &&
      declarationIncludes(
        'splats.d.ts',
        'declare function Splat({ ref, id, ...props }: SplatProps)'
      ) &&
      declarationIncludes('splats.d.ts', 'splatIds?: readonly SplatId[];') &&
      declarationIncludes('splats.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'splats.d.ts',
        'declare function InteractiveSplatter({ ref, className, maxSplats, minSize, maxSize, colors, interactive, splatIds, ...props }: InteractiveSplatterProps)'
      ) &&
      splatShapeComponentNames.every(
        (componentName) =>
          declarationExports('splats.d.ts', `${componentName}Props`) &&
          declarationIncludes(
            'splats.d.ts',
            `interface ${componentName}Props extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'color' | 'ref'>`
          ) &&
          declarationIncludes(
            'splats.d.ts',
            `declare function ${componentName}({ ref, color, className, style, ...props }: ${componentName}Props)`
          )
      ) &&
      declarationExports('ink-splash-canvas.d.ts', 'InkSplashCanvasProps') &&
      declarationIncludes(
        'ink-splash-canvas.d.ts',
        "interface InkSplashCanvasProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'>"
      ) &&
      declarationIncludes('ink-splash-canvas.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'ink-splash-canvas.d.ts',
        'declare function InkSplashCanvas({ ref, state, durationIn, durationOut, color, count, startPosition, background, preloadedBackground, onComplete, className, style, ...props }: InkSplashCanvasProps)'
      ) &&
      declarationExports('wave-canvas.d.ts', 'WaveCanvasProps') &&
      declarationIncludes(
        'wave-canvas.d.ts',
        "interface WaveCanvasProps extends Omit<React.ComponentProps<'canvas'>, 'children' | 'color' | 'height' | 'ref' | 'width'>"
      ) &&
      declarationIncludes('wave-canvas.d.ts', 'ref?: React.Ref<HTMLCanvasElement>;') &&
      declarationIncludes(
        'wave-canvas.d.ts',
        'declare function WaveCanvas({ ref, color, height, interactive, numPoints, elasticity, friction, className, style, ...props }: WaveCanvasProps)'
      ),
  },
  {
    name: 'navigation render-link event props preserve React anchor event types',
    pass:
      declarationIncludes(
        'navigation-types.d.ts',
        'onMouseEnter: React.MouseEventHandler<HTMLAnchorElement>;'
      ) &&
      declarationIncludes(
        'navigation-types.d.ts',
        'onMouseLeave: React.MouseEventHandler<HTMLAnchorElement>;'
      ) &&
      declarationIncludes(
        'navigation-types.d.ts',
        'onFocus: React.FocusEventHandler<HTMLAnchorElement>;'
      ) &&
      declarationIncludes(
        'navigation-types.d.ts',
        'onBlur: React.FocusEventHandler<HTMLAnchorElement>;'
      ) &&
      declarationIncludes(
        'navigation-types.d.ts',
        'onClick: React.MouseEventHandler<HTMLAnchorElement>;'
      ) &&
      declarationIncludes(
        'navigation-dialog.d.ts',
        'onNavigate?: (href: string, event?: React.MouseEvent<HTMLAnchorElement>) => void;'
      ),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Package declaration checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }

  if (missingDeclarationFiles.length > 0) {
    console.error(`Missing declaration files: ${missingDeclarationFiles.join(', ')}`)
  }

  if (forbiddenPublicDeclarationMatches.length > 0) {
    console.error('Forbidden declaration matches:')
    for (const match of forbiddenPublicDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  if (inlineObjectPropsDeclarationMatches.length > 0) {
    console.error('Inline object props declarations:')
    for (const match of inlineObjectPropsDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  if (implicitRefComponentPropsDeclarationMatches.length > 0) {
    console.error('Implicit ref ComponentProps declarations:')
    for (const match of implicitRefComponentPropsDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  if (nativePropOverrideDeclarationMatches.length > 0) {
    console.error('Native prop override declarations:')
    for (const match of nativePropOverrideDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  if (missingNamedPropsDeclarationMatches.length > 0) {
    console.error('Component declarations without exported named props:')
    for (const match of missingNamedPropsDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  process.exit(1)
}

console.log('Package declaration checks passed.')
