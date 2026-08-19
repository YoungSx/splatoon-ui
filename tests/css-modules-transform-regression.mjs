import { transformCssModule } from '../packages/ui/scripts/css-modules.mjs'

const source = `
.photoFrame.thinBorder,
.thinBorder.photoFrame {
  --border-offset-x: 2px;
  background-image: url('/_images/foo.bar.png');
}

.button:hover .icon,
.button:focus-visible .icon {
  transform: translateY(-5px);
}

:global(.is-reduced-motion) .stagger > * {
  transition-duration: 0.01ms;
}

@media screen and (min-width: 640px) {
  .inView.stagger > :first-child {
    transition-delay: 0s;
  }
}

@container (min-width: 400px) {
  .tapeMobile {
    display: none;
  }
}

/* Comment before a nested rule container must not stop selector scoping. */
@media screen and (min-width: 1024px) {
  .photoFrame {
    --border-offset-x: 4px;
  }
}

/* A reference inside a rule container that appears before the @keyframes
   definition below still has to be rewritten. */
@media (hover: hover) {
  .squish {
    animation: squish 2s ease-out infinite;
  }
}

/* ── Comment directly before a definition must not block the rename. ── */
@keyframes squish {
  0%,
  100% {
    transform: scale(1);
  }
}

.morph {
  animation-name: morph;
}

@-webkit-keyframes morph {
  0% {
    border-radius: 40%;
  }
}

@keyframes morph {
  0% {
    border-radius: 40%;
  }
}

/* Multi-value and multiline animation shorthands. */
.combo {
  animation:
    squish 2s ease-out,
    morph 3s linear infinite;
}

/* A name that is not defined in this module stays global. */
.global {
  animation: spin 1s linear infinite;
}
`

const { classMap, css } = transformCssModule(source, 'fixture_ab12cd3')
const failures = []

for (const className of [
  'button',
  'icon',
  'inView',
  'photoFrame',
  'stagger',
  'tapeMobile',
  'thinBorder',
]) {
  if (classMap[className] !== `fixture_ab12cd3_${className}`) {
    failures.push(`missing scoped class map for ${className}`)
  }
}

for (const expected of [
  '.fixture_ab12cd3_photoFrame.fixture_ab12cd3_thinBorder',
  '.fixture_ab12cd3_thinBorder.fixture_ab12cd3_photoFrame',
  '.fixture_ab12cd3_button:hover .fixture_ab12cd3_icon',
  '.fixture_ab12cd3_button:focus-visible .fixture_ab12cd3_icon',
  '.is-reduced-motion .fixture_ab12cd3_stagger > *',
  '.fixture_ab12cd3_inView.fixture_ab12cd3_stagger > :first-child',
  '.fixture_ab12cd3_tapeMobile',
  '.fixture_ab12cd3_photoFrame',
  "url('/_images/foo.bar.png')",
  // Definitions are renamed, including vendor-prefixed spellings and ones
  // preceded by a comment.
  '@keyframes fixture_ab12cd3_squish',
  '@keyframes fixture_ab12cd3_morph',
  '@-webkit-keyframes fixture_ab12cd3_morph',
  // References are rewritten to match, including forward references from a
  // rule container above the definition.
  'animation: fixture_ab12cd3_squish 2s ease-out infinite',
  'animation-name: fixture_ab12cd3_morph',
  'fixture_ab12cd3_squish 2s ease-out,',
  'fixture_ab12cd3_morph 3s linear infinite',
  // A name with no definition in this module refers to a global animation.
  'animation: spin 1s linear infinite',
]) {
  if (!css.includes(expected)) {
    failures.push(`transformed CSS is missing ${expected}`)
  }
}

for (const forbidden of [
  '.photoFrame.thinBorder',
  '.thinBorder.photoFrame',
  '.button:hover .icon',
  '.inView.stagger',
  '.photoFrame {',
  '.tapeMobile',
  'foo.fixture_ab12cd3_bar',
  // An unscoped definition would collide with the same name in another module.
  '@keyframes squish',
  '@keyframes morph',
  '@-webkit-keyframes morph',
  // An unscoped reference would point at whichever module won the collision.
  'animation: squish',
  'animation-name: morph',
  // A definition must never be scoped twice.
  'fixture_ab12cd3_fixture_ab12cd3_',
]) {
  if (css.includes(forbidden)) {
    failures.push(`transformed CSS still contains ${forbidden}`)
  }
}

const keyframeFixture = `
/* A comment before the definition must not prevent the at-rule from being scoped. */
@-webkit-keyframes morph {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes morph {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}

.motion {
  animation: morph 200ms ease;
  animation-name: morph;
}
`

const keyframeResult = transformCssModule(keyframeFixture, 'fixture_ef34567')

for (const expected of [
  '@-webkit-keyframes fixture_ef34567_morph',
  '@keyframes fixture_ef34567_morph',
  'animation: fixture_ef34567_morph 200ms ease',
  'animation-name: fixture_ef34567_morph',
]) {
  if (!keyframeResult.css.includes(expected)) {
    failures.push(`keyframe transform is missing ${expected}`)
  }
}

for (const forbidden of [
  '@-webkit-keyframes morph',
  '@keyframes morph',
  'animation: morph 200ms ease',
  'animation-name: morph',
]) {
  if (keyframeResult.css.includes(forbidden)) {
    failures.push(`keyframe transform still contains ${forbidden}`)
  }
}

const scopedKeyframes = [
  ...keyframeResult.css.matchAll(/@(?:-webkit-)?keyframes\s+([A-Za-z_][\w-]*)/g),
].map((match) => match[1])
const scopedAnimationNames = [
  ...keyframeResult.css.matchAll(/animation(?:-name)?\s*:\s*([^;{}]+)/g),
].flatMap((match) => [...match[1].matchAll(/[A-Za-z_][\w-]*/g)].map((match) => match[0]))

for (const animationName of scopedAnimationNames) {
  if (animationName === 'fixture_ef34567_morph' && !scopedKeyframes.includes(animationName)) {
    failures.push(`keyframe reference has no matching definition: ${animationName}`)
  }
}

if (failures.length > 0) {
  console.error('CSS Modules transform checks failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('CSS Modules transform checks passed.')
