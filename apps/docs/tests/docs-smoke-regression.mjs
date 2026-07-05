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
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function collectDocsState(page) {
  return page.evaluate(() => {
    const playground = document.querySelector('[data-slot="docs-playground"]')
    const playgroundPreview = document.querySelector('[data-slot="docs-playground-preview"]')
    const playgroundControls = document.querySelector('[data-slot="docs-playground-controls"]')

    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      title: document.querySelector('h1')?.textContent?.trim() ?? '',
      hasSidebar: Boolean(document.querySelector('nav[aria-label="Component navigation"]')),
      hasApiTable: Boolean(document.querySelector('table')),
      hasPlayground: Boolean(playground),
      playgroundLayout:
        playground && playgroundPreview && playgroundControls
          ? {
              width: playground.getBoundingClientRect().width,
              previewWidth: playgroundPreview.getBoundingClientRect().width,
              previewBottom: playgroundPreview.getBoundingClientRect().bottom,
              controlsTop: playgroundControls.getBoundingClientRect().top,
            }
          : null,
      transparentChaosBackgrounds: [...document.querySelectorAll('[class*="bg-chaos-black"]')]
        .filter((element) => element.getClientRects().length > 0)
        .filter((element) => getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)')
        .map((element) => element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? ''),
      codeText: [...document.querySelectorAll('pre code')]
        .map((element) => element.textContent ?? '')
        .join('\n\n'),
    }
  })
}

const browser = await chromium.launch()

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })

    for (const route of routes) {
      const response = await page.goto(`${demoUrl}${route.path}`, { waitUntil: 'networkidle' })
      assert(
        response?.status() === 200,
        `${route.path} returned HTTP ${response?.status() ?? 'missing response'} on ${viewport.name}`
      )
      const state = await collectDocsState(page)

      assert(state.overflow <= 1, `${route.path} overflows horizontally on ${viewport.name}`)
      assert(state.title.length > 0, `${route.path} did not render a title on ${viewport.name}`)
      assert(state.hasSidebar, `${route.path} did not render docs sidebar on ${viewport.name}`)
      assert(
        state.transparentChaosBackgrounds.length === 0,
        `${route.path} has transparent bg-chaos-black surfaces on ${viewport.name}: ${state.transparentChaosBackgrounds.join(
          ', '
        )}`
      )

      if (route.kind === 'detail') {
        const expectedImport = `from 'splatoon-ui/${route.slug}'`

        assert(state.hasApiTable, `${route.path} did not render API table on ${viewport.name}`)
        assert(state.hasPlayground, `${route.path} did not render playground on ${viewport.name}`)
        assert(state.playgroundLayout, `${route.path} did not expose playground layout slots`)
        assert(
          state.playgroundLayout.previewWidth >= state.playgroundLayout.width - 40,
          `${route.path} playground preview is compressed on ${viewport.name}: ${JSON.stringify(
            state.playgroundLayout
          )}`
        )
        assert(
          state.playgroundLayout.controlsTop >= state.playgroundLayout.previewBottom,
          `${route.path} playground controls overlap preview on ${viewport.name}: ${JSON.stringify(
            state.playgroundLayout
          )}`
        )

        await page.getByRole('button', { name: 'code', exact: true }).click()
        const codeText = await page
          .locator('[data-slot="docs-playground"] pre code')
          .first()
          .textContent()
        assert(codeText?.includes(expectedImport), `${route.path} did not render package imports`)
        assert(!codeText?.includes('@/components'), `${route.path} rendered local source imports`)
        await page.getByRole('button', { name: 'api', exact: true }).click()
        await page.getByText('Props').first().waitFor()
      }
    }

    const legacyIndexResponse = await page.goto(`${demoUrl}/docs`, { waitUntil: 'networkidle' })
    assert(legacyIndexResponse?.status() === 404, 'legacy /docs route is still public')

    const legacyDetailResponse = await page.goto(`${demoUrl}/docs/button`, {
      waitUntil: 'networkidle',
    })
    assert(legacyDetailResponse?.status() === 404, 'legacy /docs/[slug] route is still public')

    await page.close()
  }
} finally {
  await browser.close()
}

console.log(
  `Docs smoke regression check passed for ${routes.length} routes across ${viewports.length} viewports.`
)
