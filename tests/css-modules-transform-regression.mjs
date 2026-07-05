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
]) {
  if (css.includes(forbidden)) {
    failures.push(`transformed CSS still contains ${forbidden}`)
  }
}

if (failures.length > 0) {
  console.error('CSS Modules transform checks failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('CSS Modules transform checks passed.')
