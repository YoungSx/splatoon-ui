import { chromium } from 'playwright'

const demoUrl = process.env.DEMO_URL ?? 'http://localhost:4317'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

try {
  await page.goto(`${demoUrl}/#carousels`, { waitUntil: 'domcontentloaded' })

  const state = await page.evaluate(() => {
    const scene = document.querySelector('[data-slot="card-stack-carousel-scene"]')
    const decks = [...document.querySelectorAll('[data-slot="card-stack-item-deck"]')]
    const activeDeck = decks.find((deck) => deck.getAttribute('data-active') === 'true')

    return {
      supportPosition: Number(scene?.getAttribute('data-support-position')),
      activeOffset: Number(activeDeck?.getAttribute('data-offset')),
      activeCount: decks.filter((deck) => deck.getAttribute('data-active') === 'true').length,
      itemCount: decks.length,
    }
  })

  assert(state.itemCount === 6, `Expected 6 feed carousel items, got ${state.itemCount}`)
  assert(state.activeCount === 1, `Expected exactly one active feed item, got ${state.activeCount}`)
  assert(
    Math.abs(state.supportPosition - 2) <= 0.001,
    `Expected initial support position 2, got ${state.supportPosition}`
  )
  assert(
    Math.abs(state.activeOffset) <= 0.001,
    `Expected active feed item to be centered on first layout, got offset ${state.activeOffset}`
  )

  console.log('Feed carousel initial layout checks passed.')
} finally {
  await browser.close()
}
