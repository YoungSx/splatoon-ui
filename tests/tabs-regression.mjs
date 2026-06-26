import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cssPath = path.join(root, 'src', 'components', 'ui', 'tabs.module.css')
const css = fs.readFileSync(cssPath, 'utf8')

function block(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`, 's'))
  return match?.groups?.body ?? ''
}

const trapezoidList = block('.trapezoidList')

const checks = [
  {
    name: 'Trapezoid tabs allow horizontal scrolling without creating vertical scrollbars',
    pass:
      trapezoidList.includes('overflow-x: auto;') &&
      trapezoidList.includes('overflow-y: hidden;') &&
      !trapezoidList.includes('overflow-y: visible;'),
  },
  {
    name: 'Trapezoid tabs reserve top space for the active pin inside the scroll container',
    pass: /padding:\s*clamp\(1rem,\s*9cqi,\s*2rem\) 0 0;/.test(trapezoidList),
  },
]

const failed = checks.filter((check) => !check.pass)

if (failed.length > 0) {
  console.error('Tabs regression checks failed:')
  for (const check of failed) {
    console.error(`- ${check.name}`)
  }
  process.exit(1)
}

console.log('Tabs regression checks passed.')
