import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const api = JSON.parse(fs.readFileSync(path.join(appRoot, 'src/docs/generated/api.json'), 'utf8'))
const locales = ['en', 'zh', 'ja']
const slugs = api.entries.map((entry) => entry.slug).sort()
const routes = locales.flatMap((locale) => [
  { kind: 'index', path: `/${locale}/docs` },
  ...slugs.map((slug) => ({ kind: 'detail', path: `/${locale}/docs/${slug}`, slug })),
])
const viewports = [
  { name: 'desktop', width: 1280, height: 900, minScreenshotBytes: 12000 },
  { name: 'mobile', width: 390, height: 844, minScreenshotBytes: 7000 },
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function stabilizeVisuals(page) {
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
}

async function collectVisualState(page, route) {
  return page.evaluate(
    ({ kind, slug, expectedSlugCount }) => {
      function parseColor(value) {
        if (!value || value === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }

        const match = value.match(
          /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
        )
        if (!match) return null

        return {
          r: Number(match[1]),
          g: Number(match[2]),
          b: Number(match[3]),
          a: match[4] === undefined ? 1 : Number(match[4]),
        }
      }

      function blend(top, bottom) {
        const alpha = Math.min(1, Math.max(0, top.a))
        return {
          r: top.r * alpha + bottom.r * (1 - alpha),
          g: top.g * alpha + bottom.g * (1 - alpha),
          b: top.b * alpha + bottom.b * (1 - alpha),
          a: 1,
        }
      }

      function relativeLuminance(color) {
        const channels = [color.r, color.g, color.b].map((channel) => {
          const value = channel / 255
          return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        })

        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
      }

      function contrastRatio(foreground, background) {
        const first = relativeLuminance(foreground)
        const second = relativeLuminance(background)
        const light = Math.max(first, second)
        const dark = Math.min(first, second)
        return (light + 0.05) / (dark + 0.05)
      }

      function isVisible(element) {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        )
      }

      function visibleText(element) {
        const clone = element.cloneNode(true)
        clone.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove())
        return clone.textContent?.trim().replace(/\s+/g, ' ') ?? ''
      }

      function effectiveBackground(element) {
        const chain = []
        for (let current = element; current; current = current.parentElement) {
          chain.push(current)
        }

        let color = { r: 255, g: 255, b: 255, a: 1 }
        for (let index = chain.length - 1; index >= 0; index -= 1) {
          const background = parseColor(getComputedStyle(chain[index]).backgroundColor)
          if (background && background.a > 0) {
            color = blend(background, color)
          }
        }

        return color
      }

      function effectiveTextColor(element, background) {
        const color = parseColor(getComputedStyle(element).color) ?? { r: 0, g: 0, b: 0, a: 1 }
        return blend(color, background)
      }

      const textContrastIssues = [
        ...document.querySelectorAll('h1, h2, h3, p, a, button, th, td, code, span, label, li'),
      ]
        .filter((element) => !element.closest('[aria-hidden="true"]'))
        .map((element) => ({ element, text: visibleText(element) }))
        .filter(({ text }) => text)
        .filter(({ element }) => isVisible(element))
        .map(({ element, text }) => {
          const background = effectiveBackground(element)
          const foreground = effectiveTextColor(element, background)
          const contrast = contrastRatio(foreground, background)
          return {
            contrast,
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
            text: text.slice(0, 80),
          }
        })
        .filter((issue) => issue.contrast < 1.8)
        .sort((a, b) => a.contrast - b.contrast)
        .slice(0, 8)

      const transparentChaosBackgrounds = [
        ...document.querySelectorAll('[class*="bg-chaos-black"]'),
      ]
        .filter(isVisible)
        .filter((element) => getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)')
        .map((element) => element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '')
        .slice(0, 8)

      const detailArticle = document.querySelector('article')
      const docsLinks = new Set(
        [...document.querySelectorAll('main a[href*="/docs/"]')].map((link) =>
          link.getAttribute('href')
        )
      )

      return {
        apiTableRows: document.querySelectorAll('table tbody tr').length,
        detailArticleVisible: detailArticle ? isVisible(detailArticle) : false,
        docsLinkCount: docsLinks.size,
        hasApiTable: Boolean(document.querySelector('table')),
        hasImportCode: [...document.querySelectorAll('pre code')].some((code) =>
          code.textContent?.includes(slug ? `splatoon-ui/${slug}` : 'splatoon-ui/')
        ),
        hasMain: Boolean(document.querySelector('main')),
        hasPlaygroundShell: Boolean(
          document.querySelector('[data-slot="docs-playground"]') ||
          document.querySelector('.pattern-chip-white.border-chaos-black')
        ),
        hasSidebar: Boolean(document.querySelector('nav[aria-label="Component navigation"]')),
        indexHasExpectedLinks: kind === 'index' ? docsLinks.size >= expectedSlugCount : true,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        textContrastIssues,
        title: document
          .querySelector(kind === 'index' ? 'header h1' : 'article h1')
          ?.textContent?.trim(),
        transparentChaosBackgrounds,
      }
    },
    { ...route, expectedSlugCount: slugs.length }
  )
}

function assertVisualState(route, viewport, state, screenshot) {
  assert(screenshot.length >= viewport.minScreenshotBytes, 'viewport screenshot looks blank')
  assert(state.overflow <= 1, `horizontal overflow ${state.overflow}px`)
  assert(state.title, 'missing page title')
  assert(state.hasMain, 'missing main landmark content')
  assert(state.hasSidebar, 'missing component navigation')
  assert(
    state.transparentChaosBackgrounds.length === 0,
    `transparent bg-chaos-black surfaces: ${state.transparentChaosBackgrounds.join(' | ')}`
  )
  assert(
    state.textContrastIssues.length === 0,
    `low text/background contrast: ${state.textContrastIssues
      .map((issue) => `${issue.tag} ${issue.contrast.toFixed(2)} "${issue.text}"`)
      .join(' | ')}`
  )

  if (route.kind === 'index') {
    assert(state.indexHasExpectedLinks, `index rendered only ${state.docsLinkCount} docs links`)
    return
  }

  assert(state.detailArticleVisible, 'detail article is not visible')
  assert(state.hasPlaygroundShell, 'missing playground or pending example surface')
  assert(state.hasImportCode, 'missing package import code')
  assert(state.hasApiTable, 'missing API table')
  assert(state.apiTableRows > 0, 'API table has no rows')
}

const browser = await chromium.launch()
const failures = []
let checked = 0

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })

    for (const route of routes) {
      try {
        const response = await page.goto(`${demoUrl}${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 60000,
        })
        assert(response?.status() === 200, `HTTP ${response?.status() ?? 'missing response'}`)
        await stabilizeVisuals(page)
        await page.evaluate(() => window.scrollTo(0, 0))

        const state = await collectVisualState(page, route)
        const screenshot = await page.screenshot({ caret: 'hide' })
        assertVisualState(route, viewport, state, screenshot)
      } catch (error) {
        failures.push(`${viewport.name} ${route.path}: ${error.message}`)
      }

      checked += 1
      if (checked % 50 === 0) {
        console.log(`Docs visual smoke checked ${checked}/${routes.length * viewports.length}.`)
      }
    }

    await page.close()
  }
} finally {
  await browser.close()
}

assert(
  failures.length === 0,
  `Docs visual smoke failed across ${routes.length} routes:\n- ${failures.join('\n- ')}`
)

console.log(
  `Docs visual smoke passed for ${routes.length} routes across ${viewports.length} viewports.`
)
