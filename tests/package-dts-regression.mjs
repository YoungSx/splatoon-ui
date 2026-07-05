import fs from 'node:fs'
import path from 'node:path'
import { publicUiEntries } from '../packages/ui/scripts/public-ui-entries.mjs'

const root = process.cwd()
const packageRoot = path.join(root, 'packages', 'ui')
const distRoot = path.join(packageRoot, 'dist')
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))

const supportDeclarationFiles = ['primitive-types.d.ts', 'theme-tokens.d.ts']
const publicDeclarationFiles = ['server.d.ts', ...publicUiEntries.map((entry) => `${entry}.d.ts`)]
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
  './button-group',
  './carousel',
  './heading-tape',
  './icons',
  './label',
  './popover',
  './select',
  './sheet',
  './torn-card',
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
    name: 'support declaration files remain private package internals',
    pass:
      supportDeclarationFiles.every((fileName) => fs.existsSync(path.join(distRoot, fileName))) &&
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
      declarationIncludes('server.d.ts', "from './badge.js'") &&
      declarationIncludes('server.d.ts', "from './input.js'") &&
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
      declarationIncludes(
        'card.d.ts',
        "interface CardProps extends Omit<React.ComponentProps<'div'>, 'ref' | 'title'>"
      ) &&
      declarationExports('card.d.ts', 'CardHeaderProps') &&
      declarationExports('card.d.ts', 'CardContentProps'),
  },
  {
    name: 'stable overlay and tabs declarations keep cancellable details behind local primitive types',
    pass:
      declarationIncludes(
        'dialog.d.ts',
        'onOpenChange?: (open: boolean, eventDetails: PrimitiveOpenChangeDetails) => void;'
      ) &&
      declarationIncludes(
        'dialog.d.ts',
        'declare function DialogTrigger({ ref, ...props }: DialogTriggerProps)'
      ) &&
      declarationIncludes(
        'tabs.d.ts',
        "interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'value'>"
      ) &&
      declarationExports('tabs.d.ts', 'TabsSwipeMode') &&
      declarationIncludes('primitive-types.d.ts', 'interface PrimitiveChangeDetails') &&
      declarationIncludes('primitive-types.d.ts', 'interface PrimitiveOpenChangeDetails'),
  },
  {
    name: 'stable progress declaration keeps fixed children ownership',
    pass:
      declarationIncludes(
        'progress.d.ts',
        "interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>"
      ) && declarationIncludes('progress.d.ts', 'ref?: React.Ref<HTMLDivElement>;'),
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
