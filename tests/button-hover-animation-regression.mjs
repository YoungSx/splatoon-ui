import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const cssPath = path.join(root, 'src', 'components', 'ui', 'button.module.css')
const buttonPath = path.join(root, 'src', 'components', 'ui', 'button.tsx')
const dripHookPath = path.join(root, 'src', 'hooks', 'use-drip-animation.ts')
const dripMathPath = path.join(root, 'src', 'lib', 'drip-math.ts')

const css = fs.readFileSync(cssPath, 'utf8')
const button = fs.readFileSync(buttonPath, 'utf8')
const dripHook = fs.readFileSync(dripHookPath, 'utf8')
const dripMath = fs.readFileSync(dripMathPath, 'utf8')

const dripMathModule = await import(
  `data:text/javascript;base64,${Buffer.from(
    ts.transpileModule(dripMath, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
  ).toString('base64')}`
)

function createDeterministicRandom() {
  let value = 0

  return () => {
    value = (value + 0.37) % 1
    return value
  }
}

const narrowPoints = dripMathModule.createDripControlPoints({
  random: createDeterministicRandom(),
  width: 180,
})
const widePoints = dripMathModule.createDripControlPoints({
  existing: narrowPoints,
  random: createDeterministicRandom(),
  width: 720,
})
const widePaths = [
  dripMathModule.createDripPath({
    controlPoints: widePoints,
    height: 56,
    phase: 'enter',
    stage: 'start',
    width: 720,
  }),
  dripMathModule.createDripPath({
    controlPoints: widePoints,
    height: 56,
    phase: 'enter',
    stage: 'end',
    width: 720,
  }),
  dripMathModule.createDripPath({
    controlPoints: widePoints,
    height: 56,
    phase: 'leave',
    stage: 'start',
    width: 720,
  }),
  dripMathModule.createDripPath({
    controlPoints: widePoints,
    height: 56,
    phase: 'leave',
    stage: 'end',
    width: 720,
  }),
]
const commandSignatures = widePaths.map((pathValue) => pathValue.match(/[MCLZ]/g)?.join('') ?? '')

const checks = [
  {
    name: 'drip hover animation is controlled by durable state instead of the transient :hover pseudo-class',
    pass: !/\.dripRoot:hover\s+\.dripHoverContent/.test(css),
  },
  {
    name: 'enter animation keeps the original top-to-bottom path',
    pass: !css.includes('--drip-enter-start') && css.includes('clip-path: var(--drip-in-start);'),
  },
  {
    name: 'leave animation keeps the original top-to-bottom path',
    pass: !css.includes('--drip-leave-start') && css.includes('clip-path: var(--drip-out-start);'),
  },
  {
    name: 'button exposes a drip animation state attribute',
    pass: button.includes('data-drip-state'),
  },
  {
    name: 'button computes the early-leave trigger from the generated drip path instead of a fixed guessed delay',
    pass:
      dripHook.includes('calculateDripVisualFillDelayMs') &&
      dripHook.includes('pendingDripLeaveTimerRef') &&
      !dripHook.includes('const dripVisualFillDelayMs = 600') &&
      !dripHook.includes('return "leaving"'),
  },
  {
    name: 'entered state holds the hover terminal frame instead of inheriting the default leave animation',
    pass: /\.dripRoot\[data-drip-state='entered'\]\s+\.dripHoverContent\s*{[^}]*animation:\s*none;[^}]*clip-path:\s*var\(--drip-in-end\);/s.test(
      css
    ),
  },
  {
    name: 'button does not capture the live overlay clip-path and alter the original drip paths',
    pass:
      !button.includes('getComputedStyle') &&
      !button.includes('clipPath') &&
      !dripHook.includes('getComputedStyle') &&
      !dripHook.includes('clipPath'),
  },
  {
    name: 'button measures drip geometry from the rendered border box instead of integer client dimensions',
    pass:
      dripHook.includes('getBoundingClientRect()') &&
      !dripHook.includes('element.clientWidth') &&
      !dripHook.includes('element.clientHeight'),
  },
  {
    name: 'drip paths are generated from stable control points instead of per-frame random path jitter',
    pass:
      dripHook.includes('createDripControlPoints') &&
      dripHook.includes('createDripPath') &&
      !dripHook.includes('Math.random'),
  },
  {
    name: 'wide drip paths extend past both visual edges so rotated buttons do not expose the base layer',
    pass: widePaths.every(
      (pathValue) =>
        pathValue.startsWith(`M-${dripMathModule.DRIP_BLEED_X} `) &&
        pathValue.includes(`L${720 + dripMathModule.DRIP_BLEED_X} `) &&
        pathValue.includes(`, -${dripMathModule.DRIP_BLEED_X} `)
    ),
  },
  {
    name: 'drip control points grow with responsive button width instead of freezing at the initial width',
    pass: widePoints.length > narrowPoints.length,
  },
  {
    name: 'drip animation paths keep matching command signatures for interpolable clip-path animation',
    pass: commandSignatures.every((signature) => signature === commandSignatures[0]),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Button hover animation regression check failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Button hover animation regression check passed.')
