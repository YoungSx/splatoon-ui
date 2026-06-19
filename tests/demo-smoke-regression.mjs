import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'short-desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 812 },
]

const forbiddenCopy = [
  'Official media-backed',
  'Official animated squid glyph',
  'Embedded media placeholder',
  'SNAP 0',
  'Battle Record #',
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    const viewportHeight = window.innerHeight

    for (let y = 0; y <= maxScroll; y += Math.max(200, Math.floor(viewportHeight * 0.8))) {
      window.scrollTo(0, y)
      await new Promise((resolve) => window.setTimeout(resolve, 80))
    }

    window.scrollTo(0, 0)
  })
}

async function collectA11yIssues(page) {
  return page.evaluate(() => {
    function isVisible(element) {
      const style = window.getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return (
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        rect.width > 0 &&
        rect.height > 0
      )
    }

    function textById(id) {
      return document.getElementById(id)?.textContent?.trim() ?? ''
    }

    function accessibleName(element) {
      const ariaLabel = element.getAttribute('aria-label')?.trim()
      if (ariaLabel) return ariaLabel

      const labelledBy = element
        .getAttribute('aria-labelledby')
        ?.split(/\s+/)
        .map(textById)
        .join(' ')
        .trim()
      if (labelledBy) return labelledBy

      const title = element.getAttribute('title')?.trim()
      if (title) return title

      if (element.id) {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
        const labelText = label?.textContent?.trim()
        if (labelText) return labelText
      }

      const wrappingLabel = element.closest('label')?.textContent?.trim()
      if (wrappingLabel) return wrappingLabel

      const text = element.textContent?.trim()
      if (text) return text

      const alt = element.querySelector('img[alt]')?.getAttribute('alt')?.trim()
      return alt ?? ''
    }

    const duplicateIds = [...document.querySelectorAll('[id]')]
      .map((element) => element.id)
      .filter(Boolean)
      .filter((id, index, ids) => ids.indexOf(id) !== index)

    const unnamedInteractives = [
      ...document.querySelectorAll(
        'a[href], button, input, select, textarea, [role="button"], [role="link"]'
      ),
    ]
      .filter((element) => !element.closest('[aria-hidden="true"]'))
      .filter(isVisible)
      .filter((element) => !accessibleName(element))
      .map((element) => element.outerHTML.slice(0, 160))

    const untitledIframes = [...document.querySelectorAll('iframe')]
      .filter((iframe) => isVisible(iframe) && !iframe.getAttribute('title')?.trim())
      .map((iframe) => iframe.outerHTML.slice(0, 160))

    const imagesWithoutAlt = [...document.querySelectorAll('img')]
      .filter((image) => !image.hasAttribute('alt'))
      .map((image) => image.outerHTML.slice(0, 160))

    return {
      duplicateIds: [...new Set(duplicateIds)],
      unnamedInteractives,
      untitledIframes,
      imagesWithoutAlt,
    }
  })
}

async function collectLayoutIssues(page) {
  return page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth
    const feedMediaHeights = [...document.querySelectorAll('[data-slot="feed-carousel-media"]')]
      .map((element) => element.offsetHeight)
      .filter((height) => height > 0)

    return {
      overflow,
      feedMediaHeightDelta:
        feedMediaHeights.length > 1
          ? Math.max(...feedMediaHeights) - Math.min(...feedMediaHeights)
          : 0,
      feedMediaCount: feedMediaHeights.length,
    }
  })
}

async function collectSectionSideNavState(page) {
  return page.evaluate(() => {
    const sidebar = document.querySelector('[data-slot="section-side-nav"]')
    if (!sidebar) return null

    const style = window.getComputedStyle(sidebar)
    const rect = sidebar.getBoundingClientRect()
    const fixedTopChromeBottom = [...document.body.querySelectorAll('*')]
      .filter((element) => !sidebar.contains(element) && element !== sidebar)
      .filter((element) => {
        const elementStyle = window.getComputedStyle(element)
        const elementRect = element.getBoundingClientRect()
        return (
          elementStyle.position === 'fixed' &&
          elementRect.top <= 1 &&
          elementRect.bottom > 0 &&
          elementRect.width >= window.innerWidth * 0.5
        )
      })
      .reduce((bottom, element) => Math.max(bottom, element.getBoundingClientRect().bottom), 0)

    return {
      display: style.display,
      opacity: Number(style.opacity),
      visibility: style.visibility,
      top: rect.top,
      bottom: rect.bottom,
      fixedTopChromeBottom,
      width: rect.width,
      height: rect.height,
    }
  })
}

async function collectImageIssues(page) {
  return page.evaluate(() =>
    [...document.images]
      .filter((image) => image.currentSrc.includes('/_images/'))
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc)
  )
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })
  const page = await context.newPage()
  const consoleErrors = []
  const requestFailures = []
  const imageResponseFailures = []

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  page.on('requestfailed', (request) => {
    const url = request.url()
    if (!url.startsWith('data:')) {
      requestFailures.push(`${request.method()} ${url}: ${request.failure()?.errorText}`)
    }
  })

  page.on('response', (response) => {
    const url = response.url()
    if (url.includes('/_images/') && response.status() >= 400) {
      imageResponseFailures.push(`${response.status()} ${url}`)
    }
  })

  try {
    const response = await page.goto(demoUrl, { waitUntil: 'networkidle' })
    assert(response, `${viewport.name}: no document response from ${demoUrl}`)
    assert(
      response.status() === 200,
      `${viewport.name}: expected HTTP 200, got ${response.status()}`
    )
    assert(
      response.headers()['cache-control']?.includes('no-store'),
      `${viewport.name}: expected no-store cache-control header`
    )

    await scrollThroughPage(page)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, Math.floor(window.innerHeight * 1.1)))
    await page.waitForTimeout(250)

    const bodyText = await page.locator('body').innerText()
    const presentForbiddenCopy = forbiddenCopy.filter((copy) => bodyText.includes(copy))
    assert(
      presentForbiddenCopy.length === 0,
      `${viewport.name}: forbidden demo copy found: ${presentForbiddenCopy.join(', ')}`
    )

    const trigger = page.locator(
      '[data-slot="dialog-trigger"][aria-label="Open Splatoon UI demo reel"]'
    )
    assert(
      (await trigger.count()) === 1,
      `${viewport.name}: expected one accessible video dialog trigger`
    )

    const sectionSideNav = await collectSectionSideNavState(page)
    assert(sectionSideNav, `${viewport.name}: section side nav was not rendered`)
    assert(
      sectionSideNav.display !== 'none' &&
        sectionSideNav.visibility === 'visible' &&
        sectionSideNav.opacity > 0.9 &&
        sectionSideNav.width > 0 &&
        sectionSideNav.height > 0,
      `${viewport.name}: section side nav is not visible: ${JSON.stringify(sectionSideNav)}`
    )
    assert(
      sectionSideNav.top >= -1 && sectionSideNav.bottom <= viewport.height + 1,
      `${viewport.name}: section side nav exceeds viewport height: ${JSON.stringify(sectionSideNav)}`
    )
    assert(
      sectionSideNav.top >= sectionSideNav.fixedTopChromeBottom - 1,
      `${viewport.name}: section side nav overlaps fixed top chrome: ${JSON.stringify(sectionSideNav)}`
    )

    const layoutIssues = await collectLayoutIssues(page)
    assert(
      layoutIssues.overflow <= 1,
      `${viewport.name}: horizontal overflow ${layoutIssues.overflow}px`
    )
    assert(
      layoutIssues.feedMediaCount > 1,
      `${viewport.name}: feed carousel media frames were not rendered`
    )
    assert(
      layoutIssues.feedMediaHeightDelta <= 1,
      `${viewport.name}: feed carousel media height delta ${layoutIssues.feedMediaHeightDelta}px`
    )

    const a11yIssues = await collectA11yIssues(page)
    assert(
      a11yIssues.duplicateIds.length === 0,
      `${viewport.name}: duplicate ids: ${a11yIssues.duplicateIds.join(', ')}`
    )
    assert(
      a11yIssues.unnamedInteractives.length === 0,
      `${viewport.name}: visible unnamed interactive elements: ${a11yIssues.unnamedInteractives.join('\n')}`
    )
    assert(
      a11yIssues.untitledIframes.length === 0,
      `${viewport.name}: visible iframe without title: ${a11yIssues.untitledIframes.join('\n')}`
    )
    assert(
      a11yIssues.imagesWithoutAlt.length === 0,
      `${viewport.name}: images without alt: ${a11yIssues.imagesWithoutAlt.join('\n')}`
    )

    const brokenImages = await collectImageIssues(page)
    assert(
      brokenImages.length === 0,
      `${viewport.name}: broken _images assets: ${brokenImages.join(', ')}`
    )
    assert(
      imageResponseFailures.length === 0,
      `${viewport.name}: _images response failures: ${imageResponseFailures.join(', ')}`
    )
    assert(
      requestFailures.length === 0,
      `${viewport.name}: request failures: ${requestFailures.join('\n')}`
    )
    assert(
      consoleErrors.length === 0,
      `${viewport.name}: console errors: ${consoleErrors.join('\n')}`
    )
  } finally {
    await context.close()
  }
}

const browser = await chromium.launch()

try {
  for (const viewport of viewports) {
    await runViewport(browser, viewport)
  }
} catch (error) {
  console.error(
    `Demo smoke checks failed for ${demoUrl}. Start the demo with "pnpm dev" or set DEMO_URL.`
  )
  console.error(error)
  process.exitCode = 1
} finally {
  await browser.close()
}

if (process.exitCode !== 1) {
  console.log('Demo smoke checks passed.')
}
