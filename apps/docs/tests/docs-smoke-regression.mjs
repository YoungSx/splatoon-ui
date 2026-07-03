import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'
const routes = [
  '/en/docs',
  '/zh/docs',
  '/ja/docs',
  '/en/docs/button',
  '/zh/docs/button',
  '/ja/docs/tabs',
  '/en/docs/icons',
]
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
  return page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    title: document.querySelector('h1')?.textContent?.trim() ?? '',
    hasSidebar: Boolean(document.querySelector('nav[aria-label="Component navigation"]')),
    hasApiTable: Boolean(document.querySelector('table')),
    hasPlayground: Boolean(document.querySelector('[data-slot="docs-playground"]')),
    transparentChaosBackgrounds: [...document.querySelectorAll('[class*="bg-chaos-black"]')]
      .filter((element) => element.getClientRects().length > 0)
      .filter((element) => getComputedStyle(element).backgroundColor === 'rgba(0, 0, 0, 0)')
      .map((element) => element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? ''),
    codeText: [...document.querySelectorAll('pre code')]
      .map((element) => element.textContent ?? '')
      .join('\n\n'),
  }))
}

const browser = await chromium.launch()

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })

    for (const route of routes) {
      await page.goto(`${demoUrl}${route}`, { waitUntil: 'networkidle' })
      const state = await collectDocsState(page)

      assert(state.overflow <= 1, `${route} overflows horizontally on ${viewport.name}`)
      assert(state.title.length > 0, `${route} did not render a title on ${viewport.name}`)
      assert(state.hasSidebar, `${route} did not render docs sidebar on ${viewport.name}`)
      assert(
        state.transparentChaosBackgrounds.length === 0,
        `${route} has transparent bg-chaos-black surfaces on ${viewport.name}: ${state.transparentChaosBackgrounds.join(
          ', '
        )}`
      )

      if (route.includes('/button') || route.includes('/tabs')) {
        const expectedImport = route.includes('/button')
          ? "from 'splatoon-ui/button'"
          : "from 'splatoon-ui/tabs'"

        assert(state.hasApiTable, `${route} did not render API table on ${viewport.name}`)
        assert(state.hasPlayground, `${route} did not render playground on ${viewport.name}`)

        await page.getByRole('button', { name: 'code', exact: true }).click()
        const codeText = await page
          .locator('[data-slot="docs-playground"] pre code')
          .first()
          .textContent()
        assert(codeText?.includes(expectedImport), `${route} did not render package imports`)
        assert(!codeText?.includes('@/components'), `${route} rendered local source imports`)
        await page.getByRole('button', { name: 'api', exact: true }).click()
        await page.getByText('Props').first().waitFor()
      }

      if (route === '/en/docs/icons') {
        assert(
          state.codeText.includes("import { NavArrowDown } from 'splatoon-ui/icons'") &&
            !state.codeText.includes('{ Icons }'),
          `${route} rendered a guessed icon import on ${viewport.name}`
        )
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

console.log('Docs smoke regression check passed.')
