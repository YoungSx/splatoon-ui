import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function activeTabText(panel) {
  return panel.evaluate((node) => {
    const root = node.closest('[data-slot="tabs"]')
    return root?.querySelector('[data-slot="tabs-trigger"][data-active]')?.textContent?.trim()
  })
}

async function swipe(panel, { startX = 0.82, endX = 0.18, startY = 0.5, endY = 0.5 } = {}) {
  const box = await panel.boundingBox()
  assert(box, 'Tabs panel bounds could not be measured')

  await panel.dispatchEvent('pointerdown', {
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    clientX: box.x + box.width * startX,
    clientY: box.y + box.height * startY,
  })
  await panel.dispatchEvent('pointerup', {
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    clientX: box.x + box.width * endX,
    clientY: box.y + box.height * endY,
  })
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
})
const page = await context.newPage()

try {
  await page.goto(`${demoUrl}/#navigation-components`, { waitUntil: 'networkidle' })

  const panels = await page.locator('#navigation-components [data-slot="tabs-panels"]').all()
  assert(panels.length === 2, `Expected two tabs panel groups, got ${panels.length}`)

  for (const [index, panel] of panels.entries()) {
    await panel.scrollIntoViewIfNeeded()
    const initial = await activeTabText(panel)
    assert(initial, `Panel group ${index} has no active tab`)

    await swipe(panel, { startX: 0.7, endX: 0.55, startY: 0.2, endY: 0.85 })
    await page.waitForTimeout(100)
    const afterVerticalGesture = await activeTabText(panel)
    assert(
      afterVerticalGesture === initial,
      `Panel group ${index} changed tab during a mostly vertical gesture`
    )

    await swipe(panel)
    await page.waitForTimeout(150)
    const afterHorizontalSwipe = await activeTabText(panel)
    assert(
      afterHorizontalSwipe && afterHorizontalSwipe !== initial,
      `Panel group ${index} did not change tab after a horizontal swipe`
    )
  }

  console.log('Tabs swipe checks passed.')
} finally {
  await browser.close()
}
