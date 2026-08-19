import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
const distRoot = path.join(packageRoot, 'dist')
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))

const supportDeclarationFiles = ['assets.d.ts', 'tokens.d.ts', 'types.d.ts']
const publicDeclarationFiles = [
  'client.d.ts',
  'server.d.ts',
  ...supportDeclarationFiles,
  ...publicUiEntries.map((entry) => `${entry}.d.ts`),
]
const missingDeclarationFiles = publicDeclarationFiles.filter(
  (fileName) => !fs.existsSync(path.join(distRoot, fileName))
)
const declarationByFileName = new Map(
  [...publicDeclarationFiles, ...supportDeclarationFiles]
    .filter((fileName) => fs.existsSync(path.join(distRoot, fileName)))
    .map((fileName) => [fileName, fs.readFileSync(path.join(distRoot, fileName), 'utf8')])
)
const publicDeclarations = publicDeclarationFiles
  .filter((fileName) => declarationByFileName.has(fileName))
  .map((fileName) => ({ fileName, source: declarationByFileName.get(fileName) ?? '' }))

function declarationIncludes(fileName, fragment) {
  return declarationByFileName.get(fileName)?.includes(fragment) === true
}

function declarationExports(fileName, name) {
  const source = declarationByFileName.get(fileName) ?? ''
  return [...source.matchAll(/export \{[^}]*\}/g)].some(
    (match) => match[0].includes(`type ${name}`) || match[0].includes(name)
  )
}

const forbiddenPublicDeclarationPatterns = [
  /from ['"]@base-ui\//g,
  /from ['"]@radix-ui\//g,
  /import\(['"]@base-ui\//g,
  /import\(['"]@radix-ui\//g,
  /from ['"]\.\/(?:chunk|card-slot|trigger-button)-[^'"]+\.js['"]/g,
  /ForwardRefExoticComponent/g,
  /JSXElementConstructor<any>/g,
  /Record<string, unknown>/g,
  /\[\s*key:\s*string\s*\]:\s*unknown\b/g,
  /HTMLMotionProps/g,
  /VariantProps<typeof/g,
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

const disallowedInternalEntrypoints = [
  './asset-image',
  './icons',
  './tape-divider',
  './torn-badge',
  './video-dialog',
]

const checks = [
  {
    name: 'public declaration files are generated for every stable package entrypoint',
    pass: missingDeclarationFiles.length === 0,
  },
  {
    name: 'public declarations do not import implementation chunks or helper signatures',
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
    name: 'public component declarations use exported named props types',
    pass: missingNamedPropsDeclarationMatches.length === 0,
  },
  {
    name: 'support declaration files are explicit public package support entrypoints',
    pass:
      supportDeclarationFiles.every((fileName) => fs.existsSync(path.join(distRoot, fileName))) &&
      packageJson.exports?.['./assets']?.types === './dist/assets.d.ts' &&
      packageJson.exports?.['./tokens']?.types === './dist/tokens.d.ts' &&
      packageJson.exports?.['./types']?.types === './dist/types.d.ts' &&
      packageJson.exports?.['./theme-tokens'] === undefined &&
      packageJson.exports?.['./primitive-types'] === undefined,
  },
  {
    name: 'removed implementation components are not package entrypoints',
    pass: disallowedInternalEntrypoints.every(
      (entrypoint) => packageJson.exports?.[entrypoint] === undefined
    ),
  },
  {
    name: 'server entrypoint only re-exports server-safe stable components',
    pass:
      declarationIncludes('server.d.ts', "from './alert.js'") &&
      declarationIncludes('server.d.ts', "from './assets.js'") &&
      declarationIncludes('server.d.ts', "from './badge.js'") &&
      declarationIncludes('server.d.ts', "from './input.js'") &&
      declarationIncludes('server.d.ts', "from './tokens.js'") &&
      declarationIncludes('server.d.ts', "from './types.js'") &&
      !declarationIncludes('server.d.ts', "from './button") &&
      !declarationIncludes('server.d.ts', "from './dialog"),
  },
  {
    name: 'stable action and form declarations expose React 19 ref props',
    pass:
      declarationIncludes(
        'button.d.ts',
        "interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>"
      ) &&
      declarationIncludes('button.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'button-group.d.ts',
        'interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement>'
      ) &&
      declarationExports('button-group.d.ts', 'ButtonGroup') &&
      declarationExports('button-group.d.ts', 'ButtonGroupItem') &&
      declarationExports('button-group.d.ts', 'ButtonGroupProps') &&
      declarationExports('button-group.d.ts', 'ButtonGroupItemProps') &&
      declarationExports('button-group.d.ts', 'ButtonGroupDensity') &&
      declarationExports('button-group.d.ts', 'ButtonGroupOrientation') &&
      declarationIncludes(
        'icon-button.d.ts',
        "type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-labelledby' | 'children'> & IconButtonOwnProps & IconButtonAccessibleName;"
      ) &&
      declarationIncludes('icon-button.d.ts', 'type IconButtonAccessibleName = {') &&
      declarationIncludes('icon-button.d.ts', "'aria-label': string;") &&
      declarationIncludes('icon-button.d.ts', "'aria-labelledby': string;") &&
      declarationIncludes('icon-button.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationExports('icon-button.d.ts', 'IconButton') &&
      declarationExports('icon-button.d.ts', 'IconButtonProps') &&
      declarationExports('icon-button.d.ts', 'IconButtonVariant') &&
      declarationExports('icon-button.d.ts', 'IconButtonSize') &&
      declarationExports('icon-button.d.ts', 'IconButtonAnimation') &&
      declarationExports('icon-button.d.ts', 'IconButtonDirection') &&
      declarationIncludes(
        'wave-button.d.ts',
        "type WaveButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-labelledby' | 'children'> & WaveButtonOwnProps & WaveButtonAccessibleName;"
      ) &&
      declarationIncludes('wave-button.d.ts', 'type WaveButtonAccessibleName = {') &&
      declarationIncludes('wave-button.d.ts', "'aria-label': string;") &&
      declarationIncludes('wave-button.d.ts', "'aria-labelledby': string;") &&
      declarationIncludes('wave-button.d.ts', 'ref?: React.Ref<HTMLButtonElement>;') &&
      declarationExports('wave-button.d.ts', 'WaveButton') &&
      declarationExports('wave-button.d.ts', 'WaveButtonProps') &&
      declarationExports('wave-button.d.ts', 'WaveButtonVariant') &&
      declarationExports('wave-button.d.ts', 'WaveButtonSize') &&
      declarationExports('wave-button.d.ts', 'WaveButtonAnimation') &&
      declarationIncludes(
        'checkbox.d.ts',
        "interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'checked' | 'children' | 'defaultChecked' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('checkbox.d.ts', 'ref?: React.Ref<HTMLElement>;') &&
      declarationIncludes(
        'input.d.ts',
        "interface InputProps extends Omit<React.ComponentProps<'input'>, 'children' | 'ref'>"
      ) &&
      declarationIncludes('input.d.ts', 'ref?: React.Ref<HTMLInputElement>;') &&
      declarationIncludes(
        'label.d.ts',
        "interface LabelProps extends Omit<React.ComponentProps<'label'>, 'ref'>"
      ) &&
      declarationIncludes('label.d.ts', 'ref?: React.Ref<HTMLLabelElement>;') &&
      declarationExports('label.d.ts', 'Label') &&
      declarationIncludes(
        'radio-group.d.ts',
        "interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('radio-group.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationExports('radio-group.d.ts', 'RadioGroup') &&
      declarationExports('radio-group.d.ts', 'RadioGroupItem') &&
      declarationExports('radio-group.d.ts', 'RadioGroupProps') &&
      declarationExports('radio-group.d.ts', 'RadioGroupItemProps') &&
      declarationIncludes(
        'select.d.ts',
        'interface SelectProps<Value = string, Multiple extends boolean | undefined = false>'
      ) &&
      declarationExports('select.d.ts', 'Select') &&
      declarationExports('select.d.ts', 'SelectTrigger') &&
      declarationExports('select.d.ts', 'SelectValue') &&
      declarationExports('select.d.ts', 'SelectContent') &&
      declarationExports('select.d.ts', 'SelectItem') &&
      declarationExports('select.d.ts', 'SelectProps') &&
      declarationExports('select.d.ts', 'SelectValueType') &&
      declarationIncludes(
        'segmented-control.d.ts',
        "interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationExports('segmented-control.d.ts', 'SegmentedControl') &&
      declarationExports('segmented-control.d.ts', 'SegmentedControlItem') &&
      declarationExports('segmented-control.d.ts', 'SegmentedControlProps') &&
      declarationExports('segmented-control.d.ts', 'SegmentedControlItemProps') &&
      declarationExports('segmented-control.d.ts', 'SegmentedControlAppearance') &&
      declarationIncludes(
        'switch.d.ts',
        "interface SwitchProps extends Omit<React.HTMLAttributes<HTMLElement>, 'checked' | 'children' | 'color' | 'defaultChecked' | 'onChange' | 'value'>"
      ) &&
      declarationIncludes('switch.d.ts', 'ref?: React.Ref<HTMLElement>;'),
  },
  {
    name: 'stable display declarations expose their named subcomponent props',
    pass:
      declarationIncludes(
        'alert.d.ts',
        "interface AlertProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      !declarationIncludes('alert.d.ts', 'TornCardProps') &&
      declarationExports('alert.d.ts', 'AlertTitleProps') &&
      declarationExports('alert.d.ts', 'AlertDescriptionProps') &&
      declarationIncludes(
        'badge.d.ts',
        "interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'color' | 'ref'>"
      ) &&
      declarationIncludes('badge.d.ts', "type BadgeColor = 'yellow'") &&
      declarationExports('badge.d.ts', 'Badge') &&
      declarationExports('badge.d.ts', 'BadgeProps') &&
      declarationExports('badge.d.ts', 'BadgeColor') &&
      !declarationIncludes('badge.d.ts', 'TornBadgeColor') &&
      !declarationIncludes('badge.d.ts', "from './torn-badge.js'") &&
      declarationIncludes(
        'card.d.ts',
        "interface CardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      declarationExports('card.d.ts', 'CardHeaderProps') &&
      declarationExports('card.d.ts', 'CardContentProps') &&
      declarationIncludes(
        'staple-card.d.ts',
        "interface StapleCardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      declarationExports('staple-card.d.ts', 'StapleCard') &&
      declarationExports('staple-card.d.ts', 'StapleCardProps') &&
      declarationExports('staple-card.d.ts', 'StapleCardTitleProps') &&
      declarationExports('staple-card.d.ts', 'StapleCardDescriptionProps') &&
      declarationExports('staple-card.d.ts', 'StapleCardVariant') &&
      declarationIncludes(
        'torn-card.d.ts',
        "interface TornCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationExports('torn-card.d.ts', 'TornCard') &&
      declarationExports('torn-card.d.ts', 'TornCardProps') &&
      declarationExports('torn-card.d.ts', 'TornCardTitleProps') &&
      declarationExports('torn-card.d.ts', 'TornCardDescriptionProps') &&
      declarationExports('torn-card.d.ts', 'TornCardSlotProps') &&
      declarationExports('torn-card.d.ts', 'TornCardSlotPosition') &&
      declarationExports('torn-card.d.ts', 'TornCardVariant') &&
      declarationIncludes(
        'rugged-card.d.ts',
        "interface RuggedCardProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationExports('rugged-card.d.ts', 'RuggedCard') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardTheme') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardHeaderProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardTitleProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardDescriptionProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardImageProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardContentProps') &&
      declarationExports('rugged-card.d.ts', 'RuggedCardFooterProps') &&
      declarationIncludes(
        'list.d.ts',
        "interface ListProps extends Omit<React.ComponentProps<'ol'>, 'start' | 'ref'>"
      ) &&
      declarationExports('list.d.ts', 'List') &&
      declarationExports('list.d.ts', 'ListItem') &&
      declarationExports('list.d.ts', 'ListProps') &&
      declarationExports('list.d.ts', 'ListItemProps'),
  },
  {
    name: 'stable overlay and tabs declarations keep cancellable details behind local primitive types',
    pass:
      declarationIncludes(
        'dialog.d.ts',
        'onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void;'
      ) &&
      declarationIncludes(
        'popover.d.ts',
        'onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void;'
      ) &&
      declarationExports('popover.d.ts', 'Popover') &&
      declarationExports('popover.d.ts', 'PopoverTriggerButton') &&
      declarationExports('popover.d.ts', 'PopoverContent') &&
      declarationExports('popover.d.ts', 'PopoverProps') &&
      declarationIncludes(
        'sheet.d.ts',
        'onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void;'
      ) &&
      declarationExports('sheet.d.ts', 'Sheet') &&
      declarationExports('sheet.d.ts', 'SheetTriggerButton') &&
      declarationExports('sheet.d.ts', 'SheetContent') &&
      declarationExports('sheet.d.ts', 'SheetSide') &&
      declarationIncludes(
        'dialog.d.ts',
        'declare function DialogTrigger({ ref, ...props }: DialogTriggerProps)'
      ) &&
      declarationIncludes(
        'tabs.d.ts',
        "interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationExports('tabs.d.ts', 'TabsSwipeMode') &&
      declarationIncludes('types.d.ts', 'interface PrimitiveChangeDetails') &&
      declarationIncludes('types.d.ts', 'interface PrimitiveOpenChangeDetails'),
  },
  {
    name: 'stable layout and typography declarations expose narrow visual primitives',
    pass:
      declarationIncludes('section.d.ts', 'pattern?: Pattern;') &&
      declarationExports('section.d.ts', 'Section') &&
      declarationExports('section.d.ts', 'SectionProps') &&
      declarationExports('section.d.ts', 'SectionPattern') &&
      declarationIncludes(
        'banner-divider.d.ts',
        "interface BannerDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationExports('banner-divider.d.ts', 'BannerDivider') &&
      declarationExports('banner-divider.d.ts', 'BannerDividerProps') &&
      declarationExports('banner-divider.d.ts', 'BannerDividerTape') &&
      declarationExports('banner-divider.d.ts', 'BannerDividerVariant') &&
      declarationExports('banner-divider.d.ts', 'BannerDividerOffsetY') &&
      declarationExports('banner-divider.d.ts', 'BannerDividerEnterFrom') &&
      declarationIncludes(
        'dotted-divider.d.ts',
        "interface DottedDividerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'color' | 'ref'>"
      ) &&
      declarationExports('dotted-divider.d.ts', 'DottedDivider') &&
      declarationExports('dotted-divider.d.ts', 'DottedDividerProps') &&
      declarationExports('dotted-divider.d.ts', 'DottedDividerOrientation') &&
      declarationIncludes(
        'tape-title.d.ts',
        "interface TapeTitleProps extends Omit<React.ComponentProps<'div'>, 'color' | 'ref'>"
      ) &&
      declarationExports('tape-title.d.ts', 'TapeTitle') &&
      declarationExports('tape-title.d.ts', 'TapeTitleProps') &&
      declarationIncludes(
        'tape.d.ts',
        "interface TapeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationIncludes('tape.d.ts', "type TapeVariant = 'tape-1'") &&
      !declarationIncludes('tape.d.ts', 'sticker-') &&
      declarationExports('tape.d.ts', 'Tape') &&
      declarationExports('tape.d.ts', 'TapeProps') &&
      declarationExports('tape.d.ts', 'TapeVariant') &&
      declarationExports('tape.d.ts', 'Staple') &&
      declarationExports('tape.d.ts', 'StapleProps') &&
      declarationIncludes(
        'splatoon-title.d.ts',
        "interface SplatoonTitleProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationExports('splatoon-title.d.ts', 'SplatoonTitle') &&
      declarationExports('splatoon-title.d.ts', 'SplatoonTitleProps') &&
      declarationExports('splatoon-title.d.ts', 'SplatoonTitleSize') &&
      declarationExports('splatoon-title.d.ts', 'SplatoonTitleVariant') &&
      declarationIncludes(
        'heading-tape.d.ts',
        "interface HeadingTapeProps extends Omit<React.ComponentProps<'div'>, 'ref'>"
      ) &&
      declarationExports('heading-tape.d.ts', 'HeadingTape') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeProps') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeDecoration') &&
      declarationExports('heading-tape.d.ts', 'HeadingTapeSize'),
  },
  {
    name: 'stable motion and progress declarations keep fixed children ownership',
    pass:
      declarationIncludes(
        'loader.d.ts',
        "interface LoaderProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>"
      ) &&
      declarationIncludes('loader.d.ts', 'ref?: React.Ref<HTMLSpanElement>;') &&
      declarationExports('loader.d.ts', 'Loader') &&
      declarationExports('loader.d.ts', 'LoaderProps') &&
      declarationExports('loader.d.ts', 'LoaderAnimation') &&
      declarationIncludes(
        'progress.d.ts',
        "interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) &&
      declarationIncludes('progress.d.ts', 'ref?: React.Ref<HTMLDivElement>;') &&
      declarationIncludes(
        'wave-canvas.d.ts',
        "interface WaveCanvasProps extends Omit<React.ComponentProps<'canvas'>, 'children' | 'color' | 'height' | 'ref' | 'width'>"
      ) &&
      declarationExports('wave-canvas.d.ts', 'WaveCanvas') &&
      declarationExports('wave-canvas.d.ts', 'WaveCanvasProps'),
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

  if (missingNamedPropsDeclarationMatches.length > 0) {
    console.error('Missing named props exports:')
    for (const match of missingNamedPropsDeclarationMatches) {
      console.error(`- ${match}`)
    }
  }

  process.exit(1)
}

console.log('Package declaration checks passed.')
