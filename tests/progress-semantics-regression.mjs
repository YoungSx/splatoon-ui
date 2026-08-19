import React from '../packages/ui/node_modules/react/index.js'
import { renderToStaticMarkup } from '../packages/ui/node_modules/react-dom/server.js'
import { Progress } from '../packages/ui/dist/progress.js'

const markup = renderToStaticMarkup(
  React.createElement(Progress, {
    value: 130,
    max: 120,
    getValueLabel: (value, max) => `${value} of ${max}`,
  })
)

const requiredFragments = [
  'role="progressbar"',
  'aria-valuemin="0"',
  'aria-valuemax="120"',
  'aria-valuenow="120"',
  'aria-valuetext="120 of 120"',
  'data-state="complete"',
  'data-value="120"',
  'data-max="120"',
  'translateX(-0%)',
]

const missing = requiredFragments.filter((fragment) => !markup.includes(fragment))
if (missing.length > 0) {
  console.error('Progress semantics check failed:')
  for (const fragment of missing) console.error(`- missing ${fragment}`)
  process.exit(1)
}

console.log('Progress semantics checks passed.')
