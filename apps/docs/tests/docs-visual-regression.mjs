import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'
const root = process.cwd()
const baselineDir = path.join(root, 'tests', 'docs-visual-baselines')
const actualDir = path.join(root, 'scratch', 'docs-visual-actual')
const updateBaselines = process.env.UPDATE_DOCS_VISUALS === '1'
const routes = [
  { name: 'en-index', path: '/en/docs' },
  { name: 'en-button', path: '/en/docs/button' },
  { name: 'zh-button', path: '/zh/docs/button' },
  { name: 'ja-tabs', path: '/ja/docs/tabs' },
  { name: 'en-alert', path: '/en/docs/alert' },
]
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

ensureDir(baselineDir)
ensureDir(actualDir)

const browser = await chromium.launch()
const failures = []
let created = 0

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })

    for (const route of routes) {
      await page.goto(`${demoUrl}${route.path}`, { waitUntil: 'networkidle' })
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            scroll-behavior: auto !important;
          }

          [data-next-badge-root],
          [data-nextjs-toast],
          [data-nextjs-dev-tools-button],
          #next-logo {
            display: none !important;
          }
        `,
      })
      await page.evaluate(() => window.scrollTo(0, 0))

      const screenshot = await page.screenshot({ fullPage: true })
      const filename = `${route.name}-${viewport.name}.png`
      const baselinePath = path.join(baselineDir, filename)
      const actualPath = path.join(actualDir, filename)

      if (updateBaselines) {
        fs.writeFileSync(baselinePath, screenshot)
        created += 1
        continue
      }

      if (!fs.existsSync(baselinePath)) {
        failures.push(`${filename} is missing a visual baseline`)
        continue
      }

      const baseline = fs.readFileSync(baselinePath)
      if (!baseline.equals(screenshot)) {
        fs.writeFileSync(actualPath, screenshot)
        failures.push(`${filename} changed`)
      }
    }

    await page.close()
  }
} finally {
  await browser.close()
}

assert(failures.length === 0, `Docs visual regression failed:\n- ${failures.join('\n- ')}`)

console.log(
  created > 0
    ? `Docs visual baselines updated: ${created}.`
    : 'Docs visual regression check passed.'
)
