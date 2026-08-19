import fs from 'node:fs'
import path from 'node:path'

const testsDir = path.dirname(new URL(import.meta.url).pathname)

/**
 * Node-only checks. No browser, no dev server, no network. Safe to run on every
 * push and cheap enough that there is no reason not to.
 *
 * `package-dts` and `package-publish` read `packages/ui/dist`, so the package
 * must be built before this tier runs.
 */
export const staticChecks = [
  'banner-divider-layout-regression.mjs',
  'button-hover-animation-regression.mjs',
  'character-assets-regression.mjs',
  'component-api-encapsulation-regression.mjs',
  'css-modules-transform-regression.mjs',
  'event-callout-assets-regression.mjs',
  'feed-carousel-assets-regression.mjs',
  'horizontal-overflow-regression.mjs',
  'in-view-regression.mjs',
  'overlay-layering-regression.mjs',
  'package-dts-regression.mjs',
  'package-publish-regression.mjs',
  'progress-semantics-regression.mjs',
  'reference-asset-coverage-regression.mjs',
  'reference-crawl-pipeline-checks.mjs',
  'release-readiness-checks.mjs',
  'responsive-component-regression.mjs',
  'section-background-assets-regression.mjs',
  'showcase-media-assets-regression.mjs',
  'squid-loader-assets-regression.mjs',
  'tabs-regression.mjs',
  'tape-image-assets-regression.mjs',
  'theme-role-tokens-regression.mjs',
  'ui-entrypoints-regression.mjs',
  'video-dialog-media-regression.mjs',
  'video-reference-analysis-checks.mjs',
  'weapons-gallery-assets-regression.mjs',
]

/** Drive a real browser against the built demo. Need Playwright and a server. */
export const browserChecks = [
  'demo-smoke-regression.mjs',
  'feed-carousel-initial-layout-regression.mjs',
  'tabs-swipe-regression.mjs',
]

/** Packs the tarball and type-checks a fresh consumer install against it. */
export const packagingChecks = ['package-consumer-smoke.mjs']

export const checkTiers = {
  static: staticChecks,
  browser: browserChecks,
  packaging: packagingChecks,
}

/**
 * Every `.mjs` file in this directory has to be claimed by exactly one tier.
 * This is what keeps the suite from silently growing files that nothing runs —
 * the failure mode this registry exists to prevent.
 */
export function findUnregisteredCheckFiles() {
  const registered = new Set(Object.values(checkTiers).flat())
  const onDisk = fs
    .readdirSync(testsDir)
    .filter((name) => name.endsWith('.mjs') && name !== 'registry.mjs' && name !== 'run.mjs')

  return {
    unregistered: onDisk.filter((name) => !registered.has(name)),
    missing: [...registered].filter((name) => !onDisk.includes(name)),
  }
}
